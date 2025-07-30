import { useEffect, useState, createContext, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import UiDriver from "./Pages/driver/UiDriver";
import DriverRouteManager from "./Pages/driver/DriverRouteManager";
import LoginForm from "./Pages/auth/LoginForm";
import SignupForm from "./Pages/auth/SignupForm";
import AdminPage from "./Pages/AdminPage";
import BusLineRoute from "./Pages/passneger/BusLineRoute";
import StationLines from "./Pages/passneger/StationLines";
import RouteCounter from "./Pages/RouteCounter";
import axios from "axios";
import MainPage from './Pages/passneger/planAJourney/MainPage';
import NotFound from './Pages/NotFound';
import { api } from "./utils/api";

const routes = [
  { path: "/", element: <Home />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/Login", element: <LoginForm />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/SignUp", element: <SignupForm />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/UiDriver", element: <UiDriver />, allowedRoles: ["driver"] },
  { path: "/DriverRouteManager", element: <DriverRouteManager />, allowedRoles: ["driver"] },
  { path: "/AdminPage", element: <AdminPage />, allowedRoles: ["admin"] },
  { path: "/bus-line-route/:gtfs_route_id", element: <BusLineRoute />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/plan-journey", element: <MainPage />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/station-lines", element: <StationLines />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/RouteCounter", element: <RouteCounter />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
  { path: "/*", element: <NotFound />, public: true, allowedRoles: ["passenger", "driver", "admin"] },
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
      console.log(storedToken);
      
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        // Try to validate token with backend using axios
        const {data} = await api.get("http://localhost:3000/auth/validate");
        
        setUser(data); // expects backend to return { user: {...} }
        
        setToken(storedToken);
      } catch (err) {
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
    if (loading) return null;
    console.log("allowedRoles", allowedRoles);
    console.log("user", user);
     // or a spinner
    if (!allowedRoles.includes(user?.role)) {
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
