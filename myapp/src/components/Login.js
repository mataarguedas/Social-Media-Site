import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', formData);
            localStorage.setItem('access_token', response.data.access);
            navigate('/dashboard');
        } catch (error) {
            console.error(error.response.data);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <img src="/assets/logo.png" alt="Logo" className="login-logo" />
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Username:</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        className="form-input"
                    />
                </div>
                <button type="submit" className="form-button">Login</button>
            </form>
        </div>
    );
};

export default Login;