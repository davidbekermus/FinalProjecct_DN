import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Css/BusStopInfo.css";

const LocationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ verticalAlign: "middle", marginRight: 6 }}
  >
    <circle
      cx="10"
      cy="10"
      r="8"
      stroke="#1976d2"
      strokeWidth="2"
      fill="#e3eafc"
    />
    <circle cx="10" cy="10" r="3" fill="#1976d2" />
  </svg>
);

const BusStopInfo = () => {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("city");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://open-bus-stride-api.hasadna.org.il/gtfs_stops/list?limit=1000"
        );
        const data = await res.json();
        setStations(
          data.map((stop) => ({
            id: stop.id,
            name: stop.name,
            city: stop.city,
            lat: stop.lat,
            lon: stop.lon,
            code: stop.code,
          }))
        );
      } catch {
        setError("שגיאה בטעינת תחנות");
      }
      setLoading(false);
    };
    fetchStations();
  }, []);

  const handleSearch = async (e) => {
    e && e.preventDefault();
    setError("");
    setResults([]);
    setSelected(null);

    if (searchType === "city") {
      const filtered = stations.filter(
        (s) =>
          s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    } else {
      handleLocationSearch();
    }
  };

  const handleLocationSearch = () => {
    if (!navigator.geolocation) {
      setError("אין תמיכה במיקום");
      return;
    }
    setLocating(true);
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
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
        const sorted = stations
          .map((s) => ({
            ...s,
            distance: calcDist(latitude, longitude, s.lat, s.lon),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 10);
        setResults(sorted);
        setLocating(false);
        setLoading(false);
      },
      () => {
        setError("שגיאה בקבלת מיקום");
        setLocating(false);
        setLoading(false);
      }
    );
  };

  const handleSelect = async (station) => {
    setSelected(station);
    setLoading(true);
    setError("");
    setLines([]);

    try {
      // שליפת ה-ride stops לפי stop_id (id של התחנה)
      const resRideStops = await fetch(
        `https://open-bus-stride-api.hasadna.org.il/gtfs_ride_stops/list?stop_id=${station.id}&get_count=false&order_by=id%20asc`
      );
      const rideStopsData = await resRideStops.json();

      if (!rideStopsData || rideStopsData.length === 0) {
        setLines(["לא נמצאו קווים לתחנה זו"]);
        setLoading(false);
        return;
      }

      // שולפים את כל ה-route_id ייחודיים
      const uniqueRouteIds = [...new Set(rideStopsData.map(item => item.route_id))];

      // שליפת פרטי הקווים לפי ה-route_id
      const queryParams = uniqueRouteIds.map(id => `route_id=${id}`).join("&");
      const resRoutes = await fetch(
        `https://open-bus-stride-api.hasadna.org.il/gtfs_routes/list?${queryParams}`
      );
      const routesData = await resRoutes.json();

      if (!routesData || routesData.length === 0) {
        // אם אין מידע מפורט, נראה רק את המספרים
        setLines(uniqueRouteIds.map(id => `קו ${id}`));
      } else {
        // יוצרים מערך של שמות קווים להציג
        const linesArr = routesData.map(route => {
          const shortName = route.route_short_name || "";
          const longName = route.route_long_name ? ` • ${route.route_long_name}` : "";
          return `${shortName}${longName}`;
        });
        setLines(linesArr);
      }
    } catch (err) {
      console.error("שגיאה בשליפת הקווים:", err);
      setError("שגיאה בשליפת הקווים");
      setLines([]);
    }

    setLoading(false);
  };

  const handleBack = () => {
    setSelected(null);
    setLines([]);
  };

  return ( 
    <>
      <Header title="חיפוש תחנות אוטובוס" />
      <main className="bus-stop-info-main">
        <div className="bus-stop-info-container">
          <h2>חיפוש תחנות אוטובוס</h2>

          <div className="search-type-bar">
            <button
              className={searchType === "city" ? "active" : ""}
              onClick={() => setSearchType("city")}
            >
              🔎 חיפוש לפי עיר
            </button>
            <button
              className={searchType === "location" ? "active" : ""}
              onClick={() => {
                setSearchType("location");
                handleLocationSearch();
              }}
              disabled={locating}
            >
              <LocationIcon />
              {locating ? "מחפש מיקום..." : "חיפוש לפי מיקום"}
            </button>
          </div>

          <form onSubmit={handleSearch} className="bus-stop-search-form">
            {searchType === "city" ? (
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="הכנס עיר או תחנה"
                className="bus-stop-input"
              />
            ) : (
              <span className="location-hint">
                המערכת תמצא את התחנות הקרובות ביותר
              </span>
            )}
            {searchType === "city" && (
              <button type="submit" className="search-btn" disabled={loading}>
                חפש
              </button>
            )}
          </form>

          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-message">טוען...</div>}

          {!selected ? (
            <div className="stations-list">
              {results.length === 0 && !loading && (
                <div className="empty-message">לא נמצאו תחנות</div>
              )}
              {results.map((station) => (
                <div
                  key={station.id}
                  className="station-card"
                  onClick={() => handleSelect(station)}
                >
                  <div className="station-card-header">
                    <div className="station-icon">🚌</div>
                    <div>
                      <div className="station-title">{station.name}</div>
                      <div className="station-city">{station.city}</div>
                    </div>
                  </div>
                  {station.distance && (
                    <div className="station-distance">
                      מרחק: {station.distance.toFixed(1)} ק"מ
                    </div>
                  )}
                  <div className="station-hint">לחץ לצפייה בקווים</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="selected-station-card">
              <button className="back-btn" onClick={handleBack}>
                ← חזור
              </button>
              <h3>
                {selected.name}{" "}
                <span className="station-city">({selected.city})</span>
              </h3>
              <div>
                <b>קווים:</b>
                <div className="lines-grid">
                  {lines.map((line, i) => (
                    <div key={i} className="line-card">
                      <span className="line-number">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BusStopInfo;
