/**
 * Reusable pagination controls component
 */
const PaginationControls = ({ 
  page, 
  totalPages, 
  totalItems,
  onPrevious, 
  onNext,
  hasPrevious,
  hasNext
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-controls" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        style={{ marginRight: '1rem' }}
      >
        Previous Page
      </button>
      <span style={{ color: '#6b7280' }}>
        Page {page} of {totalPages} {totalItems !== undefined && `(${totalItems} total)`}
      </span>
      <button
        onClick={onNext}
        disabled={!hasNext}
        style={{ marginLeft: '1rem' }}
      >
        Next Page
      </button>
    </div>
  );
};

export default PaginationControls;

