import React from 'react';
import { Link } from 'react-router-dom';


const Header = ({ title }) => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <img src="/FinalProjectImg.png" alt="Logo" className="logo" />
          <h1 className="header-title">{title}</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/SignIn" className="nav-link">Sign In</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
