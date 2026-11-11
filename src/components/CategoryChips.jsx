import React from 'react';
import { useApp } from '../context/AppContext';
import { FOOD_CATEGORIES } from '../data/mockData';
import { Check, Flame, Clock, CreditCard } from 'lucide-react';

export default function CategoryChips() {
  const { 
    selectedCategory, 
    setSelectedCategory,
    filterOnlyOpen,
    setFilterOnlyOpen,
    filterAcceptsJunaeb,
    setFilterAcceptsJunaeb
  } = useApp();

  return (
    <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
      {/* Category Pills (Edge-to-edge scroll on mobile) */}
      <div className="relative -mx-3.5 px-3.5 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
          {FOOD_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 shrink-0 ${
                  isSelected
                    ? 'bg-pedidosya-red text-white shadow-pedidosya-red/25 shadow-md scale-102'
                    : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/90'
                }`}
              >
                <span className="text-base sm:text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilterOnlyOpen(!filterOnlyOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition shadow-2xs active:scale-95 ${
            filterOnlyOpen
              ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
              : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filterOnlyOpen ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
          <span>Abiertos ahora</span>
          {filterOnlyOpen && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
        </button>

        <button
          onClick={() => setFilterAcceptsJunaeb(!filterAcceptsJunaeb)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition shadow-2xs active:scale-95 ${
            filterAcceptsJunaeb
              ? 'bg-blue-50 text-blue-800 border-blue-400'
              : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <CreditCard className="w-3 h-3 text-blue-600" />
          <span>Acepta JUNAEB</span>
          {filterAcceptsJunaeb && <Check className="w-3 h-3 text-blue-600 stroke-[3]" />}
        </button>
      </div>
    </div>
  );
}
