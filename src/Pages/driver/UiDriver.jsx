import React, { useState } from "react";
import axios from "axios";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import "../../Css/UiDriver.css";
import { useNavigate } from "react-router-dom";

const UiDriver = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.busCompany ||
      !formData.busRouteNumber ||
      !formData.cityName
    ) {
      setError("Please fill in all fields");
      return;
    }
    
    setError("");
    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await axios.get("http://localhost:3000/bus-Lines/driver-search", {
        params: {
          busCompany: formData.busCompany,
          busRouteNumber: formData.busRouteNumber,
          cityName: formData.cityName
        }
      });

      setSearchResults(response.data.routes || []);
      
      if (response.data.routes.length === 0) {
        setError("No matching bus lines found. Please try different search criteria.");
      } else {
        setError("");
      }
    } catch (err) {
      console.error("Error searching bus lines:", err);
      setError("Error searching bus lines. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteSelect = (route) => {
    // Navigate to driver route manager with selected route data
    navigate("/DriverRouteManager", { 
      state: { 
        selectedRoute: route,
        formData: formData 
      } 
    });
  };

  return (
    <>
      <Header title="Transportation Planner" />
      <main className="ui-driver-main">
        <div className="ui-driver-container">
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            ברוך השב נהג
          </h2>
          <h2>Transportation Planner</h2>
          <form onSubmit={handleSubmit}>
            <div className="ui-driver-inputgroup">
              <label htmlFor="busCompany">Bus Company</label>
              <input
                type="text"
                id="busCompany"
                className="ui-driver-input"
                value={formData.busCompany || ""}
                onChange={handleChange}
                placeholder="Enter bus company name"
                required
              />

              <label htmlFor="busRouteNumber">Bus Route Number</label>
              <input
                type="text"
                id="busRouteNumber"
                className="ui-driver-input"
                value={formData.busRouteNumber || ""}
                onChange={handleChange}
                placeholder="Enter the route number"
                required
              />

              <label htmlFor="cityName">City Name</label>
              <input
                type="text"
                id="cityName"
                className="ui-driver-input"
                value={formData.cityName || ""}
                onChange={handleChange}
                placeholder="Enter city name"
                required
              />

              {error && <p className="error-message">{error}</p>}
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search Bus Lines"}
            </button>
          </form>

          {/* Search Results */}
          {hasSearched && (
            <div className="search-results">
              <h3>Search Results</h3>
              {isLoading ? (
                <p>Searching for bus lines...</p>
              ) : searchResults.length > 0 ? (
                <div className="results-container">
                  <p className="results-count">
                    Found {searchResults.length} matching bus line(s):
                  </p>
                  <div className="bus-lines-list">
                    {searchResults.map((route, index) => (
                      <div key={route._id || index} className="bus-line-card">
                        <div className="bus-line-info">
                          <h4>Route {route.route_short_name}</h4>
                          <p><strong>Company:</strong> {route.agency_name}</p>
                          <p><strong>Route:</strong> {route.route_long_name}</p>
                          <p><strong>Direction:</strong> {route.route_direction}</p>
                          <p><strong>Type:</strong> {route.route_type}</p>
                        </div>
                        <button 
                          className="select-route-btn"
                          onClick={() => handleRouteSelect(route)}
                        >
                          Select This Route
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="no-results">No matching bus lines found.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UiDriver;
