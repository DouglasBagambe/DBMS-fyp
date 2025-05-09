"use client";

import { useContext, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AnalyticsPage from "./components/Analytic";
import UserProfile from "./components/UserProfile";
import Support from "./components/Support";
import Settings from "./components/Settings";
import Notifications from "./components/Notifications";
import About from "./components/About";
import { AuthContext } from "./context/AuthContext";

export default function Page() {
  return <PageContent />;
}

function PageContent() {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !isAuthenticated &&
      location.pathname !== "/login" &&
      location.pathname !== "/signup" &&
      location.pathname !== "/" &&
      location.pathname !== "/support" &&
      location.pathname !== "/about"
    ) {
      navigate("/login");
    }

    updateMetadata(location.pathname);
  }, [isAuthenticated, location, navigate]);

  const updateMetadata = (pathname) => {
    let title = "DBMS";
    let description = "Driver Behavior Monitoring System Application";

    switch (pathname) {
      case "/":
        title = "DBMS | Home";
        description =
          "Welcome to DBMS - Your Driver Behavior Monitoring Solution";
        break;
      case "/login":
        title = "DBMS | Login";
        description = "Log in to your DBMS account";
        break;
      case "/signup":
        title = "DBMS | Sign Up";
        description = "Create a new DBMS account";
        break;
      case "/dashboard":
        title = "DBMS | Dashboard";
        description = "Your DBMS dashboard overview";
        break;
      case "/analytics":
        title = "DBMS | Analytics";
        description = "Data analytics and reporting";
        break;
      case "/profile":
        title = "DBMS | Profile";
        description = "Your user profile";
        break;
      case "/support":
        title = "DBMS | Support";
        description = "Get help and support for DBMS";
        break;
      case "/settings":
        title = "DBMS | Settings";
        description = "Manage your account settings";
        break;
      case "/notifications":
        title = "DBMS | Notifications";
        description = "View your notifications";
        break;
      case "/about":
        title = "DBMS | About";
        description = "Learn about the Driver Behavior Monitoring System";
        break;
      default:
        title = "DBMS";
        description = "Driver Behavior Monitoring System Application";
    }

    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/analytics"
        element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />}
      />
      <Route path="/support" element={<Support />} />
      <Route
        path="/settings"
        element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
      />
      <Route
        path="/notifications"
        element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />}
      />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
