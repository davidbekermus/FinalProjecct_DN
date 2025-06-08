import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-title">Footer</h2>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Your Website. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
