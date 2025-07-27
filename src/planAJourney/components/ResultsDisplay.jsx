import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

// Deduplicate by agency_name (case-insensitive)
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

// Group by agency_name
const groupByAgency = (lines) => {
  const groups = {};
  lines.forEach(line => {
    const agency = line.agency_name || 'Unknown Agency';
    if (!groups[agency]) groups[agency] = [];
    groups[agency].push(line);
  });
  return groups;
};

const ResultsDisplay = ({
  results,
  loading,
  showBusLines,
  searchTerm,
  showNearbyStations,
  nearbyStations,
  locationLoading,
  showStationSearch,
  allStations,
  stationsLoading,
  searchType,
  showBusCompanies
}) => {
  // State for bus lines, loading, error, and pagination
  const [busLines, setBusLines] = useState([]);
  const [busLinesLoading, setBusLinesLoading] = useState(false);
  const [busLinesError, setBusLinesError] = useState(null);
  const [page, setPage] = useState(1);
  const [stationPage, setStationPage] = useState(1); // Added for station pagination
  const pageSize = 40;
  const stationPageSize = 40; // Added for station pagination

  // Fetch bus lines when showBusLines becomes true
  useEffect(() => {
    if (!showBusLines) return;
    
    setBusLinesLoading(true);
    setBusLinesError(null);
    setPage(1);
    
    api.get('/bus-lines?get_count=false&limit=10000')
      .then(res => {
        let data = res.data || [];
        data = data.slice().sort((a, b) => {
          const agencyA = (a.agency_name || '').toLowerCase();
          const agencyB = (b.agency_name || '').toLowerCase();
          return agencyA.localeCompare(agencyB);
        });
        setBusLines(data);
        console.log(`Fetched ${data.length} bus lines from /bus-lines`);
      })
      .catch(err => {
        setBusLinesError(err.message || 'Failed to fetch bus lines');
      })
      .finally(() => setBusLinesLoading(false));
  }, [showBusLines]);

  // Reset station page when switching to station search
  useEffect(() => {
    if (showStationSearch) {
      setStationPage(1);
    }
  }, [showStationSearch]);

  // Show loading spinner for initial data
  if (loading) {
    return <div className="spinner">Loading bus companies...</div>;
  }

  // Show station search results
  if (showStationSearch) {
    if (stationsLoading) {
      return <div className="spinner">Loading stations...</div>;
    }
    
    let filteredStations = allStations;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredStations = allStations.filter(station => {
        switch (searchType) {
          case 'station_id':
            return (station.id || '').toString().includes(searchTerm);
          case 'city_name':
            return (station.city || '').toLowerCase().includes(searchLower);
          case 'station_code':
            return (station.code || '').toString().includes(searchTerm);
          case 'station_name':
          default:
            return (station.name || '').toLowerCase().includes(searchLower) ||
                   (station.city || '').toLowerCase().includes(searchLower) ||
                   (station.code || '').toString().includes(searchTerm);
        }
      });
    }
    
    // Sort stations by city name starting from א (Alef)
    filteredStations = filteredStations.sort((a, b) => {
      const cityA = (a.city || '').toLowerCase();
      const cityB = (b.city || '').toLowerCase();
      
      // Hebrew characters come after English characters in Unicode
      // So we need to handle Hebrew sorting specially
      const hebrewA = cityA.match(/[\u0590-\u05FF]/); // Hebrew Unicode range
      const hebrewB = cityB.match(/[\u0590-\u05FF]/);
      
      // If both are Hebrew or both are not Hebrew, sort normally
      if ((hebrewA && hebrewB) || (!hebrewA && !hebrewB)) {
        return cityA.localeCompare(cityB, 'he'); // Use Hebrew locale
      }
      
      // Hebrew cities come first
      if (hebrewA && !hebrewB) return -1;
      if (!hebrewA && hebrewB) return 1;
      
      return cityA.localeCompare(cityB, 'he');
    });
    
    // Paginate stations
    const paginatedStations = filteredStations.slice(
      (stationPage - 1) * stationPageSize, 
      stationPage * stationPageSize
    );
    const totalStationPages = Math.ceil(filteredStations.length / stationPageSize);
    
    return (
      <div className="results-display">
        {filteredStations.length === 0 ? (
          <div className="results-empty-placeholder">No stations found</div>
        ) : (
          <>
            <div className="stations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {paginatedStations.map((station, idx) => (
                <div key={station.id || idx} className="station-card" style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '1rem', 
                  background: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <strong>{station.name}</strong><br />
                  <span style={{ color: '#6b7280', fontSize: '0.9em' }}>{station.city}</span><br />
                  <span style={{ color: '#3b82f6', fontSize: '0.85em' }}>Code: {station.code}</span>
                </div>
              ))}
            </div>
            
            {/* Pagination controls for stations */}
            {totalStationPages > 1 && (
              <div className="pagination-controls">
                <button 
                  onClick={() => setStationPage(Math.max(1, stationPage - 1))}
                  disabled={stationPage === 1}
                >
                  Previous Page
                </button>
                <span style={{ color: '#6b7280' }}>
                  Page {stationPage} of {totalStationPages} ({filteredStations.length} total stations)
                </span>
                <button 
                  onClick={() => setStationPage(Math.min(totalStationPages, stationPage + 1))}
                  disabled={stationPage === totalStationPages}
                >
                  Next Page
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Show nearby stations if requested
  if (showNearbyStations) {
    if (locationLoading) {
      return <div className="spinner">Finding stations near you...</div>;
    }
    let filteredStations = nearbyStations;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredStations = nearbyStations.filter(station => {
        switch (searchType) {
          case 'station_id':
            return (station.id || '').toString().includes(searchTerm);
          case 'city_name':
            return (station.city || '').toLowerCase().includes(searchLower);
          case 'station_code':
            return (station.code || '').toString().includes(searchTerm);
          case 'station_name':
          default:
            return (station.name || '').toLowerCase().includes(searchLower) ||
                   (station.city || '').toLowerCase().includes(searchLower);
        }
      });
    }
    return (
      <div className="results-display">
        {filteredStations.length === 0 ? (
          <div className="results-empty-placeholder">No nearby stations found</div>
        ) : (
          <ul className="nearby-stations-list">
            {filteredStations.map((station, idx) => (
              <li key={station.id || idx} className="nearby-station-item">
                <strong>{station.name}</strong> ({station.city})<br />
                <span style={{ color: '#2563eb', fontSize: '0.95em' }}>{station.distance.toFixed(2)} km away</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (showBusLines) {
    if (busLinesLoading) {
      return <div className="spinner">Loading bus lines...</div>;
    }
    if (busLinesError) {
      return <div className="results-error">{busLinesError}</div>;
    }

    // Filter and paginate bus lines
    let filteredBusLines = busLines;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredBusLines = busLines.filter(line => {
        switch (searchType) {
          case 'agency_name':
            return (line.agency_name || '').toLowerCase().includes(searchLower);
          case 'route_short_name':
          default:
            return (line.route_short_name || '').toLowerCase().includes(searchLower);
        }
      });
    }
    const paginatedLines = filteredBusLines.slice((page - 1) * pageSize, page * pageSize);
    const grouped = groupByAgency(paginatedLines);
    const totalPages = Math.ceil(filteredBusLines.length / pageSize);

    return (
      <div className="results-display">
        {Object.keys(grouped).length === 0 ? (
          <div className="results-empty-placeholder">No bus lines to display</div>
        ) : (
          <div className="bus-lines-grouped-list">
            {Object.entries(grouped).map(([agency, lines]) => (
              <div key={agency} className="bus-lines-agency-group">
                <h3 className="bus-lines-agency-header">{agency}</h3>
                <ul className="bus-lines-list">
                  {lines.map((line, idx) => (
                    <li key={line.id || idx} className="bus-line-item">
                      {line.route_short_name} - {line.route_long_name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="pagination-controls" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ marginRight: '1rem' }}
            >
              Previous Page
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ marginLeft: '1rem' }}
            >
              Next Page
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default: show company results
  let filteredResults = results;
  if (!showBusLines && searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredResults = results.filter(company => {
      switch (searchType) {
        case 'agency_name':
        default:
          return (company.agency_name || '').toLowerCase().includes(searchLower);
      }
    });
  }
  const uniqueResults = removeDuplicates(filteredResults || []);

  // Show bus companies when FilterByCompany is clicked
  if (showBusCompanies) {
    return (
      <div className="results-display">
        {uniqueResults && uniqueResults.length > 0 ? (
          <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {uniqueResults.map((company, idx) => (
              <div key={idx} className="company-card" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', background: '#fafafa', textAlign: 'center' }}>
                {company.agency_name || 'Unknown Company'}
              </div>
            ))}
          </div>
        ) : (
          <div className="results-empty-placeholder">No bus companies found</div>
        )}
      </div>
    );
  }

  return (
    <div className="results-display">
      {uniqueResults && uniqueResults.length > 0 ? (
        <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {uniqueResults.map((company, idx) => (
            <div key={idx} className="company-card" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', background: '#fafafa', textAlign: 'center' }}>
              {company.agency_name || 'Unknown Company'}
            </div>
          ))}
        </div>
      ) : (
        <div className="results-empty-placeholder">No results to display</div>
      )}
    </div>
  );
};

export default ResultsDisplay; 