/**
 * Utility functions for data manipulation
 */

// Remove duplicate companies by agency_name (case-insensitive)
export const removeDuplicates = (data) => {
  if (!Array.isArray(data)) return [];
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

// Group bus lines by agency_name and sort lines within each group
export const groupByAgency = (lines) => {
  if (!Array.isArray(lines)) return {};
  const groups = {};
  lines.forEach(line => {
    const agency = line.agency_name || 'Unknown Agency';
    if (!groups[agency]) groups[agency] = [];
    groups[agency].push(line);
  });
  
  // Sort lines within each group numerically by route_short_name
  Object.keys(groups).forEach(agency => {
    groups[agency].sort((a, b) => {
      const aNum = parseInt(a.route_short_name) || 0;
      const bNum = parseInt(b.route_short_name) || 0;
      return aNum - bNum;
    });
  });
  
  return groups;
};

// Sort bus lines by agency name
export const sortBusLinesByAgency = (data) => {
  if (!Array.isArray(data)) return [];
  return data.slice().sort((a, b) => {
    const agencyA = (a.agency_name || '').toLowerCase();
    const agencyB = (b.agency_name || '').toLowerCase();
    return agencyA.localeCompare(agencyB);
  });
};

// Extract city name from route_long_name (format: "something-city-something")
export const extractCityFromRoute = (routeLongName) => {
  const cityMatch = routeLongName?.match(/-([^-]+)-/);
  return cityMatch ? cityMatch[1].trim() : '';
};

