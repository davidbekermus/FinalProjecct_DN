import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/UiDriver_FinalInfo.css';

const UiDriver_FinalInfo = ({ nextStopName, waitingPassengers }) => {
  return (
    <>
      <Header title="Next Stop Information" />
      <main className="ui-driver-finalinfo-main">
        <div className="ui-driver-finalinfo-container">
          <h2>Next Stop Information</h2>
          <div className="ui-driver-finalinfo-card">
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