const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const orderRoutes = require("./routes/orderRoutes");

const cartRoutes = require("./routes/cartRoutes");

const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("RMVC Backend Running... Ready to communicate with frontend");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});