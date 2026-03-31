import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function Checkout({ isDarkMode, user, clearCart }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    paymentMethod: 'creditCard'
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    vodafonePhone: '',
    paypalEmail: ''
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (user) {
          const res = await fetch(`http://localhost:5000/api/cart/${user.id}`);
          const data = await res.json();
          setCart(Array.isArray(data) ? data : []);
        } else {
          const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
          setCart(guestCart);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cart || cart.length === 0) {
      return Swal.fire({
        title: 'Your cart is empty',
        text: 'There are no items to checkout.',
        icon: 'warning',
        confirmButtonColor: '#0d6efd'
      });
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (clearCart) {
        await clearCart();
      }

      Swal.fire({
        title: 'Payment Successful! ✅',
        text: 'Your order has been placed successfully.',
        icon: 'success',
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'Back to Store'
      }).then(() => {
        window.location.href = '/';
      });

    } catch (error) {
      console.error('Checkout error:', error);
      Swal.fire({
        title: 'Checkout Failed',
        text: 'There was a problem completing your order. Please try again.',
        icon: 'error',
        confirmButtonColor: '#0d6efd'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentDetailChange = (field, value) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const cardClass = isDarkMode ? 'bg-dark text-white border-secondary' : 'bg-white text-dark border-0 shadow';
  const inputClass = isDarkMode ? 'bg-secondary text-white border-0' : 'bg-light text-dark border-1';
  const labelClass = isDarkMode ? 'text-white' : 'text-muted fw-bold';

  if (loading) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className={`card shadow-lg p-4 ${cardClass}`} style={{ borderRadius: '15px' }}>
            <h2 className="text-center mb-4 text-primary fw-bold">CHECKOUT</h2>
            
            {cart.length > 0 && (
              <div className={`mb-4 p-3 rounded ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}>
                <h6 className="fw-bold mb-2">Order Summary:</h6>
                {cart.map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between small mb-1">
                    <span>{item.name} x {item.quantity || 1}</span>
                    <span>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>${cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0).toFixed(2)}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className={`form-label small ${labelClass}`}>Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${inputClass}`}
                    placeholder="e.g. Mohand Haithem"
                    required
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className={`form-label small ${labelClass}`}>Email Address</label>
                  <input
                    type="email"
                    className={`form-control ${inputClass}`}
                    placeholder="john@example.com"
                    required
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className={`form-label small ${labelClass}`}>Shipping Address</label>
                <textarea
                  className={`form-control ${inputClass}`}
                  rows="2"
                  required
                  placeholder="Street, City, Egypt"
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className={`form-label small ${labelClass}`}>Payment Method</label>
                <select
                  className={`form-select ${inputClass}`}
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  <option value="creditCard">💳 Credit Card (Fake)</option>
                  <option value="vodafoneCash">📱 Vodafone Cash</option>
                  <option value="paypal">🅿️ PayPal</option>
                  <option value="cash">💵 Cash on Delivery</option>
                </select>
              </div>

              <div className="payment-details-section">
                {formData.paymentMethod === 'creditCard' && (
                  <div className={`p-3 mb-4 rounded border ${isDarkMode ? 'bg-black border-secondary' : 'bg-light'}`}>
                    <p className="small fw-bold text-primary mb-2">💳 Card Details (Simulation)</p>
                    <input
                      type="text"
                      className={`form-control mb-2 ${inputClass}`}
                      placeholder="Card Number (16 digits)"
                      maxLength="16"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => handlePaymentDetailChange('cardNumber', e.target.value)}
                      required
                    />
                    <div className="row">
                      <div className="col-6">
                        <input
                          type="text"
                          className={`form-control ${inputClass}`}
                          placeholder="MM/YY"
                          value={paymentDetails.cardExpiry}
                          onChange={(e) => handlePaymentDetailChange('cardExpiry', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="password"
                          className={`form-control ${inputClass}`}
                          placeholder="CVV"
                          maxLength="3"
                          value={paymentDetails.cardCvv}
                          onChange={(e) => handlePaymentDetailChange('cardCvv', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'vodafoneCash' && (
                  <div className={`p-3 mb-4 rounded border border-danger ${isDarkMode ? 'bg-black' : 'bg-light'}`}>
                    <p className="small fw-bold text-danger mb-2">📱 Vodafone Cash Number</p>
                    <input
                      type="tel"
                      className={`form-control ${inputClass}`}
                      placeholder="010 xxxx xxxx"
                      value={paymentDetails.vodafonePhone}
                      onChange={(e) => handlePaymentDetailChange('vodafonePhone', e.target.value)}
                      required
                    />
                  </div>
                )}

                {formData.paymentMethod === 'paypal' && (
                  <div className={`p-3 mb-4 rounded border border-primary ${isDarkMode ? 'bg-black' : 'bg-light'}`}>
                    <p className="small fw-bold text-primary mb-2">🅿️ PayPal Email</p>
                    <input
                      type="email"
                      className={`form-control ${inputClass}`}
                      placeholder="paypal@example.com"
                      value={paymentDetails.paypalEmail}
                      onChange={(e) => handlePaymentDetailChange('paypalEmail', e.target.value)}
                      required
                    />
                  </div>
                )}

                {formData.paymentMethod === 'cash' && (
                  <div className={`p-3 mb-4 rounded border ${isDarkMode ? 'bg-black border-secondary' : 'bg-light'}`}>
                    <p className="small fw-bold text-success mb-2">💵 Cash on Delivery</p>
                    <p className="mb-0 small opacity-75">Pay the total amount in cash at your doorstep.</p>
                  </div>
                )}
              </div>

              <hr className={isDarkMode ? 'border-secondary' : 'border-light'} />

              <div className="text-center">
                <div className="mb-3" style={{ height: '30px' }}>
                  <img
                    src="/images/tap.png"
                    alt="Payment Methods"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', opacity: 0.8 }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`btn btn-primary btn-lg w-100 fw-bold shadow ${isProcessing ? 'opacity-75' : ''}`}
                  style={{ borderRadius: '10px' }}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing Order...
                    </>
                  ) : (
                    'CONFIRM & PAY NOW'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;