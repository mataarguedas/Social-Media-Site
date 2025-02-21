import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS file

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        emailAccount: '',
        emailDomain: 'ucr.ac.cr', // Default domain
        password: ''
    });
    const [error, setError] = useState('');
    const history = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
            alert('Registration successful!');
            history.push('/login');
        } catch (error) {
            console.error(error.response.data);
            if (error.response && error.response.data.email) {
                setError(error.response.data.email[0]);
            } else {
                setError('Registration failed. Please check your inputs.');
            }
        }
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
            {error && <p className="error-message">{error}</p>}
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
                </div>
                <div className="form-group email-group">
                    <div className="email-account">
                        <label>Email Account:</label>
                        <input 
                            type="text" 
                            name="emailAccount" 
                            value={formData.emailAccount} 
                            onChange={handleChange} 
                            required 
                            className="form-input"
                        />
                    </div>
                    <div className="email-domain">
                        <label>Email Domain:</label>
                        <select 
                            name="emailDomain" 
                            value={formData.emailDomain} 
                            onChange={handleChange} 
                            className="form-input"
                        >
                            {allowedDomains.map((domain) => (
                                <option key={domain} value={domain}>
                                    {domain}
                                </option>
                            ))}
                        </select>
                    </div>
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
                <button type="submit" className="form-button">Register</button>
            </form>
        </div>
    );
};

export default Register;