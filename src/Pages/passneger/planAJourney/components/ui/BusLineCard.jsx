import { extractCityFromRoute } from '../../utils/dataUtils';

/**
 * Bus line card component for displaying bus line information
 */
const BusLineCard = ({ line, onClick, showAgency = false, className = "company-line-card" }) => {
  const cityName = extractCityFromRoute(line.route_long_name);

  return (
    <div 
      className={className}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
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
      {showAgency && line.agency_name && (
        <div className="line-agency">
          🚌 {line.agency_name}
        </div>
      )}
    </div>
  );
};

export default BusLineCard;

