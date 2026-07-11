import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Notification from "../components/Notifications";

const API_URL = "http://localhost:5000/api/orders";

function Checkout() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [notification, setNotification] = useState({ show: false, type: "",  message: "" });
    
    const [formData, setFormData] = useState({

        full_name: user?.full_name || "",
        email: user?.email || "",
        phone: user?.phone_no || "",
        address: "",
        city: "",
        postal_code: ""

    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({

            ...formData,

            [name]: value

        });

    };

    const placeOrder = async () => {

        // Validate required fields
       if (
        !formData.address.trim() ||
        !formData.city.trim() ||
        !formData.postal_code.trim()
        ) 
        {
         setNotification({
            show: true,
            type: "warning",
            message: "Please fill in Address, City and Postal Code."

           });
          return;
        }

        try {

         const response = await fetch(`${API_URL}/checkout`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                user_id: user.id,

                ...formData

            })

          });

          const data = await response.json();

          if (data.success) {
            setNotification({

                show: true,
                type: "success",
                message: "Order placed successfully."

            });

            setTimeout(() => {

                navigate("/");

            }, 1500);

          }

          else {

            setNotification({

                show: true,
                type: "error",
                message: data.message

            });

          }
        }

      catch (error) {

        console.error(error);

        setNotification({

            show: true,
            type: "error",
            message: "Unable to place order."

        });

    }

 };

    return (

        <div className="min-h-screen bg-slate-950 text-white flex flex-col">

            <Navbar />

            <div className="container py-5">

                <div className="text-center mb-5">
                     <h2 className="inline-flex items-center gap-2 px-6 py-2.5 bg-yellow-300 hover:bg-gray-400 text-slate-950 font-bold rounded-xl transition-all duration-200 no-underline shadow-lg shadow-amber-500/20 text-sm">
                                    
                                    Checkout

                     </h2>
                </div>

                <div className="card p-4 bg-dark text-white">

                    <div className="mb-3">

                        <label>Name</label>

                        <input
                            className="form-control"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="mb-3">

                        <label>Email</label>

                        <input
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="mb-3">

                        <label>Phone</label>

                        <input
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="mb-3">

                        <label>Address</label>

                        <textarea
                            className="form-control"
                            rows="3"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="mb-3">

                        <label>City</label>

                        <input
                            className="form-control"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="mb-3">

                        <label>Postal Code</label>

                        <input
                            className="form-control"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        className="btn btn-warning"
                        onClick={placeOrder}
                    >

                        Place Order

                    </button>

                </div>

            </div>

            <Footer />

            <Notification

              show={notification.show}
              type={notification.type}
              message={notification.message}

              onClose={() =>
                  setNotification({
                  ...notification,
                  show: false
                  })
                }
            />

        </div>

    );

}

export default Checkout;