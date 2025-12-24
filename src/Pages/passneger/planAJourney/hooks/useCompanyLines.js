import { useState } from 'react';
import { api } from '../../../../utils/api';
import { sortBusLinesByAgency } from '../utils/dataUtils';

/**
 * Custom hook for fetching and managing company lines data
 */
export const useCompanyLines = (busLines) => {
  const [companyLines, setCompanyLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanyLines = async (company) => {
    setLoading(true);
    setError(null);
    
    try {
      // If bus lines are not loaded yet, fetch them first
      let linesToFilter = busLines;
      if (busLines.length === 0) {
        console.log('Bus lines not loaded, fetching them first...');
        const response = await api.get('/bus-lines?get_count=false&limit=10000');
        const data = response.data || [];
        linesToFilter = sortBusLinesByAgency(data);
      }
      
      // Filter lines by company name
      const filteredLines = linesToFilter.filter(line => 
        (line.agency_name || '').toLowerCase() === (company.agency_name || '').toLowerCase()
      );
      
      // Sort lines numerically by route number
      const sortedLines = filteredLines.sort((a, b) => {
        const aNum = parseInt(a.route_short_name) || 0;
        const bNum = parseInt(b.route_short_name) || 0;
        return aNum - bNum;
      });
      
      setCompanyLines(sortedLines);
      console.log(`Found ${sortedLines.length} lines for ${company.agency_name}`);
    } catch (err) {
      setError(err.message || 'Failed to fetch company lines');
      console.error('Error loading company lines:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCompanyLines = () => {
    setCompanyLines([]);
    setError(null);
  };

  return { 
    companyLines, 
    loading, 
    error, 
    fetchCompanyLines, 
    clearCompanyLines 
  };
};

