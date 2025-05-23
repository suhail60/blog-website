import React, { useContext, useEffect, useState } from "react";
import { BlogContext } from "../context/blog";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const { isAuthenticated, logout, setSearchTerm } = useContext(BlogContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const hideNavItems = location.pathname === "/dashboard";

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header>
        <nav>
          <div className="logo">
            <i className="fas fa-blog"></i>
            <span>BlogSphere</span>
          </div>

          {/* Desktop Navigation */}
          {!hideNavItems && windowWidth > 768 && (
            <div className="nav-item">
              <ul id="nav-list">
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchTerm("");
                      closeMobileMenu();
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
                      closeMobileMenu();
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
                      closeMobileMenu();
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
                      closeMobileMenu();
                    }}
                  >
                    Life Style
                  </a>
                </li>
              </ul>
            </div>
          )}

          <div className="nav-right">
            {windowWidth > 768 && (
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
            )}

            {windowWidth > 768 ? (
              isAuthenticated ? (
                <div className="d-flex gap-1 m-lg-5" style={{ marginRight: "12px" }}>
                  <Link to="/dashboard" className="border-r-8 auth-btn-nav">
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
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" style={{ textDecoration: "none" }} className="auth-btn-nav login-btn">
                    Login
                  </Link>
                  <Link to="/signup" style={{ textDecoration: "none" }} className="auth-btn-nav signup-btn">
                    Sign Up
                  </Link>
                </div>
              )
            ) : (
              <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && windowWidth <= 768 && (
            <div className="mobile-menu">
              {!hideNavItems && (
                <ul className="mobile-nav-list">
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSearchTerm("");
                        closeMobileMenu();
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
                        closeMobileMenu();
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
                        closeMobileMenu();
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
                        closeMobileMenu();
                      }}
                    >
                      Life Style
                    </a>
                  </li>
                </ul>
              )}

              <div className="mobile-search">
                <input
                  type="search"
                  placeholder="Search articles..."
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    closeMobileMenu();
                  }}
                />
                <button className="search-btn" type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </div>

              {isAuthenticated ? (
                <div className="mobile-auth-buttons">
                  <Link to="/dashboard" className="mobile-auth-btn" onClick={closeMobileMenu}>
                    Write
                  </Link>
                  <Link to="/dashboard" className="mobile-auth-btn" onClick={closeMobileMenu}>
                    Dashboard
                  </Link>
                  <Link to="/profile" className="mobile-auth-btn" onClick={closeMobileMenu}>
                    Profile
                  </Link>
                  <Link to="/" className="mobile-auth-btn" onClick={() => { logout(); closeMobileMenu(); }}>
                    Log Out
                  </Link>
                </div>
              ) : (
                <div className="mobile-auth-buttons">
                  <Link to="/login" className="mobile-auth-btn" onClick={closeMobileMenu}>
                    Login
                  </Link>
                  <Link to="/signup" className="mobile-auth-btn" onClick={closeMobileMenu}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

    </>
  );
}

export default Navbar;