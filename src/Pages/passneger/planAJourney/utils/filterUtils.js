/**
 * Utility functions for filtering and sorting data
 */

// Filter stations based on search term and type
export const filterStations = (stations, searchTerm, searchType) => {
  if (!Array.isArray(stations)) return [];
  if (!searchTerm) return stations;
  
  const searchLower = searchTerm.toLowerCase();
  return stations.filter(station => {
    switch (searchType) {
      case 'station_id':
        return (station.id || '').toString().includes(searchTerm);
      case 'city_name':
        return (station.city || '').toLowerCase().includes(searchLower);
      case 'station_name':
      default:
        return (station.name || '').toLowerCase().includes(searchLower) ||
               (station.city || '').toLowerCase().includes(searchLower);
    }
  });
};

// Sort stations based on search type
export const sortStations = (stations, searchType) => {
  if (!Array.isArray(stations)) return [];
  // Create a copy to avoid mutating the original array
  return [...stations].sort((a, b) => {
    switch (searchType) {
      case 'station_name':
        return (a.name || '').localeCompare(b.name || '', 'he');
      case 'station_id':
        return (a.id || 0) - (b.id || 0);
      case 'city_name':
      default:
        const cityA = (a.city || '').toLowerCase();
        const cityB = (b.city || '').toLowerCase();
        
        // Handle Hebrew sorting
        const hebrewA = cityA.match(/[\u0590-\u05FF]/);
        const hebrewB = cityB.match(/[\u0590-\u05FF]/);
        
        if ((hebrewA && hebrewB) || (!hebrewA && !hebrewB)) {
          return cityA.localeCompare(cityB, 'he');
        }
        
        // Hebrew cities come first
        if (hebrewA && !hebrewB) return -1;
        if (!hebrewA && hebrewB) return 1;
        
        return cityA.localeCompare(cityB, 'he');
    }
  });
};

// Filter bus lines based on search term and type
export const filterBusLines = (lines, searchTerm, searchType) => {
  if (!Array.isArray(lines)) return [];
  if (!searchTerm) return lines;
  
  const searchLower = searchTerm.toLowerCase();
  return lines.filter(line => {
    switch (searchType) {
      case 'agency_name':
        return (line.agency_name || '').toLowerCase().includes(searchLower);
      case 'route_short_name':
        return (line.route_short_name || '').toLowerCase().includes(searchLower);
      case 'route_direction':
        return (line.route_direction || '').toLowerCase().includes(searchLower);
      default:
        return (line.route_short_name || '').toLowerCase().includes(searchLower);
    }
  });
};

// Sort bus lines based on search type
export const sortBusLines = (lines, searchType) => {
  if (!Array.isArray(lines)) return [];
  // Create a copy to avoid mutating the original array
  return [...lines].sort((a, b) => {
    switch (searchType) {
      case 'agency_name':
        return (a.agency_name || '').localeCompare(b.agency_name || '', 'he');
      case 'route_short_name':
        const aNum = parseInt(a.route_short_name) || 0;
        const bNum = parseInt(b.route_short_name) || 0;
        return aNum - bNum;
      case 'route_direction':
        return (a.route_direction || '').localeCompare(b.route_direction || '', 'he');
      default:
        const aNumDefault = parseInt(a.route_short_name) || 0;
        const bNumDefault = parseInt(b.route_short_name) || 0;
        return aNumDefault - bNumDefault;
    }
  });
};

// Filter company lines based on search term and type
export const filterCompanyLines = (lines, searchTerm, searchType) => {
  if (!Array.isArray(lines)) return [];
  if (!searchTerm) return lines;
  
  const searchLower = searchTerm.toLowerCase();
  return lines.filter(line => {
    switch (searchType) {
      case 'route_short_name':
        return (line.route_short_name || '').toLowerCase().includes(searchLower);
      case 'city_name':
      case 'route_long_name':
        return (line.route_long_name || '').toLowerCase().includes(searchLower);
      default:
        return (line.route_short_name || '').toLowerCase().includes(searchLower) ||
               (line.route_long_name || '').toLowerCase().includes(searchLower);
    }
  });
};

// Sort company lines based on search type
export const sortCompanyLines = (lines, searchType) => {
  if (!Array.isArray(lines)) return [];
  // Create a copy to avoid mutating the original array
  return [...lines].sort((a, b) => {
    switch (searchType) {
      case 'route_short_name':
        const aNum = parseInt(a.route_short_name) || 0;
        const bNum = parseInt(b.route_short_name) || 0;
        return aNum - bNum;
      case 'route_long_name':
        return (a.route_long_name || '').localeCompare(b.route_long_name || '', 'he');
      default:
        const aNumDefault = parseInt(a.route_short_name) || 0;
        const bNumDefault = parseInt(b.route_short_name) || 0;
        return aNumDefault - bNumDefault;
    }
  });
};

// Filter companies based on search term
export const filterCompanies = (companies, searchTerm, searchType) => {
  if (!Array.isArray(companies)) return [];
  if (!searchTerm) return companies;
  
  const searchLower = searchTerm.toLowerCase();
  return companies.filter(company => {
    switch (searchType) {
      case 'agency_name':
      default:
        return (company.agency_name || '').toLowerCase().includes(searchLower);
    }
  });
};

