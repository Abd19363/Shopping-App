const pool = require("../config/db");

const checkout = async (req, res) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const {

            user_id,
            full_name,
            email,
            phone,
            address

        } = req.body;

        // Get cart items

        const cartResult = await client.query(

            `SELECT
                cart.product_id,
                cart.quantity,
                products.price
            FROM cart
            INNER JOIN products
            ON cart.product_id = products.id
            WHERE cart.user_id = $1`,

            [user_id]

        );

        if (cartResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(400).json({

                success: false,
                message: "Cart is empty."

            });

        }

        let totalPrice = 0;

        cartResult.rows.forEach(item => {

            totalPrice += Number(item.price) * item.quantity;

        });

        // Create Order

        const orderResult = await client.query(

            `INSERT INTO orders
            (
                user_id,
                full_name,
                email,
                phone,
                address,
                total_price,
                status
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7
            )
            RETURNING id`,

            [

                user_id,
                full_name,
                email,
                phone,
                address,
                totalPrice,
                "Pending"

            ]

        );

        const orderId = orderResult.rows[0].id;

        // Insert every cart item into order_items

        for (const item of cartResult.rows) {

            await client.query(

                `INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    quantity,
                    price
                )
                VALUES
                (
                    $1,$2,$3,$4
                )`,

                [

                    orderId,
                    item.product_id,
                    item.quantity,
                    item.price

                ]

            );

        }

        // Empty Cart

        await client.query(

            `DELETE FROM cart
             WHERE user_id = $1`,

            [user_id]

        );

        await client.query("COMMIT");

        res.status(201).json({

            success: true,
            message: "Order placed successfully."

        });

    }

    catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

    finally {

        client.release();

    }

};

module.exports = {

    checkout

};