import React from 'react';
import '../Css/Footer.css';

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        <h2 className="footer-title">BusCheck</h2>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} BusCheck. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
