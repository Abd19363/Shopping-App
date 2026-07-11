const pool = require("../config/db");

const addToCart = async (req, res) => {

    try {

        const { user_id, product_id, quantity } = req.body;

        const result = await pool.query(

            `INSERT INTO cart (user_id, product_id, quantity)
             VALUES ($1, $2, $3)
             RETURNING *`,

            [user_id, product_id, quantity]

        );

        res.status(201).json({

            success: true,
            message: "Product added to cart.",
            cart: result.rows[0]

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

const getCart = async (req, res) => {

    try {

        const { userId } = req.params;

        const result = await pool.query(

            `SELECT
                cart.id,
                cart.quantity,
                products.id AS product_id,
                products.name,
                products.price,
                products.image
            FROM cart
            INNER JOIN products
            ON cart.product_id = products.id
            WHERE cart.user_id = $1`,

            [userId]

        );

        res.status(200).json({

            success: true,
            cart: result.rows

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

const updateCart = async (req, res) => {

    try {

        const { cart_id, quantity } = req.body;

        if (quantity < 1) {

            return res.status(400).json({

                success: false,
                message: "Quantity must be at least 1."

            });

        }

        const result = await pool.query(

            `UPDATE cart
             SET quantity = $1
             WHERE id = $2
             RETURNING *`,

            [quantity, cart_id]

        );

        res.status(200).json({

            success: true,
            message: "Cart updated successfully.",
            cart: result.rows[0]

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

const removeCartItem = async (req, res) => {

    try {

        const { cartId } = req.params;

        await pool.query(

            `DELETE FROM cart
             WHERE id = $1`,

            [cartId]

        );

        res.status(200).json({

            success: true,
            message: "Item removed successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

module.exports = {

    addToCart,
    getCart,updateCart,
    removeCartItem

};