import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/SignIn.css";

const LoginForm = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const { data } = await axios.post(
        "http://localhost:3000/auth/login",
        formData
      );
      setError("");
      localStorage.setItem("token", data.token);
      if (data.user.role === "admin") {
        nav("/AdminPage");
      } else if (data.user.role === "driver") {
        nav("/UiDriver");
      } else {
        nav("/UiPassenger");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
        return;
      }
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-main">
      <div className="signin-container">
        <h2 className="signin-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="signin-input"
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="signin-input"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="signin-button" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}
          <div
            className="signup-prompt"
            style={{ textAlign: "center", marginTop: "1rem" }}
          >
            <p>Don't have an account?</p>
            <a href="/SignUp" className="signup-link">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
