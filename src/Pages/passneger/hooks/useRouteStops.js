import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';

/**
 * Custom hook for fetching route stops for a bus line
 */
export const useRouteStops = (routeId) => {
  const [stops, setStops] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!routeId) return;

    const fetchRouteAndStops = async () => {
      setLoading(true);
      setError(null);
      setStops([]);
      setRouteInfo(null);
      
      try {
        const res = await api.get(`/routes/line/${routeId}`);
        const data = res.data;
        
        if (!data || !data.stations || data.stations.length === 0) {
          setError("No route or stops found for this bus line.");
          setLoading(false);
          return;
        }
        
        setStops(data.stations);
        setRouteInfo(data.busLineId);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch route stops');
      } finally {
        setLoading(false);
      }
    };

    fetchRouteAndStops();
  }, [routeId]);

  return { stops, routeInfo, loading, error };
};

