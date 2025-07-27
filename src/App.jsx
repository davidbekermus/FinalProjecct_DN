import { useEffect, useState, createContext, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import UiPassenger from "./Pages/UiPassenger";
import UiDriver from "./Pages/UiDriver";
import BusInfo from "./Pages/BusInfo";
import BusStopInfo from "./Pages/BusStopInfo";
import UiDriver_FinalInfo from "./Pages/Uidriver_FinalInfo";
import LoginForm from "./Pages/auth/LoginForm";
import SignupForm from "./Pages/auth/SignupForm";
import AdminPage from "./Pages/AdminPage";
import CompanyBusLines from "./Pages/CompanyBusLines";
import BusLineRoute from "./Pages/BusLineRoute";
import StationLines from "./Pages/StationLines";
import axios from "axios";
import MainPage from './planAJourney/MainPage';

const routes = [
  { path: "/", element: <Home />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/Login", element: <LoginForm />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/SignUp", element: <SignupForm />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/UiPassenger", element: <UiPassenger />, allowedRoles: ["passenger"] },
  { path: "/UiDriver", element: <UiDriver />, allowedRoles: ["driver"] },
  { path: "/UiDriver_FinalInfo", element: <UiDriver_FinalInfo />, allowedRoles: ["driver"] },
  { path: "/BusInfo", element: <BusInfo />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/BusStopInfo", element: <BusStopInfo />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/AdminPage", element: <AdminPage />, allowedRoles: ["admin"] },
  { path: "/company-bus-lines/:operatorRef", element: <CompanyBusLines />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/bus-line-route/:gtfs_route_id", element: <BusLineRoute />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/plan-journey", element: <MainPage />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/station-lines", element: <StationLines />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
];

// Create AuthContext
export const AuthContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate token and fetch user info on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        // Try to validate token with backend using axios
        const res = await axios.get("http://localhost:3000/auth/validate");
        setUser(res.data.user); // expects backend to return { user: {...} }
        setToken(storedToken);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Auth context value
  const authValue = { user, token, setUser, setToken };

  // ProtectedRoute logic
  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (loading) return null; // or a spinner
    if (!allowedRoles.includes(user.role)) {
      return <div>Access Denied</div>;
    }
    return element;
  };

  // Debug log
 

  return (
    <AuthContext.Provider value={authValue}>
      <BrowserRouter>
        <Routes>
          {routes.map(({ path, element, allowedRoles, public: isPublic }) =>
            <Route
              key={path}
              path={path}
              element={
                isPublic
                  ? element
                  : <ProtectedRoute element={element} allowedRoles={allowedRoles} />
              }
            />
          )}
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
