import React from 'react'
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/SignIn.css'; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SignInDriver = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  }  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    console.log('Form submitted:', formData);
    navigate('/UiPassenger'); // Assuming you want to navigate to UiPassenger after successful sign-in
  }
  return (
        <>
      <Header title="Sign In" />
      <main className="signin-main">
        <form onSubmit ={handleSubmit} className="signin-container">
          <h2 className="signin-title">Welcome Back Driver</h2>
          
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
            type="text" 
            id="username" 
            value={formData.username || ''}
            className="signin-input" 
            placeholder="Enter your username"
            onChange={handleChange}
            required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
            type="password" 
            id="password"
            value = {formData.password || ''} 
            className="signin-input" 
            placeholder="Enter your password"
            onChange={handleChange}
            required />
          </div>

          {error && <p className="error-message">{error}</p>}
          <button className="signin-button">Enter</button>
         
          <div className="signup-prompt">
            <p>Don't have an account?</p>
            <Link to="/SignUpDriver" className="signup-link">Sign up</Link>
          </div>
        </form>
      </main>
      <Footer />
    </>
  )
}

export default SignInDriver