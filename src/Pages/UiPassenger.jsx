import { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Css/UiPassenger.css'; 
function UiPassenger() {
  const [form, setForm] = useState({
    location: '',
    destination: '',
    company: '',
    line: '',
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
  };

const handleUseMyLocation = () => {
  if (!navigator.geolocation) {
    setError('Geolocation is not supported by your browser.');
    return;
  }

  setLocationLoading(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=d4c5c4303dda4a4faacecc7b513d1ac9`
        );

        const data = await response.json();

        if (data && data.results && data.results.length > 0) {
          const formatted = data.results[0].formatted;
          setForm((prev) => ({ ...prev, location: formatted }));
          setError('');
        } else {
          setError('Could not find a readable address.');
        }
      } catch (err) {
        setError('Failed to fetch address.');
      }

      setLocationLoading(false);
    },
    () => {
      setError('Unable to retrieve your location.');
      setLocationLoading(false);
    }
  );
};


  return (
    <>
    <Header title="Transportation Planner" />
    <main className="signin-main">
      <div className="signin-container">
        <h2 className="signin-title">Transportation Planner</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Where are you located?</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="signin-input"
              placeholder="Enter your location"
              required
            />
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={locationLoading}
              className="use-location-button"
              style={{
                background: 'none',
                border: 'none',
                color: '#4f46e5',
                marginTop: '0.5rem',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              {locationLoading ? 'Detecting location…' : 'Use My Location'}
            </button>
            {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
          </div>

          <div className="input-group">
            <label>Destination</label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              className="signin-input"
              placeholder="Enter your destination"
              required
            />
          </div>

          <div className="input-group">
            <label>Transportation Company</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="signin-input"
              placeholder="e.g., MetroTransit, Amtrak"
              required
            />
          </div>

          <div className="input-group">
            <label>Line to Board</label>
            <input
              type="text"
              name="line"
              value={form.line}
              onChange={handleChange}
              className="signin-input"
              placeholder="e.g., Blue Line, Bus 24"
              required
            />
          </div>

          <button type="submit" className="signin-button">
            Submit
          </button>
        </form>
      </div>
    </main>
    <Footer />
    </>
  );
}

export default UiPassenger;
