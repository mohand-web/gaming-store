import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login({ isDarkMode, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));

                const isAdmin = data.user.role === 'admin';

                await Swal.fire({
                    title: isAdmin ? `Welcome, Commander ${data.user.username}! 👑` : `Welcome back, Agent ${data.user.username}! 🎮`,
                    text: isAdmin
                        ? 'Admin Access Granted. All systems are under your command. 🛡️'
                        : 'Systems are online. Get ready for action! 🚀',
                    icon: 'success',
                    timer: 2500,
                    showConfirmButton: false,
                    background: isDarkMode ? '#1a1a1a' : '#fff',
                    color: isAdmin ? '#ffca28' : (isDarkMode ? '#fff' : '#000'),
                    iconColor: isAdmin ? '#ffca28' : '#0d6efd',
                });

                navigate('/');
                window.location.reload();


            } else {
                Swal.fire({
                    title: 'Access Denied!',
                    text: 'Invalid credentials. Try again, soldier! ❌',
                    icon: 'error',
                    confirmButtonColor: '#dc3545',
                    background: isDarkMode ? '#1a1a1a' : '#fff',
                    color: isDarkMode ? '#fff' : '#000'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'System Failure!',
                text: 'Communication with the server failed. Check your connection. 📡',
                icon: 'error',
                confirmButtonColor: '#dc3545',
                background: isDarkMode ? '#1a1a1a' : '#fff',
                color: isDarkMode ? '#fff' : '#000'
            });
        }
    };

    const textClass = isDarkMode ? 'text-white' : 'text-dark';

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className={`card shadow-lg p-4 border-0 ${isDarkMode ? 'bg-dark' : 'bg-white'}`}>
                        <h2 className={`fw-bold text-center mb-4 ${textClass}`}>Login 🎮</h2>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className={`form-label ${textClass}`}>Email Address</label>
                                <input type="email" className="form-control shadow-sm" required onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className={`form-label ${textClass}`}>Password</label>
                                <input type="password" className="form-control shadow-sm" required onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mb-3">LOGIN</button>
                            <p className={`text-center mb-0 ${textClass}`}>
                                Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Sign Up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;