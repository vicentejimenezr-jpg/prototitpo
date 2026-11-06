import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  QrCode, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight,
  Flame,
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-pedidosya-pucv text-white p-5 sm:p-6 relative">
          <button
            onClick={() => setTrackingOrder(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="bg-pedidosya-pucvGold text-neutral-900 font-black text-[10px] px-2 py-0.5 rounded">
              TICKET DE RETIRO
            </span>
            <span className="text-xs text-white/70">PUCV Ya!</span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {trackingOrder.id}
            </h2>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full text-white">
              {trackingOrder.pickupTimeStr || 'Horario programado'}
            </span>
          </div>

          <p className="text-xs text-neutral-300 mt-1">
            Muestra este código en el mostrador de <strong>{trackingOrder.kioskName}</strong>
          </p>
        </div>

        {/* Status Callout Banner */}
        <div className={`p-4 text-center text-xs font-bold ${
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
          {trackingOrder.status === 'entregado' && '✅ Pedido retirado exitosamente. ¡Gracias por usar PUCV Ya!'}
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Progress Tracker Stepper */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400">
              Estado de la Reserva
            </h4>
            
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
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
                      <h5 className={`text-xs font-bold ${isCurrent ? 'text-pedidosya-red text-sm' : isPassed ? 'text-neutral-900' : 'text-neutral-400'}`}>
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
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Punto de retiro:</p>
              <h4 className="text-sm font-extrabold text-neutral-900">{trackingOrder.kioskName}</h4>
              <p className="text-xs text-neutral-600 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-pedidosya-red shrink-0" />
                <span>{trackingOrder.locationDetails || trackingOrder.campusName}</span>
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                Cliente: <strong>{trackingOrder.customerName}</strong>
              </p>
            </div>

            {/* QR Mockup */}
            <div className="w-20 h-20 bg-white border border-neutral-300 rounded-xl p-1.5 flex flex-col items-center justify-center shadow-sm shrink-0">
              <QrCode className="w-12 h-12 text-neutral-800" />
              <span className="text-[9px] font-mono font-bold text-neutral-600">{trackingOrder.id}</span>
            </div>
          </div>

          {/* Reserved Items */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-2">
              Productos Reservados ({trackingOrder.items.length})
            </h4>
            <div className="space-y-2">
              {trackingOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-neutral-100">
                  <div>
                    <span className="font-bold text-neutral-900">{item.quantity}x {item.name}</span>
                    {item.notes && (
                      <p className="text-[11px] text-neutral-500 italic">"{item.notes}"</p>
                    )}
                  </div>
                  <span className="font-bold text-neutral-800">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 text-sm font-black text-neutral-900">
                <span>Total pagado ({trackingOrder.paymentMethod})</span>
                <span className="text-pedidosya-red">${trackingOrder.total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>

          {/* Demo control to advance status */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 flex items-center justify-between">
            <div>
              <span className="font-bold block">Simulación de Estado:</span>
              <span className="text-[11px]">Cambia el estado para probar la experiencia en vivo.</span>
            </div>
            {trackingOrder.status !== 'entregado' && (
              <button
                onClick={() => {
                  const nextStatus = 
                    trackingOrder.status === 'recibido' ? 'preparando' :
                    trackingOrder.status === 'preparando' ? 'listo' : 'entregado';
                  updateOrderStatus(trackingOrder.id, nextStatus);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
              >
                Avanzar estado ➜
              </button>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end">
          <button
            onClick={() => setTrackingOrder(null)}
            className="w-full bg-neutral-900 hover:bg-black text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl transition"
          >
            Entendido, volver a la aplicación
          </button>
        </div>

      </div>
    </div>
  );
}
