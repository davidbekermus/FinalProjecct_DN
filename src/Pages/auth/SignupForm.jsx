import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/SignUp.css";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { signupValidation } from "../../utils/validations";
import { AuthContext } from "../../App";
import { useContext } from "react";

const SignupForm = () => {
  const nav = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "passenger",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 New state for visibility

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = signupValidation(formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setIsLoading(true);
      const signupResponse = await axios.post(
        "http://localhost:3000/auth/signup",
        formData
      );

      // Check if this is a driver signup
      if (formData.role === "driver") {
        setError("");
        alert(
          "Driver account created successfully! Please wait for admin approval before logging in."
        );
        nav("/Login");
        return;
      }

      setError("");
      // Automatically log the user in after signup (only for non-drivers)
      const loginRes = await axios.post("http://localhost:3000/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      if (loginRes.data?.token && loginRes.data?.user) {
        localStorage.setItem("token", loginRes.data.token);
        setUser(loginRes.data.user);
        if (typeof setToken === "function") setToken(loginRes.data.token);
        // Check for pending route counter data
        const pendingRouteCounter = localStorage.getItem("pendingRouteCounter");
        if (pendingRouteCounter) {
          try {
            const parsedData = JSON.parse(pendingRouteCounter);
            const dataAge = Date.now() - parsedData.timestamp;
            if (dataAge < 5 * 60 * 1000) {
              nav("/RouteCounter", { state: parsedData });
              return;
            } else {
              localStorage.removeItem("pendingRouteCounter");
            }
          } catch (error) {
            localStorage.removeItem("pendingRouteCounter");
          }
        }
        // Default navigation after signup+login
        if (loginRes.data.user.role === "admin") {
          nav("/AdminPage");
        } else if (loginRes.data.user.role === "driver") {
          nav("/UiDriver");
        } else {
          nav("/plan-journey");
        }
        return;
      }
      // fallback if login fails
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
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="signup-input"
                placeholder="Enter your password"
              />
            </div>
            <div className="signup-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="signup-input"
                placeholder="Re-enter your password"
              />
            </div>

            <div className="signup-group">
              <label>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                />{" "}
                Show Password
              </label>
            </div>

            <div className="signup-group">
              <label htmlFor="role">User Type:</label>
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="signup-input"
                required
              >
                <option value="passenger">Passenger</option>
                <option value="driver">Driver</option>
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
      <Footer />
    </div>
  );
};

export default SignupForm;
