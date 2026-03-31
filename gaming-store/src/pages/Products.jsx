import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Products({ addToCart, wishlist, toggleWishlist, isDarkMode }) {
  const [productsData, setProductsData] = useState([]);
  const [dbCategories, setDbCategories] = useState(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProductsData(data))
      .catch(err => console.error('Products fetch error:', err));

    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        const catList = ['All', ...data.map(cat => cat.name)];
        setDbCategories(catList);
      })
      .catch(err => console.error('Categories fetch error:', err));
  }, []);

  const filteredProducts = productsData.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      category === 'All' || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const textClass = isDarkMode ? 'text-white' : 'text-dark';
  const cardClass = isDarkMode
    ? 'bg-secondary text-white border-0'
    : 'bg-white border-1';

  return (
    <div className="container py-5 mt-4">
      <div className="row mb-5 align-items-center g-3">
        <div className="col-md-8">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-primary text-white border-0">🔍</span>
            <input
              type="text"
              className={`form-control form-control-lg ${isDarkMode ? 'bg-dark text-white border-0' : ''}`}
              placeholder="Search products..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-4">
          <select
            className={`form-select form-select-lg shadow-sm ${isDarkMode ? 'bg-dark text-white border-0' : ''}`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {dbCategories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isInWishlist = wishlist.some(item => item.id === product.id);

            return (
              <div className="col-md-4 col-lg-3 mb-4" key={product.id}>
                <div className={`card h-100 shadow-sm ${cardClass}`}>

                  <button
                    className={`btn position-absolute top-0 end-0 m-3 rounded-circle shadow-sm ${
                        isInWishlist ? 'btn-danger' : 'btn-light'
                    }`}
                    onClick={() => toggleWishlist(product)}
                    style={{ width: '35px', height: '35px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {isInWishlist ? '❤️' : '🤍'}
                  </button>

                  <Link to={`/product/${product.id}`} className="text-decoration-none text-reset">
                    <div className="text-center p-3" style={{ height: '220px' }}>
                      <img
                        src={`http://localhost:5000${product.image_url}`}
                        alt={product.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/400x300/EEE/31343C?font=montserrat&text=No+Image';
                        }}
                      />
                    </div>

                    <div className="card-body pb-0">
                      <span className="badge bg-primary mb-2 shadow-sm">
                        {product.category}
                      </span>
                      <h6 className="fw-bold text-truncate" title={product.name}>
                        {product.name}
                      </h6>
                    </div>
                  </Link>

                  <div className="card-body d-flex flex-column justify-content-end">
                    <h5 className="text-primary fw-bold mb-3">
                      ${Number(product.price).toFixed(2)}
                    </h5>
                    <button
                      className="btn btn-primary w-100 fw-bold shadow-sm"
                      onClick={() => addToCart(product)}
                    >
                      ADD TO CART 🛒
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-5 w-100">
            <h3 className={textClass}>No products found matching your search.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;