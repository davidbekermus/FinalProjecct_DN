import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import SearchBar from './components/SearchBar';
import FilterByLocation from './components/FilterByLocation';
import FilterByline from './components/FilterByline';
import FilterByStation from './components/FilterByStation';
import ResultsDisplay from './components/ResultsDisplay';
import '../Css/planAjourney/MainPage.css';

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

const MainPage = () => {
  // State for results, loading, error, bus lines view, search term, and nearby stations
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBusLines, setShowBusLines] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNearbyStations, setShowNearbyStations] = useState(false);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showStationSearch, setShowStationSearch] = useState(false);
  const [allStations, setAllStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [searchType, setSearchType] = useState('agency_name'); // Added for dropdown search options

  // Reset search term when switching modes
  useEffect(() => {
    setSearchTerm('');
    // Reset search type based on active mode
    if (showBusLines) {
      setSearchType('route_short_name');
    } else if (showNearbyStations) {
      setSearchType('station_name');
    } else if (showStationSearch) {
      setSearchType('station_name');
    } else {
      setSearchType('agency_name');
    }
  }, [showBusLines, showNearbyStations, showStationSearch]); // Updated dependencies

  useEffect(() => {
    const fetchBusData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(
          'https://open-bus-stride-api.hasadna.org.il/gtfs_agencies/list'
        );
        const data = response.data;
        if (Array.isArray(data)) {
          const uniqueData = removeDuplicates(data);
          setResults(uniqueData);
        } else {
          setError('Unexpected response format from API');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching bus data');
      } finally {
        setLoading(false);
      }
    };
    fetchBusData();
  }, []);

  // Handler for search bar submit
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
  };

  // Handler for FilterByLocation click
  const handleLocationClick = async () => {
    setShowBusLines(false);
    setShowNearbyStations(true);
    setShowStationSearch(false);
    setLocationLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('Your browser does not support location services');
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Fetch from local database route
          const response = await api.get('/stations');
          const data = response.data;
          const allStations = data.map((stop) => ({
            id: stop.id,
            name: stop.name,
            city: stop.city,
            lat: stop.lat,
            lon: stop.lon,
            code: stop.code,
          }));
          // Calculate distance
          const calcDist = (lat1, lon1, lat2, lon2) => {
            const R = 6371;
            const dLat = ((lat2 - lat1) * Math.PI) / 180;
            const dLon = ((lon2 - lon1) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) ** 2;
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          };
          const sorted = allStations
            .map((s) => ({
              ...s,
              distance: calcDist(position.coords.latitude, position.coords.longitude, s.lat, s.lon),
            }))
            .filter((s) => s.distance <= 3)
            .sort((a, b) => a.distance - b.distance);
          setNearbyStations(sorted);
          console.log(`Found ${sorted.length} nearby stations from local database`);
        } catch (err) {
          setError('Error searching for stations from database');
          console.error('Error loading nearby stations:', err);
        }
        setLocationLoading(false);
      },
      () => {
        setError('Error getting location');
        setLocationLoading(false);
      }
    );
  };

  // Handler for FilterByStation click
  const handleStationSearchClick = async () => {
    setShowBusLines(false);
    setShowNearbyStations(false);
    setShowStationSearch(true);
    setStationsLoading(true);
    setError(null);
    
    try {
      // Fetch from local database route
      const response = await api.get('/stations');
      const data = response.data;
      
      // Transform the data to match the expected format
      const stations = data.map((stop) => ({
        id: stop.id,
        name: stop.name,
        city: stop.city,
        lat: stop.lat,
        lon: stop.lon,
        code: stop.code,
      }));
      setAllStations(stations);
      console.log(`Loaded ${stations.length} stations from local database`);
    } catch (err) {
      setError('Error fetching stations from database');
      console.error('Error loading stations:', err);
    } finally {
      setStationsLoading(false);
    }
  };

  const getCurrentSearchMode = () => {
    if (showBusLines) return 'bus_lines';
    if (showNearbyStations) return 'nearby_stations';
    if (showStationSearch) return 'station';
    return 'default';
  };

  return (
    <>
      <Header title="Plan a Journey" />
      <div className="mainpage-layout">
        <div className="mainpage-top">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSubmit={handleSearch}
            searchType={searchType}
            onSearchTypeChange={handleSearchTypeChange}
            placeholder={showBusLines ? 'Search by line number...' : showNearbyStations ? 'Search by station name...' : showStationSearch ? 'Search by station name...' : 'Search by agency name...'}
            searchMode={getCurrentSearchMode()}
          />
        </div>
        <div className="mainpage-main">
          {/* Right: Three filter/result-type components */}
          <div className="mainpage-right">
            <FilterByLocation onClick={handleLocationClick} />
            <FilterByline onClick={() => { setShowBusLines(true); setShowNearbyStations(false); setShowStationSearch(false); }} />
            <FilterByStation onClick={handleStationSearchClick} />
          </div>
          {/* Left: Results container */}
          <div className="mainpage-left">
            {error ? (
              <div className="results-error" style={{ color: 'red', padding: '1rem' }}>{error}</div>
            ) : (
              <ResultsDisplay
                results={results}
                loading={loading}
                showBusLines={showBusLines}
                searchTerm={searchTerm}
                showNearbyStations={showNearbyStations}
                nearbyStations={nearbyStations}
                locationLoading={locationLoading}
                showStationSearch={showStationSearch}
                allStations={allStations}
                stationsLoading={stationsLoading}
                searchType={searchType}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MainPage; 