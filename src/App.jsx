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
import AdminPage from "./Pages/AdminPage";
import CompanyBusLines from "./Pages/CompanyBusLines";
import BusLineRoute from "./Pages/BusLineRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
            </>
          }
        />
        <Route
          path="/Login"
          element={
            <>
              <LoginForm />
            </>
          }
        />
        <Route
          path="/SignUp"
          element={
            <>
              <SignupForm />
            </>
          }
        />
        <Route
          path="/UiPassenger"
          element={
            <>
              <UiPassenger />
            </>
          }
        />
        <Route
          path="/UiDriver"
          element={
            <>
              <UiDriver />
            </>
          }
        />
        <Route
          path="/UiDriver_FinalInfo"
          element={
            <>
              <UiDriver_FinalInfo />
            </>
          }
        />
        <Route
          path="/BusInfo"
          element={
            <>
              <BusInfo />
            </>
          }
        />
        <Route
          path="/BusStopInfo"
          element={
            <>
              <BusStopInfo />
            </>
          }
        />
        <Route
          path="/AdminPage"
          element={
            <>
              <AdminPage />
            </>
          }
        />
        <Route
          path="/company-bus-lines/:operatorRef"
          element={<CompanyBusLines />}
        />
        <Route
          path="/bus-line-route/:gtfs_route_id"
          element={<BusLineRoute />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
