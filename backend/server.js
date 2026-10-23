require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Model ----------
const CUISINES = ['biryani', 'pizza', 'south', 'chinese', 'other'];

const foodOrderSchema = new mongoose.Schema({
  restaurant: { type: String, required: [true, 'restaurant is required'], trim: true },
  bill: { type: Number, required: [true, 'bill is required'], min: 1, max: 10000 },
  cuisine: { type: String, enum: CUISINES, default: 'other' },
  delivered: { type: Boolean, default: false },
  orderedOn: { type: Date, default: Date.now },
});
const FoodOrder = mongoose.model('FoodOrder', foodOrderSchema, 'orders');

// ---------- Helpers ----------
const badId = (res) => res.status(400).json({ error: 'Invalid id' });

// ---------- Routes ----------
const router = express.Router();

// GET /orders?cuisine=biryani&sort=bill
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.cuisine) filter.cuisine = req.query.cuisine;
    const query = FoodOrder.find(filter);
    if (req.query.sort === 'bill') query.sort({ bill: 1 });
    else query.sort({ orderedOn: -1 });
    res.json(await query);
  } catch (e) { next(e); }
});

// GET /orders/total  (must be ABOVE /:id)
router.get('/total', async (req, res, next) => {
  try {
    const result = await FoodOrder.aggregate([
      { $group: { _id: null, total: { $sum: '$bill' } } },
    ]);
    res.json({ total: result.length ? result[0].total : 0 });
  } catch (e) { next(e); }
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is working successfully"
  });
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return badId(res);
    const order = await FoodOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const order = await FoodOrder.create(req.body);
    res.status(201).json(order);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return badId(res);
    const order = await FoodOrder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return badId(res);
    const order = await FoodOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (e) { next(e); }
});

app.use('/orders', router);

// ---------- Error handler ----------
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// ---------- Start ----------
mongoose
  .connect(process.env.mongodb_url)
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API running on port ${port}`));
  })
  .catch((err) => console.error('MongoDB connection failed:', err.message));
