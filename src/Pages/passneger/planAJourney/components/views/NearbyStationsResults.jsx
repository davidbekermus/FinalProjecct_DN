import { useNavigate } from 'react-router-dom';
import { filterStations, sortStations } from '../../utils/filterUtils';
import StationCard from '../ui/StationCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';

/**
 * Component for displaying nearby stations
 */
const NearbyStationsResults = ({ 
  nearbyStations, 
  locationLoading, 
  searchTerm, 
  searchType 
}) => {
  const navigate = useNavigate();

  if (locationLoading) {
    return <LoadingSpinner message="Finding stations near you..." />;
  }

  // Ensure nearbyStations is an array
  const stations = Array.isArray(nearbyStations) ? nearbyStations : [];
  
  // Ensure searchTerm and searchType have default values
  const safeSearchTerm = searchTerm || '';
  const safeSearchType = searchType || 'station_name';

  // Filter and sort nearby stations
  let filteredStations = filterStations(stations, safeSearchTerm, safeSearchType);
  filteredStations = sortStations(filteredStations, safeSearchType);

  const handleStationClick = (station) => {
    navigate('/station-lines', {
      state: { station }
    });
  };

  return (
    <div className="results-display">
      {filteredStations.length === 0 ? (
        <EmptyState message="No nearby stations found" />
      ) : (
        <div className="nearby-stations-grid">
          {filteredStations.map((station, idx) => (
            <StationCard
              key={station.id || idx}
              station={station}
              onClick={() => handleStationClick(station)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyStationsResults;

