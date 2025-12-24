/**
 * Component for displaying a route card in search results
 */
const RouteCard = ({ route, onSelect }) => {
  return (
    <div className="bus-line-card">
      <div className="bus-line-info">
        <h4>Route {route.route_short_name}</h4>
        <p><strong>Company:</strong> {route.agency_name}</p>
        <p><strong>Route:</strong> {route.route_long_name}</p>
        <p><strong>Type:</strong> {route.route_type}</p>
      </div>
      <button 
        className="select-route-btn"
        onClick={() => onSelect(route)}
      >
        Select This Route
      </button>
    </div>
  );
};

export default RouteCard;

