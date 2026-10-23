const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    restaurant: {
        type: String,
        required: true,
        trim: true
    },

    bill: {
        type: Number,
        required: true,
        min: 1,
        max: 10000
    },

    cuisine: {
        type: String,
        enum: ["biryani", "pizza", "south", "chinese", "other"],
        default: "other"
    },

    delivered: {
        type: Boolean,
        default: false
    },

    orderedOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);