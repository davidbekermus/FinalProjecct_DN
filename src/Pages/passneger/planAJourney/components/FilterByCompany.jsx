import React from 'react';

const FilterByCompany = ({ onClick }) => {
  return (
    <div className="filter-component filter-component-4" onClick={onClick} style={{ cursor: 'pointer' }}>
      Search by Company
    </div>
  );
};

export default FilterByCompany; 