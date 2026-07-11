import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Watches from "./pages/Watches";
import Categories from "./pages/Categories";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Products Showcase */}
          <Route path="/Logosec" element={<Products />} />

          {/* Login / Sign In */}
          <Route path="/Home" element={<Login />} />

          {/* Watches Catalog */}
          <Route path="/Watch" element={<Watches />} />

          {/* Category Selection */}
          <Route path="/BuyPage" element={<Categories />} />

          {/* Account Registration */}
          <Route path="/Register" element={<Register />} />

          <Route path="/Cart" element={<Cart />} />

          <Route path="/Checkout"  element={<Checkout/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;