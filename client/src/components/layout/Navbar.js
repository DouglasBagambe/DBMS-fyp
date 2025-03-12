import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BellAlertIcon,
  CogIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const isAuthenticated = !!token;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon, auth: true },
    { name: "Analytics", path: "/analytics", icon: ChartBarIcon, auth: true },
    {
      name: "Reports",
      path: "/reports",
      icon: ClipboardDocumentListIcon,
      auth: true,
    },
    { name: "Alerts", path: "/alerts", icon: BellAlertIcon, auth: true },
    { name: "Settings", path: "/settings", icon: CogIcon, auth: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className="h-8 w-8 bg-primary-600 text-white flex items-center justify-center rounded-md">
                  <span className="font-bold">DM</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-800">
                  DriveSafe
                </span>
              </Link>
            </div>

            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? "border-primary-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <item.icon className="h-5 w-5 mr-1" />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Admin
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-white p-1 rounded-full text-gray-400 hover:text-gray-500"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  <span className="ml-1 text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
