"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import useSWR from "swr";
import { fetcher } from "../../lib/api";

interface Incident {
  id: number;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string;
  threat_score: number;
  summary?: string | null;
}

const scoreColor = (score: number) => {
  if (score >= 8) return "text-red-400";
  if (score >= 5) return "text-amber-400";
  return "text-emerald-400";
};

export default function IncidentMap() {
  const { data } = useSWR<Incident[]>(
    "http://localhost:8000/api/map",
    fetcher
  );

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 h-[360px] md:h-[420px]">
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={4}
        className="h-full w-full rounded-md overflow-hidden"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        {data?.map(
          (incident) =>
            incident.latitude &&
            incident.longitude && (
              <Marker
                key={incident.id}
                position={[incident.latitude, incident.longitude]}
              >
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">
                      {incident.location ?? "Unknown location"}
                    </div>
                    <div className="text-xs text-slate-500 uppercase">
                      {incident.category}
                    </div>
                    <div className="text-xs">
                      Threat Score:{" "}
                      <span className={scoreColor(incident.threat_score)}>
                        {incident.threat_score.toFixed(1)}
                      </span>
                    </div>
                    {incident.summary && (
                      <p className="mt-1 text-xs">{incident.summary}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </section>
  );
}

