import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  Clock, 
  Store, 
  SlidersHorizontal,
  Map, 
  Grid, 
  Sparkles,
  ChevronDown,
  KeyRound,
  LogOut,
  PlusCircle,
  ShieldCheck
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

  // Find active order if any (pending pickup)
  const activeOrder = orders.find(o => o.status !== 'entregado' && o.status !== 'cancelado');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      {/* Top Banner Notice */}
      <div className="bg-pedidosya-pucv text-white text-xs py-1.5 px-4 text-center flex items-center justify-between gap-2">
        <div className="flex-1 text-center flex items-center justify-center gap-2">
          <span className="bg-pedidosya-pucvGold text-neutral-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
            JUNAEB BAES
          </span>
          <span className="hidden sm:inline">¡Evita filas en recreo! Reserva tu comida online y retira con tu código sin esperar en los quioscos PUCV</span>
          <span className="sm:hidden">Reserva comida y evita filas en recreos</span>
        </div>

        {/* Quick link to Join as Kiosk */}
        <button
          onClick={() => openKioskAuth('register')}
          className="hidden md:flex items-center gap-1 text-[11px] font-bold text-pedidosya-pucvGold hover:underline ml-2"
        >
          <PlusCircle className="w-3 h-3" />
          <span>¿Tienes quiosco? Únete aquí</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => { setCurrentView('browse'); }} 
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-2xl bg-pedidosya-red flex items-center justify-center text-white shadow-md shadow-pedidosya-red/30 group-hover:scale-105 transition-transform">
                <span className="text-sm font-black tracking-tighter">Eat</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl text-neutral-900 tracking-tight">
                    Eat<span className="text-pedidosya-red">PUCV</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-neutral-100 text-pedidosya-pucv px-1.5 py-0.5 rounded border border-neutral-300">
                    Valparaíso
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 font-medium">Quioscos & Reservas</span>
              </div>
            </div>

            {/* Campus Selector (Location Picker) */}
            <div className="hidden md:flex items-center">
              <div className="relative group">
                <div className="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200/80 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-700 cursor-pointer transition">
                  <MapPin className="w-3.5 h-3.5 text-pedidosya-red" />
                  <select
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    className="bg-transparent text-neutral-800 font-semibold cursor-pointer outline-none pr-1"
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
          </div>

          {/* Search bar (Center) */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Busca quioscos, completos, café de grano, empanadas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 hover:bg-neutral-200/60 focus:bg-white text-sm text-neutral-900 placeholder-neutral-400 pl-10 pr-4 py-2.5 rounded-full border border-transparent focus:border-pedidosya-red outline-none transition shadow-inner"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 bg-neutral-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Actions on right */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Mode Toggle: Lista vs Mapa */}
            <div className="bg-neutral-100 p-1 rounded-xl flex items-center gap-0.5 border border-neutral-200">
              <button
                onClick={() => setCurrentView('browse')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentView === 'browse'
                    ? 'bg-white text-pedidosya-red shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Ver lista de quioscos"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Quioscos</span>
              </button>
              <button
                onClick={() => setCurrentView('map')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentView === 'map'
                    ? 'bg-white text-pedidosya-red shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Ver quioscos en el mapa de Valparaíso"
              >
                <Map className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Mapa</span>
              </button>
            </div>

            {/* Active order badge/tracker if any */}
            {activeOrder && (
              <button
                onClick={() => setTrackingOrder(activeOrder)}
                className="relative flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-full text-xs font-semibold transition pulse-glow"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span className="hidden lg:inline">Reserva Activa:</span>
                <span className="font-bold">{activeOrder.id}</span>
              </button>
            )}

            {/* KIOSK AUTHENTICATION / ADMIN BUTTON */}
            {isKioskAuthenticated ? (
              /* Authenticated Kiosk Badge & Controls */
              <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-2xl border border-neutral-300">
                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                    isAdminMode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-neutral-800 hover:bg-neutral-50'
                  }`}
                  title="Panel de Operaciones de Quiosco"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-extrabold">{kioskUser?.username || 'local123'}</span>
                  <span className="hidden xl:inline text-[10px] opacity-80">({isAdminMode ? 'Panel Abierto' : 'Ver Panel'})</span>
                </button>

                <button
                  onClick={logoutKiosk}
                  className="p-1.5 rounded-xl text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Cerrar Sesión de Modo Quiosco"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Not Authenticated: Click opens Kiosk Auth Modal with login, recovery and join form */
              <button
                onClick={() => openKioskAuth('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition bg-white text-pedidosya-pucv border-pedidosya-pucv/30 hover:border-pedidosya-pucv hover:bg-pedidosya-pucv hover:text-white shadow-sm"
                title="Iniciar sesión en Modo Quiosco (Credenciales: local123 / local123)"
              >
                <KeyRound className="w-3.5 h-3.5 text-pedidosya-red" />
                <span>Soy Quiosco</span>
              </button>
            )}

            {/* Cart Button (PedidosYa style) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-pedidosya-red hover:bg-pedidosya-darkRed text-white px-3.5 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm shadow-md shadow-pedidosya-red/30 transition transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Tu Reserva</span>
              {cartItemCount > 0 && (
                <div className="flex items-center gap-1 pl-1 border-l border-white/30">
                  <span className="bg-white text-pedidosya-red rounded-full px-1.5 py-0.2 text-xs font-extrabold">
                    {cartItemCount}
                  </span>
                  <span className="text-xs font-semibold">${cartTotal.toLocaleString('es-CL')}</span>
                </div>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search & Campus bar */}
        <div className="sm:hidden pb-3 pt-1 flex flex-col gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar comida, quioscos, café..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-100 text-sm pl-9 pr-3 py-2 rounded-xl border border-neutral-200 outline-none"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 flex items-center gap-1 bg-neutral-100 px-3 py-1.5 rounded-xl text-xs">
              <MapPin className="w-3.5 h-3.5 text-pedidosya-red shrink-0" />
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="bg-transparent text-neutral-800 font-semibold cursor-pointer outline-none w-full"
              >
                {campuses.map(campus => (
                  <option key={campus.id} value={campus.id}>
                    {campus.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Kiosk Auth Trigger */}
            {!isKioskAuthenticated ? (
              <button
                onClick={() => openKioskAuth('login')}
                className="text-xs font-bold text-pedidosya-pucv bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl shrink-0 flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5 text-pedidosya-red" />
                <span>Quiosco</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className="text-xs font-bold text-white bg-emerald-600 px-3 py-2 rounded-xl shrink-0 flex items-center gap-1"
              >
                <span>Panel</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
