import { useState, useEffect } from 'react';
import { api } from '../../../../utils/api';
import { sortBusLinesByAgency } from '../utils/dataUtils';

/**
 * Custom hook for fetching and managing bus lines data
 */
export const useBusLines = (showBusLines) => {
  const [busLines, setBusLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showBusLines) return;
    
    setLoading(true);
    setError(null);
    
    api.get('/bus-lines?get_count=false&limit=10000')
      .then(res => {
        const data = res.data || [];
        const sorted = sortBusLinesByAgency(data);
        setBusLines(sorted);
        console.log(`Fetched ${data.length} bus lines from /bus-lines`);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch bus lines');
      })
      .finally(() => setLoading(false));
  }, [showBusLines]);

  return { busLines, loading, error };
};

