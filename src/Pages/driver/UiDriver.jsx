import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useRouteSearch } from "./hooks/useRouteSearch";
import DriverSearchForm from "./components/DriverSearchForm";
import RouteSearchResults from "./components/RouteSearchResults";
import "../../Css/UiDriver.css";

/**
 * Main driver interface for searching and selecting routes
 */
const UiDriver = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  
  const {
    searchResults,
    loading,
    error,
    hasSearched,
    searchRoutes
  } = useRouteSearch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await searchRoutes(
      formData.busCompany,
      formData.busRouteNumber,
      formData.cityName
    );
  };

  const handleRouteSelect = (route) => {
    navigate("/DriverRouteManager", { 
      state: { 
        selectedRoute: route,
        formData: formData 
      } 
    });
  };

  return (
    <>
      <Header title="Transportation Planner" />
      <main className="ui-driver-main">
        <div className="ui-driver-container">
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            ברוך השב נהג
          </h2>
          <h2>Transportation Planner</h2>
          
          <DriverSearchForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />

          <RouteSearchResults
            searchResults={searchResults}
            loading={loading}
            hasSearched={hasSearched}
            onRouteSelect={handleRouteSelect}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UiDriver;
