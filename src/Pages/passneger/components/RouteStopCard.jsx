import { useNavigate } from 'react-router-dom';

/**
 * Component for displaying a route stop with navigation option
 */
const RouteStopCard = ({ stop, routeInfo, locationState }) => {
  const navigate = useNavigate();

  const handleChooseStation = () => {
    navigate("/RouteCounter", {
      state: {
        stopId: stop.id,
        stopName: stop.name,
        routeShortName: locationState?.routeShortName || routeInfo?.route_short_name,
        routeLongName: locationState?.routeLongName || routeInfo?.route_long_name,
        agencyName: locationState?.agencyName || routeInfo?.agency_name,
        route_mkt: locationState?.route_mkt || routeInfo?.route_mkt
      }
    });
  };

  return (
    <div className="route-stop" key={stop.id || stop._id}>
      <div className="route-dot" />
      <div className="stop-info">
        <span className="stop-name">{stop.name}</span>
        <button
          className="choose-station-btn"
          onClick={handleChooseStation}
        >
          Choose This Station
        </button>
      </div>
    </div>
  );
};

export default RouteStopCard;

