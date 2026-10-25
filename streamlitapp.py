
import os
from datetime import datetime

import streamlit as st
from pymongo import MongoClient
from pymongo.errors import PyMongoError

st.set_page_config(
    page_title="Food Order Log",
    page_icon="🍽️",
    layout="wide"
)

# ---------- Styling ----------
st.markdown("""
<style>
.stApp {
    background-color: #fffaf0;
}
h1, h2, h3 {
    color: #285943;
}
div.stButton > button {
    border-radius: 8px;
}
</style>
""", unsafe_allow_html=True)

# ---------- MongoDB connection ----------
@st.cache_resource
def get_collection():
    uri = st.secrets.get("MONGODB_URL", os.getenv("MONGODB_URL"))

    if not uri:
        raise ValueError("MongoDB connection string is not configured.")

    client = MongoClient(uri, serverSelectionTimeoutMS=10000)
    client.admin.command("ping")

    # Change these names if your existing database uses different names.
    db_name = st.secrets.get("MONGO_DB_NAME", "foodorder")
    collection_name = st.secrets.get("MONGO_COLLECTION_NAME", "orders")

    return client[db_name][collection_name]


# ---------- Food images ----------
FOOD_IMAGES = {
    "biryani": "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=700",
    "pizza": "https://images.unsplash.com/photo- pizza-placeholder?w=700",
    "south": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=700",
    "chinese": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=700",
    "other": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700",
}

# ---------- Header ----------
st.title("🍽️ Food Order Log")
st.write("Manage your food orders, track spending, and organize your favourites.")

try:
    orders_collection = get_collection()
except (ValueError, PyMongoError) as error:
    st.error("Could not connect to MongoDB Atlas.")
    st.info(
        "Check your Streamlit secrets, Atlas network access, "
        "database name, and collection name."
    )
    st.stop()

# ---------- Read orders ----------
try:
    orders = list(orders_collection.find().sort("_id", -1))
except PyMongoError:
    st.error("Could not load orders from MongoDB.")
    st.stop()

# ---------- Statistics ----------
total_orders = len(orders)
total_spending = sum(float(order.get("bill", 0) or 0) for order in orders)
average_bill = total_spending / total_orders if total_orders else 0

col1, col2, col3 = st.columns(3)
col1.metric("📦 Total Orders", total_orders)
col2.metric("💰 Total Spending", f"₹{total_spending:,.2f}")
col3.metric("🧾 Average Bill", f"₹{average_bill:,.2f}")

st.divider()

# ---------- Add an order ----------
st.subheader("➕ Add a New Order")

with st.form("add_order_form", clear_on_submit=True):
    restaurant = st.text_input("Restaurant name")
    cuisine = st.selectbox(
        "Cuisine",
        ["biryani", "pizza", "south", "chinese", "other"]
    )
    bill = st.number_input("Bill amount (₹)", min_value=0.0, step=10.0)
    delivered = st.checkbox("Order delivered")
    ordered_on = st.date_input("Order date", value=datetime.today().date())

    submitted = st.form_submit_button("Add Order")

    if submitted:
        if not restaurant.strip():
            st.warning("Please enter a restaurant name.")
        else:
            try:
                orders_collection.insert_one({
                    "restaurant": restaurant.strip(),
                    "cuisine": cuisine,
                    "bill": bill,
                    "delivered": delivered,
                    "orderedOn": datetime.combine(
                        ordered_on, datetime.min.time()
                    )
                })
                st.success("Order added successfully!")
                st.rerun()
            except PyMongoError:
                st.error("Could not save the order.")

st.divider()

# ---------- Filter and sort ----------
st.subheader("📋 Your Orders")

filter_col, sort_col = st.columns(2)

with filter_col:
    selected_cuisine = st.selectbox(
        "Filter by cuisine",
        ["All"] + ["biryani", "pizza", "south", "chinese", "other"]
    )

with sort_col:
    sort_option = st.selectbox(
        "Sort orders",
        ["Newest first", "Lowest bill first", "Highest bill first"]
    )

filtered_orders = orders

if selected_cuisine != "All":
    filtered_orders = [
        order for order in filtered_orders
        if order.get("cuisine") == selected_cuisine
    ]

if sort_option == "Lowest bill first":
    filtered_orders.sort(key=lambda order: float(order.get("bill", 0) or 0))
elif sort_option == "Highest bill first":
    filtered_orders.sort(
        key=lambda order: float(order.get("bill", 0) or 0),
        reverse=True
    )

if not filtered_orders:
    st.info("No orders found. Add your first order above!")
else:
    for order in filtered_orders:
        order_id = order["_id"]
        restaurant_name = order.get("restaurant", "Unnamed restaurant")
        cuisine_name = order.get("cuisine", "other")
        bill_amount = float(order.get("bill", 0) or 0)
        is_delivered = order.get("delivered", False)

        with st.container(border=True):
            image_col, details_col = st.columns([1, 3])

            with image_col:
                image_url = FOOD_IMAGES.get(cuisine_name, FOOD_IMAGES["other"])
                st.image(image_url, use_container_width=True)

            with details_col:
                st.markdown(f"### {restaurant_name}")
                st.write(f"**Cuisine:** {cuisine_name.title()}")
                st.write(f"**Bill:** ₹{bill_amount:,.2f}")
                st.write(
                    "**Status:** " +
                    ("✅ Delivered" if is_delivered else "🕒 Not delivered")
                )

                ordered_date = order.get("orderedOn")
                if ordered_date:
                    if isinstance(ordered_date, datetime):
                        st.write(
                            f"**Order date:** {ordered_date.strftime('%d-%m-%Y')}"
                        )
                    else:
                        st.write(f"**Order date:** {ordered_date}")

                edit_col, delete_col = st.columns(2)

                with edit_col:
                    with st.expander("✏️ Edit order"):
                        with st.form(f"edit_{order_id}"):
                            new_restaurant = st.text_input(
                                "Restaurant",
                                value=restaurant_name,
                                key=f"name_{order_id}"
                            )
                            new_cuisine = st.selectbox(
                                "Cuisine",
                                ["biryani", "pizza", "south", "chinese", "other"],
                                index=(
                                    ["biryani", "pizza", "south", "chinese", "other"]
                                    .index(cuisine_name)
                                    if cuisine_name in
                                    ["biryani", "pizza", "south", "chinese", "other"]
                                    else 4
                                ),
                                key=f"cuisine_{order_id}"
                            )
                            new_bill = st.number_input(
                                "Bill amount (₹)",
                                min_value=0.0,
                                value=max(0.0, bill_amount),
                                key=f"bill_{order_id}"
                            )
                            new_delivered = st.checkbox(
                                "Delivered",
                                value=is_delivered,
                                key=f"delivered_{order_id}"
                            )

                            if st.form_submit_button("Save changes"):
                                if not new_restaurant.strip():
                                    st.warning("Restaurant name is required.")
                                else:
                                    try:
                                        orders_collection.update_one(
                                            {"_id": order_id},
                                            {"$set": {
                                                "restaurant": new_restaurant.strip(),
                                                "cuisine": new_cuisine,
                                                "bill": new_bill,
                                                "delivered": new_delivered
                                            }}
                                        )
                                        st.success("Order updated!")
                                        st.rerun()
                                    except PyMongoError:
                                        st.error("Could not update the order.")

                with delete_col:
                    if st.button("🗑️ Delete", key=f"delete_{order_id}"):
                        try:
                            orders_collection.delete_one({"_id": order_id})
                            st.success("Order deleted.")
                            st.rerun()
                        except PyMongoError:
                            st.error("Could not delete the order.")
