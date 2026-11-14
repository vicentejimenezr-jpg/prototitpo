import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  QrCode, 
  ChefHat, 
  PackageCheck 
} from 'lucide-react';

export default function OrderTrackerModal() {
  const { trackingOrder, setTrackingOrder, updateOrderStatus } = useApp();

  if (!trackingOrder) return null;

  const steps = [
    { key: 'recibido', label: 'Recibido', desc: 'En cola', icon: Clock },
    { key: 'preparando', label: 'En Cocina', desc: 'Preparando', icon: ChefHat },
    { key: 'listo', label: '¡Listo!', desc: 'Retirar en mesón', icon: PackageCheck },
    { key: 'entregado', label: 'Entregado', desc: '¡Buen provecho!', icon: CheckCircle2 }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'recibido': return 0;
      case 'preparando': return 1;
      case 'listo': return 2;
      case 'entregado': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(trackingOrder.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white w-full max-w-sm sm:max-w-md md:max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] sm:max-h-[86vh] border border-neutral-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Compact Header */}
        <div className="bg-pedidosya-pucv text-white p-3.5 sm:p-4 relative shrink-0 shadow-xs">
          <button
            onClick={() => setTrackingOrder(null)}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition"
            aria-label="Cerrar ticket"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="bg-pedidosya-pucvGold text-neutral-900 font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
              TICKET DE RETIRO
            </span>
            <span className="text-[11px] text-white/70">EatPUCV</span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {trackingOrder.id}
            </h2>
            <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-white shrink-0">
              {trackingOrder.pickupTimeStr || 'Horario programado'}
            </span>
          </div>

          <p className="text-[11px] text-neutral-300 mt-0.5 truncate">
            Mesón: <strong>{trackingOrder.kioskName}</strong>
          </p>
        </div>

        {/* Status Callout Banner */}
        <div className={`px-3 py-1.5 sm:py-2 text-center text-[11px] sm:text-xs font-bold shrink-0 ${
          trackingOrder.status === 'listo' 
            ? 'bg-emerald-500 text-white animate-pulse'
            : trackingOrder.status === 'preparando'
            ? 'bg-amber-100 text-amber-900'
            : trackingOrder.status === 'entregado'
            ? 'bg-neutral-800 text-white'
            : 'bg-neutral-100 text-neutral-800'
        }`}>
          {trackingOrder.status === 'recibido' && '⏳ Tu orden fue recibida por el quiosco.'}
          {trackingOrder.status === 'preparando' && '👨‍🍳 ¡Cocinando tu comida con ingredientes frescos!'}
          {trackingOrder.status === 'listo' && '🎉 ¡TU PEDIDO YA ESTÁ LISTO! Acércate al mesón.'}
          {trackingOrder.status === 'entregado' && '✅ Pedido retirado. ¡Buen provecho!'}
        </div>

        {/* Scrollable Body Content */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-3 flex-1 scrollbar-thin">
          
          {/* Progress Tracker Stepper (Horizontal & Compact) */}
          <div className="bg-neutral-50 p-2.5 sm:p-3 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 mb-2">
              <span className="uppercase tracking-wider">Progreso del Pedido</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                trackingOrder.status === 'listo' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-800'
              }`}>
                {trackingOrder.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 items-center relative">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                const Icon = st.icon;

                return (
                  <div key={st.key} className="flex flex-col items-center text-center">
                    <div 
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-pedidosya-red text-white ring-2 ring-pedidosya-red/30 scale-105 shadow-2xs'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-neutral-200 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>

                    <span className={`text-[9px] sm:text-[10px] mt-1 font-bold leading-tight line-clamp-1 ${
                      isCurrent ? 'text-pedidosya-red font-black' : isPassed ? 'text-neutral-900' : 'text-neutral-400'
                    }`}>
                      {st.label}
                    </span>
                    <span className="text-[8px] text-neutral-400 hidden sm:block truncate">
                      {st.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QR Code / Mesón de Retiro Card */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-2.5">
            <div className="min-w-0 pr-1 text-xs">
              <p className="text-[9px] uppercase font-bold text-neutral-400">Punto de entrega:</p>
              <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900 truncate">{trackingOrder.kioskName}</h4>
              <p className="text-[11px] text-neutral-600 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-pedidosya-red shrink-0" />
                <span className="truncate">{trackingOrder.locationDetails || trackingOrder.campusName}</span>
              </p>
              <p className="text-[10px] text-neutral-500 mt-0.5 truncate">
                Alumno: <strong>{trackingOrder.customerName}</strong>
              </p>
            </div>

            {/* Compact QR Mockup */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white border border-neutral-300 rounded-xl p-1 flex flex-col items-center justify-center shadow-2xs shrink-0">
              <QrCode className="w-8 h-8 sm:w-9 sm:h-9 text-neutral-800" />
              <span className="text-[8px] font-mono font-black text-neutral-600">{trackingOrder.id}</span>
            </div>
          </div>

          {/* Reserved Items */}
          <div className="bg-neutral-50/70 p-2.5 sm:p-3 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-neutral-400 mb-1.5">
              <span>Detalle de Productos</span>
              <span>{(trackingOrder.items || []).length} items</span>
            </div>

            <div className="space-y-1">
              {(trackingOrder.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-0.5 border-b border-neutral-200/40 last:border-none gap-2">
                  <div className="truncate min-w-0">
                    <span className="font-bold text-neutral-900">{item.quantity || 1}x {item.name || 'Producto'}</span>
                    {item.notes && (
                      <p className="text-[9px] text-neutral-500 italic truncate">"{item.notes}"</p>
                    )}
                  </div>
                  <span className="font-bold text-neutral-800 shrink-0 text-xs">
                    ${((item.price || 0) * (item.quantity || 1)).toLocaleString('es-CL')}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-1.5 mt-1 text-xs font-black text-neutral-900 border-t border-neutral-200">
              <span className="text-neutral-600 font-bold">{trackingOrder.paymentMethod || 'Efectivo'}</span>
              <span className="text-pedidosya-red text-sm">
                ${(trackingOrder.total || 0).toLocaleString('es-CL')}
              </span>
            </div>
          </div>

          {/* Demo control to advance status */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-2 sm:p-2.5 text-[11px] text-blue-900 flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] text-blue-800 font-medium truncate">
              Simulación: Probar cambio de estado en vivo
            </span>
            {trackingOrder.status !== 'entregado' && (
              <button
                type="button"
                onClick={() => {
                  const nextStatus = 
                    trackingOrder.status === 'recibido' ? 'preparando' :
                    trackingOrder.status === 'preparando' ? 'listo' : 'entregado';
                  updateOrderStatus(trackingOrder.id, nextStatus);
                }}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] sm:text-xs shrink-0 shadow-2xs"
              >
                Avanzar ➜
              </button>
            )}
          </div>

        </div>

        {/* Compact Footer */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-200 shrink-0">
          <button
            type="button"
            onClick={() => setTrackingOrder(null)}
            className="w-full bg-neutral-900 hover:bg-black active:scale-[0.99] text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl transition shadow-sm"
          >
            Entendido, volver a la aplicación
          </button>
        </div>

      </div>
    </div>
  );
}
