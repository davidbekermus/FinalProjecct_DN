import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/BusLineRoute.css';

const BusLineRoute = () => {
  const { gtfs_route_id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stops, setStops] = useState([]);
  const [journeyId, setJourneyId] = useState(null);

  console.log(gtfs_route_id || 'no gtfs_route_id');

  useEffect(() => {
    const fetchJourneyAndStops = async () => {
      setLoading(true);
      setError(null);
      setStops([]);
      setJourneyId(null);
      
      try {
        console.log('gtfs_route_id:', gtfs_route_id);
        
        // בדיקה אם זה קו דמה
        if (gtfs_route_id && gtfs_route_id.startsWith('dummy_gtfs_')) {
          console.log('Detected dummy route, generating random stops');
          
          // יצירת תחנות רנדומליות לקו דמה
          const randomStops = [
            { id: 1, gtfs_stop__name: 'תחנה מרכזית' },
            { id: 2, gtfs_stop__name: 'שדרות רוטשילד' },
            { id: 3, gtfs_stop__name: 'דיזנגוף סנטר' },
            { id: 4, gtfs_stop__name: 'אוניברסיטת תל אביב' },
            { id: 5, gtfs_stop__name: 'בית חולים איכילוב' },
            { id: 6, gtfs_stop__name: 'קניון עזריאלי' },
            { id: 7, gtfs_stop__name: 'תחנת רכבת השלום' },
            { id: 8, gtfs_stop__name: 'פארק הירקון' },
            { id: 9, gtfs_stop__name: 'נמל תל אביב' },
            { id: 10, gtfs_stop__name: 'שוק הכרמל' }
          ];
          
          // בחירת 5-8 תחנות רנדומליות
          const numStops = Math.floor(Math.random() * 4) + 5; // 5-8 תחנות
          const selectedStops = randomStops.slice(0, numStops);
          
          setStops(selectedStops);
          setJourneyId('dummy_journey');
          setLoading(false);
          return;
        }
        
        // קו אמיתי - ננסה לקבל מסלול מהשרת המקומי קודם
        console.log('Real route detected, trying to fetch from local server first');
        try {
          const localRouteRes = await fetch(`http://localhost:3000/routes/${gtfs_route_id}`);
          if (localRouteRes.ok) {
            const localRouteData = await localRouteRes.json();
            if (localRouteData && localRouteData.stations && localRouteData.stations.length > 0) {
              console.log('Found route data in local server:', localRouteData);
              
              // המרת מזהי תחנות לשמות תחנות
              const stationNames = await Promise.all(
                localRouteData.stations.map(async (stationId) => {
                  try {
                    const stationRes = await fetch(`http://localhost:3000/stations/${stationId}`);
                    if (stationRes.ok) {
                      const stationData = await stationRes.json();
                      return {
                        id: stationId,
                        gtfs_stop__name: stationData.name || `תחנה ${stationId}`
                      };
                    }
                  } catch (err) {
                    console.log('Error fetching station name:', err);
                  }
                  return {
                    id: stationId,
                    gtfs_stop__name: `תחנה ${stationId}`
                  };
                })
              );
              
              setStops(stationNames);
              setJourneyId(gtfs_route_id);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.log('Local server route fetch failed, trying external API:', err);
        }
        
        // לקווים אמיתיים - fetch מה-API החיצוני
        console.log('Real route, fetching from API');

        // 1. Fetch the first journey for the route
        const journeyRes = await fetch(
          `https://open-bus-stride-api.hasadna.org.il/gtfs_rides/list?get_count=false&gtfs_route_id=${gtfs_route_id}&order_by=id%20asc`
        );
        if (!journeyRes.ok) throw new Error('Failed to fetch journey');
        const journeys = await journeyRes.json();
        if (!Array.isArray(journeys) || journeys.length === 0) {
          setError('No journeys found for this route.');
          setLoading(false);
          return;
        }
        const firstJourneyId = journeys[0].id;
        setJourneyId(firstJourneyId);
        
        // 2. Fetch the stops for the first journey
        const stopsRes = await fetch(
          `https://open-bus-stride-api.hasadna.org.il/gtfs_ride_stops/list?get_count=false&gtfs_ride_ids=${firstJourneyId}&order_by=id%20asc`
        );
        if (!stopsRes.ok) throw new Error('Failed to fetch stops');
        const stopsData = await stopsRes.json();
        setStops(stopsData);
      } catch (err) {
        console.error('Error fetching route data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJourneyAndStops();
  }, [gtfs_route_id]);

  return (
    <div className="bus-line-route-container">
      <Header title={`line :${location.state?.routeShortName || gtfs_route_id}`} />
      <main className="bus-line-route-main">
        <div className="content-wrapper">
          <h2>Bus Line Route</h2>
          {location.state && (
            <div className="route-info">
              <p><strong>Route Name:</strong> {location.state.routeLongName}</p>
              <p><strong>Company:</strong> {location.state.agencyName}</p>
            </div>
          )}
          {loading ? (
            <div>Loading route...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : stops.length > 0 ? (
            <div className="stops-list route-visual">
              <h3>Stops for line: {location.state?.routeShortName}</h3>
              <div className="route-line">
                {stops.map((stop, idx) => (
                  <div className="route-stop" key={stop.id}>
                    <div className="route-dot" />
                    <div className="stop-info">
                      <span className="stop-name">{stop.gtfs_stop__name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>No stops found for this journey.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusLineRoute; 