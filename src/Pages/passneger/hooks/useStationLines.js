import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';

/**
 * Custom hook for fetching bus lines that serve a station
 */
export const useStationLines = (station) => {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!station || !station.id) {
      setError(station ? 'Invalid station data' : 'No station data found');
      return;
    }

    fetchStationLines(station);
  }, [station]);

  const fetchStationLines = async (stationData) => {
    setLoading(true);
    setError('');
    setLines([]);

    const rawId = stationData.id;
    const stationId = Number(rawId);

    if (!stationId || isNaN(stationId)) {
      setError("Invalid station ID");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/routes/station/${stationId}`);
      const data = response.data;

      if (!data.routes || data.routes.length === 0) {
        setError("No lines found for this station");
        setLoading(false);
        return;
      }

      // Process and transform route data
      const processedLines = data.routes.map((route) => {
        const busLineData = route.busLineId;
        return {
          id: route._id,
          _id: busLineData?._id || route._id,
          route_short_name: busLineData?.route_short_name || "Unknown",
          route_long_name: busLineData?.route_long_name || "Unknown",
          agency_name: busLineData?.agency_name || "Unknown",
          gtfs_route_id: busLineData?.id || route._id,
          routeDescription: busLineData?.route_desc || `Route serving ${route.stations?.length || 0} stations`,
          route_mkt: busLineData?.route_mkt || route.route_mkt,
          busLineId: busLineData,
        };
      });

      // Sort lines numerically by route number
      const sortedLines = processedLines.sort((a, b) => {
        const aNum = parseInt(a.route_short_name) || 999;
        const bNum = parseInt(b.route_short_name) || 999;
        return aNum - bNum;
      });

      setLines(sortedLines);
    } catch (err) {
      console.error("Error fetching lines:", err);
      setError(`Error fetching lines: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { lines, loading, error };
};

