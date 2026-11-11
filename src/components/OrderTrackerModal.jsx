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
    { key: 'recibido', label: 'Reserva Recibida', desc: 'Enviado al quiosco', icon: Clock },
    { key: 'preparando', label: 'En Preparación', desc: 'Cocinando y empaquetando', icon: ChefHat },
    { key: 'listo', label: '¡Listo para Retirar!', desc: 'Acércate al mesón', icon: PackageCheck },
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh] sm:h-auto sm:max-h-[92vh] border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-pedidosya-pucv text-white p-4 sm:p-6 relative shrink-0">
          <button
            onClick={() => setTrackingOrder(null)}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition"
            aria-label="Cerrar ticket"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="bg-pedidosya-pucvGold text-neutral-900 font-black text-[10px] px-2 py-0.5 rounded">
              TICKET DE RETIRO
            </span>
            <span className="text-xs text-white/70">EatPUCV</span>
          </div>

          <div className="flex items-baseline justify-between mt-1 gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {trackingOrder.id}
            </h2>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full text-white shrink-0">
              {trackingOrder.pickupTimeStr || 'Horario programado'}
            </span>
          </div>

          <p className="text-xs text-neutral-300 mt-1 truncate">
            Mostrador: <strong>{trackingOrder.kioskName}</strong>
          </p>
        </div>

        {/* Status Callout Banner */}
        <div className={`p-3 sm:p-4 text-center text-xs font-bold shrink-0 ${
          trackingOrder.status === 'listo' 
            ? 'bg-emerald-500 text-white animate-pulse'
            : trackingOrder.status === 'preparando'
            ? 'bg-amber-100 text-amber-900'
            : trackingOrder.status === 'entregado'
            ? 'bg-blue-600 text-white'
            : 'bg-neutral-100 text-neutral-800'
        }`}>
          {trackingOrder.status === 'recibido' && '⏳ Tu orden fue recibida por el quiosco y está en cola de preparación.'}
          {trackingOrder.status === 'preparando' && '👨‍🍳 ¡El quiosco está preparando tu comida con ingredientes frescos!'}
          {trackingOrder.status === 'listo' && '🎉 ¡TU PEDIDO YA ESTÁ LISTO! Acércate al mesón para retirar.'}
          {trackingOrder.status === 'entregado' && '✅ Pedido retirado exitosamente. ¡Gracias por usar EatPUCV!'}
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
          
          {/* Progress Tracker Stepper */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
              Estado de la Reserva
            </h4>
            
            <div className="relative pl-6 space-y-5 sm:space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                const Icon = st.icon;

                return (
                  <div key={st.key} className="relative flex items-start gap-3">
                    <div 
                      className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-pedidosya-red text-white ring-4 ring-pedidosya-red/20 scale-110'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-neutral-200 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                    </div>

                    <div>
                      <h5 className={`text-xs font-bold ${isCurrent ? 'text-pedidosya-red text-sm font-black' : isPassed ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {st.label}
                      </h5>
                      <p className="text-[11px] text-neutral-500">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QR Code / Pickup Card */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3">
            <div className="min-w-0 pr-1">
              <p className="text-[10px] uppercase font-bold text-neutral-400">Punto de retiro:</p>
              <h4 className="text-sm font-extrabold text-neutral-900 truncate">{trackingOrder.kioskName}</h4>
              <p className="text-xs text-neutral-600 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-pedidosya-red shrink-0" />
                <span className="truncate">{trackingOrder.locationDetails || trackingOrder.campusName}</span>
              </p>
              <p className="text-[11px] text-neutral-500 mt-1 truncate">
                Cliente: <strong>{trackingOrder.customerName}</strong>
              </p>
            </div>

            {/* QR Mockup */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 bg-white border border-neutral-300 rounded-xl p-1.5 flex flex-col items-center justify-center shadow-2xs shrink-0">
              <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-800" />
              <span className="text-[9px] font-mono font-bold text-neutral-600">{trackingOrder.id}</span>
            </div>
          </div>

          {/* Reserved Items */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-2">
              Productos Reservados ({trackingOrder.items.length})
            </h4>
            <div className="space-y-2 bg-neutral-50/50 p-3 rounded-2xl border border-neutral-200/80">
              {trackingOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-neutral-200/50 last:border-none gap-2">
                  <div className="truncate">
                    <span className="font-bold text-neutral-900">{item.quantity}x {item.name}</span>
                    {item.notes && (
                      <p className="text-[10px] text-neutral-500 italic truncate">"{item.notes}"</p>
                    )}
                  </div>
                  <span className="font-bold text-neutral-800 shrink-0">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 text-xs sm:text-sm font-black text-neutral-900 border-t border-neutral-200">
                <span>Total pagado ({trackingOrder.paymentMethod})</span>
                <span className="text-pedidosya-red">${trackingOrder.total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>

          {/* Demo control to advance status */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold block">Simulación de Estado:</span>
              <span className="text-[11px] text-blue-700">Cambia el estado para probar la experiencia en vivo.</span>
            </div>
            {trackingOrder.status !== 'entregado' && (
              <button
                onClick={() => {
                  const nextStatus = 
                    trackingOrder.status === 'recibido' ? 'preparando' :
                    trackingOrder.status === 'preparando' ? 'listo' : 'entregado';
                  updateOrderStatus(trackingOrder.id, nextStatus);
                }}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg text-xs self-start sm:self-auto shrink-0 shadow-2xs"
              >
                Avanzar estado ➜
              </button>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end shrink-0 pb-6 sm:pb-4">
          <button
            onClick={() => setTrackingOrder(null)}
            className="w-full bg-neutral-900 hover:bg-black active:scale-[0.99] text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition"
          >
            Entendido, volver a la aplicación
          </button>
        </div>

      </div>
    </div>
  );
}
