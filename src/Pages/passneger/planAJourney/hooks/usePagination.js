import { useState, useEffect } from 'react';

/**
 * Custom hook for pagination logic
 */
export const usePagination = (items, pageSize, resetTrigger) => {
  const [page, setPage] = useState(1);

  // Ensure items is an array
  const safeItems = Array.isArray(items) ? items : [];

  // Reset to page 1 when resetTrigger changes
  useEffect(() => {
    setPage(1);
  }, [resetTrigger]);

  const totalPages = Math.max(1, Math.ceil(safeItems.length / pageSize));
  const paginatedItems = safeItems.slice((page - 1) * pageSize, page * pageSize);

  const goToPreviousPage = () => setPage(p => Math.max(1, p - 1));
  const goToNextPage = () => setPage(p => Math.min(totalPages, p + 1));

  return {
    page,
    totalPages,
    paginatedItems,
    goToPreviousPage,
    goToNextPage,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
};

