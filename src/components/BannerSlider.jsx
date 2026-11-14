import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Clock, CreditCard, ChevronRight, ChevronLeft, Hand } from 'lucide-react';

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
    title: 'Marraquetas Porteñas y Comida Lenta',
    subtitle: 'Churrascos a la plancha, sándwiches mechada y café de grano en los patios de la PUCV.',
    tag: 'Sabor Universitario',
    bgColor: 'from-amber-600 to-orange-700',
    icon: Sparkles,
    badgeColor: 'bg-white text-orange-700'
  }
];

export default function BannerSlider() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const startXRef = useRef(0);
  const currentOffsetRef = useRef(0);

  // Auto rotation timer (pauses when user is dragging or touching)
  useEffect(() => {
    if (isPaused || isDragging) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % BANNERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, isDragging]);

  // Touch and Drag Gesture Handlers
  const handleDragStart = (clientX) => {
    setIsDragging(true);
    setIsPaused(true);
    startXRef.current = clientX;
    currentOffsetRef.current = 0;
    setDragOffset(0);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;
    const diff = clientX - startXRef.current;
    // Limit max drag distance to prevent over-stretching
    const boundedDiff = Math.max(-180, Math.min(180, diff));
    currentOffsetRef.current = boundedDiff;
    setDragOffset(boundedDiff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const diff = currentOffsetRef.current;
    const threshold = 35; // Pixels needed to switch slide on mobile

    if (diff < -threshold) {
      // Dragged left -> Next slide
      setCurrentIdx(prev => (prev + 1) % BANNERS.length);
    } else if (diff > threshold) {
      // Dragged right -> Previous slide
      setCurrentIdx(prev => (prev - 1 + BANNERS.length) % BANNERS.length);
    }

    setIsDragging(false);
    setDragOffset(0);
    currentOffsetRef.current = 0;
    // Resume auto-rotation after 2 seconds
    setTimeout(() => setIsPaused(false), 2000);
  };

  const banner = BANNERS[currentIdx];
  const Icon = banner.icon;

  return (
    <div 
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-md text-white my-3 sm:my-6 select-none touch-pan-y cursor-grab active:cursor-grabbing"
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <div 
        style={{ 
          transform: `translateX(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
        className={`p-3.5 sm:p-6 md:p-8 bg-gradient-to-r ${banner.bgColor} min-h-[135px] sm:min-h-[160px] flex flex-col justify-between transition-colors duration-500`}
      >
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="max-w-2xl min-w-0 pr-1">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wide uppercase ${banner.badgeColor} shadow-2xs`}>
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {banner.tag}
              </span>
              
              {/* Mobile swipe helper tag */}
              <span className="sm:hidden text-[9px] font-bold text-white/70 bg-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>Desliza ⟷</span>
              </span>
            </div>

            <h2 className="text-sm sm:text-xl md:text-2xl font-black tracking-tight leading-tight mb-1 sm:mb-1.5 text-white">
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

        {/* Carousel indicators & navigation buttons */}
        <div className="flex items-center justify-between pt-2.5 sm:pt-4 mt-2 border-t border-white/15">
          <div className="flex items-center gap-1.5">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrentIdx(idx); }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIdx ? 'w-5 sm:w-6 bg-white' : 'w-2 bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setCurrentIdx(prev => (prev - 1 + BANNERS.length) % BANNERS.length); }}
              className="p-1 sm:p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition active:scale-95"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setCurrentIdx(prev => (prev + 1) % BANNERS.length); }}
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
