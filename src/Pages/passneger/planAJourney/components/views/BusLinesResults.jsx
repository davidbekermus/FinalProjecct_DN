import { useNavigate } from 'react-router-dom';
import { usePagination } from '../../hooks/usePagination';
import { filterBusLines, sortBusLines } from '../../utils/filterUtils';
import { groupByAgency } from '../../utils/dataUtils';
import BusLineCard from '../ui/BusLineCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import PaginationControls from '../ui/PaginationControls';

/**
 * Component for displaying bus lines grouped by agency
 */
const BusLinesResults = ({ 
  busLines, 
  loading, 
  error, 
  searchTerm, 
  searchType 
}) => {
  const navigate = useNavigate();
  const PAGE_SIZE = 40;

  // Ensure busLines is an array
  const lines = Array.isArray(busLines) ? busLines : [];
  
  // Ensure searchTerm and searchType have default values
  const safeSearchTerm = searchTerm || '';
  const safeSearchType = searchType || 'route_short_name';

  // Filter and sort bus lines
  let filteredBusLines = filterBusLines(lines, safeSearchTerm, safeSearchType);
  filteredBusLines = sortBusLines(filteredBusLines, safeSearchType);

  // Pagination - MUST be called before any early returns (Rules of Hooks)
  const {
    page,
    totalPages,
    paginatedItems,
    goToPreviousPage,
    goToNextPage,
    hasNextPage,
    hasPreviousPage
  } = usePagination(filteredBusLines, PAGE_SIZE, searchTerm);

  // Always show loading if loading is true or if busLines is undefined and we're expecting data
  if (loading || (busLines === undefined && !error)) {
    return <LoadingSpinner message="Loading bus lines..." />;
  }

  if (error) {
    return <div className="results-error">{error}</div>;
  }

  // Group paginated lines by agency
  const grouped = groupByAgency(paginatedItems);

  const handleLineClick = (line) => {
    if (line._id) {
      navigate(`/bus-line-route/${line._id}`, {
        state: {
          routeShortName: line.route_short_name,
          routeLongName: line.route_long_name,
          agencyName: line.agency_name,
          route_mkt: line.route_mkt
        }
      });
    } else {
      alert('Cannot view route details: This bus line does not have a valid ID.');
      console.error('No valid MongoDB ObjectId (_id) found for line:', line);
    }
  };

  return (
    <div className="results-display">
      {Object.keys(grouped).length === 0 ? (
        <EmptyState message="No bus lines to display" />
      ) : (
        <>
          <div className="bus-lines-grouped-list">
            {Object.entries(grouped).map(([agency, lines]) => (
              <div key={agency} className="bus-lines-agency-group">
                <h3 className="bus-lines-agency-header">{agency}</h3>
                <div className="bus-lines-grid">
                  {lines.map((line, idx) => (
                    <BusLineCard
                      key={line._id || idx}
                      line={line}
                      onClick={() => handleLineClick(line)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <PaginationControls
            page={page}
            totalPages={totalPages}
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

export default BusLinesResults;

