import React from 'react';

const FilterByLocation = ({ onClick }) => {
  return (
    <div className="filter-component filter-component-1" onClick={onClick} style={{ cursor: 'pointer' }}>
      Stations Near Me
    </div>
  );
};

export default FilterByLocation; 