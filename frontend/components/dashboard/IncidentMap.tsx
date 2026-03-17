"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet's default icon path for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
  iconUrl: markerIcon.src ?? markerIcon,
  shadowUrl: markerShadow.src ?? markerShadow,
});

const highIcon = new L.DivIcon({
  className: "pulsar-marker",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const moderateIcon = new L.DivIcon({
  className: "pulsar-marker-moderate",
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const lowIcon = new L.DivIcon({
  className: "pulsar-marker-low",
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

const getMarkerIcon = (score: number) => {
  if (score >= 8) return highIcon;
  if (score >= 5) return moderateIcon;
  return lowIcon;
};

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
    "/api/map",
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
                icon={getMarkerIcon(incident.threat_score)}
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

