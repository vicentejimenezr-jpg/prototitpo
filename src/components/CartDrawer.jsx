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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-pedidosya-red" />
              <h2 className="text-base sm:text-lg font-black text-neutral-900">Tu Reserva</h2>
              <span className="bg-pedidosya-lightRed text-pedidosya-red text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItemCount} {cartItemCount === 1 ? 'producto' : 'productos'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Kiosk origin banner if cart has items */}
          {firstItem && (
            <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-800">{firstItem.kioskName}</p>
                <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-pedidosya-red" />
                  <span>{firstItem.campusName}</span>
                </p>
              </div>
              <button
                onClick={clearCart}
                className="text-[11px] text-neutral-500 hover:text-pedidosya-red underline"
              >
                Vaciar
              </button>
            </div>
          )}

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-neutral-300" />
                </div>
                <h3 className="font-bold text-neutral-800 text-base mb-1">Tu canasta de reserva está vacía</h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Explora los quioscos de la PUCV, elige tus comidas favoritas y resérvalas para retirar sin filas.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200/80 flex gap-3 relative"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-neutral-900 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-neutral-400 hover:text-pedidosya-red p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected options */}
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.values(item.selectedOptions).map((opt, i) => (
                            <span key={i} className="text-[10px] bg-white border border-neutral-200 px-1.5 py-0.5 rounded text-neutral-600">
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <p className="text-[11px] text-amber-700 italic mt-1 bg-amber-50 px-1.5 py-0.5 rounded">
                          Nota: "{item.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      <span className="font-extrabold text-neutral-900 text-sm">
                        ${item.subtotal.toLocaleString('es-CL')}
                      </span>

                      <div className="flex items-center gap-2 bg-white border border-neutral-300 rounded-full px-2 py-0.5 shadow-sm">
                        <button
                          onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity - 1)}
                          className="text-neutral-500 hover:text-pedidosya-red"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-neutral-800 w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity + 1)}
                          className="text-neutral-500 hover:text-pedidosya-red"
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
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal productos</span>
                  <span className="font-semibold text-neutral-800">${cartTotal.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-600">
                  <span className="flex items-center gap-1">
                    <span>Cargo por reserva online</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1 rounded">PUCV FREE</span>
                  </span>
                  <span className="font-bold">$0</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-100">
                  <span>Total estimado</span>
                  <span className="text-pedidosya-red">${cartTotal.toLocaleString('es-CL')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-pedidosya-red hover:bg-pedidosya-darkRed text-white py-3.5 px-4 rounded-2xl font-black text-sm shadow-lg shadow-pedidosya-red/30 flex items-center justify-center gap-2 transition"
              >
                <span>Programar Horario y Reservar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
