import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Css/BusLineRoute.css";
import { api } from "../utils/api";

const BusLineRoute = () => {
  const { gtfs_route_id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stops, setStops] = useState([]);
  const [journeyId, setJourneyId] = useState(null);

  useEffect(() => {
    const fetchJourneyAndStops = async () => {
      setLoading(true);
      setError(null);
      setStops([]);
      setJourneyId(null);
      try {
        // 1. Fetch the first journey for the route
        const journeyRes = await api.get(
          `https://open-bus-stride-api.hasadna.org.il/gtfs_rides/list?get_count=false&gtfs_route_id=${gtfs_route_id}&order_by=id%20asc`
        );
        const journeys = journeyRes.data;
        if (!Array.isArray(journeys) || journeys.length === 0) {
          setError("No journeys found for this route.");
          setLoading(false);
          return;
        }
        const firstJourneyId = journeys[0].id;
        setJourneyId(firstJourneyId);
        // 2. Fetch the stops for the first journey
        const stopsRes = await api.get(
          `https://open-bus-stride-api.hasadna.org.il/gtfs_ride_stops/list?get_count=false&gtfs_ride_ids=${firstJourneyId}&order_by=id%20asc`
        );
        const stopsData = stopsRes.data;
        setStops(stopsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJourneyAndStops();
  }, [gtfs_route_id]);

  return (
    <div className="bus-line-route-container">
      <Header
        title={`line :${location.state?.routeShortName || gtfs_route_id}`}
      />
      <main className="bus-line-route-main">
        <div className="content-wrapper">
          <h2>Bus Line Route</h2>
          {location.state && (
            <div className="route-info">
              <p>
                <strong>Route Name:</strong> {location.state.routeLongName}
              </p>
              <p>
                <strong>Company:</strong> {location.state.agencyName}
              </p>
            </div>
          )}
          {loading ? (
            <div>Loading route...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : stops.length > 0 ? (
            <div className="stops-list route-visual">
              <h3>Stops for line: {location.state?.routeShortName}</h3>
              <div className="route-line">
                {stops.map((stop, idx) => (
                  <div className="route-stop" key={stop.id}>
                    <div className="route-dot" />
                    <div className="stop-info">
                      <span className="stop-name">{stop.gtfs_stop__name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>No stops found for this journey.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusLineRoute; 