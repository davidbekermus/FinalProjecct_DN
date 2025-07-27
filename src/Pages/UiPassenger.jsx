import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Css/UiPassenger.css";
import { api } from "../utils/api";

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
    // TODO: fetch stations by name
    setResults([`Search results for station: ${stationName}`]);
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
            .filter((s) => s.distance <= 3)
            .sort((a, b) => a.distance - b.distance);
          setResults(sorted);
        } catch (err) {
          setError("Error searching for stations");
        }
        setLocationLoading(false);
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
    navigate('/station-lines', {
      state: { station }
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
            <div className="uipassenger-loading-message">
              Loading stations...
            </div>
          )}

          {/* Error message */}
          {error && (
            <p className="uipassenger-error-message">{error}</p>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="uipassenger-results">
              <h3 className="uipassenger-results-title">Search Results ({results.length}):</h3>
              <div className="uipassenger-stations-grid">
                {results.map((item, idx) => (
                  searchMode === SEARCH_MODES.LINE ? (
                    <div key={item.id || idx} className="uipassenger-station-card">
                      <div className="uipassenger-station-icon">🚌</div>
                      <div className="uipassenger-station-info">
                        <div className="uipassenger-station-name">
                          <strong>Route:</strong> {item.route_short_name}
                        </div>
                        <div className="uipassenger-station-city">
                          <strong>Long Name:</strong> {item.route_long_name}
                        </div>
                        <div className="uipassenger-station-city">
                          <strong>Agency:</strong> {item.agency_name}
                        </div>
                        <div className="uipassenger-station-city">
                          <strong>City:</strong> {getCityFromRoute(item.route_long_name)}
                        </div>
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
                      <div className="uipassenger-arrow">→</div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {!loading && !error && results.length === 0 && searchMode !== SEARCH_MODES.LINE && (
            <div className="uipassenger-no-results">
              No stations found. Try another search.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default UiPassenger;
