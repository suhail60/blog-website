import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import {BlogContext} from "../context/blog"

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
    const { isAuthenticated ,setAuthenticated } = useContext(BlogContext);
    const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_DEV_API
    : import.meta.env.VITE_APP_PROD_API;
  
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/");
  //   }
  // }, [isAuthenticated, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data)

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user',JSON.stringify(data.user));
        setAuthenticated(true)
        navigate('/dashboard');
      } else {
        setErrMsg(data.message || 'Login failed');
      }
    } catch (error) {
      setErrMsg('Server error');
    }
  };

  return ( 
  
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to access your personalized content and settings</p>

        <div className="social-auth">
          <div className="social-btn google-btn"><i className="fab fa-google"></i></div>
          <div className="social-btn facebook-btn"><i className="fab fa-facebook-f"></i></div>
          <div className="social-btn twitter-btn"><i className="fab fa-twitter"></i></div>
        </div>

        <div className="auth-divider"><span>OR</span></div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='text-dark'
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='text-dark'
            />
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}

          <button type="submit" className="auth-btn">Sign In</button>
        </form>

        <div className="auth-footer">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
