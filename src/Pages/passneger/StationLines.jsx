import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useStationLines } from "./hooks/useStationLines";
import { extractCityFromRoute } from "./planAJourney/utils/dataUtils";
import StationInfoCard from "./components/StationInfoCard";
import BusLineCard from "./planAJourney/components/ui/BusLineCard";
import LoadingSpinner from "./planAJourney/components/ui/LoadingSpinner";
import EmptyState from "./planAJourney/components/ui/EmptyState";
import "../../Css/StationLines.css";

/**
 * Component for displaying all bus lines that serve a station
 */
const StationLines = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);

  useEffect(() => {
    if (location.state && location.state.station) {
      const stationData = location.state.station;
      console.log("Station from location.state:", stationData);
      setStation(stationData);
    } else {
      console.warn("No station found in location.state");
    }
  }, [location]);

  const { lines, loading, error } = useStationLines(station);

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

          <StationInfoCard station={station} />

          <div className="lines-section">
            <h3 className="lines-title">Lines serving this station ({lines.length})</h3>

            {loading && <LoadingSpinner message="Loading lines..." />}
            {error && <div className="error-message">{error}</div>}
            {!loading && !error && lines.length === 0 && (
              <EmptyState message="No lines found" />
            )}

            {!loading && lines.length > 0 && (
              <div className="lines-grid">
                {lines.map((line, index) => (
                  <BusLineCard
                    key={line._id || index}
                    line={line}
                    onClick={() => handleLineClick(line)}
                    showAgency={true}
                    className="line-card"
                  />
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
