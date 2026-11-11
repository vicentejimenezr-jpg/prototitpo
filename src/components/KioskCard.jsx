import React from 'react';
import { Star, Clock, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function KioskCard({ kiosk }) {
  const { setActiveKiosk } = useApp();

  return (
    <div
      onClick={() => setActiveKiosk(kiosk)}
      className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-pedidosya-red/40 transition-all duration-300 flex flex-col cursor-pointer group active:scale-[0.99]"
    >
      {/* Image Banner */}
      <div className="relative h-40 sm:h-44 md:h-48 w-full overflow-hidden bg-neutral-100">
        <img
          src={kiosk.image}
          alt={kiosk.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Dark overlay gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />

        {/* Featured Tag */}
        {kiosk.featuredBadge && (
          <div className="absolute top-3 left-3 bg-pedidosya-red text-white text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md">
            {kiosk.featuredBadge}
          </div>
        )}

        {/* Open / Closed Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold shadow-md backdrop-blur-xs ${
              kiosk.isOpen
                ? 'bg-emerald-500 text-white'
                : 'bg-neutral-900/85 text-neutral-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${kiosk.isOpen ? 'bg-white' : 'bg-neutral-500'}`} />
            {kiosk.isOpen ? 'Abierto' : 'Cerrado'}
          </span>
        </div>

        {/* Campus & Location Tag at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs gap-2">
          <span className="bg-pedidosya-pucv/90 backdrop-blur-md px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[11px] sm:text-xs truncate max-w-[170px] sm:max-w-none">
            <MapPin className="w-3.5 h-3.5 text-pedidosya-pucvGold shrink-0" />
            <span className="truncate">{kiosk.campusName}</span>
          </span>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg font-bold text-xs shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{kiosk.rating}</span>
            <span className="text-white/70 text-[10px]">({kiosk.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-black text-neutral-900 text-base sm:text-lg group-hover:text-pedidosya-red transition-colors leading-snug">
            {kiosk.name}
          </h3>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-1 flex items-center gap-1">
            <span>📍</span>
            <span className="truncate">{kiosk.locationDetails}</span>
          </p>

          {/* Time & Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-neutral-600">
            <div className="flex items-center gap-1 font-bold text-neutral-800 bg-neutral-100 px-2 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-pedidosya-red" />
              <span>{kiosk.pickupTimeMin}-{kiosk.pickupTimeMax} min retiro</span>
            </div>

            {kiosk.acceptsJunaeb && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
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
                <div key={item.id} className="flex items-center justify-between text-xs gap-2">
                  <span className="text-neutral-700 truncate">• {item.name}</span>
                  <span className="font-extrabold text-neutral-900 shrink-0">${item.price.toLocaleString('es-CL')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <span className="text-xs text-neutral-400 font-medium truncate">Horario: {kiosk.openingHours}</span>
          <button 
            className="flex items-center gap-1 text-xs font-bold text-pedidosya-red group-hover:translate-x-1 transition-transform shrink-0"
            aria-label={`Ver menú de ${kiosk.name}`}
          >
            <span>Ver Menú</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
