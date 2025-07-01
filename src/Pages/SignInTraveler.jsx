import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/SignIn.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const SignInTraveler = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    console.log('Form submitted:', formData);
    // still have to check if the user is in the DB
    navigate('/UiPassenger'); 
  };
  return (
    <>
      <Header title="Sign In"/>
      <main className="signin-main">
        <form onSubmit = {handleSubmit} className="signin-container">
          <h2 className="signin-title">Welcome Back Traveler</h2>
          
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
            type="text" 
            id="username" 
            value={formData.username || ''}
            onChange={handleChange}
            className="signin-input"
            placeholder="Enter your username"
            required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
            type="password" 
            id="password" 
            value={formData.password || ''}
            onChange={handleChange}
            className="signin-input" 
            placeholder="Enter your password"
            required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="signin-button">Enter</button>
          <div className="signup-prompt">
            <p>Don't have an account?</p>
            <Link to="/SignUpTraveler" className="signup-link">Sign up</Link>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default SignInTraveler;
