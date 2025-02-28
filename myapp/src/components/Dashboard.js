import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Dashboard component rendered');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <h1>Welcome to the Dashboard</h1>
            <div className="dashboard-links">
                <Link to="/profile" className="profile-link">View Profile</Link>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default Dashboard;