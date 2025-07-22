import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/CompanyBusLines.css';
import { api } from '../utils/api';

const CompanyBusLines = () => {
  const { operatorRef } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const itemsPerPage = 50;

 
  const [busLines, setBusLines] = useState([]); // Holds data for the CURRENT page only
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(null);
  const [totalBusLines, setTotalBusLines] = useState(0);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page to 1 when a new search is performed
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedTerm]);

  // --- Single Authoritative Hook for Data Fetching ---
  useEffect(() => {
    if (!operatorRef) {
      setError('No operator selected');
      return;
    }

    const fetchBusLines = async () => {
      setLoadingPage(true);
      setError(null);

      const isSearching = debouncedTerm.trim() !== '';
      const offset = (currentPage - 1) * itemsPerPage;

      // 1. Build the query for fetching data and for fetching the count
      const baseQuery = `operator_refs=${operatorRef}`;
      const searchQuery = isSearching ? `&route_short_name=${debouncedTerm}` : '';
      const dataUrl = `/bus-lines?${baseQuery}${searchQuery}&limit=${itemsPerPage}&offset=${offset}`;
      const countUrl = `/bus-lines?get_count=true&${baseQuery}${searchQuery}`;

      try {
        // 2. Fetch both the page data and the total count in parallel
        const [dataRes, countRes] = await Promise.all([
          api.get(dataUrl),
          api.get(countUrl),
        ]);

        const data = dataRes.data;
        const count = countRes.data;

        // 3. Update state with the new data
        setBusLines(data);
        setTotalBusLines(count);

      } catch (err) {
        setError(err.message);
        setBusLines([]); // Clear data on error
      } finally {
        setLoadingPage(false);
      }
    };

    fetchBusLines();

  }, [operatorRef, debouncedTerm, currentPage]); // Re-runs whenever the company, search, or page changes

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalBusLines / itemsPerPage)), [totalBusLines]);

  const getCityFromRoute = (routeLongName) => {
    if (!routeLongName) return '';
    try {
      const originPart = routeLongName.split('<->')[0];
      const cityParts = originPart.split('-');
      // The city is the last part of the origin string before the <->
      return cityParts[cityParts.length - 1];
    } catch (e) {
      console.error('Could not parse city from route name:', routeLongName);
      return ''; // Return empty string on error
    }
  };

  return (
    <div className="company-bus-lines-container">
      <Header title={`Bus Lines for ${location.state?.companyName || operatorRef}`} />
      <main className="bus-lines-main">
        <div className="content-wrapper">
          <h2>Bus Lines</h2>
          {totalBusLines > 0 && (
            <p className="total-count-info">
              Total bus lines: {totalBusLines} | {Math.ceil(totalBusLines / itemsPerPage)} pages
            </p>
          )}

          <div className="search-container">
            <input
              type="text"
              placeholder="Search by route_short_name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                console.log('Search term typed:', e.target.value);
              }}
              className="bus-line-search-input"
            />

          </div>

          {debouncedTerm && (
            <div className="search-info">
              Showing results for <strong>{debouncedTerm}</strong>
            </div>
          )}

          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="bus-lines-grid">
              {loadingPage ? (
                <div className="skeleton-loader">Loading bus lines...</div>
              ) : busLines.length > 0 ? (
                <>
                  <div className="grid-container">
                    {busLines.map((line) => (
                      <div
                        key={line.id}
                        className="bus-line-item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          // Log the gtfs_route_id if needed
                          // console.log(line.gtfs_route_id);
                          navigate(`/bus-line-route/${line.id}`, {
                            state: {
                              routeShortName: line.route_short_name,
                              routeLongName: line.route_long_name,
                              agencyName: line.agency_name,
                              id: line.id,
                              operatorRef: operatorRef 
                            } 
                          });
                        }}
                      >
                        <h3>Route {line.route_short_name}</h3>
                        <p>Route Long Name: {line.route_long_name}</p>
                        <p>Type: {line.route_type}</p>
                        <p>Company: {line.agency_name}</p>
                        <p>City: {getCityFromRoute(line.route_long_name)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pagination-controls">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      Previous
                    </button>
                    <span className="page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>

                  {loadingPage && <div className="loading-spinner smaller" />}
                </>
              ) : (
                <p>No bus lines found</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyBusLines;
