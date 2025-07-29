import React, { useState, useEffect } from 'react';
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

  // Fetch stops for the selected route
  useEffect(() => {
      const fetchStops = async () => {
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
  };

    fetchStops();
  }, [selectedRoute]);

  // Fetch current stop data
  useEffect(() => {
    const fetchCurrentStopData = async () => {
      if (stops.length === 0 || currentStopIndex >= stops.length) return;

      const currentStop = stops[currentStopIndex];
      if (!currentStop) return;

      try {
        setLoadingStopData(true);
        
        // Query routeCounter for current stop
        const response = await api.get('/route-counter/station', {
          params: {
            stationId: currentStop.id,
            route_mkt: selectedRoute.route_mkt || selectedRoute.id
          }
        });
        
        setCurrentStopData(response.data);
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
    };

    fetchCurrentStopData();
  }, [currentStopIndex, stops, selectedRoute]);

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

  const getCurrentStop = () => {
    return stops[currentStopIndex] || null;
  };

  const shouldStopAtCurrentStop = () => {
    return currentStopData?.counter > 0;
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
          </div>

          <div className="driver-route-manager-content">
            {/* Left Side - Stops List */}
            <div className="stops-panel">
              <h3>Route Stops</h3>
              {loading ? (
                <div className="loading">Loading stops...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : (
                <div className="stops-list">
                  {stops.map((stop, index) => (
                    <div 
                      key={stop.id || stop._id} 
                      className={`stop-item ${index === currentStopIndex ? 'current-stop' : ''}`}
                    >
                      <div className="stop-number">{index + 1}</div>
                      <div className="stop-info">
                        <div className="stop-name">{stop.name}</div>
                        {index === currentStopIndex && (
                          <div className="current-indicator">Current Stop</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Controls and Status */}
            <div className="controls-panel">
              {/* Top Right - Navigation Controls */}
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
              </div>

              {/* Bottom Right - Status Panel */}
              <div className="status-panel">
                <h3>Current Stop Status</h3>
                {getCurrentStop() ? (
                  <div className="status-content">
                    <div className="current-stop-info">
                      <h4>{getCurrentStop().name}</h4>
                      <p>Stop #{currentStopIndex + 1} of {stops.length}</p>
                    </div>
                    
                    {loadingStopData ? (
                      <div className="loading">Loading stop data...</div>
                    ) : (
                      <div className="stop-status">
                        <div className="passenger-count">
                          <span className="label">Passengers Waiting:</span>
                          <span className="count">{currentStopData?.counter || 0}</span>
                        </div>
                        
                        <div className={`stop-decision ${shouldStopAtCurrentStop() ? 'should-stop' : 'no-stop'}`}>
                          {shouldStopAtCurrentStop() ? (
                            <div className="decision should-stop">
                              <span className="icon">🛑</span>
                              <span>Should stop at this stop</span>
                            </div>
                          ) : (
                            <div className="decision no-stop">
                              <span className="icon">➡️</span>
                              <span>No need to stop - no passengers waiting</span>
                            </div>
                          )}
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DriverRouteManager; 