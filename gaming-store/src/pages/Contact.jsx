import React from 'react';

function Contact({ isDarkMode }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We will contact you soon.');
  };

  const textClass = isDarkMode ? 'text-white' : 'text-dark';
  const inputClass = isDarkMode ? 'bg-secondary text-white border-0' : 'bg-white text-dark border-1';

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className={`card shadow-lg p-4 rounded-4 ${isDarkMode ? 'bg-dark border-primary' : 'bg-light'}`}>
            <h2 className="text-center text-primary fw-bold mb-4">GET IN TOUCH</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className={`form-label fw-bold ${textClass}`}>Name</label>
                <input 
                  type="text" 
                  className={`form-control form-control-lg ${inputClass}`} 
                  placeholder="Enter your name"
                  required 
                />
              </div>
              <div className="mb-3">
                <label className={`form-label fw-bold ${textClass}`}>Email</label>
                <input 
                  type="email" 
                  className={`form-control form-control-lg ${inputClass}`} 
                  placeholder="name@example.com"
                  required 
                />
              </div>
              <div className="mb-3">
                <label className={`form-label fw-bold ${textClass}`}>Subject</label>
                <input 
                  type="text" 
                  className={`form-control form-control-lg ${inputClass}`} 
                  placeholder="How can we help?"
                  required 
                />
              </div>
              <div className="mb-4">
                <label className={`form-label fw-bold ${textClass}`}>Message</label>
                <textarea 
                  className={`form-control ${inputClass}`} 
                  rows="4" 
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow">
                SEND MESSAGE
              </button>
            </form>
          </div>
          
          <div className={`mt-5 text-center ${textClass}`}>
            <h5>Other ways to connect:</h5>
            <p className="mb-1">📍 Mansoura, Egypt</p>
            <p>📧 mohand00055k@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;