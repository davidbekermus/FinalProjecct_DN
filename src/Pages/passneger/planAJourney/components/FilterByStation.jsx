import React from 'react';

const FilterByStation = ({ onClick }) => {
  return (
    <div className="filter-component filter-component-3" onClick={onClick} style={{ cursor: 'pointer' }}>
      Filter by Station
    </div>
  );
};

export default FilterByStation; 