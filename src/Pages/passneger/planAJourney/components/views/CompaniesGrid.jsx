import { removeDuplicates } from '../../utils/dataUtils';
import { filterCompanies } from '../../utils/filterUtils';
import CompanyCard from '../ui/CompanyCard';
import EmptyState from '../ui/EmptyState';

/**
 * Component for displaying bus companies grid
 */
const CompaniesGrid = ({ 
  companies, 
  searchTerm, 
  searchType, 
  onCompanyClick 
}) => {
  // Ensure companies is an array
  const companiesList = Array.isArray(companies) ? companies : [];
  
  // Ensure searchTerm and searchType have default values
  const safeSearchTerm = searchTerm || '';
  const safeSearchType = searchType || 'agency_name';

  // Filter companies
  let filteredCompanies = filterCompanies(companiesList, safeSearchTerm, safeSearchType);
  
  // Remove duplicates
  const uniqueCompanies = removeDuplicates(filteredCompanies);

  return (
    <div className="results-display">
      {uniqueCompanies && uniqueCompanies.length > 0 ? (
        <div className="results-grid">
          {uniqueCompanies.map((company, idx) => (
            <CompanyCard
              key={idx}
              company={company}
              onClick={() => onCompanyClick(company)}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No bus companies found" />
      )}
    </div>
  );
};

export default CompaniesGrid;

