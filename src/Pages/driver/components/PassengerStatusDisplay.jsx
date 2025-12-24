/**
 * Component for displaying passenger count and stop decision
 */
const PassengerStatusDisplay = ({ 
  passengerCount, 
  shouldStop, 
  loading, 
  lastUpdated 
}) => {
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    return lastUpdated.toLocaleTimeString();
  };

  if (loading) {
    return <div className="loading-large">Loading passenger data...</div>;
  }

  return (
    <div className="passenger-status-large">
      {/* Passenger Count - LARGE AND PROMINENT */}
      <div className={`passenger-count-large ${shouldStop ? 'has-passengers' : 'no-passengers'}`}>
        <div className="count-display">
          <span className="count-number">{passengerCount || 0}</span>
          <span className="count-label">Passengers Waiting</span>
        </div>
      </div>
      
      {/* Stop Decision - LARGE AND CLEAR */}
      <div className={`stop-decision-large ${shouldStop ? 'should-stop' : 'no-stop'}`}>
        {shouldStop ? (
          <div className="decision-content should-stop">
            <div className="decision-icon">🛑</div>
            <div className="decision-text">
              <h3>STOP HERE</h3>
              <p>Passengers are waiting at this stop</p>
            </div>
          </div>
        ) : (
          <div className="decision-content no-stop">
            <div className="decision-icon">➡️</div>
            <div className="decision-text">
              <h3>CONTINUE</h3>
              <p>No passengers waiting - skip this stop</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="last-updated-large">
        Last updated: {formatLastUpdated()}
      </div>
    </div>
  );
};

export default PassengerStatusDisplay;

