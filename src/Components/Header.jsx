import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Header.css";
import { AuthContext } from "../App";

const Header = ({ title }) => {
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
    <header className="modern-header" style={{ opacity }}>
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

        {/* Spacer to push nav links inward */}
        <div className="flex-spacer"></div>

        {/* Nav links */}
        <nav className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          {user ? (
            <>
              <span className="nav-link" style={{ cursor: "default", fontWeight: 600 }}>
                Hello {user.name}
              </span>
              <button className="nav-link" onClick={handleSignOut} style={{ background: "none", border: "none", cursor: "pointer" }}>
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
          <div className="transit-info-dropdown">
            <Link to="#" className="nav-link transit-info-link">
              Transit Info
            </Link>
            <div className="dropdown-content">
              <Link to="/BusInfo" className="dropdown-link">
                Bus Info
              </Link>
              <Link to="/BusStopInfo" className="dropdown-link">
                Bus Stop Info
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
