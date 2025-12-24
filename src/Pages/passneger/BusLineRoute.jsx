import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useRouteStops } from "./hooks/useRouteStops";
import RouteInfoCard from "./components/RouteInfoCard";
import RouteStopCard from "./components/RouteStopCard";
import LoadingSpinner from "./planAJourney/components/ui/LoadingSpinner";
import EmptyState from "./planAJourney/components/ui/EmptyState";
import "../../Css/BusLineRoute.css";

/**
 * Component for displaying bus line route with all stops
 */
const BusLineRoute = () => {
  const { gtfs_route_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { stops, routeInfo, loading, error } = useRouteStops(gtfs_route_id);

  const handleBack = () => navigate(-1);
  
  const routeTitle = location.state?.routeShortName || routeInfo?.route_short_name || gtfs_route_id;

  return (
    <div className="bus-line-route-container">
      <Header title={`line :${routeTitle}`} />
      <main className="bus-line-route-main">
        <div className="content-wrapper">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h2>Bus Line Route</h2>
          
          <RouteInfoCard routeInfo={routeInfo} locationState={location.state} />

          {loading ? (
            <LoadingSpinner message="Loading route..." />
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : stops.length > 0 ? (
            <div className="stops-list route-visual">
              <h3>Stops for line: {routeTitle}</h3>
              <div className="route-line">
                {stops.map((stop) => (
                  <RouteStopCard
                    key={stop.id || stop._id}
                    stop={stop}
                    routeInfo={routeInfo}
                    locationState={location.state}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState message="No stops found for this route." />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusLineRoute;
