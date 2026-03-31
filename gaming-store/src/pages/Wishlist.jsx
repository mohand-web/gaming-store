import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Wishlist({ isDarkMode, updateWishlistCount, updateCartCount }) {
  const [wishlist, setWishlist] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchWishlist = () => {
    if (user?.id) {
      fetch(`http://localhost:5000/api/wishlist/${user.id}`)
        .then(res => res.json())
        .then(data => {
          const list = Array.isArray(data) ? data : [];
          setWishlist(list);
          if (updateWishlistCount) updateWishlistCount(list.length);
        })
        .catch(err => console.error("Fetch Error:", err));
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user?.id]);

  const handleRemove = async (productId) => {
    if (!user?.id) {
      Swal.fire('Error', 'You must be logged in', 'error');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/${user.id}/${productId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Delete failed');
      
      // تحديث الواجهة
      const updated = wishlist.filter(item => item.id !== productId);
      setWishlist(updated);
      if (updateWishlistCount) updateWishlistCount(updated.length);
      
      Swal.fire('Removed', 'Product removed from wishlist', 'success');
    } catch (err) {
      console.error("Remove Error:", err);
      Swal.fire('Error', 'Failed to remove item', 'error');
    }
  };

  const handleMoveToCart = async (product) => {
    if (!user?.id) return;
    try {
      // إضافة إلى السلة
      const cartRes = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, product_id: product.id, quantity: 1 })
      });
      if (!cartRes.ok) throw new Error('Cart add failed');
      
      // حذف من wishlist
      await fetch(`http://localhost:5000/api/wishlist/${user.id}/${product.id}`, { method: 'DELETE' });
      
      // تحديث الواجهة
      const updated = wishlist.filter(item => item.id !== product.id);
      setWishlist(updated);
      if (updateWishlistCount) updateWishlistCount(updated.length);
      
      // تحديث عداد السلة في الـ Navbar
      if (updateCartCount) {
        const cartCountRes = await fetch(`http://localhost:5000/api/cart/${user.id}`);
        const cartData = await cartCountRes.json();
        updateCartCount(cartData.length);
      }
      
      Swal.fire('Moved!', `${product.name} added to cart`, 'success');
    } catch (err) {
      console.error("Move Error:", err);
      Swal.fire('Error', 'Failed to move item', 'error');
    }
  };

  const textClass = isDarkMode ? 'text-white' : 'text-dark';

  if (!user) {
    return (
      <div className="container py-5 mt-5 text-center">
        <p className={textClass}>Please login to view your wishlist.</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container py-5 mt-5 text-center">
        <p className={`fs-4 ${textClass} opacity-75`}>Your Wishlist Is Empty. Start Hearting Your Gear! 🎮</p>
        <Link to="/products" className="btn btn-primary px-4 mt-3">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <h2 className={`fw-bold mb-4 ${textClass}`}>My Wishlist ❤️</h2>
      <div className="row">
        {wishlist.map((product) => (
          <div className="col-md-4 col-lg-3 mb-4" key={product.id}>
            <div className={`card h-100 shadow-sm ${isDarkMode ? 'bg-secondary text-white border-0' : ''}`}>
              <div className="position-relative">
                <img
                  src={`http://localhost:5000${product.image_url}`}
                  className="card-img-top p-3"
                  alt={product.name}
                  style={{ height: '180px', objectFit: 'contain' }}
                />
                <button
                  className="btn btn-danger position-absolute top-0 end-0 m-2 rounded-circle btn-sm"
                  onClick={() => handleRemove(product.id)}
                >
                  ✕
                </button>
              </div>
              <div className="card-body d-flex flex-column">
                <h6 className="fw-bold">{product.name}</h6>
                <p className="text-primary fw-bold mb-3">${product.price}</p>
                <button
                  className="btn btn-primary w-100 mt-auto fw-bold"
                  onClick={() => handleMoveToCart(product)}
                >
                  MOVE TO CART
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;