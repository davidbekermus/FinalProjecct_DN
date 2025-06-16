import React from "react";
import { Link } from "react-router-dom";
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import "../Css/ChooseSignInType.css"; 

const ChooseSignInType = () => {
  return (
    <>
      <Header title = "Sign in"/>
      <div className="choose-signin-background">
        <div className="button-container">
          <Link to="/SignInDriver" className="signin-button">
            Are you a bus driver?
          </Link>
          <Link to="/SignInTraveler" className="signin-button">
            Are you a traveler?
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChooseSignInType;
