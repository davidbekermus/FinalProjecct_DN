import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Header.css";
import { AuthContext } from "../App";

const Header = ({ title, transparent }) => {
  const [opacity, setOpacity] = useState(1);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const { user, setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const maxScroll = 500;

      if (currentScroll < lastScrollTop) {
        setOpacity(1);
      } else {
        let newOpacity = 1 - currentScroll / maxScroll;
        if (newOpacity < 0) newOpacity = 0;
        setOpacity(newOpacity);
      }

      setLastScrollTop(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/");
  };

  return (
    <header
      className={`modern-header ${transparent ? "transparent" : ""}`}
      style={{ opacity }}
    >
      <div className="modern-header-container">
        {/* Left side: Logo + title */}
        <div className="logo-title-group">
          <Link to="/" className="logo-link" aria-label="Home">
            <img
              src="/finalProjImg2.png"
              alt="BusCheck Logo"
              className="logo-image"
            />
          </Link>
          <h1 className="site-title">{title}</h1>
        </div>

        {/* Spacer to push nav links to right */}
        <div className="flex-spacer"></div>

        {/* Nav links */}
        <nav className="nav-links">
          {/* Position 1: Journey-related link */}
          <div className="nav-link-container">
            {!user || user.role !== "driver" ? (
              <Link to="/plan-journey" className="nav-link">
                Plan Journey
              </Link>
            ) : (
              <Link to="/UiDriver" className="nav-link">
                Start a Journey
              </Link>
            )}
          </div>

          {/* Position 2: User greeting (only for logged in users) */}
          <div className="nav-link-container">
            {user ? (
              <span
                className="nav-link"
                style={{ cursor: "default", fontWeight: 600 }}
              >
                Hello {user.name}
              </span>
            ) : (
              <Link to="/Login" className="nav-link">
                Login
              </Link>
            )}
          </div>

          {/* Position 3: Admin link, Sign Up, or Sign Out for drivers/passengers */}
          <div className="nav-link-container">
            {user ? (
              user.role === "admin" ? (
                <Link to="/AdminPage" className="nav-link">
                  Admin
                </Link>
              ) : user.role === "driver" ? (
                <button
                  className="nav-link"
                  onClick={handleSignOut}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  className="nav-link"
                  onClick={handleSignOut}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              )
            ) : (
              <Link to="/SignUp" className="nav-link">
                Sign Up
              </Link>
            )}
          </div>

          {/* Position 4: Sign Out (only for admins) */}
          <div className="nav-link-container">
            {user && user.role === "admin" ? (
              <button
                className="nav-link"
                onClick={handleSignOut}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            ) : (
              <div className="nav-link-placeholder"></div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
