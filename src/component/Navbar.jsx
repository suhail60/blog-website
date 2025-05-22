import React, { useContext, useEffect } from "react";
import { BlogContext } from "../context/blog";
import { Link, useLocation } from "react-router-dom";


function Navbar() {
  const {  isAuthenticated,logout, setSearchTerm } = useContext(BlogContext);
    const location = useLocation();  // gets current URL path

  // Check if current path is "/dashboard"
  const hideNavItems = location.pathname === "/dashboard";

useEffect(()=>{

},[])
  console.log(isAuthenticated)



  return (
    <>
      <header>
        <nav>
          <div className="logo">
            <i className="fas fa-blog"></i>
            <span>BlogSphere</span>
          </div>

         {
          !hideNavItems ?  <div className="nav-item">
            <ul id="nav-list">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchTerm("");
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchTerm("Technology");
                  }}
                >
                  Technology
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchTerm("Science");
                  }}
                >
                  Science
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchTerm("Lifestyle");
                  }}
                >
                  Life Style
                </a>
              </li>
            </ul>
          </div>
:""
         }
          <div className="nav-right">
            <div className="search">
              <input
                id="search-input"
                type="search"
                placeholder="Search articles..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button id="search-btn" className="search-btn" type="submit">
                <i className="fas fa-search"></i>
              </button>
            </div>
            {isAuthenticated ? <div className="d-flex gap-1 m-lg-5" style={{marginRight:"12px"}}>
              <Link to="/dashboard" className=" border-r-8 auth-btn-nav ">
                Write
              </Link>
<div className="dropdown">
  <li className="auth-btn-nav">Profile</li>
  <ul className="dropdown-menu">
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/profile">Profile</a></li>
    <li><a href="/" onClick={logout}>Log Out</a></li>
  </ul>
</div>
</div>

              :
              <div className="auth-buttons">
                <Link to="/login" style={{ textDecoration: "none" }} className="auth-btn-nav login-btn">
                  Login
                </Link>
                <Link to="/signup" style={{ textDecoration: "none" }} className="auth-btn-nav signup-btn">
                  Sign Up
                </Link>
              </div>}
            <button className="mobile-menu-btn">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
