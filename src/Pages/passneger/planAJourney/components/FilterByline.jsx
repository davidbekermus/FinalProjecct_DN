import React from 'react';

const FilterByline = ({ onClick }) => {
  return (
    <div className="filter-component filter-component-2" onClick={onClick} style={{ cursor: 'pointer' }}>
      Filter by Line
    </div>
  );
};

export default FilterByline; 