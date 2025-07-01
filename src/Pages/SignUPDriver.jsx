import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';
import '../Css/SignUp.css';
import { useNavigate } from 'react-router-dom';

const SignUpDriver = () => {
const [formData, setFormData] = useState({})
const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password < 8){
      setError('Password must be at least 8 characters long');
      return;
    }else if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }else if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;  
    }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { 
      setError('Please enter a valid email address');
      return;
    }else if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid phone number (10 digits)');
      return;
    }else if (!/\d/.test(formData.password) || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[!@#$%^&*]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }else {
      setError('');
    console.log('Form submitted');
    // still have to add the the DB the new user
    navigator('/SignInDriver');
  }
}  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    
  }
  return (
    <>
      <Header title="Sign Up" />
      <main className="signup-main">
        <form className="signup-container" onSubmit={handleSubmit}>
          <h2 className="signup-title">Create Your Account</h2>

          <div className="signup-group">
            <label htmlFor="firstName">First Name</label>
            <input 
            type="text"
            id="firstName"
            value={formData.firstName || ''} 
            className="signup-input"
            onChange={handleChange} 
            placeholder="Enter your first name"
            required />
          </div>

          <div className="signup-group">
            <label htmlFor="lastName">Last Name</label>
            <input 
            type="text" 
            id="lastName"
            value={formData.lastName || ''} 
            className="signup-input"
            onChange={handleChange} 
            placeholder="Enter your last name"
            required />
          </div>

          <div className="signup-group">
            <label htmlFor="email">Email</label>
            <input 
            type="email" 
            id="email"
            value={formData.email || ''}
            onChange={handleChange} 
            className="signup-input" 
            placeholder="Enter your email"
            required />
          </div>

          <div className="signup-group">
            <label htmlFor="phone">Phone Number</label>
            <input 
            type="tel" 
            id="phone"
            value={formData.phone || ''}
            onChange={handleChange} 
            className="signup-input" 
            placeholder="Enter your phone number"
            required />
          </div>

          <div className="signup-group">
            <label htmlFor="username">Username</label>
            <input 
            type="text" 
            id="username" 
            value={formData.username || ''}
            onChange={handleChange}
            className="signup-input" 
            placeholder="Choose a username"
            required />
          </div>

          <div className="signup-group">
            <label htmlFor="password">Password</label>
            <input 
            type="password" 
            id="password"
            value={formData.password || ''}
            onChange={handleChange} 
            className="signup-input" 
            placeholder="Create a password"
            required />
          </div>

          <div className="signup-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
            type="password" 
            id="confirmPassword"
            value={formData.confirmPassword || ''}
            onChange={handleChange} 
            className="signup-input" 
            placeholder="Re-enter your password"
            required />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button className="signup-button" type="submit" >Register</button>

          <div className="signup-footer">
            <p>Already have an account?</p>
            <Link to="/SignInDriver" className="signup-link">Sign in</Link>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default SignUpDriver;
