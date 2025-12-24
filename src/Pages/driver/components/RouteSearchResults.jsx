import LoadingSpinner from '../../passneger/planAJourney/components/ui/LoadingSpinner';
import EmptyState from '../../passneger/planAJourney/components/ui/EmptyState';
import RouteCard from './RouteCard';

/**
 * Component for displaying route search results
 */
const RouteSearchResults = ({ 
  searchResults, 
  loading, 
  hasSearched, 
  onRouteSelect 
}) => {
  if (!hasSearched) return null;

  return (
    <div className="search-results">
      <h3>Search Results</h3>
      {loading ? (
        <LoadingSpinner message="Searching for bus lines..." />
      ) : searchResults.length > 0 ? (
        <div className="results-container">
          <p className="results-count">
            Found {searchResults.length} matching bus line(s):
          </p>
          <div className="bus-lines-list">
            {searchResults.map((route, index) => (
              <RouteCard
                key={route._id || index}
                route={route}
                onSelect={onRouteSelect}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState message="No matching bus lines found." />
      )}
    </div>
  );
};

export default RouteSearchResults;

