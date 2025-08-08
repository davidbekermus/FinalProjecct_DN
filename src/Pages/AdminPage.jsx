import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { AuthContext } from "../App";
import "../Css/AdminPage.css";

const AdminPage = () => {
  const { user, token } = useContext(AuthContext);
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  const fetchPendingDrivers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/auth/pending-drivers", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPendingDrivers(response.data);
    } catch (err) {
      console.error("Error fetching pending drivers:", err);
      setError("Failed to fetch pending drivers");
    } finally {
      setLoading(false);
    }
  };

  const handleDriverAction = async (driverId, action) => {
    try {
      setActionLoading(prev => ({ ...prev, [driverId]: true }));
      
      await axios.put(`http://localhost:3000/auth/approve-driver/${driverId}`, 
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Remove the driver from the pending list
      setPendingDrivers(prev => prev.filter(driver => driver._id !== driverId));
      
      alert(`Driver ${action}d successfully!`);
    } catch (err) {
      console.error(`Error ${action}ing driver:`, err);
      alert(`Failed to ${action} driver: ${err.response?.data?.message || "Unknown error"}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [driverId]: false }));
    }
  };

  const getImageUrl = (imageFilename) => {
    if (!imageFilename) return null;
    return `http://localhost:3000/uploads/${imageFilename}`;
  };

  const handleImageClick = (imageUrl, driverName) => {
    setSelectedImage({ url: imageUrl, name: driverName });
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  if (!user || user.role !== "admin") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <>
      <Header title="Admin Dashboard" />
      <main className="admin-main">
        <div className="admin-container">
          <h2>Admin Dashboard</h2>
          <p>Welcome, {user.name}! Manage driver approvals below.</p>
          
          <div className="pending-drivers-section">
            <h3>Pending Driver Approvals</h3>
            
            {loading ? (
              <p>Loading pending drivers...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : pendingDrivers.length === 0 ? (
              <p>No pending driver approvals.</p>
            ) : (
              <div className="drivers-list">
                {pendingDrivers.map((driver) => (
                  <div key={driver._id} className="driver-card">
                    <div className="driver-info">
                      <div className="driver-header">
                        <h4>{driver.name}</h4>
                        <span className="status-pending">{driver.status}</span>
                      </div>
                      <p><strong>Email:</strong> {driver.email}</p>
                      <p><strong>Role:</strong> {driver.role}</p>
                      <p><strong>Created:</strong> {new Date(driver.createdAt).toLocaleDateString()}</p>
                      
                      {/* Driver Image Section */}
                      {driver.image && (
                        <div className="driver-image-section">
                          <p><strong>Uploaded Image:</strong></p>
                          <div className="driver-image-container">
                            <img 
                              src={getImageUrl(driver.image)} 
                              alt={`${driver.name}'s profile`}
                              className="driver-image"
                              onClick={() => handleImageClick(getImageUrl(driver.image), driver.name)}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                            <div className="image-error" style={{ display: 'none' }}>
                              <p>Image not available</p>
                            </div>
                          </div>
                          <small className="image-click-hint">Click image to view larger</small>
                        </div>
                      )}
                    </div>
                    <div className="driver-actions">
                      <button
                        className="approve-btn"
                        onClick={() => handleDriverAction(driver._id, "approve")}
                        disabled={actionLoading[driver._id]}
                      >
                        {actionLoading[driver._id] ? "Processing..." : "Approve"}
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleDriverAction(driver._id, "reject")}
                        disabled={actionLoading[driver._id]}
                      >
                        {actionLoading[driver._id] ? "Processing..." : "Reject"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-header">
              <h3>{selectedImage.name}'s Image</h3>
              <button className="modal-close-btn" onClick={closeImageModal}>
                ×
              </button>
            </div>
            <div className="image-modal-body">
              <img 
                src={selectedImage.url} 
                alt={`${selectedImage.name}'s profile`}
                className="modal-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="modal-image-error" style={{ display: 'none' }}>
                <p>Image not available</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AdminPage;
