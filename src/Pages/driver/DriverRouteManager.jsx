import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { api } from '../../utils/api';
import '../../Css/DriverRouteManager.css';

const DriverRouteManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedRoute, formData } = location.state || {};
  
  const [stops, setStops] = useState([]);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStopData, setCurrentStopData] = useState(null);
  const [loadingStopData, setLoadingStopData] = useState(false);
  const [selectedDirection, setSelectedDirection] = useState("1");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [routeProgress, setRouteProgress] = useState(0);
  const [routeStartTime, setRouteStartTime] = useState(null);
  const [estimatedCompletion, setEstimatedCompletion] = useState(null);

  // Calculate route progress
  useEffect(() => {
    if (stops.length > 0) {
      const progress = ((currentStopIndex + 1) / stops.length) * 100;
      setRouteProgress(progress);
    }
  }, [currentStopIndex, stops.length]);

  // Set route start time when component mounts
  useEffect(() => {
    if (selectedRoute && !routeStartTime) {
      setRouteStartTime(new Date());
    }
  }, [selectedRoute, routeStartTime]);

  // Calculate estimated completion time
  useEffect(() => {
    if (routeStartTime && stops.length > 0) {
      const averageTimePerStop = 3; // minutes per stop
      const remainingStops = stops.length - currentStopIndex - 1;
      const estimatedMinutes = remainingStops * averageTimePerStop;
      
      const completionTime = new Date(routeStartTime);
      completionTime.setMinutes(completionTime.getMinutes() + estimatedMinutes);
      setEstimatedCompletion(completionTime);
    }
  }, [routeStartTime, stops.length, currentStopIndex]);

  // Fetch stops for the selected route
  const fetchStops = useCallback(async () => {
    if (!selectedRoute) {
      setError('No route selected');
      setLoading(false);
      return;
    }

    console.log('Selected route data:', selectedRoute);

    try {
      setLoading(true);
      setError(null);
      
      // Fetch route details and stops
      const response = await api.get(`/routes/line/${selectedRoute._id}`);
      const routeData = response.data;
      
      console.log('Route data response:', routeData);
      
      if (!routeData || !routeData.stations || routeData.stations.length === 0) {
        setError('No stops found for this route');
        return;
      }
      
      setStops(routeData.stations);
      console.log('Fetched stops:', routeData.stations);
    } catch (err) {
      console.error('Error fetching stops:', err);
      setError(err.response?.data?.message || 'Failed to fetch route stops');
    } finally {
      setLoading(false);
    }
  }, [selectedRoute]);

  useEffect(() => {
    fetchStops();
  }, [fetchStops]);

  // Fetch current stop data
  const fetchCurrentStopData = useCallback(async () => {
      if (stops.length === 0 || currentStopIndex >= stops.length) return;

      const currentStop = stops[currentStopIndex];
      if (!currentStop) return;

      try {
        setLoadingStopData(true);
        
        // Query routeCounter for current stop
        const response = await api.get('/route-counter/station', {
          params: {
            stationId: currentStop.id,
            route_mkt: selectedRoute.route_mkt || selectedRoute.id,
            routeDirection: selectedDirection
          }
        });
        
        setCurrentStopData(response.data);
      setLastUpdated(new Date());
        console.log('Current stop data:', response.data);
      } catch (err) {
        console.error('Error fetching stop data:', err);
        // Set default data if no counter exists
        setCurrentStopData({
          counter: 0,
          shouldStop: false
        });
      } finally {
        setLoadingStopData(false);
      }
  }, [currentStopIndex, stops, selectedRoute, selectedDirection]);

  useEffect(() => {
    fetchCurrentStopData();
  }, [fetchCurrentStopData]);

  // Auto-refresh passenger counts
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchCurrentStopData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchCurrentStopData]);

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

  const handleManualRefresh = () => {
    fetchCurrentStopData();
  };

  const handleRouteComplete = () => {
    alert('Route completed! Thank you for your service.');
    navigate('/UiDriver');
  };

  const getCurrentStop = () => {
    return stops[currentStopIndex] || null;
  };

  const shouldStopAtCurrentStop = () => {
    return currentStopData?.counter > 0;
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    return lastUpdated.toLocaleTimeString();
  };

  const formatEstimatedCompletion = () => {
    if (!estimatedCompletion) return 'Calculating...';
    return estimatedCompletion.toLocaleTimeString();
  };

  const isRouteComplete = () => {
    return currentStopIndex >= stops.length - 1;
  };

  if (!selectedRoute) {
    return (
      <>
        <Header title="Route Manager" />
        <main className="driver-route-manager-main">
          <div className="driver-route-manager-container">
            <h2>No Route Selected</h2>
            <p>Please go back and select a route first.</p>
            <button onClick={() => navigate('/UiDriver')}>Back to Route Selection</button>
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
          {/* Route Info Header */}
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
                {currentStopIndex + 1} of {stops.length} stops
              </span>
            </div>

            <div className="direction-selector">
              <label htmlFor="direction-select">
                <strong>Direction:</strong>
              </label>
              <select
                id="direction-select"
                value={selectedDirection}
                onChange={(e) => handleDirectionChange(e.target.value)}
                className="direction-select"
              >
                <option value="1">Direction 1 (Default)</option>
                <option value="2">Direction 2 (Alternative)</option>
              </select>
            </div>

            {/* Auto-refresh toggle */}
            <div className="auto-refresh-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                Auto-refresh passenger counts
              </label>
              <button 
                onClick={handleManualRefresh}
                className="refresh-btn"
                disabled={loadingStopData}
              >
                🔄 Refresh Now
              </button>
            </div>
          </div>

          <div className="driver-route-manager-content">
            {/* Left Side - Current Stop Status (MAIN FOCUS) */}
            <div className="current-stop-panel">
              <h3>Current Stop</h3>
              {getCurrentStop() ? (
                <div className="current-stop-content">
                  <div className="stop-name-large">
                    <h2>{getCurrentStop().name}</h2>
                    <p className="stop-number-large">Stop #{currentStopIndex + 1} of {stops.length}</p>
                  </div>
                  
                  {loadingStopData ? (
                    <div className="loading-large">Loading passenger data...</div>
                  ) : (
                    <div className="passenger-status-large">
                      {/* Passenger Count - LARGE AND PROMINENT */}
                      <div className={`passenger-count-large ${shouldStopAtCurrentStop() ? 'has-passengers' : 'no-passengers'}`}>
                        <div className="count-display">
                          <span className="count-number">{currentStopData?.counter || 0}</span>
                          <span className="count-label">Passengers Waiting</span>
                        </div>
                      </div>
                      
                      {/* Stop Decision - LARGE AND CLEAR */}
                      <div className={`stop-decision-large ${shouldStopAtCurrentStop() ? 'should-stop' : 'no-stop'}`}>
                        {shouldStopAtCurrentStop() ? (
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
                  )}
                </div>
              ) : (
                <div className="no-stop-selected">
                  <p>No stop selected</p>
                </div>
              )}
            </div>

            {/* Right Side - Navigation and Route Info */}
            <div className="navigation-panel">
              {/* Navigation Controls */}
              <div className="navigation-controls">
                <h3>Navigation</h3>
                <div className="control-buttons">
                  <button 
                    className="nav-btn prev-btn"
                    onClick={handlePreviousStop}
                    disabled={currentStopIndex === 0}
                  >
                    ← Previous Stop
                  </button>
                  <button 
                    className="nav-btn next-btn"
                    onClick={handleNextStop}
                    disabled={currentStopIndex >= stops.length - 1}
                  >
                    Next Stop →
                  </button>
                </div>
                <button 
                  className="arrived-btn"
                  onClick={handleNextStop}
                  disabled={currentStopIndex >= stops.length - 1}
                >
                  Arrived / Next Stop Reached
                </button>
                
                {/* Route Completion Button */}
                {isRouteComplete() && (
                  <button 
                    className="complete-route-btn"
                    onClick={handleRouteComplete}
                  >
                    🎉 Complete Route
                  </button>
                )}
              </div>

              {/* Route Stops List */}
              <div className="stops-list-panel">
                <h3>Route Stops</h3>
                {loading ? (
                  <div className="loading">Loading stops...</div>
                ) : error ? (
                  <div className="error">
                    {error}
                    <button onClick={fetchStops} className="retry-btn">
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="stops-list-compact">
                    {stops.map((stop, index) => (
                      <div 
                        key={stop.id || stop._id} 
                        className={`stop-item-compact ${index === currentStopIndex ? 'current-stop' : ''} ${index < currentStopIndex ? 'completed-stop' : ''}`}
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
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DriverRouteManager; 