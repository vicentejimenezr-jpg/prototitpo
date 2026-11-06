import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { Clock, Star, MapPin, Store } from 'lucide-react';

export default function InteractiveMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const { filteredKiosks, selectedCampus, campuses, setActiveKiosk } = useApp();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-33.0300, -71.5800],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | PUCV',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for filtered kiosks
    filteredKiosks.forEach(kiosk => {
      // Create custom SVG PedidosYa style icon
      const customIcon = L.divIcon({
        className: 'custom-kiosk-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              background: ${kiosk.isOpen ? '#EA0038' : '#71717A'};
              color: white;
              padding: 5px 9px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 700;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              white-space: nowrap;
              border: 2px solid white;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span>${kiosk.isOpen ? '🟢' : '⚪'}</span>
              <span>${kiosk.name}</span>
            </div>
            <div style="
              width: 0; 
              height: 0; 
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 8px solid ${kiosk.isOpen ? '#EA0038' : '#71717A'};
              margin-top: -1px;
            "></div>
          </div>
        `,
        iconSize: [120, 36],
        iconAnchor: [60, 34],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([kiosk.lat, kiosk.lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 210px; max-width: 250px;">
          <img src="${kiosk.image}" alt="${kiosk.name}" style="width: 100%; height: 95px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #002B49; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;">
              ${kiosk.campusName}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #EA0038;">★ ${kiosk.rating}</span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #111827;">${kiosk.name}</h4>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #6B7280; line-height: 1.3;">📍 ${kiosk.locationDetails}</p>
          <div style="font-size: 11px; color: #374151; margin-bottom: 10px; display: flex; align-items: center; gap: 4px;">
            ⏱️ <strong>${kiosk.pickupTimeMin}-${kiosk.pickupTimeMax} min</strong> para retiro
          </div>
          <button id="btn-kiosk-${kiosk.id}" style="
            width: 100%;
            background: #EA0038;
            color: white;
            border: none;
            padding: 7px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
          ">
            Ver Menú y Reservar
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-kiosk-${kiosk.id}`);
        if (btn) {
          btn.onclick = () => {
            setActiveKiosk(kiosk);
          };
        }
      });

      markersRef.current.push(marker);
    });

    // Fly to selected campus if not "todos"
    if (selectedCampus && selectedCampus !== 'todos') {
      const activeCampusObj = campuses.find(c => c.id === selectedCampus);
      if (activeCampusObj) {
        map.flyTo([activeCampusObj.lat, activeCampusObj.lng], activeCampusObj.zoom || 16, {
          duration: 1.2
        });
      }
    } else if (filteredKiosks.length > 0) {
      // Zoom to bounds of all filtered kiosks
      const group = L.featureGroup(markersRef.current);
      if (group.getBounds().isValid()) {
        map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 15 });
      }
    }

    return () => {
      // Keep map instance alive or clean up markers
    };
  }, [filteredKiosks, selectedCampus, campuses, setActiveKiosk]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-sm border border-neutral-200">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Floating map info pill */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-neutral-200/80 flex items-center gap-2.5 text-xs text-neutral-700">
        <span className="w-2.5 h-2.5 rounded-full bg-pedidosya-red animate-ping" />
        <span className="font-semibold text-neutral-900">{filteredKiosks.length} Quioscos</span> en la zona PUCV (Valparaíso & Viña del Mar)
      </div>

      <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] text-neutral-500 shadow border border-neutral-200 hidden sm:block">
        Haz clic en cualquier quiosco para ver detalles y reservar
      </div>
    </div>
  );
}
