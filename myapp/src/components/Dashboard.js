import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file

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
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
};

export default Dashboard;