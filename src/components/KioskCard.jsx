import React from 'react';
import { Star, Clock, MapPin, CreditCard, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function KioskCard({ kiosk }) {
  const { setActiveKiosk } = useApp();

  return (
    <div
      onClick={() => setActiveKiosk(kiosk)}
      className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl hover:border-pedidosya-red/30 transition-all duration-300 flex flex-col cursor-pointer group"
    >
      {/* Image Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
        <img
          src={kiosk.image}
          alt={kiosk.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Dark overlay gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Featured Tag */}
        {kiosk.featuredBadge && (
          <div className="absolute top-3 left-3 bg-pedidosya-red text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow">
            {kiosk.featuredBadge}
          </div>
        )}

        {/* Open / Closed Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${
              kiosk.isOpen
                ? 'bg-emerald-500 text-white'
                : 'bg-neutral-800/90 text-neutral-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${kiosk.isOpen ? 'bg-white' : 'bg-neutral-500'}`} />
            {kiosk.isOpen ? 'Abierto' : 'Cerrado'}
          </span>
        </div>

        {/* Campus & Location Tag at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="bg-pedidosya-pucv/90 backdrop-blur-md px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-pedidosya-pucvGold" />
            {kiosk.campusName}
          </span>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{kiosk.rating}</span>
            <span className="text-white/70 text-[10px]">({kiosk.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-neutral-900 text-lg group-hover:text-pedidosya-red transition-colors leading-snug">
            {kiosk.name}
          </h3>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-1 flex items-center gap-1">
            <span>📍</span>
            <span>{kiosk.locationDetails}</span>
          </p>

          {/* Time & Badges */}
          <div className="flex items-center gap-3 mt-3 text-xs text-neutral-600">
            <div className="flex items-center gap-1 font-semibold text-neutral-800 bg-neutral-100 px-2 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5 text-pedidosya-red" />
              <span>{kiosk.pickupTimeMin}-{kiosk.pickupTimeMax} min retiro</span>
            </div>

            {kiosk.acceptsJunaeb && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                <CreditCard className="w-3 h-3 text-blue-600" />
                <span>JUNAEB BAES</span>
              </div>
            )}
          </div>

          {/* Preview of popular items */}
          <div className="mt-3.5 pt-3 border-t border-neutral-100 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Destacados del quiosco:
            </span>
            <div className="space-y-1">
              {kiosk.menu.slice(0, 2).map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="text-neutral-700 truncate max-w-[190px]">• {item.name}</span>
                  <span className="font-bold text-neutral-900">${item.price.toLocaleString('es-CL')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-medium">Horario: {kiosk.openingHours}</span>
          <button 
            className="flex items-center gap-1 text-xs font-bold text-pedidosya-red group-hover:translate-x-1 transition-transform"
          >
            <span>Ver Menú y Reservar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
