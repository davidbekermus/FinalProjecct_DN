import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { api } from "../utils/api";
import "../Css/RouteCounter.css";

const RouteCounter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [storedRouteData, setStoredRouteData] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState("1"); // Default to Direction 1

  // Get data from navigation state or stored data
  const { stopId, stopName, routeShortName, routeLongName, agencyName, route_mkt } = location.state || {};
  const currentData = storedRouteData || { stopId, stopName, routeShortName, routeLongName, agencyName, route_mkt };

  useEffect(() => {
    // Check if user is signed in
    const token = localStorage.getItem("token");
    if (!token) {
      // Store the current route counter data before redirecting
      const routeCounterData = {
        stopId,
        stopName,
        routeShortName,
        routeLongName,
        agencyName,
        route_mkt,
        selectedDirection: selectedDirection, // Store current selected direction
        timestamp: Date.now()
      };
      localStorage.setItem("pendingRouteCounter", JSON.stringify(routeCounterData));
      
      alert("You must be signed in to access this page.");
      navigate("/Login");
      return;
    }

    // Check if we have stored route counter data (user just signed in)
    const storedData = localStorage.getItem("pendingRouteCounter");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const dataAge = Date.now() - parsedData.timestamp;
        
        // Only use stored data if it's less than 5 minutes old
        if (dataAge < 5 * 60 * 1000) {
          // Update the component state with stored data
          setStoredRouteData(parsedData);
          // Set the direction from stored data or default to "1"
          setSelectedDirection(parsedData.selectedDirection || "1");
          // Clear the stored data
          localStorage.removeItem("pendingRouteCounter");
        } else {
          // Data is too old, clear it
          localStorage.removeItem("pendingRouteCounter");
        }
      } catch (error) {
        console.error("Error parsing stored route counter data:", error);
        localStorage.removeItem("pendingRouteCounter");
      }
    }

    // Check if required data is available (either from props or stored data)
    if (!currentData.stopId || !currentData.stopName || !currentData.routeShortName) {
      alert("Missing required data. Please go back and try again.");
      navigate(-1);
      return;
    }
  }, [navigate, stopId, stopName, routeShortName, route_mkt, storedRouteData]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post("/route-counter", {
        stationId: currentData.stopId,
        stationName: currentData.stopName,
        lineShortName: currentData.routeShortName,
        routeLongName: currentData.routeLongName,
        agencyName: currentData.agencyName,
        route_mkt: currentData.route_mkt,
        routeDirection: selectedDirection
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/"); // Go back after showing success
        }, 4000);
      } else {
        setError(response.data.message || "Failed to update route counter");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!currentData.stopId || !currentData.stopName || !currentData.routeShortName) {
    return (
      <div className="route-counter-container">
        <Header title="Route Counter" />
        <main className="route-counter-main">
          <div className="route-counter-content">
            <div className="error-message">Missing required data. Please go back and try again.</div>
            <button onClick={handleBack} className="back-button">← Back</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="route-counter-container">
      <Header title="Route Counter" />
      <main className="route-counter-main">
        <div className="route-counter-content">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h2>Route Counter</h2>
          
          <div className="info-section">
            <div className="station-info-card">
              <div className="station-icon">🚉</div>
              <div className="station-details">
                <div className="station-name">{currentData.stopName}</div>
              </div>
            </div>
            
            <div className="line-info-card">
              <div className="line-number">
                Line {currentData.routeShortName}
              </div>
              {currentData.routeLongName && (
                <div className="line-description">
                  {currentData.routeLongName}
                </div>
              )}
              {currentData.agencyName && (
                <div className="line-agency">
                  🚌 {currentData.agencyName}
                </div>
              )}
            </div>
          </div>

          {/* Direction Selection */}
          <div className="direction-toggle">
            <span className="direction-label">Direction {selectedDirection}:</span>
            <button
              type="button"
              className={`toggle-slider ${selectedDirection === "1" ? "left" : "right"}`}
              onClick={() => setSelectedDirection(selectedDirection === "1" ? "2" : "1")}
            >
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              Route counter updated successfully!
            </div>
          )}

          <div className="button-section">
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="submit-button"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RouteCounter; 