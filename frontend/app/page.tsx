import ThreatOverview from "../components/dashboard/ThreatOverview";
import IncidentMap from "../components/dashboard/IncidentMap";
import IncidentCharts from "../components/dashboard/IncidentCharts";
import LatestBrief from "../components/dashboard/LatestBrief";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ThreatOverview />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <IncidentMap />
        </div>
        <IncidentCharts />
      </div>
      <LatestBrief />
    </div>
  );
}

