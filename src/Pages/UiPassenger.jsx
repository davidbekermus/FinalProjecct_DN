import { useState, useEffect } from "react";
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
      const res = await fetch(
        "https://open-bus-stride-api.hasadna.org.il/gtfs_stops/list?limit=1000"
      );
      const data = await res.json();
      const allStations = data.map((stop) => ({
        id: stop.id,
        name: stop.name,
        city: stop.city,
        lat: stop.lat,
        lon: stop.lon,
        code: stop.code,
      }));
      
      const filtered = allStations.filter(
        (s) =>
          s.city?.toLowerCase().includes(stationName.toLowerCase()) ||
          s.name?.toLowerCase().includes(stationName.toLowerCase())
      );
      
      setResults(filtered.slice(0, 20)); // הגבלה ל-20 תוצאות
    } catch (err) {
      setError("שגיאה בחיפוש תחנות");
    }
    setLoading(false);
  };

  const handleLineSearch = (e) => {
    e.preventDefault();
    // TODO: fetch stations by line number
    setResults([`תוצאות חיפוש עבור קו: ${lineNumber}`]);
  };

  const handleLocationSearch = async () => {
    if (!navigator.geolocation) {
      setError("הדפדפן לא תומך במיקום");
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
          
          const res = await fetch(
            "https://open-bus-stride-api.hasadna.org.il/gtfs_stops/list?limit=1000"
          );
          const data = await res.json();
          const allStations = data.map((stop) => ({
            id: stop.id,
            name: stop.name,
            city: stop.city,
            lat: stop.lat,
            lon: stop.lon,
            code: stop.code,
          }));
          
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
              distance: calcDist(position.coords.latitude, position.coords.longitude, s.lat, s.lon),
            }))
            .filter((s) => s.distance <= 3) // סינון תחנות עד 3 ק"מ בלבד
            .sort((a, b) => a.distance - b.distance);
            
          setResults(sorted);
        } catch (err) {
          setError("שגיאה בחיפוש תחנות");
        }
        setLocationLoading(false);
        setLoading(false);
      },
      () => {
        setError("שגיאה בקבלת מיקום");
        setLocationLoading(false);
        setLoading(false);
      }
    );
  };

  const handleStationClick = (station) => {
    // ניווט לעמוד הקווים עם נתוני התחנה
    console.log("Station clicked in UiPassenger:", station);
    console.log("Station ID:", station.id, "Type:", typeof station.id);
    
    navigate('/station-lines', {
      state: { station }
    });
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
                {locationLoading ? "מחפש מיקום..." : "מצא תחנות קרובות"}
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

          {/* Loading message */}
          {loading && (
            <div style={{ textAlign: "center", padding: "1rem", color: "#6b7280" }}>
              טוען תחנות...
            </div>
          )}

          {/* Error message */}
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>תוצאות חיפוש ({results.length}):</h3>
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
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginLeft: "1rem" }}>🚌</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600", fontSize: "1rem", color: "#1f2937", marginBottom: "0.25rem" }}>
                        {station.name}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                        {station.city}
                      </div>
                      {station.distance && (
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.25rem" }}>
                          מרחק: {station.distance.toFixed(1)} ק"מ
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: "1.5rem", color: "#9ca3af", marginRight: "0.5rem" }}>→</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && results.length === 0 && searchMode !== SEARCH_MODES.LINE && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
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
