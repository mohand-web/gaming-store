import React from 'react';
import { Link } from 'react-router-dom';

function Footer({ isDarkMode }) {
  // تحديد الألوان بناءً على الثيم
  const headerColor = 'text-primary';
  const textColor = isDarkMode ? 'text-light' : 'text-dark';
  const mutedText = isDarkMode ? 'opacity-75' : 'text-secondary';

  return (
    <footer className={`py-5 mt-auto border-top ${isDarkMode ? 'bg-black border-primary' : 'bg-light'}`}>
      <div className="container">
        <div className="row g-4">

          {/* العمود الأول: اسم المتجر ووصفه */}
          <div className="col-md-5">
            <h4 className={`fw-bold text-uppercase mb-3 ${headerColor}`}>
              Gaming Store
            </h4>
            <p className={`fs-6 ${textColor} ${mutedText}`} style={{ maxWidth: '350px', lineHeight: '1.6' }}>
              Your number one destination for the best gaming gear and latest releases.
              Level up your setup with our premium collection.
            </p>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div className="col-md-3">
            <h5 className={`fw-bold mb-3 ${textColor}`}>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/products" className="text-decoration-none text-info fw-medium">Store</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-decoration-none text-info fw-medium">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-decoration-none text-info fw-medium">Your Cart</Link>
              </li>
              <li className="mb-2">
                <Link to="/orders" className="text-decoration-none text-info fw-medium">Order History</Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4 text-md-end">
            <h5 className={`fw-bold mb-3 ${textColor}`}>Contact Info</h5>
            <p className={`mb-1 fw-medium ${textColor}`}>📍 Mansoura, Egypt</p>
            <p className={`mb-4 fw-medium ${textColor}`}>📧 info@gamingstore.com</p>

            <div className={`pt-3 border-top ${isDarkMode ? 'border-secondary' : ''}`}>
              <p className={`small mb-0 ${textColor} ${mutedText}`}>
                &copy; 2026 <span className="fw-bold">Gaming Store</span>.
                <br /> All rights reserved.
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;