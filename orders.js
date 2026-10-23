const express = require("express");

const c = require("./controllers/orderscontroller");

const router = express.Router();

router.get("", c.getOrders);
router.get("/:id", c.getOrderById);
router.post("", c.createOrder);
router.put("/:id", c.updateOrder);
router.delete("/:id", c.deleteOrder);

module.exports = router;