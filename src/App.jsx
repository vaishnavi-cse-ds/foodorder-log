
import { useEffect, useState } from 'react';
import './App.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const MENU = [
  { id: 1, name: 'Hyderabadi Biryani', cuisine: 'biryani', price: 250, emoji: '🍛', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=700&q=85', description: 'Aromatic rice with rich Indian spices' },
  { id: 2, name: 'Margherita Pizza', cuisine: 'pizza', price: 280, emoji: '🍕', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=85', description: 'Classic Italian pizza with melted cheese' },
  { id: 3, name: 'Masala Dosa', cuisine: 'south', price: 100, emoji: '🥞', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=85', description: 'Crispy dosa with spiced potato filling' },
  { id: 4, name: 'Veg Fried Rice', cuisine: 'chinese', price: 180, emoji: '🍜', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=85', description: 'Wok-tossed rice with fresh vegetables' },
  { id: 5, name: 'Cheese Burger', cuisine: 'other', price: 220, emoji: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85', description: 'Juicy burger layered with cheese' },
  { id: 6, name: 'Sushi Rolls', cuisine: 'other', price: 350, emoji: '🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=85', description: 'Japanese-inspired bite-sized rolls' },
  { id: 7, name: 'Mexican Tacos', cuisine: 'other', price: 240, emoji: '🌮', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=85', description: 'Flavorful tacos with colorful toppings' },
  { id: 8, name: 'Italian Pasta', cuisine: 'pizza', price: 260, emoji: '🍝', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=85', description: 'Comforting pasta with herbs and sauce' },
  { id: 9, name: 'Paneer Butter Masala', cuisine: 'south', price: 230, emoji: '🍲', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=85', description: 'Creamy curry with tender paneer' },
  { id: 10, name: 'Chocolate Cake', cuisine: 'other', price: 160, emoji: '🍰', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85', description: 'Rich chocolate dessert for a sweet finish' },
  { id: 11, name: 'Thai Noodles', cuisine: 'chinese', price: 240, emoji: '🥢', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=85', description: 'Noodles tossed with a fragrant sauce' },
  { id: 12, name: 'Falafel & Hummus', cuisine: 'other', price: 210, emoji: '🥙', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85', description: 'Mediterranean-inspired fresh bites' },
];

const CUISINES = [
  { value: '', label: 'All cuisines' },
  { value: 'biryani', label: 'Indian Biryani' },
  { value: 'south', label: 'South Indian' },
  { value: 'pizza', label: 'Italian & Pizza' },
  { value: 'chinese', label: 'Chinese & Asian' },
  { value: 'other', label: 'World Favorites' },
];

const today = () => new Date().toLocaleDateString('en-CA');
const emptyForm = {
  restaurant: '',
  bill: '',
  cuisine: 'other',
  delivered: false,
  orderedOn: today(),
};

function getFood(name) {
  const value = (name || '').toLowerCase();
  return MENU.find((item) => value.includes(item.name.toLowerCase()) ||
    item.name.toLowerCase().includes(value)) || MENU.find((item) => {
      if (value.includes('paradise') || value.includes('biryani')) return item.cuisine === 'biryani';
      if (value.includes('dosa') || value.includes('paneer') || value.includes('idli')) return item.cuisine === 'south';
      if (value.includes('pizza') || value.includes('pasta')) return item.cuisine === 'pizza';
      if (value.includes('rice') || value.includes('noodle') || value.includes('manchurian')) return item.cuisine === 'chinese';
      return false;
    }) || MENU[0];
}

function FoodImage({ item, className = '' }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`food-image ${className}`}>
      {failed ? (
        <span className="image-fallback">{item?.emoji || '🍽️'}</span>
      ) : (
        <img
          src={item?.image || MENU[0].image}
          alt={item?.name || 'Food'}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function App() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [cuisine, setCuisine] = useState('');
  const [sort, setSort] = useState('');
  const [menuCuisine, setMenuCuisine] = useState('all');
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cuisine) params.set('cuisine', cuisine);
      if (sort) params.set('sort', sort);

      const [listResponse, totalResponse] = await Promise.all([
        fetch(`${API}/orders?${params}`),
        fetch(`${API}/orders/total`),
      ]);

      if (!listResponse.ok || !totalResponse.ok) {
        throw new Error('Could not load orders from the API');
      }

      const [list, tot] = await Promise.all([
        listResponse.json(),
        totalResponse.json(),
      ]);

      setOrders(Array.isArray(list) ? list : list.orders || []);
      setTotal(Number(tot.total) || 0);
      setError('');
    } catch {
      setError('Cannot reach the API. Check that your backend and MongoDB are running.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [cuisine, sort]);

  function chooseFood(item) {
    setForm({
      ...form,
      restaurant: item.name,
      bill: String(item.price),
      cuisine: item.cuisine,
    });
    setError('');
    setNotice(`${item.name} selected. You can change the bill before saving.`);
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    setNotice('');

    try {
      const res = await fetch(`${API}/orders${editId ? `/${editId}` : ''}`, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, bill: Number(form.bill) }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || data.message || 'Could not save this order.');
        return;
      }

      setForm(emptyForm);
      setEditId(null);
      setNotice('Order saved successfully!');
      await load();
    } catch {
      setError('Could not connect to the backend. Please check the server.');
    }
  }

  function edit(order) {
    setEditId(order._id);
    setForm({
      restaurant: order.restaurant || '',
      bill: String(order.bill ?? ''),
      cuisine: order.cuisine || 'other',
      delivered: Boolean(order.delivered),
      orderedOn: order.orderedOn ? String(order.orderedOn).slice(0, 10) : today(),
    });
    setError('');
    setNotice('Editing order. Update the details below.');
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function remove(id) {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    setError('');
    setNotice('');
    try {
      const res = await fetch(`${API}/orders/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || data.message || 'Could not delete the order.');
        return;
      }

      setNotice('Order deleted successfully.');
      await load();
    } catch {
      setError('Could not connect to the backend.');
    }
  }

  const visibleMenu = menuCuisine === 'all'
    ? MENU
    : MENU.filter((item) => item.cuisine === menuCuisine);

  const foodCount = orders.length;
  const deliveredCount = orders.filter((order) => order.delivered).length;

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-topline">
          <span className="brand-mark">✳</span>
          <span>THE GOOD FOOD CLUB</span>
          <span className="hero-open"><span /> Your food diary</span>
        </div>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">GOOD FOOD. GOOD MOOD.</p>
            <h1>Every craving<br />has a <em>story.</em></h1>
            <p className="hero-description">
              Discover something delicious, keep track of your orders,
              and make every meal count.
            </p>
            <a className="hero-cta" href="#menu">Explore the menu <span>↓</span></a>
          </div>
          <div className="hero-visual">
            <FoodImage item={MENU[0]} className="hero-food-image" />
            <div className="hero-sticker"><span>✦</span> Made for<br />food lovers</div>
            <div className="hero-caption"><span>01 / SIGNATURE PICK</span><strong>Hyderabadi Biryani</strong></div>
          </div>
        </div>
        <div className="hero-bottom">
          <span>FRESH IDEAS FOR YOUR NEXT MEAL</span>
          <span>SCROLL TO TASTE MORE ↓</span>
        </div>
      </header>

      <section className="stats-grid" aria-label="Order summary">
        <article className="stat-card stat-featured">
          <span className="stat-icon">₹</span>
          <span className="stat-label">TOTAL SPENT</span>
          <strong>₹{total.toLocaleString('en-IN')}</strong>
          <span className="stat-foot">Across your food orders</span>
        </article>
        <article className="stat-card">
          <span className="stat-icon">♧</span>
          <span className="stat-label">ORDERS SHOWN</span>
          <strong>{foodCount.toString().padStart(2, '0')}</strong>
          <span className="stat-foot">Matching your current filter</span>
        </article>
        <article className="stat-card">
          <span className="stat-icon">✓</span>
          <span className="stat-label">DELIVERED</span>
          <strong>{deliveredCount.toString().padStart(2, '0')}</strong>
          <span className="stat-foot">Meals marked delivered</span>
        </article>
      </section>

      <section className="section-block" id="menu">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A LITTLE SOMETHING FOR EVERYONE</p>
            <h2>Find your <em>favorite.</em></h2>
          </div>
          <p className="section-note">From local comfort food to<br />flavors around the world.</p>
        </div>

        <div className="menu-filters" aria-label="Filter menu by cuisine">
          {[
            ['all', 'All dishes'],
            ['biryani', 'Indian biryani'],
            ['south', 'South Indian'],
            ['pizza', 'Italian'],
            ['chinese', 'Chinese & Asian'],
            ['other', 'World favorites'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`chip ${menuCuisine === value ? 'active' : ''}`}
              onClick={() => setMenuCuisine(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {visibleMenu.map((item, index) => (
            <article className="menu-card" key={item.id} style={{ '--card-index': index }}>
              <div className="menu-card-image-wrap">
                <FoodImage item={item} className="menu-card-image" />
                <span className="menu-category">{item.cuisine === 'other' ? 'WORLD FAVORITE' : item.cuisine.toUpperCase()}</span>
                <span className="menu-number">{String(item.id).padStart(2, '0')}</span>
              </div>
              <div className="menu-card-content">
                <div className="menu-card-title">
                  <h3>{item.name}</h3>
                  <strong>₹{item.price}</strong>
                </div>
                <p>{item.description}</p>
                <button type="button" className="add-food-btn" onClick={() => chooseFood(item)}>
                  <span>＋</span> Add to order
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="order-section" id="orders">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR PERSONAL FOOD JOURNAL</p>
            <h2>{editId ? 'Edit your ' : 'Your order '}<em>{editId ? 'order.' : 'history.'}</em></h2>
          </div>
          <span className="order-count">{orders.length} {orders.length === 1 ? 'ORDER' : 'ORDERS'}</span>
        </div>

        <div className="order-layout">
          <form className="order-form" id="order-form" onSubmit={save}>
            <div className="form-heading">
              <span className="form-icon">{editId ? '✎' : '＋'}</span>
              <div>
                <h3>{editId ? 'Update order' : 'Add an order'}</h3>
                <p>Keep all your delicious details in one place.</p>
              </div>
            </div>

            <label htmlFor="restaurant">Dish or restaurant name</label>
            <input id="restaurant" placeholder="e.g. Hyderabadi Biryani" value={form.restaurant}
              onChange={(e) => setForm({ ...form, restaurant: e.target.value })} required />

            {form.restaurant && (
              <div className="selected-food-preview">
                <FoodImage item={getFood(form.restaurant)} />
                <div><span>SELECTED FOOD</span><strong>{getFood(form.restaurant).name}</strong></div>
                <span className="preview-emoji">{getFood(form.restaurant).emoji}</span>
              </div>
            )}

            <div className="form-row">
              <div>
                <label htmlFor="bill">Bill amount (₹)</label>
                <input id="bill" type="number" placeholder="250" value={form.bill} min="1" max="10000" required
                  onChange={(e) => setForm({ ...form, bill: e.target.value })} />
              </div>
              <div>
                <label htmlFor="cuisine">Cuisine</label>
                <select id="cuisine" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })}>
                  {CUISINES.filter((c) => c.value).map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <label htmlFor="orderedOn">Order date</label>
            <input id="orderedOn" type="date" value={form.orderedOn}
              onChange={(e) => setForm({ ...form, orderedOn: e.target.value })} />

            <label className="delivered-toggle">
              <input type="checkbox" checked={form.delivered}
                onChange={(e) => setForm({ ...form, delivered: e.target.checked })} />
              <span className="custom-check">✓</span>
              <span><strong>Order delivered</strong><small>Mark this meal as received</small></span>
            </label>

            {error && <p className="message error-message" role="alert">{error}</p>}
            {notice && <p className="message success-message" role="status">{notice}</p>}

            <button className="submit-btn" type="submit">
              {editId ? 'Save changes' : 'Save food order'} <span>↗</span>
            </button>
            {editId && (
              <button className="cancel-btn" type="button" onClick={() => {
                setEditId(null); setForm(emptyForm); setError(''); setNotice('');
              }}>Cancel editing</button>
            )}
          </form>

          <div className="orders-panel">
            <div className="orders-toolbar">
              <div>
                <h3>Recent orders</h3>
                <p>Your meals, all in one place.</p>
              </div>
              <span className="live-dot">LIVE</span>
            </div>

            <div className="table-controls">
              <label className="filter-select">
                <span>⌕</span>
                <select aria-label="Filter orders by cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
                  {CUISINES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </label>
              <button type="button" className={`sort-btn ${sort ? 'sort-active' : ''}`}
                onClick={() => setSort(sort ? '' : 'bill')}>
                ↕ {sort ? 'Bill: low to high' : 'Sort by bill'}
              </button>
            </div>

            {loading ? (
              <div className="empty-orders"><span className="empty-emoji">⌛</span><h3>Loading orders...</h3><p>Fetching your food journal.</p></div>
            ) : orders.length === 0 ? (
              <div className="empty-orders">
                <span className="empty-emoji">🍽️</span>
                <h3>No orders found</h3>
                <p>Add a meal or choose another cuisine filter.</p>
                <button type="button" className="text-btn" onClick={() => setCuisine('')}>Show all orders ↗</button>
              </div>
            ) : (
              <div className="table-scroll">
                <table className="orders-table">
                  <thead><tr><th>FOOD / RESTAURANT</th><th>BILL</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
                  <tbody>
                    {orders.map((order) => {
                      const food = getFood(order.restaurant);
                      return (
                        <tr key={order._id}>
                          <td>
                            <div className="order-food-cell">
                              <FoodImage item={food} className="order-thumb" />
                              <div className="order-food-details">
                                <strong>{order.restaurant}</strong>
                                <span>{order.cuisine} · {order.orderedOn ? String(order.orderedOn).slice(0, 10) : 'No date'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="bill-cell">₹{Number(order.bill).toLocaleString('en-IN')}</td>
                          <td><span className={`status-pill ${order.delivered ? 'status-delivered' : 'status-pending'}`}>
                            <span />{order.delivered ? 'Delivered' : 'Pending'}
                          </span></td>
                          <td>
                            <div className="row-actions">
                              <button className="icon-action edit-action" title="Edit order" aria-label={`Edit ${order.restaurant}`} onClick={() => edit(order)}>✎</button>
                              <button className="icon-action delete-action" title="Delete order" aria-label={`Delete ${order.restaurant}`} onClick={() => remove(order._id)}>×</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="table-footer"><span>YOUR FOOD, YOUR STORY.</span><strong>Showing {orders.length} orders</strong></div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><span>✳</span> GOOD FOOD CLUB</div>
        <p>Made with a little hunger and a lot of love.</p>
        <a href="#menu">BACK TO MENU ↑</a>
      </footer>
    </main>
  );
}
