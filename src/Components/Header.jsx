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
          {!user || user.role !== "driver" ? (
            <Link to="/plan-journey" className="nav-link">
              Plan Journey
            </Link>
          ) : null}
          {user && user.role === "driver" && (
            <Link to="/UiDriver" className="nav-link">
              Start a Journey
            </Link>
          )}
          {user ? (
            <>
              <span
                className="nav-link"
                style={{ cursor: "default", fontWeight: 600 }}
              >
                Hello {user.name}
              </span>
              {user.role === "admin" && (
                <Link to="/AdminPage" className="nav-link">
                  Admin
                </Link>
              )}
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
            </>
          ) : (
            <>
              <Link to="/Login" className="nav-link">
                Login
              </Link>
              <Link to="/SignUp" className="nav-link">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
