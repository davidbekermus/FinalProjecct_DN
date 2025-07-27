import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/SignIn.css";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { signinValidation } from "../../utils/validations";
import { AuthContext } from "../../App";
import { useContext } from "react";

const LoginForm = () => {
  console.log("LoginForm rendered");
  const nav = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);
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
    console.log("handleSubmit called");
    const validationError = signinValidation(formData);
    if (validationError) {
      console.log("Validation error:", validationError);
      setError(validationError);
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "http://localhost:3000/auth/login",
        formData
      );
      console.log("Login response data:", data);
      if (!data?.token || !data?.user) {
        throw new Error("Malformed response");
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      if (typeof setToken === "function") setToken(data.token);

      console.log("User role:", data.user.role);
      if (data.user.role === "admin") {
        console.log("Navigating to /AdminPage");
        nav("/AdminPage");
      } else if (data.user.role === "driver") {
        console.log("Navigating to /UiDriver");
        nav("/UiDriver");
      } else {
        console.log("Navigating to /UiPassenger");
        nav("/UiPassenger");
      }
      setError("");

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
        return;
      }else {
        console.log("Error:", err);
      setError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header title="Login" />
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
            <button
              type="submit"
              className="signin-button"
              disabled={isLoading}
              onClick={() => console.log("Button clicked")}
            >
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
      <Footer />
    </div>
  );
};

export default LoginForm;
