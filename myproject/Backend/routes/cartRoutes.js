const express = require("express");

const router = express.Router();

const {addToCart,getCart, updateCart, removeCartItem } = require("../controllers/cartController");

router.post("/add", addToCart); 
router.get("/:userId",getCart);    // route parameter
router.put("/update",updateCart);
router.delete("/remove/:cartID",removeCartItem);

module.exports = router;