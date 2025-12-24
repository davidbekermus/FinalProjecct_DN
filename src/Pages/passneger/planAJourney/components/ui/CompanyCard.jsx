/**
 * Company card component for displaying bus company information
 */
const CompanyCard = ({ company, onClick }) => {
  return (
    <div 
      className="company-card"
      onClick={onClick}
    >
      {company.agency_name || 'Unknown Company'}
    </div>
  );
};

export default CompanyCard;

