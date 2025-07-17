import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/BusInfo.css';

const BusInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [busData, setBusData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);


  const removeDuplicates = (data) => {
    const seen = new Set();
    return data.filter((company) => {
      const key = company.agency_name?.toLowerCase() || "";
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await fetch(
          "https://open-bus-stride-api.hasadna.org.il/gtfs_agencies/list"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data);
        
        if (Array.isArray(data)) {
          const uniqueData = removeDuplicates(data);
          setBusData(uniqueData);
        } else {
          setError("Unexpected response format from API");
        }
      } catch (error) {
        setError(error.message || "An error occurred while fetching bus data");
      }
    };
    fetchBusData();
  }, []);   
  
  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
  };

  const filteredData = busData.filter(company => {
    const searchLower = searchTerm.toLowerCase();
    const name = company.agency_name?.toLowerCase() || '';
    const url = company.agency_url?.toLowerCase() || '';
    
    return name.includes(searchLower) || url.includes(searchLower);
  });

  const displayedData = searchTerm ? filteredData : busData;

  return (
    <>
      {location.state?.companyName && (
        <p>You clicked on: {location.state.companyName}</p>
      )}
      <Header title="Bus Information" />
      <main className="bus-info-main">
        <div className="bus-info-container">
          <h2>Search for Bus Information</h2>
          <form onSubmit={handleSearch} className="bus-info-search">
            {error && (
              <div className="bus-info-error">
                <p>{error}</p>
              </div>
            )}
            <input
              type="text"
              placeholder="Enter bus route number or company name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bus-info-search-input"
            />
            <button type="submit" className="bus-info-search-button">
              Search
            </button>
          </form>
          {displayedData.length > 0 ? (
            <div className="bus-info-results">
              <h3>Bus Companies</h3>
              <ul>
                {displayedData.map((company, index) => (
                  <li key={index} className="company-item" onClick={() => {
                    console.log('Navigating to:', `/company-bus-lines/${encodeURIComponent(company.operator_ref)}`);
                    navigate(`/company-bus-lines/${encodeURIComponent(company.operator_ref)}`, {
                      state: { 
                        companyName: company.agency_name
                      }
                    });
                  }}>
                    <h4>{company.agency_name}</h4>
                    <p>{company.agency_url}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : busData.length === 0 ? (
            <div className="bus-info-loading">
              <p>Loading bus companies...</p>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BusInfo;
