"use client";
import AllIncidents from "../components/AllIncidents";

// Set static rendering for Netlify compatibility
export const dynamic = "force-static";

export default function IncidentsPage() {
  return <AllIncidents />;
}
