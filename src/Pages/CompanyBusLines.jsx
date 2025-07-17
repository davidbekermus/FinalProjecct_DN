import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/CompanyBusLines.css';

const CompanyBusLines = () => {
  const { operatorRef } = useParams();
  const location = useLocation();

  const itemsPerPage = 50;

 
  const [busLines, setBusLines] = useState([]);
  const [rawOffset, setRawOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [loadingPage, setLoadingPage] = useState(false);
  const [error, setError] = useState(null);
  const [totalBusLines, setTotalBusLines] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  
  const resetData = () => {
    setBusLines([]);
    setRawOffset(0);
    setCurrentPage(1);
    setError(null);
  };

  useEffect(() => {
    if (!operatorRef) {
      setError('No operator selected');
      setLoadingPage(false);
      return;
    }
    resetData();
    setSearchTerm('');
    setDebouncedTerm('');
    fetchTotalBusLines();

  }, [operatorRef]);


  useEffect(() => {
    if (debouncedTerm.trim() === '') return;
    resetData();
    fetchUntilEnoughSearchResults(debouncedTerm, itemsPerPage);
  }, [debouncedTerm]);

  useEffect(() => {
    const requiredCount = currentPage * itemsPerPage;


    if (busLines.length < requiredCount && !loadingPage) {
      if (debouncedTerm) {
        console.log(`Fetching search results for "${debouncedTerm}", page ${currentPage}`);
        fetchUntilEnoughSearchResults(debouncedTerm, requiredCount);
      } else {
        console.log(`Fetching default bus lines page ${currentPage}`);
        fetchUntilEnoughUnique(requiredCount);
      }
    }
  }, [currentPage]);

 
  const fetchTotalBusLines = async () => {
    try {
      const response = await fetch(
        `https://open-bus-stride-api.hasadna.org.il/gtfs_routes/list?get_count=true&operator_refs=${operatorRef}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const count = await response.json();
      if (typeof count !== 'number') throw new Error('Unexpected count format');
      setTotalBusLines(count);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch total bus lines count');
    }
  };

  
  const fetchUntilEnoughUnique = async (neededCount) => {
    setLoadingPage(true);
    try {
      let localBusLines = [];
      let localSeenMkts = new Set();
      let offset = 0;

      while (localBusLines.length < neededCount && offset < 60000) {
        const res = await fetch(
          `https://open-bus-stride-api.hasadna.org.il/gtfs_routes/list?limit=100&offset=${offset}&operator_refs=${operatorRef}&order_by=id%20asc`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const batch = await res.json();
        if (!Array.isArray(batch)) throw new Error('Unexpected API format');

        for (const line of batch) {
          if (!localSeenMkts.has(line.route_mkt)) {
            localSeenMkts.add(line.route_mkt);
            localBusLines.push(line);
          }
        }

        offset += 100;
        if (batch.length < 100) break;
        await new Promise((res) => setTimeout(res, 250));
      }

      setBusLines(localBusLines);
      setRawOffset(offset);
    } catch (err) {
      setError(err.message || 'Failed to fetch bus lines');
    } finally {
      setLoadingPage(false);
    }
  };

  const fetchUntilEnoughSearchResults = async (term, neededCount) => {
    setLoadingPage(true);
    try {
      let localBusLines = [];
      let localSeenMkts = new Set();
      let offset = 0;

      while (localBusLines.length < neededCount && offset < 60000) {
        const response = await fetch(
          `https://open-bus-stride-api.hasadna.org.il/gtfs_routes/list?limit=100&offset=${offset}&operator_refs=${operatorRef}&route_short_name=${term}`
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const batch = await response.json();
        if (!Array.isArray(batch)) throw new Error('Unexpected API format');

        console.log(`Fetched ${batch.length} results from offset ${offset}, needed count: ${neededCount}, busLength: ${localBusLines.length}`);

        for (const line of batch) {
          if (!localSeenMkts.has(line.route_mkt)) {
            localSeenMkts.add(line.route_mkt);
            localBusLines.push(line);
          }
        }

        offset += 100;
        if (batch.length < 100) break;
        await new Promise((res) => setTimeout(res, 250));
      }

      console.log(`Final total search results: ${localBusLines.length}`);
      setBusLines(localBusLines);
      setRawOffset(offset);
    } catch (err) {
      console.error('Error during search fetch:', err);
      setError('Failed to fetch search results');
    } finally {
      setLoadingPage(false);
    }
  };


  const paginatedLines = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return busLines.slice(start, start + itemsPerPage);
  }, [currentPage, busLines]);

  
  const totalPages = useMemo(() => Math.max(1, Math.ceil(busLines.length / itemsPerPage)), [busLines]);

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
            {searchTerm && (
              <button
                className="clear-search-button"
                onClick={() => {
                  console.log('Search cleared');
                  setSearchTerm('');
                  setDebouncedTerm('');
                }}
              >
                ✕
              </button>
            )}
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
              {loadingPage && busLines.length === 0 ? (
                <div className="skeleton-loader">Loading bus lines...</div>
              ) : paginatedLines.length > 0 ? (
                <>
                  <div className="grid-container">
                    {paginatedLines.map((line) => (
                      <div key={line.id} className="bus-line-item">
                        <h3>Route {line.route_short_name}</h3>
                        <p>Route Long Name: {line.route_long_name}</p>
                        <p>Type: {line.route_type}</p>
                        <p>Company: {line.agency_name}</p>
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
