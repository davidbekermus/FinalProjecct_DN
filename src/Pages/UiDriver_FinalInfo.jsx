import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/UiDriver_FinalInfo.css';

const UiDriver_FinalInfo = () => {
  const location = useLocation();
  const { selectedRoute, formData } = location.state || {};
  
  // Mock data for demonstration - in real app this would come from API
  const nextStopName = "Central Station";
  const waitingPassengers = Math.floor(Math.random() * 10);

  if (!selectedRoute) {
    return (
      <>
        <Header title="Route Information" />
        <main className="ui-driver-finalinfo-main">
          <div className="ui-driver-finalinfo-container">
            <h2>No Route Selected</h2>
            <p>Please go back and select a route first.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header title="Route Information" />
      <main className="ui-driver-finalinfo-main">
        <div className="ui-driver-finalinfo-container">
          <h2>Selected Route Information</h2>
          
          {/* Route Details */}
          <div className="ui-driver-finalinfo-card">
            <div className="route-details">
              <h3>Route Details</h3>
              <div className="route-info">
                <p><strong>Route Number:</strong> {selectedRoute.route_short_name}</p>
                <p><strong>Company:</strong> {selectedRoute.agency_name}</p>
                <p><strong>Route Name:</strong> {selectedRoute.route_long_name}</p>
                <p><strong>Direction:</strong> {selectedRoute.route_direction}</p>
                <p><strong>Type:</strong> {selectedRoute.route_type}</p>
              </div>
            </div>

            {/* Search Criteria */}
            <div className="search-criteria">
              <h3>Search Criteria Used</h3>
              <div className="criteria-info">
                <p><strong>Bus Company:</strong> {formData?.busCompany}</p>
                <p><strong>Route Number:</strong> {formData?.busRouteNumber}</p>
                <p><strong>City Name:</strong> {formData?.cityName}</p>
              </div>
            </div>

            {/* Next Stop Information */}
            <div className="ui-driver-finalinfo-stop">
              <h3>Next Stop:</h3>
              <p className="ui-driver-finalinfo-stop-name">{nextStopName}</p>
            </div>
            
            <div className="ui-driver-finalinfo-passengers">
              <h3>Passengers Waiting:</h3>
              <p className="ui-driver-finalinfo-passenger-count">{waitingPassengers}</p>
            </div>
            
            <div className="ui-driver-finalinfo-status">
              {waitingPassengers > 0 ? (
                <p className="ui-driver-finalinfo-should-stop">Should stop at this stop</p>
              ) : (
                <p className="ui-driver-finalinfo-no-stop">No need to stop - no passengers waiting</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UiDriver_FinalInfo;