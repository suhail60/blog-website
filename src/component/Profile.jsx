import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // We'll create this CSS file

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    termcheck: false,
    createdAt: new Date()
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userid = localStorage.getItem("user")
        if (!token) {
          navigate('/login');
          return;}

 const parsedUser = JSON.parse(userid);

        setUser({
          username: parsedUser.username,
          email: parsedUser.email,
          termcheck: parsedUser.termcheck,
          createdAt: parsedUser.createdAt
        });
        
       
      } catch (err) {
        console.error("Failed to fetch profile:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: user.username,
          termcheck: user.termcheck
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error("Failed to update profile:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <div className="profile-header">
          <h2>User Profile</h2>
          {/* <div className="user-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h3>{user.email}</h3>
          <p>{user.email}</p> */}
        </div>
        
        <ul className="profile-nav">
          <li>
            <button
              className={`profile-nav-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
          </li>
          <li>
            <button
              className={`profile-nav-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </li>
          <li>
            <button
              className="profile-nav-button"
              onClick={() => navigate('/change-password')}
            >
              Change Password
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {success && (
          <div className="success-message">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)}>×</button>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="section-header">
              <h3>Profile Information</h3>
              {!isEditing && (
                <button 
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
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
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    readOnly
                    className="read-only"
                  />
                  <small>Contact admin to change email</small>
                </div>

                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="termcheck"
                    name="termcheck"
                    checked={user.termcheck}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="termcheck">I agree to terms and conditions</label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">Username:</span>
                  <span className="detail-value">{user.username
}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{user.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Terms Accepted:</span>
                  <span className="detail-value">
                    {user.termcheck ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Member Since:</span>
                  <span className="detail-value">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>Account Settings</h3>
            </div>

            <div className="settings-options">
              <div className="setting-item">
                <h4>Notification Preferences</h4>
                <p>Manage how you receive notifications</p>
                <button className="setting-button">Configure</button>
              </div>

              <div className="setting-item">
                <h4>Privacy Settings</h4>
                <p>Control your privacy and data sharing</p>
                <button className="setting-button">Manage</button>
              </div>

              <div className="setting-item danger-zone">
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all data</p>
                <button 
                  className="delete-button"
                  onClick={() => navigate('/delete-account')}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;