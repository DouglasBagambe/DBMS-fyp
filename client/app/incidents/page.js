"use client";
import AllIncidents from "../components/AllIncidents";

// Add dynamic rendering with no static prerendering
export const dynamic = "force-dynamic";

export default function IncidentsPage() {
  return <AllIncidents />;
}
