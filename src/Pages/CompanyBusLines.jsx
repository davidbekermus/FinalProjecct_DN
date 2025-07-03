import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/CompanyBusLines.css';

const CompanyBusLines = () => {
  const { operatorRef } = useParams();
  const location = useLocation();
  const [allBusLines, setAllBusLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 30;

  useEffect(() => {
    if (!operatorRef) {
      setError('No operator selected');
      setLoading(false);
      return;
    }

    const fetchBusLines = async () => {
      try {
        setLoading(true);
        let fetchedLines = [];
        let offset = 0;
        const limit = 1000;
        let hasMore = true;
        const maxOffset = 100000;

        while (hasMore && offset < maxOffset) {
          const response = await fetch(
            `https://open-bus-stride-api.hasadna.org.il/gtfs_routes/list?limit=${limit}&offset=${offset}&order_by=id%20asc`
          );

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const batch = await response.json();

          if (!Array.isArray(batch)) throw new Error('Unexpected response format from API');

          const matches = batch.filter(line => {
            const ref = line.operator_ref || line.gtfs_route__operator_ref;
            return parseInt(ref) === parseInt(operatorRef);
          });

          fetchedLines = [...fetchedLines, ...matches];
          offset += limit;
          hasMore = batch.length === limit;

          await new Promise(res => setTimeout(res, 250));
        }

        const uniqueByRouteMkt = [];
        const seenRouteMkts = new Set();
        for (const line of fetchedLines) {
          const routeMkt = line.route_mkt;
          if (!seenRouteMkts.has(routeMkt)) {
            seenRouteMkts.add(routeMkt);
            uniqueByRouteMkt.push(line);
          }
        }

        uniqueByRouteMkt.sort((a, b) => parseInt(a.route_short_name || 0) - parseInt(b.route_short_name || 0));
        setAllBusLines(uniqueByRouteMkt);
        setCurrentPage(1);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch bus lines');
        setLoading(false);
      }
    };

    fetchBusLines();
  }, [operatorRef]);

  const filteredLines = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const termAsNumber = parseInt(term);
    return allBusLines.filter(line => {
      const routeShortName = line.route_short_name?.toString() || '';
      const routeLongName = line.route_long_name?.toLowerCase() || '';
      return (
        // Check if route_short_name matches the search term as a number
        (routeShortName && (parseInt(routeShortName) === termAsNumber || routeShortName.toLowerCase().includes(term))) ||
        // Check if route_long_name contains the search term
        (routeLongName && routeLongName.includes(term))
      );
    });
  }, [searchTerm, allBusLines]);

  const paginatedLines = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLines.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredLines]);

  const totalPages = Math.ceil(filteredLines.length / itemsPerPage);

  return (
    <div className="company-bus-lines-container">
      <Header title={`Bus Lines for ${location.state?.companyName || operatorRef}`} />
      <main className="bus-lines-main">
        <div className="content-wrapper">
          <h2>Bus Lines</h2>

          <input
            type="text"
            placeholder="Search route number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bus-line-search-input"
          />

          {loading ? (
            <div className="loading">Loading bus lines...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="bus-lines-grid">
              {paginatedLines.length > 0 ? (
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
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      Previous
                    </button>
                    <span className="page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage >= totalPages}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>
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