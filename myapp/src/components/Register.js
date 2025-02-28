import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        emailAccount: '',
        emailDomain: 'ucr.ac.cr', // Default domain
        password: ''
    });
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        general: ''
    });
    const [popup, setPopup] = useState({
        show: false,
        message: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullEmail = `${formData.emailAccount}@${formData.emailDomain}`;
        const completeFormData = {
            ...formData,
            email: fullEmail
        };
        delete completeFormData.emailAccount;
        delete completeFormData.emailDomain;
    
        try {
            const response = await axios.post('http://localhost:5000/register', completeFormData);
            console.log(response.data);
            setPopup({
                show: true,
                message: 'Registration successful!'
            });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error(error);
            // Reset all errors first
            setErrors({
                username: '',
                email: '',
                password: '',
                general: ''
            });
            
            if (error.response) {
                const data = error.response.data;
                
                // Handle specific field errors
                if (data.email) {
                    setErrors(prev => ({ ...prev, email: data.email[0] }));
                    
                    // Show popup for email already registered
                    if (data.email[0].includes("ya está registrado")) {
                        setPopup({
                            show: true,
                            message: `El correo electrónico ${fullEmail} ya está registrado.`
                        });
                    }
                }
                if (data.username) {
                    setErrors(prev => ({ ...prev, username: data.username[0] }));
                }
                if (data.password) {
                    setErrors(prev => ({ ...prev, password: data.password[0] }));
                }
                
                // If no specific field errors but still failed
                if (!data.email && !data.username && !data.password) {
                    setErrors(prev => ({ 
                        ...prev, 
                        general: 'Registration failed. Please check your inputs.' 
                    }));
                }
            } else if (error.request) {
                setErrors(prev => ({ 
                    ...prev, 
                    general: 'No response from the server. Please check your network connection.' 
                }));
            } else {
                setErrors(prev => ({ 
                    ...prev, 
                    general: 'An error occurred. Please try again.' 
                }));
            }
        }
    };

    // Close popup after 3 seconds
    useEffect(() => {
        if (popup.show) {
            const timer = setTimeout(() => {
                setPopup({ show: false, message: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [popup.show]);

    const closePopup = () => {
        setPopup({ show: false, message: '' });
    };

    const allowedDomains = [
        'ucr.ac.cr',
        'una.cr',
        'tec.ac.cr',
        'earth.ac.cr',
        'incase.edu',
        'ulatina.ac.cr',
        'ulacit.ac.cr',
        'veritas.cr',
        'uam.cr',
        'uci.ac.cr',
        'uaca.cr',
        'uiberoamerica.cr',
        'ucienciasmedicas.cr',
        'ucartago.cr',
        'usj.cr',
        'ucienciasyarte.cr',
        'ufsjt.cr',
        'umagister.cr',
        'uip.cr',
        'ucsa.cr',
        'upapa.cr',
        'uisil.cr',
        'uem.cr',
        'uicr.cr',
        'uea.cr',
        'uca.cr',
        'uct.cr',
        'usac.cr',
        'usc.cr'
    ];

    return (
        <div className="register-container">
            <h1>User Registration</h1>
            {errors.general && <p className="error-message">{errors.general}</p>}
            
            {/* Popup notification */}
            {popup.show && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <span className="close-button" onClick={closePopup}>&times;</span>
                        <p>{popup.message}</p>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="register-form">
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
                    {errors.username && <p className="field-error">{errors.username}</p>}
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <div className="email-group">
                        <div className="email-account">
                            <input 
                                type="text" 
                                name="emailAccount" 
                                value={formData.emailAccount} 
                                onChange={handleChange} 
                                required 
                                className="form-input"
                                placeholder="username"
                            />
                        </div>
                        <div className="email-domain">
                            <select 
                                name="emailDomain" 
                                value={formData.emailDomain} 
                                onChange={handleChange} 
                                className="form-input"
                            >
                                {allowedDomains.map((domain) => (
                                    <option key={domain} value={domain}>
                                        @{domain}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {errors.email && <p className="field-error">{errors.email}</p>}
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
                    {errors.password && <p className="field-error">{errors.password}</p>}
                </div>
                <button type="submit" className="form-button">Register</button>
            </form>
        </div>
    );
};

export default Register;