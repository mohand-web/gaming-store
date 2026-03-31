import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetails({ addToCart, isDarkMode }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        console.log("STATUS:", res.status); 
        return res.json();
      })
      .then((data) => {
        console.log("DATA:", data);
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const textClass = isDarkMode ? 'text-white' : 'text-dark';

  if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;

  if (error || !product) {
    return (
      <div className="container py-5 mt-5 text-center">
        <h2 className="text-danger mb-4">Product Not Found! 🚨</h2>
        <p className={textClass}>The product you are trying to access is not in the database or the server does not see it.</p>
        <Link to="/" className="btn btn-primary btn-lg mt-3 shadow">Back To Store</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <div className={`row align-items-center shadow-lg p-4 rounded ${isDarkMode ? 'bg-dark border border-secondary' : 'bg-white'}`}>
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <img
            src={`http://localhost:5000${product.image_url}`}
            alt={product.name}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '450px', objectFit: 'contain' }}
            onError={(e) => {
              e.target.src = 'https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Image+Not+Found';
            }}
          />
        </div>

        <div className="col-md-6 ps-md-5">
          <span className="badge bg-primary px-3 py-2 mb-3 shadow-sm">{product.category}</span>
          <h1 className={`fw-bold display-5 mb-3 ${textClass}`}>{product.name}</h1>
          <h2 className="text-success fw-bold mb-4">${Number(product.price).toFixed(2)}</h2>
          <div className="mb-3">
            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
            </span>
          </div>

          <div className="mb-4">
            <h5 className={`fw-bold ${textClass}`}>Description:</h5>
            <p className={`lead ${isDarkMode ? 'text-light' : 'text-muted'}`}>
              {product.description || "No detailed description available for this product yet."}
            </p>
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-md-start mt-5">
            <button
              className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow"
              onClick={() => addToCart(product)}
            >
              Add To Cart 🛒
            </button>
            <Link to="/" className="btn btn-outline-secondary btn-lg px-4 py-3">
              Keep Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;