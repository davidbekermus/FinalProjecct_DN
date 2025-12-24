import { useEffect } from 'react';
import { useBusLines } from '../hooks/useBusLines';
import { useCompanyLines } from '../hooks/useCompanyLines';
import StationSearchResults from './views/StationSearchResults';
import NearbyStationsResults from './views/NearbyStationsResults';
import BusLinesResults from './views/BusLinesResults';
import CompanyLinesResults from './views/CompanyLinesResults';
import CompaniesGrid from './views/CompaniesGrid';
import LoadingSpinner from './ui/LoadingSpinner';

/**
 * Main results display component that routes to appropriate view based on current state
 */
const ResultsDisplay = ({
  results,
  loading,
  showBusLines,
  searchTerm,
  showNearbyStations,
  nearbyStations,
  locationLoading,
  showStationSearch,
  allStations,
  stationsLoading,
  searchType,
  showBusCompanies,
  selectedCompany,
  setSelectedCompany,
  updateFilterInURL
}) => {
  // Fetch bus lines when showBusLines is true
  const { busLines, loading: busLinesLoading, error: busLinesError } = useBusLines(showBusLines);
  
  // Manage company lines state
  const { 
    companyLines, 
    loading: companyLinesLoading, 
    error: companyLinesError,
    fetchCompanyLines,
    clearCompanyLines
  } = useCompanyLines(busLines);

  // Fetch company lines when selectedCompany is set from URL params (not from click)
  useEffect(() => {
    if (selectedCompany && companyLines.length === 0 && !companyLinesLoading) {
      fetchCompanyLines(selectedCompany);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany]);

  // Handle company card click
  const handleCompanyClick = async (company) => {
    setSelectedCompany(company);
    updateFilterInURL('company_lines', company.agency_name);
    await fetchCompanyLines(company);
  };

  // Handle back to companies view
  const handleBackToCompanies = () => {
    setSelectedCompany(null);
    clearCompanyLines();
    updateFilterInURL('company_lines');
  };

  // Show loading spinner for initial data
  if (loading) {
    return <LoadingSpinner message="Loading bus companies..." />;
  }

  // Route to appropriate view based on current state
  if (showStationSearch) {
    return (
      <StationSearchResults
        allStations={allStations}
        stationsLoading={stationsLoading}
        searchTerm={searchTerm}
        searchType={searchType}
      />
    );
  }

  if (showNearbyStations) {
    return (
      <NearbyStationsResults
        nearbyStations={nearbyStations}
        locationLoading={locationLoading}
        searchTerm={searchTerm}
        searchType={searchType}
      />
    );
  }

  if (showBusLines) {
    return (
      <BusLinesResults
        busLines={busLines}
        loading={busLinesLoading}
        error={busLinesError}
        searchTerm={searchTerm}
        searchType={searchType}
      />
    );
  }

  // Show bus companies when FilterByCompany is clicked or on default page
  if (showBusCompanies || (!showBusLines && !showNearbyStations && !showStationSearch)) {
    // If a company is selected, show its lines
    if (selectedCompany) {
      return (
        <CompanyLinesResults
          selectedCompany={selectedCompany}
          companyLines={companyLines}
          loading={companyLinesLoading}
          error={companyLinesError}
          searchTerm={searchTerm}
          searchType={searchType}
          onBack={handleBackToCompanies}
        />
      );
    }

    // Show companies grid
    return (
      <CompaniesGrid
        companies={results}
        searchTerm={searchTerm}
        searchType={searchType}
        onCompanyClick={handleCompanyClick}
      />
    );
  }

  // Default fallback
  return (
    <CompaniesGrid
      companies={results}
      searchTerm={searchTerm}
      searchType={searchType}
      onCompanyClick={handleCompanyClick}
    />
  );
};

export default ResultsDisplay;
