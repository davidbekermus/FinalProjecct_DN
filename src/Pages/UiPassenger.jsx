import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Css/UiPassenger.css";

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

  // For location-based search
  const [userLocation, setUserLocation] = useState(null);

  const handleSearchMode = (mode) => {
    setSearchMode(mode);
    setError("");
    setResults([]);
  };

  const handleStationSearch = (e) => {
    e.preventDefault();
    // TODO: fetch stations by name
    setResults([`תוצאות חיפוש עבור תחנה: ${stationName}`]);
  };

  const handleLineSearch = (e) => {
    e.preventDefault();
    // TODO: fetch stations by line number
    setResults([`תוצאות חיפוש עבור קו: ${lineNumber}`]);
  };

  const handleLocationSearch = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationLoading(false);
        // TODO: fetch 10 closest stations by coordinates
        setResults(["10 תחנות הכי קרובות יוצגו כאן (דמו)"]);
      },
      () => {
        setError("Unable to retrieve your location.");
        setLocationLoading(false);
      }
    );
  };

  return (
    <>
      <Header title="Transportation Planner" />
      <main className="signin-main">
        <div className="signin-container">
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            ברוך השב נוסע
          </h2>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <button
              onClick={() => handleSearchMode(SEARCH_MODES.STATION)}
              style={{
                background:
                  searchMode === SEARCH_MODES.STATION ? "#7c3aed" : "#e0e7ff",
                color: searchMode === SEARCH_MODES.STATION ? "#fff" : "#1e3a8a",
                border: "none",
                borderRadius: "8px",
                padding: "0.5rem 1.5rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              חיפוש לפי שם תחנה
            </button>
            <button
              onClick={() => handleSearchMode(SEARCH_MODES.LOCATION)}
              style={{
                background:
                  searchMode === SEARCH_MODES.LOCATION ? "#7c3aed" : "#e0e7ff",
                color:
                  searchMode === SEARCH_MODES.LOCATION ? "#fff" : "#1e3a8a",
                border: "none",
                borderRadius: "8px",
                padding: "0.5rem 1.5rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              חיפוש לפי מיקום נוכחי
            </button>
            <button
              onClick={() => handleSearchMode(SEARCH_MODES.LINE)}
              style={{
                background:
                  searchMode === SEARCH_MODES.LINE ? "#7c3aed" : "#e0e7ff",
                color: searchMode === SEARCH_MODES.LINE ? "#fff" : "#1e3a8a",
                border: "none",
                borderRadius: "8px",
                padding: "0.5rem 1.5rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              חיפוש לפי מספר קו
            </button>
          </div>

          {/* Search by station name */}
          {searchMode === SEARCH_MODES.STATION && (
            <form
              onSubmit={handleStationSearch}
              style={{ marginBottom: "1.5rem" }}
            >
              <label>שם תחנה:</label>
              <input
                type="text"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                className="signin-input"
                placeholder="הכנס שם תחנה"
                required
                style={{ marginBottom: "1rem" }}
              />
              <button type="submit" className="signin-button">
                חפש
              </button>
            </form>
          )}

          {/* Search by current location */}
          {searchMode === SEARCH_MODES.LOCATION && (
            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <button
                onClick={handleLocationSearch}
                className="signin-button"
                disabled={locationLoading}
              >
                {locationLoading ? "מחפש מיקום..." : "מצא 10 תחנות קרובות"}
              </button>
              {userLocation && (
                <div style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  מיקום נוכחי: {userLocation.lat.toFixed(5)},{" "}
                  {userLocation.lng.toFixed(5)}
                </div>
              )}
            </div>
          )}

          {/* Search by line number */}
          {searchMode === SEARCH_MODES.LINE && (
            <form
              onSubmit={handleLineSearch}
              style={{ marginBottom: "1.5rem" }}
            >
              <label>מספר קו:</label>
              <input
                type="text"
                value={lineNumber}
                onChange={(e) => setLineNumber(e.target.value)}
                className="signin-input"
                placeholder="הכנס מספר קו"
                required
                style={{ marginBottom: "1rem" }}
              />
              <button type="submit" className="signin-button">
                חפש
              </button>
            </form>
          )}

          {/* Error message */}
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ textAlign: "center" }}>תוצאות חיפוש:</h3>
              <ul>
                {results.map((result, idx) => (
                  <li key={idx}>{result}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default UiPassenger;
