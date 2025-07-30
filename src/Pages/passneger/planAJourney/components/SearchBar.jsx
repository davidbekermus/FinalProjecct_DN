import React, { useState } from 'react';

const SearchBar = ({ value, onChange, onSubmit, placeholder = 'Search...', searchType, onSearchTypeChange, searchMode }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showDropdown, setShowDropdown] = useState(false);

  React.useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(inputValue);
  };

  const handleSearchTypeSelect = (type) => {
    if (onSearchTypeChange) onSearchTypeChange(type);
    setShowDropdown(false);
  };

  const getDropdownOptions = () => {
    if (searchMode === 'station') {
      return [
        { key: 'station_name', label: 'Search by Station Name' },
        { key: 'station_id', label: 'Search by Station ID' },
        { key: 'city_name', label: 'Search by City Name' }
      ];
    } else if (searchMode === 'bus_lines') {
      return [
        { key: 'route_short_name', label: 'Search by Line Number' },
        { key: 'agency_name', label: 'Search by Agency Name' }
      ];
    } else if (searchMode === 'nearby_stations') {
      return [
        { key: 'station_name', label: 'Search by Station Name' },
        { key: 'station_id', label: 'Search by Station ID' },
        { key: 'city_name', label: 'Search by City Name' }
      ];
    } else if (searchMode === 'company_lines') {
      return [
        { key: 'route_short_name', label: 'Search by Line Number' },
        { key: 'route_long_name', label: 'Search by Route Name' }
      ];
    } else {
      return [
        { key: 'agency_name', label: 'Search by Agency Name' }
      ];
    }
  };

  const getCurrentOptionLabel = () => {
    const options = getDropdownOptions();
    const currentOption = options.find(opt => opt.key === searchType) || options[0];
    return currentOption ? currentOption.label : 'Search...';
  };

  const getPlaceholder = () => {
    const options = getDropdownOptions();
    const currentOption = options.find(opt => opt.key === searchType) || options[0];
    return currentOption ? currentOption.label : placeholder;
  };

  return (
    <div className="search-bar-container">
      <div className="search-dropdown">
        <button
          type="button"
          className="search-dropdown-button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {getCurrentOptionLabel()}
          <span className="dropdown-arrow">▼</span>
        </button>
        {showDropdown && (
          <div className="search-dropdown-menu">
            {getDropdownOptions().map((option) => (
              <button
                key={option.key}
                type="button"
                className="search-dropdown-item"
                onClick={() => handleSearchTypeSelect(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input 
          type="text" 
          className="search-bar__input" 
          placeholder={getPlaceholder()} 
          aria-label="Search" 
          value={inputValue} 
          onChange={handleChange} 
        />
        <button type="submit" className="search-bar__button">Search</button>
      </form>
    </div>
  );
};

export default SearchBar; 