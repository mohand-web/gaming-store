import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Cart({ isDarkMode }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (user) {
      const userId = encodeURIComponent(user.id);
      fetch(`http://localhost:5000/api/cart/${userId}`)
        .then(res => res.json())
        .then(data => {
          setCart(data);
          setLoading(false);
        })
        .catch(err => console.error("Error fetching cart:", err));
    }
  }, [user?.id]);

  const removeFromCart = (cartItemId) => {
    const itemId = encodeURIComponent(cartItemId);
    fetch(`http://localhost:5000/api/cart/${itemId}`, { method: 'DELETE' })
      .then(() => {
        setCart(cart.filter(item => item.cart_id !== cartItemId));
      });
  };

  const updateQuantity = async (cartItemId, newQty) => {
    if (newQty < 1) return; 
    try {
      const itemId = encodeURIComponent(cartItemId);
      await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
      setCart(cart.map(item =>
        item.cart_id === cartItemId ? { ...item, quantity: newQty } : item
      ));
    } catch (err) { console.error("Update failed:", err); }
  };

  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  if (loading) return <div className="text-center py-5">Loading Cart...</div>;

  return (
    <div className="container py-5 mt-5">
      <div className={`card p-4 shadow-lg border-0 ${isDarkMode ? 'bg-dark text-white' : 'bg-white text-dark'}`}>
        <h2 className="fw-bold mb-4 border-bottom pb-2">Your Shopping Cart</h2>
        {cart.length === 0 ? (
          <div className="text-center py-5">
            <p className="fs-4">Your cart is empty! 🎮</p>
            <Link to="/products" className="btn btn-primary px-4">Go to Store</Link>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className={`table ${isDarkMode ? 'table-dark' : ''} align-middle`}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.cart_id}>
                      <td>
                        <div className="fw-bold">{item.name}</div>
                        <small className="text-muted">Unit Price: ${item.price}</small>
                      </td>
                      <td className="text-center" style={{ width: '150px' }}>
                        <div className="input-group input-group-sm border rounded-pill overflow-hidden">
                          <button
                            className="btn btn-light border-0"
                            onClick={() => updateQuantity(item.cart_id, (item.quantity || 1) - 1)}
                          > - </button>

                          <span className="form-control text-center border-0 bg-transparent">
                            {item.quantity || 1}
                          </span>

                          <button
                            className="btn btn-light border-0"
                            onClick={() => updateQuantity(item.cart_id, (item.quantity || 1) + 1)}
                          > + </button>
                        </div>
                      </td>
                      <td className="fw-bold text-primary">${(item.price * (item.quantity || 1)).toFixed(2)}</td>
                      <td className="text-center">
                        <button className="btn btn-outline-danger btn-sm rounded-circle shadow-sm" onClick={() => removeFromCart(item.cart_id)}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <h3 className="fw-bold">Total: ${total.toFixed(2)}</h3>
              <Link to="/checkout" className="btn btn-success btn-lg px-5 shadow">Checkout</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;