import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Css/StationSearch.css";
import { api } from "../utils/api";

function StationSearch() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("location"); // 'location' or 'station'
  const [searchQuery, setSearchQuery] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationLines, setStationLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock data - במקום אמיתי זה יבוא מ-API
  const mockStations = [
    {
      id: 1,
      name: "תחנה מרכזית תל אביב",
      city: "תל אביב",
      location: { lat: 32.0853, lng: 34.7818 },
      lines: ["קו 1", "קו 2", "קו 3", "קו 4", "קו 5"],
      distance: 0.5,
    },
    {
      id: 2,
      name: "תחנת הרכבת תל אביב מרכז",
      city: "תל אביב",
      location: { lat: 32.0853, lng: 34.7818 },
      lines: ["קו הרכבת תל אביב-ירושלים", "קו הרכבת תל אביב-חיפה"],
      distance: 1.2,
    },
    {
      id: 3,
      name: "תחנת האוטובוסים דיזנגוף",
      city: "תל אביב",
      location: { lat: 32.0853, lng: 34.7818 },
      lines: ["קו 10", "קו 11", "קו 12"],
      distance: 2.1,
    },
    {
      id: 4,
      name: "תחנה מרכזית ירושלים",
      city: "ירושלים",
      location: { lat: 31.7683, lng: 35.2137 },
      lines: ["קו 1", "קו 2", "קו 3", "קו 4"],
      distance: 0.8,
    },
    {
      id: 5,
      name: "תחנת הרכבת ירושלים מרכז",
      city: "ירושלים",
      location: { lat: 31.7683, lng: 35.2137 },
      lines: ["קו הרכבת תל אביב-ירושלים"],
      distance: 1.5,
    },
    {
      id: 6,
      name: "תחנה מרכזית חיפה",
      city: "חיפה",
      location: { lat: 32.794, lng: 34.9896 },
      lines: ["קו 1", "קו 2", "קו 3", "קו 4", "קו 5", "קו 6"],
      distance: 0.3,
    },
  ];

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await api.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=d4c5c4303dda4a4faacecc7b513d1ac9`
          );
          const data = response.data;

          if (data && data.results && data.results.length > 0) {
            const formatted = data.results[0].formatted;
            setSearchQuery(formatted);
            setSearchType("location");
            searchNearbyStations(latitude, longitude);
          } else {
            setError("Could not find a readable address.");
          }
        } catch (err) {
          setError("Failed to fetch address.");
        }

        setLocationLoading(false);
      },
      () => {
        setError("Unable to retrieve your location.");
        setLocationLoading(false);
      }
    );
  };

  const searchNearbyStations = (lat, lng) => {
    setLoading(true);
    // Mock API call - במקום אמיתי זה יהיה קריאה ל-API
    setTimeout(() => {
      const nearbyStations = mockStations
        .map((station) => ({
          ...station,
          distance: Math.random() * 5, // Mock distance calculation
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);

      setSearchResults(nearbyStations);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError("");

    // Mock API call
    setTimeout(() => {
      let results = [];

      if (searchType === "station") {
        // Search by station name
        results = mockStations.filter((station) =>
          station.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        // Search by city/location
        results = mockStations.filter(
          (station) =>
            station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            station.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setSearchResults(results);
      setLoading(false);
    }, 1000);
  };

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    setStationLines(station.lines);
  };

  const handleBackToSearch = () => {
    setSelectedStation(null);
    setStationLines([]);
  };

  const handleViewBusInfo = () => {
    navigate("/BusInfo");
  };

  return (
    <>
      <Header title="חיפוש תחנות" />
      <main className="station-search-main">
        <div className="station-search-container">
          <h2 className="station-search-title">חיפוש תחנות תחבורה</h2>

          {!selectedStation ? (
            <>
              <div className="search-type-selector">
                <button
                  className={`search-type-btn ${
                    searchType === "location" ? "active" : ""
                  }`}
                  onClick={() => setSearchType("location")}
                >
                  חיפוש לפי מיקום/עיר
                </button>
                <button
                  className={`search-type-btn ${
                    searchType === "station" ? "active" : ""
                  }`}
                  onClick={() => setSearchType("station")}
                >
                  חיפוש לפי תחנה
                </button>
              </div>

              <div className="search-form">
                <div className="input-group">
                  <label>
                    {searchType === "location"
                      ? "הזן עיר או מיקום:"
                      : "הזן שם תחנה:"}
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    placeholder={
                      searchType === "location"
                        ? "לדוגמה: תל אביב, ירושלים, חיפה"
                        : "לדוגמה: תחנה מרכזית תל אביב"
                    }
                  />

                  {searchType === "location" && (
                    <button
                      type="button"
                      onClick={handleUseMyLocation}
                      disabled={locationLoading}
                      className="use-location-button"
                    >
                      {locationLoading ? "מאתר מיקום..." : "השתמש במיקום שלי"}
                    </button>
                  )}
                </div>

                <button
                  onClick={handleSearch}
                  disabled={loading || !searchQuery.trim()}
                  className="search-button"
                >
                  {loading ? "מחפש..." : "חפש"}
                </button>

                {error && <p className="error-message">{error}</p>}
              </div>

              {loading && (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>מחפש תחנות...</p>
                </div>
              )}

              {searchResults.length > 0 && !loading && (
                <div className="search-results">
                  <h3>תוצאות חיפוש:</h3>
                  <div className="stations-grid">
                    {searchResults.map((station) => (
                      <div
                        key={station.id}
                        className="station-card"
                        onClick={() => handleStationSelect(station)}
                      >
                        <h4>{station.name}</h4>
                        <p className="station-city">{station.city}</p>
                        <p className="station-distance">
                          מרחק: {station.distance.toFixed(1)} ק"מ
                        </p>
                        <p className="station-lines">
                          {station.lines.length} קווים זמינים
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.length === 0 && !loading && searchQuery && (
                <div className="no-results">
                  <p>לא נמצאו תחנות מתאימות</p>
                </div>
              )}
            </>
          ) : (
            <div className="station-details">
              <button onClick={handleBackToSearch} className="back-button">
                ← חזור לחיפוש
              </button>

              <div className="station-info">
                <h3>{selectedStation.name}</h3>
                <p className="station-city">{selectedStation.city}</p>
                <p className="station-distance">
                  מרחק: {selectedStation.distance.toFixed(1)} ק"מ
                </p>
              </div>

              <div className="lines-section">
                <h4>קווים זמינים בתחנה:</h4>
                <div className="lines-grid">
                  {stationLines.map((line, index) => (
                    <div key={index} className="line-card">
                      <span className="line-number">{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="action-buttons">
                <button
                  onClick={handleViewBusInfo}
                  className="view-bus-info-button"
                >
                  צפה במידע על האוטובוסים
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default StationSearch;
