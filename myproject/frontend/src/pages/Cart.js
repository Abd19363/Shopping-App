import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import Checkout from "./Checkout";

const API_URL = "http://localhost:5000/api/cart";

function Cart() {

    const navigate = useNavigate();
    const { user } = useAuth();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchCart = useCallback(async () => {

     try {

        const response = await fetch(`${API_URL}/${user.id}`);

        const data = await response.json();

        if (data.success) {

            setCartItems(data.cart);

        }

    }

     catch (error) {

        console.error(error);

    }

     finally {

        setLoading(false);

    }

    }, [user]);


    useEffect(() => {

        if (!user) {

            navigate("/Home");
            return;

        }

        fetchCart();

    }, [user, navigate, fetchCart]);


    const increaseQuantity = async (item) => {

    try {

        const response = await fetch(`${API_URL}/update`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                cart_id: item.id,
                quantity: item.quantity + 1

            })

        });

        const data = await response.json();

        if (data.success) {

            fetchCart();

        }

    }

    catch (error) {

        console.error(error);

    }

};

    const decreaseQuantity = async (item) => {

    if (item.quantity === 1) return;

    try {

        const response = await fetch(`${API_URL}/update`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                cart_id: item.id,
                quantity: item.quantity - 1

            })

        });

        const data = await response.json();

        if (data.success) {

            fetchCart();

        }

    }

    catch (error) {

        console.error(error);

    }

};

    const removeItem = async (item) => {

    try {

        const response = await fetch(`${API_URL}/remove/${item.id}`, {

            method: "DELETE"

        });

        const data = await response.json();

        if (data.success) {

            fetchCart();

        }

    }

    catch (error) {

        console.error(error);

    }

};

    const total = cartItems.reduce((sum, item) => {

        return sum + Number(item.price) * item.quantity;

    }, 0);

    return (

        <div className="min-h-screen bg-slate-950 text-white flex flex-col">

            <Navbar />

            <div className="container mx-auto py-10">

                <h2 className="text-4xl font-bold mb-8 text-center">

                    My Cart

                </h2>

                {

                    loading ?

                        <h4 className="text-center">

                            Loading...

                        </h4>

                        :

                        cartItems.length === 0 ?

                            <h4 className="text-center">

                                Your cart is empty.

                            </h4>

                            :

                            <>

                                {

                                    cartItems.map(item => (

                                        <div
                                            key={item.id}
                                            className="bg-slate-900 rounded-xl p-4 mb-4 d-flex justify-content-between align-items-center"
                                        >

                                            <div className="d-flex">

                                                <img

                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{
                                                        width: "120px",
                                                        height: "120px",
                                                        objectFit: "cover"
                                                    }}

                                                />

                                                <div className="ms-4">

                                                    <h4>

                                                        {item.name}

                                                    </h4>

                                                    <p>

                                                        Rs. {item.price}

                                                    </p>

                                                    <p>

                                                        Quantity : {item.quantity}

                                                    </p>

                                                    <p>

                                                        Subtotal :

                                                        Rs. {item.price * item.quantity}

                                                    </p>

                                                </div>

                                            </div>

                                            <div>

                                                <button
                                                    className="btn btn-success m-1"
                                                    onClick={() => increaseQuantity(item)}
                                                >
                                                    +
                                                </button>

                                                <button
                                                    className="btn btn-warning m-1"
                                                    onClick={() => decreaseQuantity(item)}
                                                >
                                                    -
                                                </button>

                                                <button
                                                    className="btn btn-danger m-1"
                                                    onClick={() => removeItem(item)}
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </div>

                                    ))

                                }

                                <div className="bg-slate-900 rounded-xl p-4 mt-5">

                                    <h3>

                                        Grand Total : Rs. {total}

                                    </h3>

                                    <div className="mt-4">

                                        <button
                                            className="btn btn-secondary me-3"
                                            onClick={() => navigate("/Logosec")}
                                        >
                                            Continue Shopping
                                        </button>

                                        <button
                                            className="btn btn-primary"
                                            onClick={() => navigate("/Checkout")}
                                        >
                                            Checkout
                                        </button>

                                    </div>

                                </div>

                            </>

                }

            </div>

            <Footer />

        </div>

    );

}

export default Cart;