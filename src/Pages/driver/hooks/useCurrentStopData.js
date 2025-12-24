import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../../utils/api';
import socketManager from '../../../utils/socket';

/**
 * Custom hook for fetching and managing current stop passenger data with WebSocket support
 */
export const useCurrentStopData = (currentStop, selectedRoute, selectedDirection) => {
  const [currentStopData, setCurrentStopData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const socketRef = useRef(null);
  const roomNameRef = useRef(null);

  // Initial fetch of stop data
  const fetchCurrentStopData = useCallback(async () => {
    if (!currentStop || !selectedRoute) return;

    try {
      setLoading(true);
      
      const response = await api.get('/route-counter/station', {
        params: {
          stationId: currentStop.id,
          route_mkt: selectedRoute.route_mkt || selectedRoute.id,
          routeDirection: selectedDirection
        }
      });
      
      setCurrentStopData(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching stop data:', err);
      // Set default data if no counter exists
      setCurrentStopData({
        counter: 0,
        shouldStop: false
      });
    } finally {
      setLoading(false);
    }
  }, [currentStop, selectedRoute, selectedDirection]);

  // Set up WebSocket connection and room subscription
  useEffect(() => {
    if (!currentStop || !selectedRoute) {
      // Clean up if no stop/route
      if (socketRef.current && roomNameRef.current) {
        socketRef.current.emit('leave-station-room', {
          stationId: currentStop?.id,
          route_mkt: selectedRoute?.route_mkt || selectedRoute?.id,
          routeDirection: selectedDirection
        });
        socketRef.current.off('passenger-count-updated');
      }
      return;
    }

    // Get socket connection
    const socket = socketManager.connect();
    socketRef.current = socket;

    // Ensure consistent string types for room name matching
    const stationId = String(currentStop.id);
    const route_mkt = String(selectedRoute.route_mkt || selectedRoute.id);
    const routeDirection = String(selectedDirection || "1");
    
    const roomName = `station-${stationId}-route-${route_mkt}-dir-${routeDirection}`;
    roomNameRef.current = roomName;

    console.log('[SOCKET] Setting up room subscription:', roomName);
    console.log('[SOCKET] Socket connected:', socket.connected);
    console.log('[SOCKET] Socket ID:', socket.id);

    // Function to join room
    const joinRoom = () => {
      console.log('[SOCKET] Joining room:', roomName);
      socket.emit('join-station-room', {
        stationId,
        route_mkt,
        routeDirection
      });
    };

    // Wait for connection if not connected
    if (!socket.connected) {
      console.log('[SOCKET] Waiting for connection...');
      socket.once('connect', () => {
        console.log('[SOCKET] Connected, now joining room:', roomName);
        joinRoom();
      });
    } else {
      // Join the room immediately if already connected
      joinRoom();
    }

    // Listen for passenger count updates
    const handlePassengerUpdate = (data) => {
      console.log('[SOCKET] Received passenger-count-updated event:', data);
      console.log('[SOCKET] Current stop:', { stationId, route_mkt, routeDirection });
      
      // Verify this update is for the current stop (compare as strings)
      const dataStationId = String(data.stationId);
      const dataRouteMkt = String(data.route_mkt);
      const dataRouteDirection = String(data.routeDirection || "1");
      
      if (dataStationId === stationId && 
          dataRouteMkt === route_mkt && 
          dataRouteDirection === routeDirection) {
        console.log('[SOCKET] Match! Updating passenger count:', data.counter);
        setCurrentStopData({
          counter: data.counter || 0,
          shouldStop: data.shouldStop || false,
          usersCount: data.usersCount || 0
        });
        setLastUpdated(new Date());
      } else {
        console.log('[SOCKET] No match - ignoring update');
        console.log('[SOCKET] Expected:', { stationId, route_mkt, routeDirection });
        console.log('[SOCKET] Received:', { dataStationId, dataRouteMkt, dataRouteDirection });
      }
    };

    socket.on('passenger-count-updated', handlePassengerUpdate);

    // Initial fetch
    fetchCurrentStopData();

    // Cleanup function
    return () => {
      socket.emit('leave-station-room', {
        stationId,
        route_mkt,
        routeDirection
      });
      socket.off('passenger-count-updated', handlePassengerUpdate);
    };
  }, [currentStop, selectedRoute, selectedDirection, fetchCurrentStopData]);

  const manualRefresh = () => {
    fetchCurrentStopData();
  };

  return {
    currentStopData,
    loading,
    lastUpdated,
    refresh: manualRefresh
  };
};
