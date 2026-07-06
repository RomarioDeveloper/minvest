"use client";

import { useEffect, useRef } from "react";

/** Координаты совпадают с филиалами Malaysary Invest в 2ГИС. */
const LOCATIONS = [
  { lat: 52.261471, lng: 76.947641, label: "Дюсенова, 304", address: "ул. Генерала Дюсенова, 304" },
  { lat: 52.260749, lng: 76.947619, label: "Дюсенова, 306", address: "ул. Генерала Дюсенова, 306" },
  { lat: 52.271532, lng: 76.945941, label: "Горького, 46", address: "ул. Горького, 46" },
  { lat: 52.281397, lng: 76.954259, label: "Естая, 90", address: "ул. Естая, 90" },
  { lat: 52.261685, lng: 76.949892, label: "Бектурова, 348", address: "ул. Академика Бектурова, 348" },
  { lat: 52.261449, lng: 76.949094, label: "Бектурова, 356", address: "ул. Академика Бектурова, 356" },
  { lat: 52.277323, lng: 76.941557, label: "Офис продаж", address: "ул. Луначарского, 10, 2 этаж" },
];

export default function MalaysaryMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current!, {
        center: [52.271, 76.948],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // OpenStreetMap tiles (dark-ish Carto variant for better look)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: 'by <strong>Iglobal Corp</strong>',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map);

      const markerHeight = 14;
      const markerWidth = Math.round(markerHeight * (187 / 120));

      const markerIcon = L.divIcon({
        className: "malaysary-map-pin",
        html: `<img src="/logo-mark.webp" alt="" draggable="false" style="display:block;width:${markerWidth}px;height:${markerHeight}px;max-width:${markerWidth}px;max-height:${markerHeight}px;object-fit:contain;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5));" />`,
        iconSize: [markerWidth, markerHeight],
        iconAnchor: [markerWidth / 2, markerHeight / 2],
        popupAnchor: [0, -Math.round(markerHeight / 2) - 2],
      });

      const bounds = L.latLngBounds([]);

      LOCATIONS.forEach((loc) => {
        const marker = L.marker([loc.lat, loc.lng], { icon: markerIcon });
        marker.addTo(map);
        bounds.extend([loc.lat, loc.lng]);
        marker.bindPopup(
          `<div style="font-family:sans-serif;min-width:160px;">
            <div style="font-weight:700;font-size:13px;color:#08080a;margin-bottom:4px;">${loc.label}</div>
            <div style="font-size:12px;color:#52525b;">${loc.address}</div>
          </div>`,
          { closeButton: false }
        );
      });

      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    });

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <style>{`
        .leaflet-control-attribution {
          background: rgba(8,8,10,0.85) !important;
          backdrop-filter: blur(6px);
          color: #a1a1aa !important;
          font-family: 'Manrope', sans-serif !important;
          font-size: 11px !important;
          letter-spacing: 0.04em;
          border-top-left-radius: 4px;
          padding: 4px 10px !important;
          border: none !important;
        }
        .leaflet-control-attribution strong {
          color: #f4f4f5 !important;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .leaflet-control-attribution a {
          display: none !important;
        }
        .leaflet-attribution-flag {
          display: none !important;
        }
        .malaysary-map-pin {
          background: transparent !important;
          border: none !important;
        }
        .malaysary-map-pin img {
          pointer-events: none;
        }
      `}</style>
      <div
        ref={mapRef}
        className="h-[360px] w-full sm:h-[460px]"
        style={{ background: "#1a1a1f" }}
      />
    </>
  );
}
