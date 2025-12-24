/**
 * Station card component for displaying station information
 */
const StationCard = ({ station, onClick }) => {
  return (
    <div 
      className="station-card"
      onClick={onClick}
    >
      <div className="station-name">
        🚉 {station.name}
      </div>
      <div className="station-city">
        🏙️ {station.city}
      </div>
      {station.code && (
        <div className="station-code">
          Code: {station.code}
        </div>
      )}
      {station.distance !== undefined && (
        <div className="station-distance">
          📍 {station.distance.toFixed(2)} km away
        </div>
      )}
    </div>
  );
};

export default StationCard;

