import PassengerStatusDisplay from './PassengerStatusDisplay';

/**
 * Component for displaying current stop information and passenger status
 */
const CurrentStopPanel = ({
  currentStop,
  currentStopIndex,
  totalStops,
  passengerCount,
  shouldStop,
  loadingStopData,
  lastUpdated
}) => {
  if (!currentStop) {
    return (
      <div className="no-stop-selected">
        <p>No stop selected</p>
      </div>
    );
  }

  return (
    <div className="current-stop-panel">
      <h3>Current Stop</h3>
      <div className="current-stop-content">
        <div className="stop-name-large">
          <h2>{currentStop.name}</h2>
          <p className="stop-number-large">
            Stop #{currentStopIndex + 1} of {totalStops}
          </p>
        </div>
        
        <PassengerStatusDisplay
          passengerCount={passengerCount}
          shouldStop={shouldStop}
          loading={loadingStopData}
          lastUpdated={lastUpdated}
        />
      </div>
    </div>
  );
};

export default CurrentStopPanel;

