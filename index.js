const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const ordersRoutes = require("./orders");
const errorhandler = require("./middleware/errorhandler");

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;


app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({
        message: "working"
    });
});


app.use("/orders", ordersRoutes);


app.use((req, res) => {
    res.status(404).json({
        message: "Page not found"
    });
});

app.use(errorhandler);


app.listen(PORT, async () => {
    await connectDB();
    console.log("server listening on " + PORT);
});