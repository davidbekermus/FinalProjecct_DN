import { useNavigate } from 'react-router-dom';
import { usePagination } from '../../hooks/usePagination';
import { filterStations, sortStations } from '../../utils/filterUtils';
import StationCard from '../ui/StationCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import PaginationControls from '../ui/PaginationControls';

/**
 * Component for displaying station search results
 */
const StationSearchResults = ({ 
  allStations, 
  stationsLoading, 
  searchTerm, 
  searchType 
}) => {
  const navigate = useNavigate();
  const PAGE_SIZE = 40;

  // Ensure allStations is an array
  const stations = Array.isArray(allStations) ? allStations : [];
  
  // Ensure searchTerm and searchType have default values
  const safeSearchTerm = searchTerm || '';
  const safeSearchType = searchType || 'station_name';

  // Filter and sort stations
  let filteredStations = filterStations(stations, safeSearchTerm, safeSearchType);
  filteredStations = sortStations(filteredStations, safeSearchType);

  // Pagination - MUST be called before any early returns (Rules of Hooks)
  const {
    page,
    totalPages,
    paginatedItems,
    goToPreviousPage,
    goToNextPage,
    hasNextPage,
    hasPreviousPage
  } = usePagination(filteredStations, PAGE_SIZE, searchTerm);

  // Show loading if explicitly loading or if allStations is undefined (data not loaded yet)
  if (stationsLoading || allStations === undefined) {
    return <LoadingSpinner message="Loading stations..." />;
  }

  const handleStationClick = (station) => {
    navigate('/station-lines', {
      state: { station }
    });
  };

  return (
    <div className="results-display">
      {filteredStations.length === 0 ? (
        <EmptyState message="No stations found" />
      ) : (
        <>
          <div className="stations-grid">
            {paginatedItems.map((station, idx) => (
              <StationCard
                key={station.id || idx}
                station={station}
                onClick={() => handleStationClick(station)}
              />
            ))}
          </div>
          
          <PaginationControls
            page={page}
            totalPages={totalPages}
            totalItems={filteredStations.length}
            onPrevious={goToPreviousPage}
            onNext={goToNextPage}
            hasPrevious={hasPreviousPage}
            hasNext={hasNextPage}
          />
        </>
      )}
    </div>
  );
};

export default StationSearchResults;

