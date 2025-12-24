/**
 * Component for driver route search form
 */
const DriverSearchForm = ({ formData, onChange, onSubmit, loading, error }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="ui-driver-inputgroup">
        <label htmlFor="busCompany">Bus Company</label>
        <input
          type="text"
          id="busCompany"
          className="ui-driver-input"
          value={formData.busCompany || ""}
          onChange={onChange}
          placeholder="Enter bus company name"
          required
        />

        <label htmlFor="busRouteNumber">Bus Route Number</label>
        <input
          type="text"
          id="busRouteNumber"
          className="ui-driver-input"
          value={formData.busRouteNumber || ""}
          onChange={onChange}
          placeholder="Enter the route number"
          required
        />

        <label htmlFor="cityName">City Name</label>
        <input
          type="text"
          id="cityName"
          className="ui-driver-input"
          value={formData.cityName || ""}
          onChange={onChange}
          placeholder="Enter city name"
          required
        />

        {error && <p className="error-message">{error}</p>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Searching..." : "Search Bus Lines"}
      </button>
    </form>
  );
};

export default DriverSearchForm;

