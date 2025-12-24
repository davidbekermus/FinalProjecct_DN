/**
 * Component for displaying station information
 */
const StationInfoCard = ({ station }) => {
  if (!station) return null;

  return (
    <div className="station-info-card">
      <div className="station-icon">🚌</div>
      <div className="station-details">
        <h2 className="station-name">{station.name}</h2>
        <p className="station-city">{station.city}</p>
        {station.code && (
          <p className="station-code">Station Code: {station.code}</p>
        )}
        {station.distance && (
          <p className="station-distance">
            Distance: {station.distance.toFixed(1)} km
          </p>
        )}
      </div>
    </div>
  );
};

export default StationInfoCard;

