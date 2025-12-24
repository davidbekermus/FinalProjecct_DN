/**
 * Component for displaying route information
 */
const RouteInfoCard = ({ routeInfo, locationState }) => {
  if (!locationState && !routeInfo) return null;

  return (
    <div className="route-info-card">
      <div className="line-number">
        Line {locationState?.routeShortName || routeInfo?.route_short_name}
      </div>
      {(locationState?.routeLongName || routeInfo?.route_long_name) && (
        <div className="line-description">
          {locationState?.routeLongName || routeInfo?.route_long_name}
        </div>
      )}
      <div className="line-agency">
        {locationState?.agencyName || routeInfo?.agency_name}
      </div>
    </div>
  );
};

export default RouteInfoCard;

