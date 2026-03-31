import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = ({ isDarkMode }) => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/products/featured')
            .then((res) => res.json())
            .then((data) => {
                setFeaturedProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching featured products:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className={`home-container ${isDarkMode ? 'bg-dark text-light' : 'bg-light'}`}>
            
            <div className="container-fluid p-0">
                <div className="p-5 text-center text-white" 
                     style={{
                       backgroundImage: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("/images/home_bc.jpg")',
                       backgroundSize: 'cover',
                       backgroundPosition: 'center',
                       minHeight: '75vh',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center'
                     }}>
                  <div className="container">
                    <h1 className="display-2 fw-bold text-uppercase">LEVEL UP YOUR GAME</h1>
                    <p className="lead fs-4 opacity-75">Explore the latest consoles and high-performance gaming gear.</p>
                    <Link to="/products" className="btn btn-primary btn-lg px-5 mt-3 fw-bold shadow">SHOP NOW</Link>
                  </div>
                </div>
            </div>

            <section className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className={`fw-bold ${isDarkMode ? 'text-white' : 'text-dark'}`}>Featured Gear</h2>
                    <Link to="/products" className="text-primary text-decoration-none small">
                        View All Products →
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2">Loading latest gear...</p>
                    </div>
                ) : (
                    <div className="row g-3">
                        {featuredProducts.map((product) => (
                            <div key={product.id} className="col-md-3 col-sm-6">
                                <div className={`card h-100 custom-card border-0 shadow-sm ${isDarkMode ? 'bg-secondary text-light' : 'bg-white'}`}>
                                    <div className="card-img-container p-2">
                                        <img 
                                            src={`http://localhost:5000${product.image_url}`} 
                                            className="card-img-top custom-img" 
                                            alt={product.name} 
                                        />
                                    </div>
                                    <div className="card-body d-flex flex-column p-3">
                                        <h6 className={`card-title fw-bold mb-1 ${isDarkMode ? 'text-white' : 'text-dark'}`}>{product.name}</h6>
                                        <p className="text-primary fw-bold mb-3">${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                        
                                        <Link to={`/product/${product.id}`} className="btn btn-outline-primary btn-sm w-100 mt-auto rounded-pill">
                                            View Product
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;