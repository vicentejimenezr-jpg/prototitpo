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
    <div className="space-y-4 mb-6">
      {/* Category Pills (horizontal scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FOOD_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                isSelected
                  ? 'bg-pedidosya-red text-white shadow-pedidosya-red/25 shadow-md scale-102'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Quick filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilterOnlyOpen(!filterOnlyOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
            filterOnlyOpen
              ? 'bg-emerald-50 text-emerald-700 border-emerald-400'
              : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filterOnlyOpen ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
          <span>Abiertos ahora</span>
          {filterOnlyOpen && <Check className="w-3 h-3 text-emerald-600" />}
        </button>

        <button
          onClick={() => setFilterAcceptsJunaeb(!filterAcceptsJunaeb)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
            filterAcceptsJunaeb
              ? 'bg-blue-50 text-blue-700 border-blue-400'
              : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <CreditCard className="w-3 h-3 text-blue-600" />
          <span>Acepta JUNAEB (Sodexo / Edenred)</span>
          {filterAcceptsJunaeb && <Check className="w-3 h-3 text-blue-600" />}
        </button>
      </div>
    </div>
  );
}
