import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <>
      <Header title="Sign Up" />
      <main className="signup-main">
        <div className="signup-container">
          <h2 className="signup-title">Create Your Account</h2>

          <div className="signup-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" className="signup-input" placeholder="Enter your first name" />
          </div>

          <div className="signup-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" className="signup-input" placeholder="Enter your last name" />
          </div>

          <div className="signup-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" className="signup-input" placeholder="Enter your email" />
          </div>

          <div className="signup-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" className="signup-input" placeholder="Enter your phone number" />
          </div>

          <div className="signup-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" className="signup-input" placeholder="Choose a username" />
          </div>

          <div className="signup-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="signup-input" placeholder="Create a password" />
          </div>

          <div className="signup-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" className="signup-input" placeholder="Re-enter your password" />
          </div>

          <button className="signup-button">Register</button>

          <div className="signup-footer">
            <p>Already have an account?</p>
            <Link to="/SignIn" className="signup-link">Sign in</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SignUp;
