import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const SignIn = () => {
  return (
    <>
      <Header title="Sign In" />
      <main className="signin-main">
        <div className="signin-container">
          <h2 className="signin-title">Welcome Back</h2>
          
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" className="signin-input" placeholder="Enter your username" />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="signin-input" placeholder="Enter your password" />
          </div>
          <Link to="/UiPassenger" className="forgot-password-link">
            <button className="signin-button">Enter</button>
          </Link>
          

          <div className="signup-prompt">
            <p>Don't have an account?</p>
            <Link to="/SignUp" className="signup-link">Sign up</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SignIn;
