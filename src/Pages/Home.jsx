import React from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import "../Css/Home.css";

const Home = () => {
  return (
    <>
      <section className="hero-fullscreen-video">
        <video
          className="hero-video"
          src="/DYNACAP_frontpage_video.mp4" /* Corrected path */
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-overlay" />
        <div className="hero-layer">
          <Header title="BUSCHECK" transparent={true} />
          <div className="hero-content">
            <h1 className="hero-title">
              Revolutionizing Public Transportation
            </h1>
            <p className="hero-subtitle">
              Real-time data. Clean interface. For riders and drivers in Israel.
            </p>
            <div className="hero-buttons">
              <a href="/plan-journey" className="hero-button">
                Plan Your Journey
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
