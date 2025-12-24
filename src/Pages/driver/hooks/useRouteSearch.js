import { useState } from 'react';
import axios from 'axios';

/**
 * Custom hook for searching bus routes by driver criteria
 */
export const useRouteSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const searchRoutes = async (busCompany, busRouteNumber, cityName) => {
    if (!busCompany || !busRouteNumber || !cityName) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await axios.get("http://localhost:3000/bus-Lines/driver-search", {
        params: {
          busCompany,
          busRouteNumber,
          cityName
        }
      });

      const routes = response.data.routes || [];
      setSearchResults(routes);
      
      if (routes.length === 0) {
        setError("No matching bus lines found. Please try different search criteria.");
      } else {
        setError("");
      }
    } catch (err) {
      console.error("Error searching bus lines:", err);
      setError("Error searching bus lines. Please try again.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchResults,
    loading,
    error,
    hasSearched,
    searchRoutes
  };
};

