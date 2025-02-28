import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState({
        username: '',
        email: '',
        profile: {
            bio: '',
            profile_picture: null
        }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:5000/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Ensure that profile exists, even if it's missing from the response
                const userData = {
                    ...response.data,
                    profile: response.data.profile || { bio: '', profile_picture: null }
                };
                
                setUser(userData);
                
                if (userData.profile && userData.profile.profile_picture) {
                    setPreviewImage(`http://localhost:5000/${userData.profile.profile_picture}`);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Failed to load profile. Please try again later.');
                setLoading(false);
                
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('access_token');
                    navigate('/login');
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'bio') {
            setUser(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    bio: value
                }
            }));
        } else if (name === 'username') {
            setUser(prev => ({
                ...prev,
                [name]: value
            }));
        }
        // We're ignoring email changes now
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        
        try {
            const token = localStorage.getItem('access_token');
            const formData = new FormData();
            
            // Prepare user data - exclude email
            const userData = {
                username: user.username,
                profile: {
                    bio: user.profile?.bio || ''
                }
            };
            
            formData.append('userData', JSON.stringify(userData));
            
            // Add profile picture if selected
            if (selectedFile) {
                formData.append('profile_picture', selectedFile);
            }
            
            const response = await axios.put('http://localhost:5000/profile', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log('Profile updated successfully:', response.data);
            setIsEditing(false);
            // Refresh the profile
            window.location.reload();
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error);
            setError('Failed to update profile. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    if (loading) {
        return <div className="profile-container loading">Loading profile...</div>;
    }

    if (error) {
        return <div className="profile-container error">{error}</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>User Profile</h1>
                <div className="action-buttons">
                    {isEditing ? (
                        <button onClick={() => setIsEditing(false)} className="cancel-button">
                            Cancel
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="edit-button">
                            Edit Profile
                        </button>
                    )}
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-picture-container">
                    {previewImage ? (
                        <img src={previewImage} alt="Profile" className="profile-picture" />
                    ) : (
                        <div className="profile-picture-placeholder">
                            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                    )}
                    {isEditing && (
                        <div className="picture-upload">
                            <label htmlFor="profile-picture" className="upload-label">
                                Change Picture
                            </label>
                            <input
                                type="file"
                                id="profile-picture"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                        </div>
                    )}
                </div>

                <div className="profile-details">
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="edit-form">
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={user.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email (cannot be changed)</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={user.email}
                                    disabled
                                    className="disabled-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={user.profile?.bio || ''}
                                    onChange={handleInputChange}
                                    rows="4"
                                />
                            </div>
                            <button type="submit" className="save-button">
                                Save Changes
                            </button>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <h2>{user.username}</h2>
                            <p className="email">{user.email}</p>
                            <div className="bio-section">
                                <h3>Bio</h3>
                                <p className="bio-text">{user.profile?.bio || 'No bio added yet.'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;