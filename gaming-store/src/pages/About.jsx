import React from 'react';

function About({ isDarkMode }) {
  const textClass = isDarkMode ? 'text-white' : 'text-dark';
  const mutedTextClass = isDarkMode ? 'text-light opacity-75' : 'text-muted';

  return (
    <div className={`container py-5 ${textClass}`}>
      <div className="row align-items-center">
        <div className="col-md-6 mb-4 mb-md-0">
          <h1 className="display-4 fw-bold text-primary mb-4">About Our Store</h1>
          <p className={`lead ${mutedTextClass}`}>
            Welcome to the ultimate destination for gamers. We provide the latest 
            high-performance gaming gear, consoles, and the most anticipated game titles.
          </p>
          <p className={mutedTextClass}>
            Our mission is to empower gamers with the best technology and accessories 
            to enhance their experience. Whether you are a pro e-sports player or 
            a casual gamer, we have something for you. Authentic gear is our priority.
          </p>
          <div className="row mt-5 text-center text-md-start">
            <div className="col-6 mb-3">
              <h3 className="fw-bold text-primary mb-0">100%</h3>
              <p className={textClass}>Authentic Gear</p>
            </div>
            <div className="col-6 mb-3">
              <h3 className="fw-bold text-primary mb-0">24/7</h3>
              <p className={textClass}>Expert Support</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <img 
            src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80" 
            className="img-fluid rounded shadow-lg border border-primary p-1" 
            alt="Gaming Culture" 
          />
        </div>
      </div>
    </div>
  );
}

export default About;