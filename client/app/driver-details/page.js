"use client";
import DriverDetails from "../components/DriverDetails";
import { useSearchParams } from "next/navigation";

export default function DriverDetailsPage() {
  const searchParams = useSearchParams();
  const driverId = searchParams.get("driverId");

  if (!driverId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700 dark:text-red-400">Driver ID not provided</p>
        </div>
      </div>
    );
  }

  return <DriverDetails driverId={driverId} />;
} 