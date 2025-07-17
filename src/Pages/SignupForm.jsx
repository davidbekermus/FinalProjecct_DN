import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/SignUp.css";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

const SignupForm = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "traveler",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post("http://localhost:3000/auth/signup", formData);
      setError("");
      nav("/Login");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 || err.response?.status === 409) {
        setError(err.response.data.message || "User already exists");
        return;
      }
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header title="Sign Up" />
      <div className="signup-main">
        <div className="signup-container">
          <h2 className="signup-title">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="signup-group">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="signup-input"
                placeholder="Enter your name"
              />
            </div>
            <div className="signup-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="signup-input"
                placeholder="Enter your email"
              />
            </div>
            <div className="signup-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="signup-input"
                placeholder="Enter your password"
              />
            </div>
            <div className="signup-group">
              <label htmlFor="role">User Type:</label>
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="signup-input"
                b
                required
              >
                <option value="driver">Driver</option>
                <option value="traveler">Traveler</option>
              </select>
            </div>
            <button
              type="submit"
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </button>
            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}
          </form>
        </div>
      </div>
      <Footer />{" "}
    </div>
  );
};

export default SignupForm;
