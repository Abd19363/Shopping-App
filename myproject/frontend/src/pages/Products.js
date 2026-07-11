import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Notification from "../components/Notifications";


const API_URL = "http://localhost:5000/api/cart";

const PRODUCT_API = "http://localhost:5000/api/products";


function Products() {
  const navigate = useNavigate();
  const { isLoggedIn,user } = useAuth();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const [notification, setNotification] = useState({ show: false,  type: "", message: "" });

  const [products, setProducts]= useState([]);
    useEffect(() => {

    fetch(PRODUCT_API)

        .then(res => res.json())

        .then(data => {

            if(data.success){

                setProducts(data.products);

            }

        })

        .catch(err => console.error(err));

  }, 
  []);
  
  // State for selected product details modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = categoryFilter
    ? products.filter(
      p => (p.category || "").toLowerCase() === categoryFilter.toLowerCase()
    )
   : products;

  const HandleEnquire = (product) => {

    if (isLoggedIn) {

        setSelectedProduct(product);

    }

    else {

        setNotification({
            show: true,
            type: "warning",
            message: "Please log in to your account first."
        });

        setTimeout(() => {

            navigate("/Logosec");

        }, 100);

    }

};

 const HandleOrder = async (product) => {
    try {

       // const user = JSON.parse(localStorage.getItem("rmvc_user"));

        if (!user) {

            setNotification({
            show: true,
            type: "warning",
             message: "Please login first."
          });

          setTimeout(() => {

          navigate("/Home");

          }, 1500);

           return;

        }

        const response = await fetch(`${API_URL}/add`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                user_id: user.id,
                product_id: product.id,
                quantity: 1

            })

        });

        const data = await response.json();

        if (data.success) {

          setNotification({
          show: true,
          type: "success",
          message: "Product added to cart successfully."
         });

         setSelectedProduct(null);

        }

        else {

          setNotification({
          show: true,
          type: "error",
          message: data.message
          });

        }

    } catch (error) {

        console.error(error);
        
        setNotification({
          show: true,
          type: "error",
          message: "Unable to add products."
        });
        

    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-900 to-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      {/* Reusable Navbar */}
      <Navbar />

      {/* Page Hero */}
      <div className="py-14 text-center relative overflow-hidden flex-grow-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-64 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest text-amber-400 uppercase bg-amber-950/40 border border-amber-500/30 rounded-full">
          RMVC Showcase
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-serif">
          <span className="text-slate-200">
            {categoryFilter ? `${categoryFilter}` : "All"}
          </span>{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-500">Collections</span>
        </h1>
        <p className="text-slate-400 mt-3 text-sm max-w-md mx-auto">
          {categoryFilter 
            ? `Viewing our premium collection of ${categoryFilter.toLowerCase()}.`
            : "Browse our complete catalog of premium chains, rings, watches, and accessories."
          }
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/BuyPage" className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all duration-200 no-underline shadow-lg shadow-amber-500/20 text-sm">
            <i className="bi bi-bag-check-fill"></i> Shop by Category
          </Link>
          {categoryFilter && (
            <Link to="/Logosec" className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-800 transition-all duration-200 no-underline text-sm">
              Show All Products
            </Link>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container max-w-7xl mx-auto px-4 pb-20 flex-grow">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <i className="bi bi-inbox text-5xl text-slate-600 block mb-4"></i>
            <p className="text-slate-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={product.id}>
                <ProductCard
                  img={product.image}
                  label={product.name}
                  tag={product.category}
                  // badge={product.badge}
                  onEnquire={() => HandleEnquire(product)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Modal (Visible only when logged in and product selected) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all duration-200 z-10"
            >
              <i className="bi bi-x-lg text-sm"></i>
            </button>

            <div className="row g-0">
              {/* Product Image Column */}
              <div className="col-md-6 bg-slate-950 aspect-square md:aspect-auto md:h-[450px]">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info Column */}
              <div className="col-md-6 p-6 flex flex-col justify-between h-[450px] overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                      {selectedProduct.category}
                    </span>
                    
                      <span className="px-2 py-0.5 text-[10px] font-bold text-slate-950 bg-amber-400 rounded-full">
                        {selectedProduct.brand}
                      </span>
                    
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-100 tracking-wide font-serif mb-2">
                    {selectedProduct.name}
                  </h2>
                  <div className="text-lg font-black text-amber-400 mb-4">
                    {selectedProduct.price}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {selectedProduct.description}
                  </p>

                  {/* Specifications */}
                  {/* <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Specifications</h4>
                  <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-1 pl-1">
                    {selectedProduct.specs.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul> */}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => HandleOrder(selectedProduct)}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition-all duration-200 uppercase tracking-wider shadow-lg shadow-amber-500/20"
                  >
                    Order Now
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all duration-200 uppercase tracking-wider border border-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Footer */}
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

export default Products;
