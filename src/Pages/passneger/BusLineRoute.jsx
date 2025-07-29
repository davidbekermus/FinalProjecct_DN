import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import "../../Css/BusLineRoute.css";
import { api } from "../../utils/api";

const BusLineRoute = () => {
  const { gtfs_route_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stops, setStops] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    const fetchRouteAndStops = async () => {
      setLoading(true);
      setError(null);
      setStops([]);
      setRouteInfo(null);
      try {
        // Fetch the first route for the bus line from the local backend
        const res = await api.get(`/routes/line/${gtfs_route_id}`);
        const data = res.data;
        if (!data || !data.stations || data.stations.length === 0) {
          setError("No route or stops found for this bus line.");
          setLoading(false);
          return;
        }
        setStops(data.stations);
        setRouteInfo(data.busLineId);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRouteAndStops();
  }, [gtfs_route_id]);

  return (
    <div className="bus-line-route-container">
      <Header
        title={`line :${location.state?.routeShortName || routeInfo?.route_short_name || gtfs_route_id}`}
      />
      <main className="bus-line-route-main">
        <div className="content-wrapper">
          <h2>Bus Line Route</h2>
          {location.state && (
            <div className="route-info">
              <p>
                <strong>Route Name:</strong> {location.state.routeLongName || routeInfo?.route_long_name}
              </p>
              <p>
                <strong>Company:</strong> {location.state.agencyName || routeInfo?.agency_name}
              </p>
            </div>
          )}
          {loading ? (
            <div>Loading route...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : stops.length > 0 ? (
            <div className="stops-list route-visual">
              <h3>Stops for line: {location.state?.routeShortName || routeInfo?.route_short_name}</h3>
              <div className="route-line">
                {stops.map((stop, idx) => (
                  <div className="route-stop" key={stop.id || stop._id}>
                    <div className="route-dot" />
                    <div className="stop-info">
                      <span className="stop-name">{stop.name}</span>
                      <button
                        className="stop-details-btn"
                        style={{ marginLeft: 10 }}
                        onClick={() => navigate("/RouteCounter", { 
                          state: { 
                            stopId: stop.id, 
                            stopName: stop.name,
                            routeShortName: location.state?.routeShortName || routeInfo?.route_short_name,
                            routeLongName: location.state?.routeLongName || routeInfo?.route_long_name,
                            agencyName: location.state?.agencyName || routeInfo?.agency_name,
                            route_mkt: location.state?.route_mkt || routeInfo?.route_mkt
                          } 
                        })}
                      >
                        Route Counter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>No stops found for this route.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusLineRoute; 