import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  Map, 
  ShoppingBag, 
  Clock, 
  KeyRound, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react';

export default function MobileBottomNav() {
  const { 
    currentView, 
    setCurrentView, 
    cartItemCount, 
    cartTotal, 
    setIsCartOpen,
    orders,
    setTrackingOrder,
    isAdminMode,
    setIsAdminMode,
    isKioskAuthenticated,
    openKioskAuth
  } = useApp();

  // Active order (if student has an order being prepared or ready)
  const activeOrder = orders.find(o => o.status !== 'entregado' && o.status !== 'cancelado');

  const handleKioskClick = () => {
    if (isKioskAuthenticated) {
      setIsAdminMode(!isAdminMode);
    } else {
      openKioskAuth('login');
    }
  };

  return (
    <nav 
      aria-label="Navegación Móvil"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 transition-all"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 sm:grid-cols-4 gap-1 items-center justify-around">
        
        {/* 1. Explorar / Quioscos */}
        <button
          onClick={() => {
            setCurrentView('browse');
            if (isAdminMode) setIsAdminMode(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            currentView === 'browse' && !isAdminMode
              ? 'text-pedidosya-red font-black scale-105'
              : 'text-neutral-500 hover:text-neutral-800 font-medium'
          }`}
        >
          <div className="relative">
            <Store className="w-5 h-5" />
            {currentView === 'browse' && !isAdminMode && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-pedidosya-red" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Quioscos</span>
        </button>

        {/* 2. Mapa Interactivo */}
        <button
          onClick={() => {
            setCurrentView('map');
            if (isAdminMode) setIsAdminMode(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            currentView === 'map' && !isAdminMode
              ? 'text-pedidosya-red font-black scale-105'
              : 'text-neutral-500 hover:text-neutral-800 font-medium'
          }`}
        >
          <div className="relative">
            <Map className="w-5 h-5" />
            {currentView === 'map' && !isAdminMode && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-pedidosya-red" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Mapa</span>
        </button>

        {/* 3. Tu Reserva / Carrito (o Ticket Activo si hay pedido) */}
        {activeOrder ? (
          <button
            onClick={() => setTrackingOrder(activeOrder)}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-amber-600 font-extrabold transition-all relative"
          >
            <div className="relative">
              <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[68px]">
              {activeOrder.status === 'listo' ? '¡Retirar!' : 'En Prep.'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setIsCartOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
              cartItemCount > 0 ? 'text-pedidosya-red font-black' : 'text-neutral-500 hover:text-neutral-800 font-medium'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-pedidosya-red text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">
              {cartItemCount > 0 ? `$${cartTotal.toLocaleString('es-CL')}` : 'Reserva'}
            </span>
          </button>
        )}

        {/* 4. Modo Quiosco / Admin */}
        <button
          onClick={handleKioskClick}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            isAdminMode
              ? 'text-emerald-600 font-black scale-105'
              : 'text-neutral-500 hover:text-neutral-800 font-medium'
          }`}
        >
          <div className="relative">
            {isKioskAuthenticated ? (
              <LayoutDashboard className="w-5 h-5 text-emerald-600" />
            ) : (
              <KeyRound className="w-5 h-5" />
            )}
            {isKioskAuthenticated && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">
            {isKioskAuthenticated ? (isAdminMode ? 'Panel ON' : 'Panel') : 'Quiosco'}
          </span>
        </button>

      </div>
    </nav>
  );
}

