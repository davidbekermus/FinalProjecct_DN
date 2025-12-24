/**
 * Component for displaying route information header with progress and controls
 */
const RouteInfoHeader = ({
  selectedRoute,
  routeProgress,
  currentStopIndex,
  totalStops,
  selectedDirection,
  onDirectionChange,
  onManualRefresh,
  loadingStopData,
  estimatedCompletion
}) => {
  return (
    <div className="route-info-header">
      <h2>Route {selectedRoute.route_short_name}</h2>
      <p><strong>Company:</strong> {selectedRoute.agency_name}</p>
      <p><strong>Route:</strong> {selectedRoute.route_long_name}</p>
      
      {/* Route Progress Bar */}
      <div className="route-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${routeProgress}%` }}
          ></div>
        </div>
        <span className="progress-text">
          {currentStopIndex + 1} of {totalStops} stops
        </span>
      </div>

      <div className="direction-selector">
        <label htmlFor="direction-select">
          <strong>Direction:</strong>
        </label>
        <select
          id="direction-select"
          value={selectedDirection}
          onChange={(e) => onDirectionChange(e.target.value)}
          className="direction-select"
        >
          <option value="1">Direction 1 (Default)</option>
          <option value="2">Direction 2 (Alternative)</option>
        </select>
      </div>

      {/* Real-time updates status and manual refresh */}
      <div className="auto-refresh-toggle">
        <div className="realtime-status">
          <span className="status-indicator">🟢</span>
          <span>Real-time updates enabled</span>
        </div>
        <button 
          onClick={onManualRefresh}
          className="refresh-btn"
          disabled={loadingStopData}
        >
          🔄 Refresh Now
        </button>
      </div>

      {estimatedCompletion && (
        <div className="estimated-completion">
          <strong>Estimated completion:</strong> {estimatedCompletion}
        </div>
      )}
    </div>
  );
};

export default RouteInfoHeader;

