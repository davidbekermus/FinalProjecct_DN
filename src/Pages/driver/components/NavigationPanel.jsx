import LoadingSpinner from '../../passneger/planAJourney/components/ui/LoadingSpinner';
import EmptyState from '../../passneger/planAJourney/components/ui/EmptyState';

/**
 * Component for navigation controls and route stops list
 */
const NavigationPanel = ({
  currentStopIndex,
  totalStops,
  onPreviousStop,
  onNextStop,
  onRouteComplete,
  stops,
  loading,
  error,
  onRetry
}) => {
  const isRouteComplete = currentStopIndex >= totalStops - 1;
  const canGoPrevious = currentStopIndex > 0;
  const canGoNext = currentStopIndex < totalStops - 1;

  return (
    <div className="navigation-panel">
      {/* Navigation Controls */}
      <div className="navigation-controls">
        <h3>Navigation</h3>
        <div className="control-buttons">
          <button 
            className="nav-btn prev-btn"
            onClick={onPreviousStop}
            disabled={!canGoPrevious}
          >
            ← Previous Stop
          </button>
          <button 
            className="nav-btn next-btn"
            onClick={onNextStop}
            disabled={!canGoNext}
          >
            Next Stop →
          </button>
        </div>
        <button 
          className="arrived-btn"
          onClick={onNextStop}
          disabled={!canGoNext}
        >
          Arrived / Next Stop Reached
        </button>
        
        {/* Route Completion Button */}
        {isRouteComplete && (
          <button 
            className="complete-route-btn"
            onClick={onRouteComplete}
          >
            🎉 Complete Route
          </button>
        )}
      </div>

      {/* Route Stops List */}
      <div className="stops-list-panel">
        <h3>Route Stops</h3>
        {loading ? (
          <LoadingSpinner message="Loading stops..." />
        ) : error ? (
          <div className="error">
            {error}
            <button onClick={onRetry} className="retry-btn">
              Retry
            </button>
          </div>
        ) : stops.length === 0 ? (
          <EmptyState message="No stops found" />
        ) : (
          <div className="stops-list-compact">
            {stops.map((stop, index) => (
              <div 
                key={stop.id || stop._id} 
                className={`stop-item-compact ${
                  index === currentStopIndex ? 'current-stop' : ''
                } ${
                  index < currentStopIndex ? 'completed-stop' : ''
                }`}
              >
                <div className="stop-number-compact">{index + 1}</div>
                <div className="stop-name-compact">{stop.name}</div>
                {index === currentStopIndex && (
                  <div className="current-indicator-compact">CURRENT</div>
                )}
                {index < currentStopIndex && (
                  <div className="completed-indicator-compact">✓</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationPanel;

