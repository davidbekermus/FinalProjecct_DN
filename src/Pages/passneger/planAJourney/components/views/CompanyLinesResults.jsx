import { useNavigate } from 'react-router-dom';
import { filterCompanyLines, sortCompanyLines } from '../../utils/filterUtils';
import BusLineCard from '../ui/BusLineCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';

/**
 * Component for displaying lines for a selected company
 */
const CompanyLinesResults = ({ 
  selectedCompany, 
  companyLines, 
  loading, 
  error, 
  searchTerm, 
  searchType,
  onBack 
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <LoadingSpinner message={`Loading lines for ${selectedCompany.agency_name}...`} />
    );
  }

  if (error) {
    return (
      <div className="results-display">
        <div className="company-lines-error">{error}</div>
        <button onClick={onBack} className="back-button">
          ← Back to Companies
        </button>
      </div>
    );
  }

  // Ensure companyLines is an array
  const lines = Array.isArray(companyLines) ? companyLines : [];
  
  // Ensure searchTerm and searchType have default values
  const safeSearchTerm = searchTerm || '';
  const safeSearchType = searchType || 'route_short_name';

  // Filter and sort company lines
  let filteredLines = filterCompanyLines(lines, safeSearchTerm, safeSearchType);
  filteredLines = sortCompanyLines(filteredLines, safeSearchType);

  const handleLineClick = (line) => {
    if (line._id) {
      navigate(`/bus-line-route/${line._id}`, {
        state: {
          routeShortName: line.route_short_name,
          routeLongName: line.route_long_name,
          agencyName: line.agency_name,
          route_mkt: line.route_mkt
        }
      });
    } else {
      alert('Cannot view route details: This bus line does not have a valid ID.');
      console.error('No valid MongoDB ObjectId (_id) found for line:', line);
    }
  };

  return (
    <div className="results-display">
      <div className="company-header">
        <button onClick={onBack} className="back-button-full-width">
          ← Back to Companies
        </button>
        <h3 className="company-title">
          {selectedCompany.agency_name}
        </h3>
      </div>
      
      {filteredLines.length === 0 ? (
        <EmptyState message="No lines found for this company" />
      ) : (
        <div className="company-lines-list">
          {filteredLines.map((line, idx) => (
            <BusLineCard
              key={line._id || idx}
              line={line}
              onClick={() => handleLineClick(line)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyLinesResults;

