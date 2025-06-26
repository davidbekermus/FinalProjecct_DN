import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/UiDriver.css';
import { useNavigate } from 'react-router-dom';

const UiDriver = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.busCompany || !formData.busRouteNumber || !formData.depaetureTime) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    console.log('Form submitted:', formData);
    navigate('/UiDriver_FinalInfo');
  };

  return (
    <>
      <Header title="Transportation Planner" />
      <main className="ui-driver-main">
        <div className="ui-driver-container">
          <h2>Transportation Planner</h2>
          <form onSubmit={handleSubmit}>
            <div className="ui-driver-inputgroup">
              <label htmlFor="busCompany">Bus Company</label>
              <input
                type="text"
                id="busCompany"
                className="ui-driver-input"
                value={formData.busCompany || ''}
                onChange={handleChange}
                placeholder="Enter pickup location"
                required
              />

              <label htmlFor="busRouteNumber">Bus Route Number</label>
              <input
                type="text"
                id="busRouteNumber"
                className="ui-driver-input"
                value={formData.busRouteNumber || ''}
                onChange={handleChange}
                placeholder="Enter the route number"
                required
              />

              <label htmlFor="depaetureTime">Departure Time</label>
              <input
                type="text"
                id="depaetureTime"
                className="ui-driver-input"
                value={formData.depaetureTime || ''}
                onChange={handleChange}
                placeholder="Enter the departure time"
                required
              />

              {error && <p className="error-message">{error}</p>}
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UiDriver;
