import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { useRouteStops } from '../passneger/hooks/useRouteStops';
import { useCurrentStopData } from './hooks/useCurrentStopData';
import { useRouteProgress } from './hooks/useRouteProgress';
import RouteInfoHeader from './components/RouteInfoHeader';
import CurrentStopPanel from './components/CurrentStopPanel';
import NavigationPanel from './components/NavigationPanel';
import '../../Css/DriverRouteManager.css';

/**
 * Component for managing driver route with stop navigation and passenger tracking
 */
const DriverRouteManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedRoute, formData } = location.state || {};
  
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [selectedDirection, setSelectedDirection] = useState("1");
  const [routeStartTime, setRouteStartTime] = useState(null);

  // Fetch route stops
  const { stops, routeInfo, loading, error } = useRouteStops(selectedRoute?._id);

  // Get current stop
  const currentStop = stops[currentStopIndex] || null;

  // Fetch current stop passenger data (with WebSocket real-time updates)
  const {
    currentStopData,
    loading: loadingStopData,
    lastUpdated,
    refresh: refreshStopData
  } = useCurrentStopData(currentStop, selectedRoute, selectedDirection);

  // Calculate route progress
  const {
    routeProgress,
    estimatedCompletion,
    formatEstimatedCompletion
  } = useRouteProgress(currentStopIndex, stops.length, routeStartTime);

  // Set route start time when component mounts
  useEffect(() => {
    if (selectedRoute && !routeStartTime) {
      setRouteStartTime(new Date());
    }
  }, [selectedRoute, routeStartTime]);

  const handleNextStop = () => {
    if (currentStopIndex < stops.length - 1) {
      setCurrentStopIndex(prev => prev + 1);
    }
  };

  const handlePreviousStop = () => {
    if (currentStopIndex > 0) {
      setCurrentStopIndex(prev => prev - 1);
    }
  };

  const handleDirectionChange = (newDirection) => {
    setSelectedDirection(newDirection);
    setCurrentStopIndex(0);
    setRouteStartTime(new Date());
  };

  const handleRouteComplete = () => {
    alert('Route completed! Thank you for your service.');
    navigate('/UiDriver');
  };

  const shouldStopAtCurrentStop = () => {
    return (currentStopData?.counter || 0) > 0;
  };

  if (!selectedRoute) {
    return (
      <>
        <Header title="Route Manager" />
        <main className="driver-route-manager-main">
          <div className="driver-route-manager-container">
            <h2>No Route Selected</h2>
            <p>Please go back and select a route first.</p>
            <button onClick={() => navigate('/UiDriver')}>
              Back to Route Selection
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header title="Route Manager" />
      <main className="driver-route-manager-main">
        <div className="driver-route-manager-container">
          <RouteInfoHeader
            selectedRoute={selectedRoute}
            routeProgress={routeProgress}
            currentStopIndex={currentStopIndex}
            totalStops={stops.length}
            selectedDirection={selectedDirection}
            onDirectionChange={handleDirectionChange}
            onManualRefresh={refreshStopData}
            loadingStopData={loadingStopData}
            estimatedCompletion={formatEstimatedCompletion()}
          />

          <div className="driver-route-manager-content">
            {/* Left Side - Current Stop Status */}
            <CurrentStopPanel
              currentStop={currentStop}
              currentStopIndex={currentStopIndex}
              totalStops={stops.length}
              passengerCount={currentStopData?.counter || 0}
              shouldStop={shouldStopAtCurrentStop()}
              loadingStopData={loadingStopData}
              lastUpdated={lastUpdated}
            />

            {/* Right Side - Navigation and Route Info */}
            <NavigationPanel
              currentStopIndex={currentStopIndex}
              totalStops={stops.length}
              onPreviousStop={handlePreviousStop}
              onNextStop={handleNextStop}
              onRouteComplete={handleRouteComplete}
              stops={stops}
              loading={loading}
              error={error}
              onRetry={() => window.location.reload()}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DriverRouteManager;
