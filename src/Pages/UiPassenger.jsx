import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Css/UiPassenger.css";
import { api } from "../utils/api";
import axios from "axios";

const SEARCH_MODES = {
  STATION: "station",
  LOCATION: "location",
  LINE: "line",
};

function UiPassenger() {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState(SEARCH_MODES.STATION);
  const [stationName, setStationName] = useState("");
  const [lineNumber, setLineNumber] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  // For location-based search
  const [userLocation, setUserLocation] = useState(null);

  const handleSearchMode = (mode) => {
    setSearchMode(mode);
    setError("");
    setResults([]);
  };

  const handleStationSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResults([]);
    setLoading(true);

    try {
      // חיפוש תחנות מהשרת המקומי
      const searchParams = new URLSearchParams();
      if (stationName.trim()) {
        // אם יש טקסט חיפוש, נחפש גם בשם וגם בעיר
        searchParams.append('name', stationName.trim());
        searchParams.append('city', stationName.trim());
      }
      searchParams.append('limit', '50');
      
      const res = await axios.get(`http://localhost:3000/stations?${searchParams.toString()}`);
      const data = res.data;
      
      // אם חיפשנו גם בעיר, נעשה חיפוש נוסף
      let allStations = data.stations || [];
      
      if (stationName.trim()) {
        // חיפוש נוסף בעיר אם לא מצאנו מספיק תוצאות
        if (allStations.length < 10) {
          const cityRes = await axios.get(`http://localhost:3000/stations?city=${encodeURIComponent(stationName.trim())}&limit=30`);
          const cityStations = cityRes.data.stations || [];
          
          // מיזוג התוצאות ומניעת כפילויות
          const existingIds = new Set(allStations.map(s => s.id));
          const newStations = cityStations.filter(s => !existingIds.has(s.id));
          allStations = [...allStations, ...newStations];
        }
      }
      
      // סינון נוסף בצד הלקוח למקרה שהשרת לא סינן מספיק טוב
      const filtered = allStations.filter((s) =>
        s.city?.toLowerCase().includes(stationName.toLowerCase()) ||
        s.name?.toLowerCase().includes(stationName.toLowerCase())
      );
      
      setResults(filtered.slice(0, 20)); // הגבלה ל-20 תוצאות
    } catch (err) {
      setError("שגיאה בחיפוש תחנות");
    }
    setLoading(false);
  };

  const handleLineSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const response = await api.get(`/bus-lines?get_count=false&route_short_name=${encodeURIComponent(lineNumber)}`);
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setResults(data);
      } else {
        setResults([]);
        setError("No lines found matching the entered number.");
      }
    } catch (err) {
      setError("Error searching for lines: " + (err.response?.data?.message || err.message));
      setResults([]);
    }
    setLoading(false);
  };

  const handleLocationSearch = async () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location services");
      return;
    }
    setLocationLoading(true);
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          // שליפת תחנות מהשרת המקומי
          const res = await axios.get('http://localhost:3000/stations?limit=1000');
          const data = res.data;
          const allStations = data.stations || [];

          // חישוב מרחק
          const calcDist = (lat1, lon1, lat2, lon2) => {
            const R = 6371;
            const dLat = ((lat2 - lat1) * Math.PI) / 180;
            const dLon = ((lon2 - lon1) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) ** 2;
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          };

          const sorted = allStations
            .map((s) => ({
              ...s,
              distance: calcDist(
                position.coords.latitude,
                position.coords.longitude,
                s.lat,
                s.lon
              ),
            }))
            .filter((s) => s.distance <= 3)
            .sort((a, b) => a.distance - b.distance);

          setResults(sorted);
        } catch (err) {
          setError("Error searching for stations");
        }
        setLocationLoading(false);
        setLoading(false);
        setLoading(false);
      },
      () => {
        setError("Error getting location");
        setLocationLoading(false);
        setLoading(false);
      }
    );
  };

  const handleStationClick = (station) => {
    // ניווט לעמוד הקווים עם נתוני התחנה
    console.log("Station clicked in UiPassenger:", station);
    console.log("Station ID:", station.id, "Type:", typeof station.id);

    navigate("/station-lines", {
      state: { station },
    });
  };

  // Helper to extract city from route_long_name (like CompanyBusLines)
  const getCityFromRoute = (routeLongName) => {
    if (!routeLongName) return '';
    try {
      const originPart = routeLongName.split('<->')[0];
      const cityParts = originPart.split('-');
      return cityParts[cityParts.length - 1].trim();
    } catch (e) {
      return '';
    }
  };

  return (
    <>
      <Header title="Transportation Planner" />
      <main className="signin-main">
        <div className="signin-container">
          <h2 className="uipassenger-title">Welcome, Passenger</h2>
          <div className="uipassenger-search-modes">
            <button
              onClick={() => handleSearchMode(SEARCH_MODES.STATION)}
              className={`uipassenger-mode-btn${searchMode === SEARCH_MODES.STATION ? " active" : ""}`}
            >
              Search by Station Name
            </button>
            <button
              onClick={() => handleSearchMode(SEARCH_MODES.LOCATION)}
              className={`uipassenger-mode-btn${searchMode === SEARCH_MODES.LOCATION ? " active" : ""}`}
            >
              Search by Current Location
            </button>
            <button
              onClick={() => handleSearchMode(SEARCH_MODES.LINE)}
              className={`uipassenger-mode-btn${searchMode === SEARCH_MODES.LINE ? " active" : ""}`}
            >
              Search by Line Number
            </button>
          </div>

          {/* Search by station name */}
          {searchMode === SEARCH_MODES.STATION && (
            <form
              onSubmit={handleStationSearch}
              className="uipassenger-search-form"
            >
              <label>Station Name:</label>
              <input
                type="text"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                className="signin-input"
                placeholder="Enter station name"
                required
                style={{ marginBottom: "1rem" }}
              />
              <button type="submit" className="signin-button">
                Search
              </button>
            </form>
          )}

          {/* Search by current location */}
          {searchMode === SEARCH_MODES.LOCATION && (
            <div className="uipassenger-location-search">
              <button
                onClick={handleLocationSearch}
                className="signin-button"
                disabled={locationLoading}
              >
                {locationLoading ? "Locating..." : "Find Nearby Stations"}
              </button>
              {userLocation && (
                <div className="uipassenger-user-location">
                  Current Location: {userLocation.lat.toFixed(5)}, {" "}
                  {userLocation.lng.toFixed(5)}
                </div>
              )}
            </div>
          )}

          {/* Search by line number */}
          {searchMode === SEARCH_MODES.LINE && (
            <form
              onSubmit={handleLineSearch}
              className="uipassenger-search-form"
            >
              <label>Line Number:</label>
              <input
                type="text"
                value={lineNumber}
                onChange={(e) => setLineNumber(e.target.value)}
                className="signin-input"
                placeholder="Enter line number"
                required
                style={{ marginBottom: "1rem" }}
              />
              <button type="submit" className="signin-button">
                Search
              </button>
            </form>
          )}

          {/* Loading message */}
          {loading && (
            <div
              style={{ textAlign: "center", padding: "1rem", color: "#6b7280" }}
            >
              טוען תחנות...
            </div>
          )}

          {/* Error message */}
          {error && (
            <p className="uipassenger-error-message">{error}</p>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
                תוצאות חיפוש ({results.length}):
              </h3>
              <div style={{ display: "grid", gap: "1rem" }}>
                {results.map((station, idx) => (
                  <div
                    key={station.id || idx}
                    onClick={() => handleStationClick(station)}
                    style={{
                      background: "white",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      padding: "1rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 8px 24px rgba(102, 126, 234, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 2px 8px rgba(0, 0, 0, 0.05)";
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginLeft: "1rem" }}>
                      🚌
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "1rem",
                          color: "#1f2937",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {station.name}
                      </div>
                    </div>
                  ) : (
                    <div
                      key={item.id || idx}
                      onClick={() => handleStationClick(item)}
                      className="uipassenger-station-card"
                    >
                      <div className="uipassenger-station-icon">🚌</div>
                      <div className="uipassenger-station-info">
                        <div className="uipassenger-station-name">{item.name}</div>
                        <div className="uipassenger-station-city">{item.city}</div>
                        {item.distance && (
                          <div className="uipassenger-station-distance">
                            Distance: {item.distance.toFixed(1)} km
                          </div>
                        )}
                      </div>
                      {station.distance && (
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#9ca3af",
                            marginTop: "0.25rem",
                          }}
                        >
                          מרחק: {station.distance.toFixed(1)} ק"מ
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        color: "#9ca3af",
                        marginRight: "0.5rem",
                      }}
                    >
                      →
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            results.length === 0 &&
            searchMode !== SEARCH_MODES.LINE && (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#6b7280",
                }}
              >
                לא נמצאו תחנות. נסה חיפוש אחר.
              </div>
            )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default UiPassenger;
