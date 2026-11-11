import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  Clock, 
  Store, 
  Map, 
  Grid, 
  KeyRound, 
  LogOut, 
  PlusCircle,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { 
    campuses, 
    selectedCampus, 
    setSelectedCampus, 
    searchQuery, 
    setSearchQuery,
    cartItemCount,
    cartTotal,
    setIsCartOpen,
    currentView,
    setCurrentView,
    orders,
    setTrackingOrder,
    isAdminMode,
    setIsAdminMode,
    isKioskAuthenticated,
    kioskUser,
    openKioskAuth,
    logoutKiosk
  } = useApp();

  const activeOrder = orders.find(o => o.status !== 'entregado' && o.status !== 'cancelado');
  const currentCampusObj = campuses.find(c => c.id === selectedCampus);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/90 shadow-sm">
      {/* Top Banner Notice */}
      <div className="bg-pedidosya-pucv text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex-1 flex items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
            <span className="bg-pedidosya-pucvGold text-neutral-900 font-extrabold px-1.5 py-0.5 rounded text-[10px] tracking-wide shrink-0">
              BAES
            </span>
            <span className="hidden md:inline text-neutral-200">
              ¡Evita filas en recreo! Reserva tu comida en quioscos PUCV y retira con tu código QR.
            </span>
            <span className="md:hidden text-neutral-200 font-medium truncate">
              Reserva anticipada sin filas en quioscos PUCV
            </span>
          </div>

          {/* Quick link for vendors */}
          <button
            onClick={() => openKioskAuth('register')}
            className="hidden sm:flex items-center gap-1 font-bold text-pedidosya-pucvGold hover:text-amber-300 transition shrink-0 text-[11px]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>¿Tienes quiosco? Únete</span>
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Campus Picker */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div 
              onClick={() => setCurrentView('browse')} 
              className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
              title="Ir a inicio de EatPUCV"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-pedidosya-red flex items-center justify-center text-white shadow-md shadow-pedidosya-red/30 group-hover:scale-105 transition-transform">
                <span className="text-xs sm:text-sm font-black tracking-tighter">Eat</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg sm:text-xl text-neutral-900 tracking-tight leading-none">
                    Eat<span className="text-pedidosya-red">PUCV</span>
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-extrabold bg-neutral-100 text-pedidosya-pucv px-1.5 py-0.5 rounded border border-neutral-200">
                    Valparaíso
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[11px] text-neutral-500 font-medium">Quioscos & Reservas</span>
              </div>
            </div>

            {/* Campus Selector Dropdown (Responsive Pill) */}
            <div className="relative flex items-center">
              <div className="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200/80 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-700 transition border border-neutral-200/60 max-w-[150px] sm:max-w-[210px] md:max-w-none">
                <MapPin className="w-3.5 h-3.5 text-pedidosya-red shrink-0" />
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="bg-transparent text-neutral-800 font-bold cursor-pointer outline-none truncate pr-1 text-xs w-full"
                  aria-label="Seleccionar campus universitario"
                >
                  {campuses.map(campus => (
                    <option key={campus.id} value={campus.id}>
                      {campus.shortName} ({campus.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search bar (Visible on md and up, tablet/desktop) */}
          <div className="flex-1 max-w-sm lg:max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar completos, café, empanadas, colaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 hover:bg-neutral-200/60 focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 pl-9 pr-8 py-2 rounded-full border border-neutral-200 focus:border-pedidosya-red outline-none transition shadow-inner"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 bg-neutral-200 rounded-full w-4 h-4 flex items-center justify-center"
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Actions & Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* View Mode Toggle: Lista vs Mapa (Visible on tablet/desktop) */}
            <div className="hidden lg:flex bg-neutral-100 p-1 rounded-xl items-center gap-0.5 border border-neutral-200">
              <button
                onClick={() => setCurrentView('browse')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  currentView === 'browse'
                    ? 'bg-white text-pedidosya-red shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Ver lista de quioscos"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Quioscos</span>
              </button>
              <button
                onClick={() => setCurrentView('map')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  currentView === 'map'
                    ? 'bg-white text-pedidosya-red shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Ver mapa interactivo"
              >
                <Map className="w-3.5 h-3.5" />
                <span>Mapa</span>
              </button>
            </div>

            {/* Active Order Badge (Desktop & Tablet) */}
            {activeOrder && (
              <button
                onClick={() => setTrackingOrder(activeOrder)}
                className="hidden sm:flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-full text-xs font-bold transition pulse-glow"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span className="hidden xl:inline">Reserva:</span>
                <span>{activeOrder.id}</span>
              </button>
            )}

            {/* Kiosk Vendor Button (Visible on lg and up; mobile/tablet uses bottom nav) */}
            <div className="hidden lg:flex items-center">
              {isKioskAuthenticated ? (
                <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-2xl border border-neutral-300">
                  <button
                    onClick={() => setIsAdminMode(!isAdminMode)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                      isAdminMode
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-extrabold">{kioskUser?.username || 'local123'}</span>
                    <span className="text-[10px] opacity-80">({isAdminMode ? 'Cerrar Panel' : 'Panel'})</span>
                  </button>

                  <button
                    onClick={logoutKiosk}
                    className="p-1.5 rounded-xl text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Cerrar Sesión Quiosco"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openKioskAuth('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition bg-white text-pedidosya-pucv border-pedidosya-pucv/30 hover:border-pedidosya-pucv hover:bg-pedidosya-pucv hover:text-white shadow-sm"
                >
                  <KeyRound className="w-3.5 h-3.5 text-pedidosya-red" />
                  <span>Soy Quiosco</span>
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 bg-pedidosya-red hover:bg-pedidosya-darkRed active:scale-95 text-white px-3 sm:px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm shadow-md shadow-pedidosya-red/30 transition shrink-0"
              aria-label="Abrir carrito de reserva"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Tu Reserva</span>
              {cartItemCount > 0 ? (
                <div className="flex items-center gap-1 sm:pl-1 sm:border-l border-white/30">
                  <span className="bg-white text-pedidosya-red rounded-full px-1.5 py-0.2 text-[11px] font-black leading-none">
                    {cartItemCount}
                  </span>
                  <span className="text-xs font-bold hidden xs:inline">${cartTotal.toLocaleString('es-CL')}</span>
                </div>
              ) : (
                <span className="sm:hidden text-xs">0</span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile & Small Tablet Search Bar */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar comida, completos, café de grano..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-100 focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 pl-9 pr-8 py-2.5 rounded-2xl border border-neutral-200 focus:border-pedidosya-red outline-none shadow-sm transition"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 bg-neutral-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
