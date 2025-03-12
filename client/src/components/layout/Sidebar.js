import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellAlertIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    { name: "Driver Profiles", path: "/drivers", icon: UserGroupIcon },
    { name: "Analytics", path: "/analytics", icon: ChartBarIcon },
    { name: "Safety Alerts", path: "/alerts", icon: BellAlertIcon },
    { name: "Settings", path: "/settings", icon: CogIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-primary-800 min-h-screen">
      <div className="flex items-center justify-center h-16 bg-primary-900">
        <span className="text-white text-lg font-bold">Driver Monitoring</span>
      </div>

      <div className="flex flex-col flex-grow pt-5">
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`${
                location.pathname === item.path
                  ? "bg-primary-700 text-white"
                  : "text-primary-100 hover:bg-primary-700"
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
            >
              <item.icon
                className={`${
                  location.pathname === item.path
                    ? "text-white"
                    : "text-primary-300 group-hover:text-white"
                } mr-3 flex-shrink-0 h-6 w-6`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-primary-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-primary-100 hover:bg-primary-700 hover:text-white"
        >
          <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-6 w-6 text-primary-300" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
