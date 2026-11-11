import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Minus, ShoppingBag, Check } from 'lucide-react';

export default function ProductCustomizerModal() {
  const { 
    activeCustomizingProduct, 
    setActiveCustomizingProduct, 
    addToCart 
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [notes, setNotes] = useState('');

  if (!activeCustomizingProduct) return null;

  const { product, kiosk } = activeCustomizingProduct;

  const handleOptionChange = (groupKey, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupKey]: value
    }));
  };

  const handleAdd = () => {
    addToCart(product, kiosk, quantity, selectedOptions, notes);
    setActiveCustomizingProduct(null);
  };

  const optionGroups = product.options ? Object.entries(product.options) : [];

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-36 sm:h-44 w-full bg-neutral-900 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          
          <button
            onClick={() => setActiveCustomizingProduct(null)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 active:scale-90 text-white flex items-center justify-center hover:bg-black/80 transition"
            aria-label="Cerrar personalizador"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[10px] uppercase font-black bg-pedidosya-red px-2 py-0.5 rounded shadow-sm">
              {kiosk.name}
            </span>
            <h3 className="text-lg sm:text-xl font-black mt-1 leading-tight truncate">{product.name}</h3>
            <p className="text-sm sm:text-base font-extrabold text-amber-300">${product.price.toLocaleString('es-CL')}</p>
          </div>
        </div>

        {/* Scrollable customization options */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5">
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {/* Option groups */}
          {optionGroups.map(([groupKey, options]) => (
            <div key={groupKey} className="border-t border-neutral-100 pt-3.5 sm:pt-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 mb-2">
                Selecciona tu {groupKey === 'bread' ? 'Tipo de Pan' :
                               groupKey === 'extras' ? 'Aderezos / Extras' :
                               groupKey === 'milk' ? 'Tipo de Leche' :
                               groupKey === 'drinks' ? 'Bebida para acompañar' :
                               groupKey === 'sweetener' ? 'Endulzante' :
                               groupKey === 'sauces' ? 'Salsas' : groupKey}
              </h4>
              <div className="space-y-2">
                {options.map((opt, i) => {
                  const isSelected = selectedOptions[groupKey] === opt;
                  return (
                    <label
                      key={i}
                      onClick={() => handleOptionChange(groupKey, opt)}
                      className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border cursor-pointer text-xs sm:text-sm font-semibold transition active:scale-[0.99] min-h-[44px] ${
                        isSelected
                          ? 'border-pedidosya-red bg-pedidosya-lightRed text-pedidosya-red font-bold shadow-2xs'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-pedidosya-red bg-pedidosya-red text-white' : 'border-neutral-300'}`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Notes for Kiosk */}
          <div className="border-t border-neutral-100 pt-3.5 sm:pt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 mb-1.5">
              Instrucciones especiales para el quiosco
            </h4>
            <textarea
              rows={2}
              placeholder="Ej: Sin mayonesa, servilletas extra, café bien caliente..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-sm sm:text-xs p-3 rounded-xl border border-neutral-200 focus:border-pedidosya-red outline-none resize-none transition"
            />
          </div>
        </div>

        {/* Footer with quantity & add */}
        <div className="p-3.5 sm:p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-3 shrink-0 pb-6 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3 bg-white border border-neutral-200 rounded-full px-2.5 sm:px-3 py-1 shadow-2xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-pedidosya-red active:scale-90 transition"
              aria-label="Menos"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-black text-neutral-800 w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-pedidosya-red active:scale-90 transition"
              aria-label="Más"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 bg-pedidosya-red hover:bg-pedidosya-darkRed active:scale-[0.98] text-white py-3 sm:py-3.5 px-4 rounded-full font-black text-xs sm:text-sm shadow-lg shadow-pedidosya-red/30 flex items-center justify-center gap-2 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Agregar ${(product.price * quantity).toLocaleString('es-CL')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
