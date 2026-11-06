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
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-44 w-full bg-neutral-900 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          <button
            onClick={() => setActiveCustomizingProduct(null)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[10px] uppercase font-bold bg-pedidosya-red px-2 py-0.5 rounded">
              {kiosk.name}
            </span>
            <h3 className="text-xl font-black mt-1 leading-tight">{product.name}</h3>
            <p className="text-sm font-bold text-amber-300">${product.price.toLocaleString('es-CL')}</p>
          </div>
        </div>

        {/* Scrollable customization options */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <p className="text-xs text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {/* Option groups */}
          {optionGroups.map(([groupKey, options]) => (
            <div key={groupKey} className="border-t border-neutral-100 pt-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 mb-2">
                Selecciona tu {groupKey === 'bread' ? 'Tipo de Pan' :
                               groupKey === 'extras' ? 'Aderezos / Extras' :
                               groupKey === 'milk' ? 'Tipo de Leche' :
                               groupKey === 'drinks' ? 'Bebida para acompañar' :
                               groupKey === 'sweetener' ? 'Endulzante' :
                               groupKey === 'sauces' ? 'Salsas' : groupKey}
              </h4>
              <div className="space-y-1.5">
                {options.map((opt, i) => {
                  const isSelected = selectedOptions[groupKey] === opt;
                  return (
                    <label
                      key={i}
                      onClick={() => handleOptionChange(groupKey, opt)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs font-semibold transition ${
                        isSelected
                          ? 'border-pedidosya-red bg-pedidosya-lightRed text-pedidosya-red font-bold'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-pedidosya-red bg-pedidosya-red text-white' : 'border-neutral-300'}`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Notes for Kiosk */}
          <div className="border-t border-neutral-100 pt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 mb-1.5">
              Instrucciones especiales para el quiosco
            </h4>
            <textarea
              rows={2}
              placeholder="Ej: Sin mayonesa, servilletas extra, café bien caliente..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:border-pedidosya-red outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer with quantity & add */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-full px-3 py-1.5 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-neutral-500 hover:text-pedidosya-red"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-extrabold text-neutral-800 w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-neutral-500 hover:text-pedidosya-red"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 bg-pedidosya-red hover:bg-pedidosya-darkRed text-white py-3 px-4 rounded-full font-bold text-sm shadow-lg shadow-pedidosya-red/30 flex items-center justify-center gap-2 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Agregar ${(product.price * quantity).toLocaleString('es-CL')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
