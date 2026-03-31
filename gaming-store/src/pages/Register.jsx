import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Register({ isDarkMode }) {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://127.0.0.1:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            await Swal.fire({
                title: 'Mission Accomplished!',
                text: 'Your account has been created. Now, log in to start your journey! 🎮',
                icon: 'success',
                confirmButtonColor: '#0d6efd',
                background: isDarkMode ? '#1a1a1a' : '#fff',
                color: isDarkMode ? '#fff' : '#000'
            });

            navigate('/login'); 
        } else {
            Swal.fire({
                title: 'Registration Failed',
                text: 'Email might be already in use or system error. ❌',
                icon: 'error',
                confirmButtonColor: '#dc3545',
                background: isDarkMode ? '#1a1a1a' : '#fff',
                color: isDarkMode ? '#fff' : '#000'
            });
        }
    } catch (err) {
        console.error("Register error:", err);
    }
};

    const textClass = isDarkMode ? 'text-white' : 'text-dark';

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className={`card shadow p-4 ${isDarkMode ? 'bg-dark border-primary' : ''}`}>
                        <h2 className={`fw-bold mb-4 ${textClass}`}>Create Account 🎮</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className={textClass}>Username</label>
                                <input type="text" className="form-control" required onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className={textClass}>Email</label>
                                <input type="email" className="form-control" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="mb-4">
                                <label className={textClass}>Password</label>
                                <input type="password" className="form-control" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <button className="btn btn-primary w-100 fw-bold py-2">SIGN UP</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;