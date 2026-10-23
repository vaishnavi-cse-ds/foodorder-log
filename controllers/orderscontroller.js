const Order = require("../models/orders");

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

exports.createOrder = async (req, res, next) => {
    try {
        const { restaurant, bill } = req.body;

        if (!restaurant) {
            return res.status(400).json({
                message: "Restaurant not found"
            });
        }

        if (!bill) {
            return res.status(400).json({
                message: "Bill not found"
            });
        }

        const order = await Order.create(req.body);

        return res.status(201).json(order);
    } catch (err) {
        next(err);
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        const id = req.params.id;

        const order = await Order.findByIdAndUpdate(
            id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const id = req.params.id;

        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};