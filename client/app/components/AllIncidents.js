"use client";
import React, { useState, useEffect } from "react";
import { getIncidents } from "../utils/api";
import {
  Bell,
  Clock,
  AlertTriangle,
  Phone,
  Moon,
  Cigarette,
  Filter,
  Search,
  Calendar,
  User,
  Car,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const AllIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const router = useRouter();

  // Map incident numbers to their respective types and messages
  const incidentTypeMap = {
    1: {
      type: "PHONE_USAGE",
      message: "Phone usage detected",
      severity: "high",
    },
    2: {
      type: "CIGARETTE",
      message: "Cigarette usage detected",
      severity: "medium",
    },
    3: {
      type: "SEATBELT",
      message: "Seatbelt violation detected",
      severity: "medium",
    },
    4: {
      type: "DROWSINESS",
      message: "Driver drowsiness detected",
      severity: "high",
    },
  };

  // Get incident type info based on incident_no
  const getIncidentTypeInfo = (incidentNo) => {
    return incidentTypeMap[incidentNo] || null;
  };

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const data = await getIncidents();
        setIncidents(data || []);
      } catch (err) {
        setError(err.message || "Failed to load incidents");
        console.error("Error fetching incidents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const getAlertIcon = (incident_no) => {
    switch (Number(incident_no)) {
      case 1: // Phone usage
        return <Phone className="w-5 h-5" />;
      case 4: // Drowsiness
        return <Moon className="w-5 h-5" />;
      case 2: // Cigarette
        return <Cigarette className="w-5 h-5" />;
      case 3: // Seatbelt
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-l-4 border-red-500";
      case "medium":
        return "bg-amber-100 text-amber-800 border-l-4 border-amber-500";
      case "low":
        return "bg-green-100 text-green-800 border-l-4 border-green-500";
      default:
        return "bg-blue-100 text-blue-800 border-l-4 border-blue-500";
    }
  };

  const getSeverityDot = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  const filteredIncidents = incidents
    .filter(
      (incident) =>
        incident.incident_no && incidentTypeMap[incident.incident_no]
    )
    .filter((incident) => {
      // Apply search filter
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        incident.driver_name?.toLowerCase().includes(searchLower) ||
        incident.vehicle_number?.toLowerCase().includes(searchLower) ||
        String(incident.driver_id).includes(searchLower)
      );
    })
    .filter((incident) => {
      // Apply type filter
      if (!filterType) return true;
      return Number(incident.incident_no) === Number(filterType);
    });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={goBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Safety Violations
          </h1>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by driver or vehicle"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="1">Phone Usage</option>
                <option value="2">Cigarette</option>
                <option value="3">Seatbelt Violation</option>
                <option value="4">Drowsiness</option>
              </select>
            </div>
          </div>
          <div className="text-right">
            <span className="text-gray-600 dark:text-gray-400">
              {filteredIncidents.length} incidents found
            </span>
          </div>
        </div>

        {/* Incidents List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading incidents data...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Incidents Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filterType
                ? "Try adjusting your search filters"
                : "No safety violations have been recorded"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className="grid grid-cols-1 gap-4 max-h-[calc(100vh-240px)] overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#CBD5E0 #EDF2F7",
              }}
            >
              {filteredIncidents.map((incident) => {
                const incidentInfo = getIncidentTypeInfo(incident.incident_no);
                if (!incidentInfo) return null;

                return (
                  <div
                    key={incident.id}
                    className={`rounded-lg p-4 transition-all ${getSeverityStyle(
                      incidentInfo.severity
                    )}`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-lg ${
                          incidentInfo.severity === "high"
                            ? "bg-red-200"
                            : incidentInfo.severity === "medium"
                            ? "bg-amber-200"
                            : "bg-green-200"
                        } mr-4`}
                      >
                        {getAlertIcon(incident.incident_no)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <h4 className="font-medium mb-1">
                            {incident.driver_name ||
                              `Driver ID: ${incident.driver_id}`}
                            : {incidentInfo.message}
                          </h4>
                          <div className="flex items-center space-x-1 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(incident.created_at)}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <div className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50 flex items-center">
                            <span
                              className={`w-2 h-2 rounded-full ${getSeverityDot(
                                incidentInfo.severity
                              )} mr-1`}
                            ></span>
                            {incidentInfo.severity.charAt(0).toUpperCase() +
                              incidentInfo.severity.slice(1)}
                          </div>
                          <div className="text-xs flex items-center px-2 py-1 rounded-full bg-white bg-opacity-50">
                            <Car className="w-3 h-3 mr-1" />
                            Vehicle:{" "}
                            {incident.vehicle_number || incident.vehicle_id}
                          </div>
                          <div className="text-xs flex items-center px-2 py-1 rounded-full bg-white bg-opacity-50">
                            <User className="w-3 h-3 mr-1" />
                            Driver ID: {incident.driver_id}
                          </div>
                          {incident.description && (
                            <div className="w-full mt-2">
                              <p className="text-sm italic">
                                "{incident.description}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllIncidents;
