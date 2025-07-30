import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import "../../Css/StationLines.css";
import { api } from "../../utils/api";

const StationLines = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state && location.state.station) {
      const stationData = location.state.station;
      console.log("Station from location.state:", stationData);

      setStation(stationData);
      fetchStationLines(stationData);
    } else {
      console.warn("No station found in location.state");
      setError("No station data found");
    }
  }, [location]);

  const fetchStationLines = async (stationData) => {
    setLoading(true);
    setError("");
    setLines([]);

    const rawId = stationData.id;
    const stationId = Number(rawId);
    console.log("Station ID:", rawId, "Parsed:", stationId);

    if (!stationId || isNaN(stationId)) {
      setError("Invalid station ID");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/routes/station/${stationId}`);
      const data = response.data;

      if (!data.routes || data.routes.length === 0) {
        setError("No lines found for this station");
        setLoading(false);
        return;
      }

      const processedLines = data.routes.map((route) => {
        // The busLineId field contains the populated bus line object
        const busLineData = route.busLineId;
        return {
          id: route._id,
          _id: busLineData?._id || route._id, // Use MongoDB ObjectId from busLine
          route_short_name: busLineData?.route_short_name || "Unknown",
          route_long_name: busLineData?.route_long_name || "Unknown",
          agency_name: busLineData?.agency_name || "Unknown",
          gtfs_route_id: busLineData?.id || route._id,
          routeDescription: busLineData?.route_desc || `Route serving ${route.stations?.length || 0} stations`,
          route_mkt: busLineData?.route_mkt || route.route_mkt,
          busLineId: busLineData,
        };
      });

      const sortedLines = processedLines.sort((a, b) => {
        const aNum = parseInt(a.route_short_name) || 999;
        const bNum = parseInt(b.route_short_name) || 999;
        return aNum - bNum;
      });

      console.log("Full lines object for station:", sortedLines);
      setLines(sortedLines);
    } catch (err) {
      console.error("Error fetching lines:", err);
      setError(`Error fetching lines: ${err.message}`);
    }

    setLoading(false);
  };

  const handleBack = () => navigate(-1);

  const handleLineClick = (line) => {
    navigate('/RouteCounter', {
      state: {
        stopId: station.id,
        stopName: station.name,
        routeShortName: line.route_short_name,
        routeLongName: line.route_long_name,
        agencyName: line.agency_name,
        route_mkt: line.route_mkt || line.busLineId?.route_mkt || undefined
      }
    });
  };

  return (
    <>
      <Header title="Station Lines" />
      <main className="station-lines-main">
        <div className="station-lines-container">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>

          {station && (
            <div className="station-info-card">
              <div className="station-icon">🚌</div>
              <div className="station-details">
                <h2 className="station-name">{station.name}</h2>
                <p className="station-city">{station.city}</p>
                {station.code && <p className="station-code">Station Code: {station.code}</p>}
                {station.distance && <p className="station-distance">Distance: {station.distance.toFixed(1)} km</p>}
              </div>
            </div>
          )}

          <div className="lines-section">
            <h3 className="lines-title">Lines serving this station ({lines.length})</h3>

            {loading && <div className="loading-message">Loading lines...</div>}
            {error && <div className="error-message">{error}</div>}
            {!loading && !error && lines.length === 0 && <div className="empty-message">No lines found</div>}

            {!loading && lines.length > 0 && (
              <div className="lines-grid">
                {lines.map((line, index) => {
                  // Extract city information from route_long_name
                  const cityMatch = line.route_long_name?.match(/-([^-]+)-/);
                  const cityName = cityMatch ? cityMatch[1].trim() : '';
                  
                  return (
                    <div
                      key={line._id || index}
                      className="line-card"
                      onClick={() => handleLineClick(line)}
                    >
                      <div className="line-number">
                        Line {line.route_short_name}
                      </div>
                      {line.route_long_name && (
                        <div className="line-description">
                          {line.route_long_name}
                        </div>
                      )}
                      {cityName && (
                        <div className="line-city">
                          🏙️ {cityName}
                        </div>
                      )}
                      
                      <div className="line-agency">
                        🚌 {line.agency_name}
                      </div>
                    </div>
                  );
                })}
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
