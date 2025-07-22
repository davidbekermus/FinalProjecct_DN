import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Css/StationLines.css";

const StationLines = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // קבלת נתוני התחנה מה-state או מה-URL params
    if (location.state && location.state.station) {
      setStation(location.state.station);
      fetchStationLines(location.state.station);
    } else {
      // אם אין נתונים, חזור לעמוד הקודם
      setError("לא נמצאו נתוני תחנה");
    }
  }, [location]);

  const fetchStationLines = async (stationData) => {
    setLoading(true);
    setError("");
    setLines([]);

    console.log("Starting to fetch lines for station:", stationData);
    console.log("Station ID:", stationData.id, "Type:", typeof stationData.id);

    // בדיקת תקינות של station ID
    if (
      !stationData.id ||
      stationData.id === undefined ||
      stationData.id === null
    ) {
      console.error("Invalid station ID:", stationData.id);
      setError("מזהה תחנה לא תקין");
      setLoading(false);
      return;
    }

    try {
      // שליפת קווים מהשרת המקומי לפי מזהה התחנה
      const localServerUrl = `http://localhost:3000/routes/station/${stationData.id}`;
      console.log("Fetching routes from local server:", localServerUrl);

      const response = await fetch(localServerUrl);
      console.log("Local server response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Routes data from local server:", data);

      if (!data.routes || data.routes.length === 0) {
        setLines([]);
        setError("לא נמצאו קווים לתחנה זו");
        setLoading(false);
        return;
      }

      // שמירת מידע על מספר הקווים המקוריים
      const originalCount = data.originalCount || data.routes.length;
      console.log(`Original routes: ${originalCount}, Total shown: ${data.routes.length}`);

      // עיבוד הנתונים - כל route כבר מכיל את פרטי הקו (busLineId populated)
      const processedLines = data.routes.map((route) => ({
        id: route._id,
        route_short_name: route.busLineId?.route_short_name || "לא ידוע",
        route_long_name: route.busLineId?.route_long_name || "לא ידוע",
        agency_name: route.busLineId?.agency_name || "לא ידוע",
        gtfs_route_id: route.busLineId?.gtfs_route_id || route._id,
        routeDescription: route.routeDescription || route.busLineId?.route_desc || "מסלול לא זמין", // מידע על המסלול
        busLineId: route.busLineId,
      }));

      console.log("Processed lines:", processedLines);

      // מיון לפי מספר קו
      const sortedLines = processedLines.sort((a, b) => {
        const aNum = parseInt(a.route_short_name) || 999;
        const bNum = parseInt(b.route_short_name) || 999;
        return aNum - bNum;
      });

      console.log("Final sorted lines:", sortedLines);
      setLines(sortedLines);
    } catch (err) {
      console.error("Error fetching station lines:", err);
      setError(`שגיאה בשליפת הקווים: ${err.message}`);
      setLines([]);
    }

    setLoading(false);
  };

  const handleBack = () => {
    navigate(-1); // חזור לעמוד הקודם
  };

  const handleLineClick = (line) => {
    // ניווט לעמוד פרטי הקו עם הנתונים הנכונים
    console.log('Navigating to bus line route with:', line);
    navigate(`/bus-line-route/${line.gtfs_route_id}`, {
      state: {
        routeShortName: line.route_short_name,
        routeLongName: line.route_long_name,
        agencyName: line.agency_name,
        line: line // שמירה על הנתונים המקוריים
      },
    });
  };

  if (!station && !error) {
    return (
      <>
        <Header title="קווים בתחנה" />
        <main className="station-lines-main">
          <div className="station-lines-container">
            <div className="loading-message">טוען...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header title="קווים בתחנה" />
      <main className="station-lines-main">
        <div className="station-lines-container">
          <button className="back-btn" onClick={handleBack}>
            ← חזור
          </button>

          {station && (
            <div className="station-info-card">
              <div className="station-icon">🚌</div>
              <div className="station-details">
                <h2 className="station-name">{station.name}</h2>
                <p className="station-city">{station.city}</p>
                {station.code && (
                  <p className="station-code">קוד תחנה: {station.code}</p>
                )}
                {station.distance && (
                  <p className="station-distance">
                    מרחק: {station.distance.toFixed(1)} ק"מ
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="lines-section">
            <h3 className="lines-title">
              קווים המגיעים לתחנה ({lines.length})
            </h3>
            {lines.length >= 10 && (
              <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#6b7280", marginBottom: "1rem" }}>
                מוצגים 10 קווים (כולל קווים נוספים להשלמה במידת הצורך)
              </p>
            )}

            {loading && <div className="loading-message">טוען קווים...</div>}

            {error && <div className="error-message">{error}</div>}

            {!loading && !error && lines.length === 0 && (
              <div className="empty-message">לא נמצאו קווים לתחנה זו</div>
            )}

            {!loading && lines.length > 0 && (
              <div className="lines-grid">
                {lines.map((line, index) => (
                  <div
                    key={line.gtfs_route_id || index}
                    className="line-card"
                    onClick={() => handleLineClick(line)}
                  >
                    <div className="line-number">{line.route_short_name}</div>
                    <div className="line-details">
                      <div className="line-name">{line.route_long_name}</div>
                      <div className="line-route">{line.routeDescription}</div>
                      <div className="line-agency">{line.agency_name}</div>
                    </div>
                    <div className="line-arrow">→</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StationLines;
