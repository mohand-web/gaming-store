import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Navbar({ isDarkMode, setIsDarkMode, user, onLogout }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // دالة لجلب الأعداد
  const fetchCounts = async () => {
    if (user) {
      try {
        const [cartRes, wishRes] = await Promise.all([
          fetch(`http://localhost:5000/api/cart/${user.id}`),
          fetch(`http://localhost:5000/api/wishlist/${user.id}`)
        ]);
        const cartData = await cartRes.json();
        const wishData = await wishRes.json();
        setCartCount(Array.isArray(cartData) ? cartData.length : 0);
        setWishlistCount(Array.isArray(wishData) ? wishData.length : 0);
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    } else {
      // ضيف
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      setCartCount(guestCart.length);
      setWishlistCount(guestWishlist.length);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [user]);

  // مراقبة التغييرات في localStorage (للتحديث الفوري للضيف)
  useEffect(() => {
    const handleStorageChange = () => {
      if (!user) {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
        setCartCount(guestCart.length);
        setWishlistCount(guestWishlist.length);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // تحديث يدوي بعد أي عملية إضافة/حذف (للمستخدم المسجل)
  // يمكن استدعاء fetchCounts() من أي مكان إذا أردنا التحديث الفوري
  // لكن هذا كافٍ لأنه سيتم التحديث عند كل تغيير في user أو عند الرجوع للصفحة

  const handleLogout = () => {
    Swal.fire({
      title: 'Logging Out...',
      text: 'See you in the next round! 🚪',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      onLogout();
      navigate('/login');
    });
  };

  return (
    <nav className={`navbar navbar-expand-lg sticky-top border-bottom ${isDarkMode ? 'navbar-dark bg-black border-primary' : 'navbar-light bg-light'}`}>
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary fs-3" to="/">GAMING STORE</Link>

        <div className="d-flex align-items-center order-lg-last">
          <button className="btn btn-sm btn-outline-secondary me-2 rounded-pill px-3" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          <Link className="btn btn-outline-danger me-2 position-relative rounded-pill px-3 overflow-visible" to="/wishlist">
            ❤️ {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
          </Link>

          <Link className="btn btn-primary position-relative rounded-pill px-3 me-3 overflow-visible" to="/cart">
            🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="dropdown">
              <button className="btn btn-outline-primary dropdown-toggle rounded-pill px-3 fw-bold border-2" type="button" data-bs-toggle="dropdown">
                👤 {user.username}
              </button>
              <ul className={`dropdown-menu dropdown-menu-end shadow ${isDarkMode ? 'dropdown-menu-dark' : ''}`}>
                {user.role === 'admin' && (
                  <li><Link className="dropdown-item fw-bold text-warning" to="/admin">👑 Admin Panel</Link></li>
                )}
                <li><Link className="dropdown-item" to="/orders">My Orders</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger fw-bold" onClick={handleLogout}>Logout 🚪</button></li>
              </ul>
            </div>
          ) : (
            <Link className="btn btn-outline-primary rounded-pill px-4 fw-bold" to="/login">Login</Link>
          )}
        </div>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto fw-medium text-center">
            <li className="nav-item"><Link className="nav-link px-3" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link px-3" to="/products">Store</Link></li>
            <li className="nav-item"><Link className="nav-link px-3" to="/about">About Us</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;