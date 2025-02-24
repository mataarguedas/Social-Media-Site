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
            console.error('Error response:', error.response);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
                alert('Login failed. Please check your credentials.');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
                alert('No response from the server. Please check your network connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
                alert('An error occurred. Please try again.');
            }
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