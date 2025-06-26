import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/BusStopInfo.css';

const BusStopInfo = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Add search logic here
    console.log('Searching for bus stop:', searchTerm);
  };

  return (
    <>
      <Header title="Bus Stop Information" />
      <main className="bus-stop-info-main">
        <div className="bus-stop-info-container">
          <h2>Search for Bus Stop Information</h2>
          <form onSubmit={handleSearch} className="bus-stop-info-search">
            <input
              type="text"
              placeholder="Enter bus stop name or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bus-stop-info-search-input"
            />
            <button type="submit" className="bus-stop-info-search-button">
              Search
            </button>
          </form>
          {/* Search results will be displayed here */}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BusStopInfo;
