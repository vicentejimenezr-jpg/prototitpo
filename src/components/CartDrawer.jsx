import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, Clock, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart,
    cartTotal, 
    cartItemCount,
    setIsCheckoutOpen 
  } = useApp();

  if (!isCartOpen) return null;

  const firstItem = cart[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen sm:max-w-md bg-white shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pedidosya-lightRed flex items-center justify-center text-pedidosya-red">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">Tu Reserva</h2>
                  <span className="bg-pedidosya-lightRed text-pedidosya-red text-[11px] font-black px-2 py-0.5 rounded-full">
                    {cartItemCount}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 font-medium">Revisa tus productos antes de programar</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 active:bg-neutral-200 text-neutral-500 flex items-center justify-center transition"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Kiosk origin banner if cart has items */}
          {firstItem && (
            <div className="bg-neutral-50 px-4 sm:px-5 py-2.5 sm:py-3 border-b border-neutral-200/80 flex items-center justify-between shrink-0">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-black text-neutral-900 truncate">{firstItem.kioskName}</p>
                <p className="text-[11px] text-neutral-500 flex items-center gap-1 truncate mt-0.5">
                  <MapPin className="w-3 h-3 text-pedidosya-red shrink-0" />
                  <span className="truncate">{firstItem.campusName}</span>
                </p>
              </div>
              <button
                onClick={clearCart}
                className="text-[11px] font-bold text-neutral-400 hover:text-pedidosya-red transition shrink-0 underline"
              >
                Vaciar
              </button>
            </div>
          )}

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 sm:space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-neutral-300" />
                </div>
                <h3 className="font-extrabold text-neutral-800 text-base mb-1">Tu canasta está vacía</h3>
                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                  Explora los quioscos de la PUCV, elige tus comidas favoritas y resérvalas para retirar sin filas.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-neutral-50/80 rounded-2xl p-3 sm:p-3.5 border border-neutral-200/90 flex gap-3 relative shadow-2xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover shrink-0"
                    loading="lazy"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-neutral-900 leading-snug truncate pr-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-neutral-400 hover:text-rose-600 active:scale-95 p-1 rounded-lg hover:bg-white"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected options */}
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.values(item.selectedOptions).map((opt, i) => (
                            <span key={i} className="text-[10px] bg-white border border-neutral-200 px-1.5 py-0.5 rounded text-neutral-600 font-medium">
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <p className="text-[10px] sm:text-[11px] text-amber-800 italic mt-1 bg-amber-50/90 border border-amber-200/50 px-2 py-0.5 rounded-lg line-clamp-2">
                          Nota: "{item.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-neutral-200/50">
                      <span className="font-black text-neutral-900 text-sm sm:text-base">
                        ${item.subtotal.toLocaleString('es-CL')}
                      </span>

                      {/* Touch-comfortable +/- controls */}
                      <div className="flex items-center gap-1.5 bg-white border border-neutral-300 rounded-full p-0.5 shadow-2xs">
                        <button
                          onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-600 hover:text-pedidosya-red hover:bg-neutral-100 active:scale-90 transition"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-neutral-900 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-600 hover:text-pedidosya-red hover:bg-neutral-100 active:scale-90 transition"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-white space-y-3 shrink-0 pb-6 sm:pb-5">
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal productos</span>
                  <span className="font-bold text-neutral-800">${cartTotal.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-600">
                  <span className="flex items-center gap-1">
                    <span>Cargo por reserva</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.2 rounded">GRATIS</span>
                  </span>
                  <span className="font-bold">$0</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-black text-neutral-900 pt-2 border-t border-neutral-100">
                  <span>Total a pagar</span>
                  <span className="text-pedidosya-red">${cartTotal.toLocaleString('es-CL')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-pedidosya-red hover:bg-pedidosya-darkRed active:scale-[0.98] text-white py-3.5 sm:py-4 px-4 rounded-2xl font-black text-sm sm:text-base shadow-lg shadow-pedidosya-red/30 flex items-center justify-center gap-2 transition"
              >
                <span>Programar Horario y Reservar</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
