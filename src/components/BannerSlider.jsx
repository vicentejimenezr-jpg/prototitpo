import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    title: '¡No hagas más filas en el recreo ni almuerzo!',
    subtitle: 'Programa la hora de retiro de tu pedido y retira en el mostrador mostrando tu código.',
    tag: 'Reserva Anticipada',
    bgColor: 'from-pedidosya-red to-rose-600',
    icon: Clock,
    badgeColor: 'bg-white text-pedidosya-red'
  },
  {
    id: 2,
    title: 'Paga con tu Beca JUNAEB BAES',
    subtitle: 'Aceptamos Sodexo Pluxee y Ticket Edenred en quioscos oficiales de Casa Central, Sausalito, IBC y Curauma.',
    tag: 'JUNAEB BAES',
    bgColor: 'from-blue-700 to-pedidosya-pucv',
    icon: CreditCard,
    badgeColor: 'bg-pedidosya-pucvGold text-neutral-900'
  },
  {
    id: 3,
    title: 'Marraquetas Porteñas y Café de Grano',
    subtitle: 'Sándwiches mechada, completos gigantes y café recién tostado en los patios de la PUCV.',
    tag: 'Sabor Universitario',
    bgColor: 'from-amber-600 to-orange-700',
    icon: Sparkles,
    badgeColor: 'bg-white text-orange-700'
  }
];

export default function BannerSlider() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[currentIdx];
  const Icon = banner.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r shadow-md text-white my-4 sm:my-6">
      <div className={`p-4 sm:p-6 md:p-8 bg-gradient-to-r ${banner.bgColor} transition-all duration-700 min-h-[140px] sm:min-h-[160px] flex flex-col justify-between`}>
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="max-w-2xl">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wide uppercase mb-2 ${banner.badgeColor} shadow-sm`}>
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {banner.tag}
            </span>
            <h2 className="text-base sm:text-xl md:text-2xl font-black tracking-tight leading-tight mb-1 sm:mb-1.5 text-white">
              {banner.title}
            </h2>
            <p className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
              {banner.subtitle}
            </p>
          </div>

          <div className="hidden sm:flex shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md items-center justify-center border border-white/20">
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
        </div>

        {/* Carousel indicators & buttons */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 mt-2 border-t border-white/15">
          <div className="flex items-center gap-1.5">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIdx ? 'w-5 sm:w-6 bg-white' : 'w-2 bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentIdx(prev => (prev - 1 + BANNERS.length) % BANNERS.length)}
              className="p-1 sm:p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition active:scale-95"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setCurrentIdx(prev => (prev + 1) % BANNERS.length)}
              className="p-1 sm:p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition active:scale-95"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
