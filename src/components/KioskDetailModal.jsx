import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Star, 
  Clock, 
  MapPin, 
  CreditCard, 
  Plus, 
  ShoppingBag
} from 'lucide-react';

export default function KioskDetailModal() {
  const { 
    activeKiosk, 
    setActiveKiosk, 
    addToCart, 
    setActiveCustomizingProduct,
    cartItemCount,
    cartTotal,
    setIsCartOpen
  } = useApp();

  const [activeMenuTab, setActiveMenuTab] = useState('todos');

  if (!activeKiosk) return null;

  // Filter items in active menu
  const menuCategories = [
    { id: 'todos', label: 'Todo el Menú' },
    ...Array.from(new Set(activeKiosk.menu.map(p => p.category))).map(cat => ({
      id: cat,
      label: cat === 'comida_lenta' ? '🥩 Comida Lenta & Plancha' :
             cat === 'completos' ? 'Completos & Sandwiches' :
             cat === 'cafeteria' ? 'Cafetería & Desayunos' :
             cat === 'almuerzos' ? 'Menú Almuerzos' :
             cat === 'empanadas' ? 'Empanadas' :
             cat === 'vegano' ? 'Veggie & Fit' :
             cat === 'dulces' ? 'Pastelería' : 'Bebidas'
    }))
  ];

  const displayedProducts = activeMenuTab === 'todos'
    ? activeKiosk.menu
    : activeKiosk.menu.filter(p => p.category === activeMenuTab);

  const handleProductClick = (product) => {
    if (!product.available) return;
    if (product.options) {
      setActiveCustomizingProduct({ product, kiosk: activeKiosk });
    } else {
      addToCart(product, activeKiosk, 1, {}, '');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="bg-white w-full max-w-4xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh] sm:h-auto sm:max-h-[92vh] border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-40 sm:h-52 md:h-64 w-full bg-neutral-900 shrink-0">
          <img
            src={activeKiosk.image}
            alt={activeKiosk.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

          {/* Close button */}
          <button
            onClick={() => setActiveKiosk(null)}
            className="absolute top-3.5 right-3.5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/80 active:scale-90 text-white flex items-center justify-center transition shadow-lg"
            aria-label="Cerrar quiosco"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badges & Info */}
          <div className="absolute bottom-3 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 text-white">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
              <span className="bg-pedidosya-pucv text-pedidosya-pucvGold text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border border-pedidosya-pucvGold/30">
                PUCV • {activeKiosk.campusName}
              </span>
              <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${activeKiosk.isOpen ? 'bg-emerald-500 text-white' : 'bg-neutral-600 text-neutral-200'}`}>
                {activeKiosk.isOpen ? '🟢 Abierto' : '⚪ Cerrado'}
              </span>
              {activeKiosk.acceptsJunaeb && (
                <span className="bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> JUNAEB
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">{activeKiosk.name}</h1>
            <p className="text-[11px] sm:text-xs md:text-sm text-neutral-200 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-pedidosya-red shrink-0" />
              <span className="truncate">{activeKiosk.locationDetails}</span>
            </p>
          </div>
        </div>

        {/* Info Strip */}
        <div className="bg-neutral-50 px-3.5 sm:px-6 py-2.5 sm:py-3 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2 sm:gap-4 text-xs text-neutral-700 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1 font-bold">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs sm:text-sm text-neutral-900">{activeKiosk.rating}</span>
              <span className="text-neutral-500 text-[11px]">({activeKiosk.reviewsCount})</span>
            </div>
            <div className="h-3 w-px bg-neutral-300 hidden sm:block" />
            <div className="flex items-center gap-1 font-semibold text-[11px] sm:text-xs">
              <Clock className="w-3.5 h-3.5 text-pedidosya-red" />
              <span>Retiro: <strong>{activeKiosk.pickupTimeMin}-{activeKiosk.pickupTimeMax} min</strong></span>
            </div>
            <div className="h-3 w-px bg-neutral-300 hidden md:block" />
            <div className="text-neutral-500 text-[11px] hidden md:block">
              Horario: {activeKiosk.openingHours}
            </div>
          </div>

          <div className="hidden xs:flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] bg-pedidosya-lightRed text-pedidosya-red font-black px-2 py-0.5 rounded-md">
              ⚡ Retiro Express sin fila
            </span>
          </div>
        </div>

        {/* Menu category navigation */}
        <div className="px-3.5 sm:px-6 pt-3 pb-2 border-b border-neutral-200 bg-white sticky top-0 z-10 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none shrink-0">
          {menuCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveMenuTab(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 shrink-0 ${
                activeMenuTab === cat.id
                  ? 'bg-pedidosya-red text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product List Content */}
        <div className={`p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-3 sm:space-y-4 ${cartItemCount > 0 ? 'pb-24 sm:pb-6' : ''}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {displayedProducts.map(product => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`bg-white rounded-2xl p-3 sm:p-4 border transition-all duration-200 flex gap-3 sm:gap-4 justify-between relative group active:scale-[0.99] ${
                  product.available 
                    ? 'border-neutral-200 hover:border-pedidosya-red/40 hover:shadow-md cursor-pointer' 
                    : 'border-neutral-200 opacity-60 cursor-not-allowed bg-neutral-50'
                }`}
              >
                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between pr-1 sm:pr-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-neutral-900 text-xs sm:text-sm group-hover:text-pedidosya-red transition-colors truncate">
                        {product.name}
                      </h4>
                      {(product.isSlowFood || product.category === 'comida_lenta') && (
                        <span className="bg-rose-100 text-rose-900 border border-rose-300 text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded shrink-0">
                          🥩 Cocción Lenta (~20m)
                        </span>
                      )}
                      {product.isPopular && (
                        <span className="bg-amber-100 text-amber-800 text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded shrink-0">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-neutral-900 text-sm sm:text-base">
                        ${product.price.toLocaleString('es-CL')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                          ${product.originalPrice.toLocaleString('es-CL')}
                        </span>
                      )}
                    </div>

                    {product.options && (
                      <span className="text-[9px] sm:text-[10px] text-pedidosya-red font-bold bg-pedidosya-lightRed px-1.5 py-0.5 rounded shrink-0">
                        Personalizable
                      </span>
                    )}
                  </div>
                </div>

                {/* Image and Add Button */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-neutral-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  {product.available ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                      className="absolute bottom-1 right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-pedidosya-red active:scale-90 text-white flex items-center justify-center shadow-md hover:bg-pedidosya-darkRed transition"
                      title="Agregar a la reserva"
                      aria-label={`Agregar ${product.name}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center text-white text-[9px] font-bold text-center px-1">
                      Agotado
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer (Sticky cart preview if items exist) */}
        {cartItemCount > 0 && (
          <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 flex items-center justify-between gap-3 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="w-8 h-8 rounded-full bg-pedidosya-lightRed text-pedidosya-red flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                {cartItemCount}
              </span>
              <div>
                <p className="text-[10px] sm:text-xs text-neutral-500">Total acumulado:</p>
                <p className="text-sm sm:text-base font-black text-neutral-900">${cartTotal.toLocaleString('es-CL')}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveKiosk(null);
                setIsCartOpen(true);
              }}
              className="bg-pedidosya-red hover:bg-pedidosya-darkRed active:scale-95 text-white font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-2.5 rounded-full shadow-lg shadow-pedidosya-red/30 flex items-center gap-1.5 sm:gap-2 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Carrito y Horario</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
