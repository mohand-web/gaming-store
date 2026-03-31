import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import axios from 'axios';
import Swal from 'sweetalert2';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (user) {
      const userId = encodeURIComponent(user.id);
      fetch(`http://localhost:5000/api/cart/${userId}`)
        .then(res => res.json())
        .then(data => setCart(data))
        .catch(err => console.error("Cart fetch error:", err));

      fetch(`http://localhost:5000/api/wishlist/${userId}`)
        .then(res => res.json())
        .then(data => setWishlist(data))
        .catch(err => console.error("Wishlist fetch error:", err));
    } else {
      const savedCart = localStorage.getItem('guestCart');
      const savedWishlist = localStorage.getItem('guestWishlist');
      setCart(savedCart ? JSON.parse(savedCart) : []);
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestCart', JSON.stringify(cart));
      localStorage.setItem('guestWishlist', JSON.stringify(wishlist));
    }
  }, [cart, wishlist, user]);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);


  const addToCart = (product) => {
    if (user) {
      const userId = encodeURIComponent(user.id);
      fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, product_id: product.id, quantity: 1 })
      }).then(() => {
        fetch(`http://localhost:5000/api/cart/${userId}`)
          .then(res => res.json())
          .then(data => setCart(data));
      });
    } else {
      const existingItem = cart.find((item) => item.id === product.id);
      if (existingItem) {
        setCart(cart.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        ));
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    }
  };

  const clearCart = async () => {
  try {
    await axios.post('http://localhost:5000/api/order/confirm', {
      userId: user ? user.id : null,
      cartItems: cart
    });

    if (!user) {
      localStorage.removeItem('guestCart');
    }
    setCart([]);
  } catch (err) {
    console.error('Order confirmation error:', err);
    throw err;
  }
};

  const toggleWishlist = (product) => {
    if (user) {
      fetch('http://localhost:5000/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, product_id: product.id })
      }).then(() => {
        fetch(`http://localhost:5000/api/wishlist/${user.id}`)
          .then(res => res.json())
          .then(data => setWishlist(data));
      });
    } else {
      const isExist = wishlist.find(item => item.id === product.id);
      setWishlist(isExist ? wishlist.filter(item => item.id !== product.id) : [...wishlist, product]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
    setWishlist([]);
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary mb-3"></div>
        <h4 className="fw-bold">LOADING STORE...</h4>
      </div>
    );
  }

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          cartCount={cart.length}
          wishlistCount={wishlist.length}
          user={user}
          onLogout={handleLogout}
        />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={user ? <Home isDarkMode={isDarkMode} /> : <Navigate to="/login" />} />
            <Route path="/products" element={<Products products={products} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} isDarkMode={isDarkMode} />} />
            <Route path="/product/:id" element={<ProductDetails products={products} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} isDarkMode={isDarkMode} />} />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} isDarkMode={isDarkMode} user={user} />} />
            
            <Route path="/checkout" element={<Checkout isDarkMode={isDarkMode} user={user} clearCart={clearCart} />} />
            
            <Route path="/about" element={<About isDarkMode={isDarkMode} />} />
            <Route path="/contact" element={<Contact isDarkMode={isDarkMode} />} />
            <Route path="/wishlist" element={<Wishlist wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} isDarkMode={isDarkMode} user={user} />} />
            <Route path="/orders" element={<OrderHistory isDarkMode={isDarkMode} user={user} />} />
            <Route path="/login" element={<Login isDarkMode={isDarkMode} setUser={setUser} />} />
            <Route path="/register" element={<Register isDarkMode={isDarkMode} />} />
            <Route path="/admin" element={user?.role === 'admin' ? <Admin isDarkMode={isDarkMode} /> : <Navigate to="/" />} />
          </Routes>
        </main>

        <Footer isDarkMode={isDarkMode} />
      </div>
    </Router>
  );
}

export default App;