"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";

export default function MalaysaryMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const { t } = useI18n();

  /** Координаты совпадают с филиалами Malaysary Invest в 2ГИС. */
  const LOCATIONS = [
    { lat: 52.261471, lng: 76.947641, label: t("obj.dyusenova_304.district"), address: "ул. Генерала Дюсенова, 304" },
    { lat: 52.260749, lng: 76.947619, label: t("obj.dyusenova_306.district"), address: "ул. Генерала Дюсенова, 306" },
    { lat: 52.271532, lng: 76.945941, label: t("obj.gorkogo_46.district"), address: "ул. Горького, 46" },
    { lat: 52.281397, lng: 76.954259, label: t("obj.estaya_90.district"), address: "ул. Естая, 90" },
    { lat: 52.261685, lng: 76.949892, label: t("obj.bekturova_348.district"), address: "ул. Академика Бектурова, 348" },
    { lat: 52.261449, lng: 76.949094, label: t("obj.bekturova_356.district"), address: "ул. Академика Бектурова, 356" },
    {
      lat: 52.277323,
      lng: 76.941557,
      label: t("contact.office"),
      address: t("contact.office.addr") + ", " + t("contact.office.note"),
      isOffice: true,
    },
  ];

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
        attributionControl: true,
      });
      map.attributionControl.setPrefix(false);

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 'by <strong>Iglobal Corp</strong>',
        maxZoom: 19,
      }).addTo(map);

      // Маркер жилого объекта — силуэт зданий из логотипа
      const markerHeight = 20;
      const markerWidth = Math.round(markerHeight * (187 / 120));

      const markerIcon = L.divIcon({
        className: "malaysary-map-pin",
        html: `<img src="/logo-mark.webp" alt="" draggable="false" style="display:block;width:${markerWidth}px;height:${markerHeight}px;max-width:${markerWidth}px;max-height:${markerHeight}px;object-fit:contain;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5));" />`,
        iconSize: [markerWidth, markerHeight],
        iconAnchor: [markerWidth / 2, markerHeight / 2],
        popupAnchor: [0, -Math.round(markerHeight / 2) - 2],
      });

      // Маркер офиса продаж — контрастный бейдж с пином (как в карточке контактов)
      const officeSize = 34;

      const officeIcon = L.divIcon({
        className: "malaysary-map-office",
        html: `<div class="malaysary-map-office-badge">
          <span class="malaysary-map-office-ring"></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>`,
        iconSize: [officeSize, officeSize],
        iconAnchor: [officeSize / 2, officeSize / 2],
        popupAnchor: [0, -Math.round(officeSize / 2) - 4],
        tooltipAnchor: [officeSize / 2 + 6, 0],
      });

      const bounds = L.latLngBounds([]);

      LOCATIONS.forEach((loc) => {
        const marker = L.marker([loc.lat, loc.lng], {
          icon: loc.isOffice ? officeIcon : markerIcon,
          zIndexOffset: loc.isOffice ? 1000 : 0,
        });
        marker.addTo(map);
        bounds.extend([loc.lat, loc.lng]);
        marker.bindPopup(
          `<div style="font-family:sans-serif;min-width:160px;">
            <div style="font-weight:700;font-size:13px;color:#08080a;margin-bottom:4px;">${loc.label}</div>
            <div style="font-size:12px;color:#52525b;">${loc.address}</div>
          </div>`,
          { closeButton: false }
        );

        if (loc.isOffice) {
          marker.bindTooltip(loc.label, {
            permanent: true,
            direction: "right",
            interactive: false,
            className: "malaysary-map-office-label",
          });
        }
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
        .leaflet-tile-pane {
          filter: invert(1) hue-rotate(180deg) brightness(0.92) contrast(1.05) saturate(0.2);
        }
        .leaflet-control-attribution a {
          display: none !important;
        }
        .leaflet-attribution-flag {
          display: none !important;
        }
        .malaysary-map-pin,
        .malaysary-map-office {
          background: transparent !important;
          border: none !important;
        }
        .malaysary-map-pin img {
          pointer-events: none;
        }

        /* Офис продаж: светлый круглый бейдж с тёмным пином */
        .malaysary-map-office-badge {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 9999px;
          background: #f4f4f5;
          color: #08080a;
          box-shadow:
            0 0 0 2px rgba(8,8,10,0.9),
            0 6px 16px rgba(0,0,0,0.6);
        }
        .malaysary-map-office-badge svg {
          width: 18px;
          height: 18px;
          pointer-events: none;
        }
        .malaysary-map-office-ring {
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          border: 1.5px solid rgba(244,244,245,0.75);
          pointer-events: none;
          animation: malaysaryOfficePulse 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }
        @keyframes malaysaryOfficePulse {
          0%   { transform: scale(0.8); opacity: 0.9; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .malaysary-map-office-ring { animation: none; opacity: 0.5; }
        }

        /* Постоянная подпись рядом с офисом */
        .leaflet-tooltip.malaysary-map-office-label {
          background: rgba(8,8,10,0.9) !important;
          backdrop-filter: blur(6px);
          color: #f4f4f5 !important;
          border: 1px solid rgba(244,244,245,0.25) !important;
          border-radius: 9999px;
          padding: 5px 11px;
          font-family: 'Manrope', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.45);
        }
        .leaflet-tooltip.malaysary-map-office-label::before {
          display: none;
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
