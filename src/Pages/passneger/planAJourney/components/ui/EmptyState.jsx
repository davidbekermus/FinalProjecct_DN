/**
 * Empty state component for when no results are found
 */
const EmptyState = ({ message = 'No results found' }) => {
  return <div className="results-empty-placeholder">{message}</div>;
};

export default EmptyState;

