import { useState, useEffect } from 'react';

/**
 * Custom hook for calculating route progress and estimated completion
 */
export const useRouteProgress = (currentStopIndex, totalStops, routeStartTime) => {
  const [routeProgress, setRouteProgress] = useState(0);
  const [estimatedCompletion, setEstimatedCompletion] = useState(null);

  // Calculate route progress percentage
  useEffect(() => {
    if (totalStops > 0) {
      const progress = ((currentStopIndex + 1) / totalStops) * 100;
      setRouteProgress(progress);
    }
  }, [currentStopIndex, totalStops]);

  // Calculate estimated completion time
  useEffect(() => {
    if (routeStartTime && totalStops > 0) {
      const averageTimePerStop = 3; // minutes per stop
      const remainingStops = totalStops - currentStopIndex - 1;
      const estimatedMinutes = remainingStops * averageTimePerStop;
      
      const completionTime = new Date(routeStartTime);
      completionTime.setMinutes(completionTime.getMinutes() + estimatedMinutes);
      setEstimatedCompletion(completionTime);
    }
  }, [routeStartTime, totalStops, currentStopIndex]);

  const formatEstimatedCompletion = () => {
    if (!estimatedCompletion) return 'Calculating...';
    return estimatedCompletion.toLocaleTimeString();
  };

  return {
    routeProgress,
    estimatedCompletion,
    formatEstimatedCompletion
  };
};

