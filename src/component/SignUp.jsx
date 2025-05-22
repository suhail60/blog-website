import React, { useState } from 'react'
import { FaEyeSlash, FaEye } from "react-icons/fa";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_DEV_API
    : import.meta.env.VITE_APP_PROD_API;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    cpassword: '',
    termcheck: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (formData.password !== formData.cpassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.termcheck) {
      setError("You must agree to the terms and conditions.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          cpassword:formData.cpassword,
          termcheck: formData.termcheck
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setMessage("Signup successful!");
      setFormData({
        username: '',
        email: '',
        password: '',
        cpassword: '',
        termcheck: false
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Join BlogSphere</h1>
        <p className="auth-subtitle">Create your account to start exploring amazing content</p>

        {/* Social buttons - you can add onClick handlers later */}
        <div className="social-auth">
          <div className="social-btn google-btn">
            <i className="fab fa-google"></i>
          </div>
          <div className="social-btn facebook-btn">
            <i className="fab fa-facebook-f"></i>
          </div>
          <div className="social-btn twitter-btn">
            <i className="fab fa-twitter"></i>
          </div>
        </div>

        <div className="auth-divider"><span>OR</span></div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Full Name</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your full name"
              required
              className="text-dark"
              onChange={handleChange}
              value={formData.username}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              className="text-dark"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="d-flex justify-content-between align-items-center position-relative">
              <input
                type={showPassword ? "text" : "password"}
                // id="password"
                name="password"
                placeholder="Create a password"
                required
                className="text-dark"
                onChange={handleChange}
                value={formData.password}
              />
              {showPassword ? (
                <FaEye
                  className="position-absolute end-0 mr-[2px] cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <FaEyeSlash
                  className="position-absolute end-0 mr-[2px] cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cpassword">Confirm Password</label>
            <div className="d-flex justify-content-between align-items-center position-relative">
              <input
                type={showCPassword ? "text" : "password"}
                id="cpassword"
                name="cpassword"
                placeholder="Confirm your password"
                required
                className="text-dark"
                onChange={handleChange}
                value={formData.cpassword}
              />
              {showCPassword ? (
                <FaEye
                  className="position-absolute end-0 mr-[2px] cursor-pointer"
                  onClick={() => setShowCPassword(false)}
                />
              ) : (
                <FaEyeSlash
                  className="position-absolute end-0 mr-[2px] cursor-pointer"
                  onClick={() => setShowCPassword(true)}
                />
              )}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "25px" }}>
            <input
              type="checkbox"
              id="terms"
              name="termcheck"
              onChange={handleChange}
              checked={formData.termcheck}
            />
            <label htmlFor="terms" style={{ display: "inline", fontWeight: "normal" }}>
              I agree to the <a href="#" style={{ color: "#6e48aa" }}>Terms of Service</a> and <a href="#" style={{ color: "#6e48aa" }}>Privacy Policy</a>
            </label>
          </div>

          {error && <p className="text-danger">{error}</p>}
          {message && <p className="text-success">{message}</p>}
          {loading && <p>Creating account...</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
