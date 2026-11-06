import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BannerSlider from './components/BannerSlider';
import CategoryChips from './components/CategoryChips';
import KioskCard from './components/KioskCard';
import InteractiveMap from './components/InteractiveMap';
import KioskDetailModal from './components/KioskDetailModal';
import ProductCustomizerModal from './components/ProductCustomizerModal';
import CartDrawer from './components/CartDrawer';
import ReservationModal from './components/ReservationModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import KioskAdminPanel from './components/KioskAdminPanel';
import KioskAuthModal from './components/KioskAuthModal';
import { 
  Store, 
  MapPin, 
  Clock, 
  Sparkles, 
  Heart, 
  Coffee, 
  HelpCircle,
  ExternalLink,
  KeyRound,
  PlusCircle
} from 'lucide-react';

function MainContent() {
  const { 
    filteredKiosks, 
    selectedCampus, 
    campuses, 
    currentView, 
    setCurrentView,
    searchQuery,
    setSearchQuery,
    isAdminMode,
    setSelectedCampus,
    openKioskAuth,
    isKioskAuthenticated
  } = useApp();

  const currentCampusObj = campuses.find(c => c.id === selectedCampus);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {/* Kiosk Vendor Admin Panel if toggled/authenticated */}
        {isAdminMode && isKioskAuthenticated && <KioskAdminPanel />}

        {/* Promo Hero Banners (PedidosYa vibe) */}
        <BannerSlider />

        {/* Food Categories & Filter Pills */}
        <CategoryChips />

        {/* Main View: Map or Kiosk Grid */}
        {currentView === 'map' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                  Mapa de Quioscos PUCV en Valparaíso y Viña del Mar
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500">
                  Explora las ubicaciones dentro de Casa Central, Sausalito, IBC, Curauma y Recreo.
                </p>
              </div>

              <button
                onClick={() => setCurrentView('browse')}
                className="text-xs font-bold text-pedidosya-red hover:underline"
              >
                Volver a vista de lista
              </button>
            </div>

            {/* Interactive Leaflet Map */}
            <InteractiveMap />

            {/* Kiosks list preview below map */}
            <div className="pt-4">
              <h3 className="font-extrabold text-neutral-900 text-lg mb-4">
                Quioscos en el área seleccionada ({filteredKiosks.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKiosks.map(kiosk => (
                  <KioskCard key={kiosk.id} kiosk={kiosk} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                    {selectedCampus === 'todos' ? 'Quioscos Disponibles' : `Quioscos en ${currentCampusObj?.name}`}
                  </h2>
                  <span className="bg-neutral-200/80 text-neutral-700 text-xs font-extrabold px-2 py-0.5 rounded-full">
                    {filteredKiosks.length}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                  Reserva con anticipación y retira en el mesón para no esperar en recreos
                </p>
              </div>

              {/* View on Map trigger link */}
              <button
                onClick={() => setCurrentView('map')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-pedidosya-red hover:text-pedidosya-darkRed transition bg-pedidosya-lightRed px-3 py-1.5 rounded-xl border border-pedidosya-red/20"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Explorar en Mapa</span>
              </button>
            </div>

            {/* Kiosks Grid */}
            {filteredKiosks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 shadow-sm max-w-lg mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-2xl">
                  🔍
                </div>
                <h3 className="text-lg font-black text-neutral-900">No encontramos quioscos con estos filtros</h3>
                <p className="text-xs text-neutral-500 mt-1 mb-6">
                  Prueba cambiando de campus o limpiando el texto de búsqueda.
                </p>
                <button
                  onClick={() => {
                    setSelectedCampus('todos');
                    setSearchQuery('');
                  }}
                  className="bg-pedidosya-red text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKiosks.map(kiosk => (
                  <KioskCard key={kiosk.id} kiosk={kiosk} />
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer (PedidosYa + PUCV vibes) */}
      <footer className="bg-white border-t border-neutral-200 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-200 text-xs text-neutral-600">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-pedidosya-red flex items-center justify-center text-white font-black text-xs">
                  Eat
                </div>
                <span className="font-extrabold text-base text-neutral-900">
                  Eat<span className="text-pedidosya-red">PUCV</span>
                </span>
              </div>
              <p className="text-neutral-500 leading-relaxed">
                Plataforma de reserva anticipada de comidas y pedidos para los quioscos de la Pontificia Universidad Católica de Valparaíso.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-pedidosya-pucv font-bold">
                <MapPin className="w-3.5 h-3.5 text-pedidosya-red" />
                <span>Región de Valparaíso, Chile</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">Campus con Quioscos</h4>
              <ul className="space-y-2">
                <li>• Casa Central (Av. Brasil 2950, Valparaíso)</li>
                <li>• Campus Sausalito (Av. El Bosque 1290, Viña del Mar)</li>
                <li>• Edificio Isabel Brown Caces - IBC (Valparaíso)</li>
                <li>• Campus Curauma (Av. Universidad 330)</li>
                <li>• Campus Recreo (Viña del Mar)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">Beneficios y Pagos</h4>
              <ul className="space-y-2">
                <li>• Beca JUNAEB BAES (Sodexo y Edenred)</li>
                <li>• Cero filas en horarios de recreo</li>
                <li>• Reserva y programación de horario</li>
                <li>• Ticket y código QR de retiro</li>
                <li>• Pago Webpay Débito y Efectivo</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">¿Tienes un Quiosco?</h4>
              <p className="text-neutral-500 mb-3 leading-relaxed">
                Integra tu quiosco o casino universitario a EatPUCV para recibir reservas automáticas de los estudiantes.
              </p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => openKioskAuth('login')}
                  className="bg-pedidosya-pucv hover:bg-[#003961] text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <KeyRound className="w-3.5 h-3.5 text-pedidosya-pucvGold" />
                  <span>Iniciar Sesión Modo Quiosco</span>
                </button>
                <button 
                  onClick={() => openKioskAuth('register')}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-pedidosya-red" />
                  <span>Rellenar Formulario para Unirse</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-3">
            <p>© 2026 EatPUCV - Diseñado para la comunidad universitaria de Valparaíso y Viña del Mar.</p>
            <p className="flex items-center gap-1">
              <span>Hecho con</span>
              <Heart className="w-3.5 h-3.5 fill-pedidosya-red text-pedidosya-red" />
              <span>para estudiantes PUCV</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <KioskDetailModal />
      <ProductCustomizerModal />
      <CartDrawer />
      <ReservationModal />
      <OrderTrackerModal />
      <KioskAuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
