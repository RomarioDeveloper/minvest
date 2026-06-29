"use client";

import { useEffect, useRef } from "react";

const LOCATIONS = [
  { lat: 52.2871, lng: 76.9638, label: "Дюсенова, 304", address: "ул. Дюсенова, 304" },
  { lat: 52.2855, lng: 76.9620, label: "Дюсенова, 306", address: "ул. Дюсенова, 306" },
  { lat: 52.2777, lng: 76.9445, label: "Горького, 46",  address: "ул. Горького, 46" },
  { lat: 52.2703, lng: 76.9515, label: "Естая, 90",     address: "ул. Естая, 90" },
  { lat: 52.2610, lng: 76.9480, label: "Бектурова, 348", address: "ул. Бектурова, 348" },
  { lat: 52.2595, lng: 76.9460, label: "Бектурова, 356", address: "ул. Бектурова, 356" },
  { lat: 52.283833, lng: 77.001001, label: "Офис продаж", address: "ул. Луначарского, 10, 2 этаж" },
];

export default function MalaysaryMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix default marker icons for Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [52.276, 76.965], // Смещенный центр, чтобы было видно и объекты, и офис
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

      // Custom SVG marker icon (houses for objects, special icon for office)
      const getCustomIcon = (isOffice: boolean) => L.divIcon({
        className: "",
        html: isOffice ? `
          <div style="
            width: 32px;
            height: 32px;
            background: #d4af37;
            border: 2px solid rgba(212,175,55,0.3);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 16px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background: #08080a;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        ` : `
          <div style="
            width: 24px;
            height: 24px;
            background: #f4f4f5;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <!-- Треугольник снизу (указатель) -->
            <div style="
              position: absolute;
              bottom: -4px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid #f4f4f5;
            "></div>
            <!-- Иконка домика внутри -->
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#08080a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        `,
        iconSize: isOffice ? [32, 32] : [24, 24],
        iconAnchor: isOffice ? [16, 32] : [12, 28],
        popupAnchor: [0, -32],
      });

      LOCATIONS.forEach((loc) => {
        const isOffice = loc.label === "Офис продаж";
        const marker = L.marker([loc.lat, loc.lng], { icon: getCustomIcon(isOffice) });
        marker.addTo(map);
        marker.bindPopup(
          `<div style="font-family:sans-serif;min-width:160px;">
            <div style="font-weight:700;font-size:13px;color:#08080a;margin-bottom:4px;">${loc.label}</div>
            <div style="font-size:12px;color:#52525b;">${loc.address}</div>
          </div>`,
          { closeButton: false }
        );
      });
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
      `}</style>
      <div
        ref={mapRef}
        className="h-[360px] w-full sm:h-[460px]"
        style={{ background: "#1a1a1f" }}
      />
    </>
  );
}
