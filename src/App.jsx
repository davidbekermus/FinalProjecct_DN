import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import UiPassenger from "./Pages/UiPassenger";
import UiDriver from "./Pages/UiDriver";
import BusInfo from "./Pages/BusInfo";
import BusStopInfo from "./Pages/BusStopInfo";
import UiDriver_FinalInfo from "./Pages/Uidriver_FinalInfo";
import LoginForm from "./Pages/LoginForm";
import SignupForm from "./Pages/SignupForm";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header title="BusCheck - Home" />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/Login"
          element={
            <>
              <Header title="BusCheck - Login" />
              <LoginForm />
              <Footer />
            </>
          }
        />
        <Route
          path="/SignUp"
          element={
            <>
              <Header title="BusCheck - Sign Up" />
              <SignupForm />
              <Footer />
            </>
          }
        />
        <Route
          path="/UiPassenger"
          element={
            <>
              <Header title="BusCheck - Passenger" />
              <UiPassenger />
              <Footer />
            </>
          }
        />
        <Route
          path="/UiDriver"
          element={
            <>
              <Header title="BusCheck - Driver" />
              <UiDriver />
              <Footer />
            </>
          }
        />
        <Route
          path="/UiDriver_FinalInfo"
          element={
            <>
              <Header title="BusCheck - Driver Final Info" />
              <UiDriver_FinalInfo />
              <Footer />
            </>
          }
        />
        <Route
          path="/BusInfo"
          element={
            <>
              <Header title="BusCheck - Bus Info" />
              <BusInfo />
              <Footer />
            </>
          }
        />
        <Route
          path="/BusStopInfo"
          element={
            <>
              <Header title="BusCheck - Bus Stop Info" />
              <BusStopInfo />
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
