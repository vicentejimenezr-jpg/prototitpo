import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PICKUP_TIME_OPTIONS, PAYMENT_METHODS } from '../data/mockData';
import { 
  X, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';

export default function ReservationModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart = [], 
    cartTotal = 0, 
    createReservation,
    kiosks = [],
    getKioskActiveAsapOrders,
    getCurrentTime,
    setSimulatedTime
  } = useApp();

  const [selectedTimeOption, setSelectedTimeOption] = useState('recreo-1');
  const [customTime, setCustomTime] = useState(() => {
    const d = new Date(Date.now() + 30 * 60 * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [customerName, setCustomerName] = useState('Vicente Morales');
  const [customerEmail, setCustomerEmail] = useState('vicente.morales@pucv.cl');
  const [customerPhone, setCustomerPhone] = useState('+56 9 8765 4321');
  const [selectedPayment, setSelectedPayment] = useState('junaeb_sodexo');
  const [orderNote, setOrderNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const firstItem = (cart && cart.length > 0) ? cart[0] : {};
  const currentKiosk = (kiosks && kiosks.find(k => k && k.id === firstItem?.kioskId)) || (kiosks && kiosks[0]) || {};

  // 1. Check if cart has "Comida Lenta" (churrascos, mechada, a la plancha, etc.)
  const hasSlowFood = cart.some(item => item && (item.isSlowFood || item.category === 'comida_lenta'));
  const slowFoodItems = cart.filter(item => item && (item.isSlowFood || item.category === 'comida_lenta'));

  // 2. Kiosk ASAP capacity setting (configured from 1 to 15 in Kiosk Mode)
  const maxAsapOrders = currentKiosk?.maxAsapOrders || 5;
  const allowAsapPickup = currentKiosk?.allowAsapPickup ?? true;
  const activeAsapOrdersCount = (firstItem?.kioskId && typeof getKioskActiveAsapOrders === 'function') 
    ? getKioskActiveAsapOrders(firstItem.kioskId) 
    : 0;
  const isAsapFull = activeAsapOrdersCount >= maxAsapOrders;

  // 3. Current system time & minutes from midnight
  const now = new Date();
  const defaultTime = {
    hour: now.getHours(),
    minute: now.getMinutes(),
    timeStr: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    isSimulated: false
  };

  const currentTime = (typeof getCurrentTime === 'function' ? getCurrentTime() : null) || defaultTime;
  const currentTotalMinutes = (currentTime?.hour ?? now.getHours()) * 60 + (currentTime?.minute ?? now.getMinutes());

  // Evaluate each time slot for availability based on time, slow food, and kiosk capacity
  const evaluatedSlots = (PICKUP_TIME_OPTIONS || []).map(slot => {
    let isDisabled = false;
    let reason = '';

    if (slot.isAsap) {
      if (hasSlowFood) {
        isDisabled = true;
        reason = 'No disponible para comida lenta (cocción 20+ min)';
      } else if (!allowAsapPickup) {
        isDisabled = true;
        reason = 'Pausado temporalmente por el quiosco';
      } else if (isAsapFull) {
        isDisabled = true;
        reason = `Cupos llenos en cocina (${activeAsapOrdersCount}/${maxAsapOrders})`;
      }
    } else if (slot.targetHour !== undefined) {
      const slotTotalMinutes = slot.targetHour * 60 + slot.targetMinute;
      // If current time is equal or past the slot time, it is disabled!
      if (currentTotalMinutes >= slotTotalMinutes) {
        isDisabled = true;
        reason = `Horario pasado (${slot.timeStr || ''})`;
      }
    }

    return {
      ...slot,
      isDisabled,
      reason
    };
  });

  // Ensure selected option is not a disabled option & customTime is upcoming
  useEffect(() => {
    if (!isCheckoutOpen) return;
    const currentSlotObj = evaluatedSlots.find(s => s.id === selectedTimeOption);
    if (!currentSlotObj || currentSlotObj.isDisabled) {
      // Pick first upcoming valid slot or fallback to custom
      const firstAvailable = evaluatedSlots.find(s => !s.isDisabled && s.id !== 'custom');
      if (firstAvailable) {
        setSelectedTimeOption(firstAvailable.id);
      } else {
        setSelectedTimeOption('custom');
      }
    }

    // Auto-adjust customTime if current custom time has passed
    const [cH, cM] = (customTime || '').split(':').map(Number);
    const customMin = (cH || 0) * 60 + (cM || 0);
    if (customMin <= currentTotalMinutes) {
      const targetMin = currentTotalMinutes + (hasSlowFood ? 30 : 20);
      const h = Math.floor((targetMin / 60) % 24);
      const m = targetMin % 60;
      setCustomTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }, [isCheckoutOpen, selectedTimeOption, currentTotalMinutes, hasSlowFood, allowAsapPickup, isAsapFull]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Por favor completa tus datos de contacto para avisarte cuando tu pedido esté listo.');
      return;
    }

    const timeObj = evaluatedSlots.find(t => t.id === selectedTimeOption);
    if (timeObj?.isDisabled) {
      setErrorMessage('El horario seleccionado no está disponible. Por favor elige un horario posterior.');
      return;
    }

    if (selectedTimeOption === 'custom') {
      const [cH, cM] = (customTime || '13:30').split(':').map(Number);
      const customMin = (cH || 0) * 60 + (cM || 0);
      const minRequired = currentTotalMinutes + (hasSlowFood ? 25 : 10);
      if (customMin <= currentTotalMinutes) {
        setErrorMessage(`La hora personalizada (${customTime}) ya pasó. Elige una hora futura (después de las ${currentTime.timeStr} hrs).`);
        return;
      }
      if (customMin < minRequired) {
        setErrorMessage(`Por favor da al menos ${hasSlowFood ? '25' : '10'} minutos de preparación. Hora mínima sugerida: ${Math.floor(minRequired / 60)}:${String(minRequired % 60).padStart(2, '0')} hrs.`);
        return;
      }
    }

    const pickupTimeStr = selectedTimeOption === 'custom' 
      ? `${customTime} hrs` 
      : timeObj?.timeStr || 'Horario programado';

    const paymentObj = (PAYMENT_METHODS || []).find(p => p.id === selectedPayment);

    createReservation({
      customerName,
      customerEmail,
      customerPhone,
      pickupTime: selectedTimeOption === 'custom' ? `Personalizado (${customTime} hrs)` : (timeObj?.label || 'Horario programado'),
      pickupTimeStr,
      paymentMethod: paymentObj ? `${paymentObj.name} (${paymentObj.badge})` : 'Efectivo',
      orderNote
    });
  };

  if (!isCheckoutOpen || !cart || cart.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh] sm:h-auto sm:max-h-[92vh] border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-pedidosya-red text-white p-4 sm:p-6 flex items-center justify-between shrink-0 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white font-extrabold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full">
                Paso Final
              </span>
              <span className="text-xs text-white/80">EatPUCV</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black mt-1 leading-tight">Reserva de Comida en Quiosco</h2>
            <p className="text-[11px] sm:text-xs text-white/90 mt-0.5 truncate max-w-xs sm:max-w-md">
              Retiro en: <strong>{firstItem?.kioskName || 'Quiosco'}</strong> • {firstItem?.campusName || 'PUCV'}
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 text-white flex items-center justify-center transition shrink-0"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 sm:space-y-6 pb-8 sm:pb-6">
          
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* WARNING 1: Slow Food Notice */}
          {hasSlowFood && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 sm:p-4 text-xs text-amber-900 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <span className="text-2xl shrink-0">🥩</span>
                <div>
                  <h4 className="font-black text-amber-950 text-xs sm:text-sm uppercase tracking-wide">
                    Pedido con Comida Lenta (A la Plancha)
                  </h4>
                  <p className="text-[11px] sm:text-xs text-amber-800 mt-1 leading-relaxed">
                    Tu pedido incluye <strong>{slowFoodItems.map(i => i?.name || 'Plato').join(', ')}</strong>. Al ser comida cocinada a la plancha con tiempo de preparación de 20 a 25 min, <strong>la opción "Lo antes posible" está desactivada</strong>. Selecciona un recreo u horario posterior para tenerlo recién hecho al llegar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 1. SELECCIONA HORARIO DE RETIRO */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-pedidosya-lightRed text-pedidosya-red flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <h3 className="font-black text-neutral-900 text-sm sm:text-base">
                  ¿A qué hora retirarás tu pedido en el quiosco?
                </h3>
              </div>
            </div>

            {/* Real-time Clock Bar with Testing Selector */}
            <div className="bg-neutral-100 p-2.5 sm:p-3 rounded-2xl border border-neutral-200 text-xs mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-pedidosya-red shrink-0" />
                <span className="text-neutral-700">
                  Hora actual: <strong className="text-neutral-950 font-black text-sm">{currentTime?.timeStr || '12:00'} hrs</strong>
                </span>
                {currentTime?.isSimulated && (
                  <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded">
                    Simulación activa
                  </span>
                )}
              </div>

              {/* Simulation test buttons so user can verify "por ejemplo son las 12:45" */}
              <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-neutral-500 font-medium">Probar hora:</span>
                <button
                  type="button"
                  onClick={() => typeof setSimulatedTime === 'function' && setSimulatedTime({ hour: 10, minute: 30 })}
                  className={`px-2 py-0.5 rounded-lg font-bold transition active:scale-95 ${
                    currentTime?.hour === 10 ? 'bg-pedidosya-red text-white shadow-2xs' : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                  title="Simular 10:30 (Todo disponible)"
                >
                  10:30
                </button>
                <button
                  type="button"
                  onClick={() => typeof setSimulatedTime === 'function' && setSimulatedTime({ hour: 12, minute: 45 })}
                  className={`px-2 py-0.5 rounded-lg font-black transition active:scale-95 ${
                    currentTime?.hour === 12 && currentTime?.minute === 45 ? 'bg-pedidosya-red text-white shadow-2xs' : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
                  }`}
                  title="Ejemplo solicitado: 12:45 (desactiva 11:15 y 12:45)"
                >
                  12:45 (Ejemplo)
                </button>
                <button
                  type="button"
                  onClick={() => typeof setSimulatedTime === 'function' && setSimulatedTime({ hour: 14, minute: 0 })}
                  className={`px-2 py-0.5 rounded-lg font-bold transition active:scale-95 ${
                    currentTime?.hour === 14 ? 'bg-pedidosya-red text-white shadow-2xs' : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                  title="Simular 14:00 (Desactiva almuerzos)"
                >
                  14:00
                </button>
                <button
                  type="button"
                  onClick={() => typeof setSimulatedTime === 'function' && setSimulatedTime(null)}
                  className={`px-2 py-0.5 rounded-lg font-bold transition active:scale-95 ${
                    !currentTime?.isSimulated ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                  title="Restablecer a la hora actual de tu reloj"
                >
                  Hora Real
                </button>
              </div>
            </div>

            {/* Time Slot Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {evaluatedSlots.map((slot) => {
                const isSelected = selectedTimeOption === slot.id;
                const isDisabled = slot.isDisabled;

                return (
                  <button
                    type="button"
                    key={slot.id}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && setSelectedTimeOption(slot.id)}
                    className={`p-3 sm:p-3.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition min-h-[48px] ${
                      isDisabled
                        ? 'opacity-40 bg-neutral-100 text-neutral-400 border-dashed border-neutral-300 cursor-not-allowed'
                        : isSelected
                        ? 'border-pedidosya-red bg-pedidosya-lightRed text-pedidosya-red font-black shadow-2xs'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700 active:scale-[0.99]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-1">
                      <Clock className={`w-3.5 h-3.5 shrink-0 ${isDisabled ? 'text-neutral-400' : 'text-neutral-600'}`} />
                      <div className="min-w-0">
                        <span className={`block truncate ${isDisabled ? 'line-through text-neutral-400' : ''}`}>
                          {slot.label}
                        </span>
                        {isDisabled && (
                          <span className="text-[10px] text-rose-600 font-bold block truncate">
                            ✕ {slot.reason}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && !isDisabled && (
                      <CheckCircle className="w-4 h-4 fill-pedidosya-red text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedTimeOption === 'custom' && (
              <div className="mt-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block">Elige tu hora exacta de retiro:</label>
                  <p className="text-[11px] text-neutral-500">Debe ser posterior a las {currentTime?.timeStr || '12:00'} hrs</p>
                </div>
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="bg-white px-3 py-2 rounded-xl border border-neutral-300 text-sm font-black text-neutral-900 outline-none w-36 shadow-2xs"
                />
              </div>
            )}
          </div>

          {/* 2. DATOS DEL ESTUDIANTE */}
          <div className="border-t border-neutral-100 pt-4 sm:pt-5">
            <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
              <div className="w-6 h-6 rounded-full bg-pedidosya-lightRed text-pedidosya-red flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <h3 className="font-black text-neutral-900 text-sm sm:text-base">
                Tus datos de contacto (PUCV)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Nombre Completo</label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Vicente Morales"
                    className="w-full text-sm sm:text-xs pl-8 pr-3 py-2.5 rounded-xl border border-neutral-200 focus:border-pedidosya-red outline-none"
                    required
                  />
                  <User className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Correo PUCV</label>
                <div className="relative">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="vicente.morales@pucv.cl"
                    className="w-full text-sm sm:text-xs pl-8 pr-3 py-2.5 rounded-xl border border-neutral-200 focus:border-pedidosya-red outline-none"
                    required
                  />
                  <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">WhatsApp de Aviso</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+56 9 8765 4321"
                    className="w-full text-sm sm:text-xs pl-8 pr-3 py-2.5 rounded-xl border border-neutral-200 focus:border-pedidosya-red outline-none"
                    required
                  />
                  <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. MÉTODO DE PAGO */}
          <div className="border-t border-neutral-100 pt-4 sm:pt-5">
            <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
              <div className="w-6 h-6 rounded-full bg-pedidosya-lightRed text-pedidosya-red flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <h3 className="font-black text-neutral-900 text-sm sm:text-base">
                Método de Pago
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {(PAYMENT_METHODS || []).map((method) => {
                const isSelected = selectedPayment === method.id;
                return (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-3 sm:p-3.5 rounded-xl border text-left text-xs flex items-center justify-between transition active:scale-[0.99] min-h-[50px] ${
                      isSelected
                        ? 'border-pedidosya-red bg-pedidosya-lightRed shadow-2xs font-bold'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <span className="text-xl shrink-0">{method.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-neutral-900">{method.name}</span>
                          <span className="text-[10px] bg-neutral-200 text-neutral-700 font-black px-1.5 py-0.2 rounded">
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 truncate">{method.desc}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle className="w-4 h-4 fill-pedidosya-red text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="bg-neutral-50 p-3.5 sm:p-4 rounded-2xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-700">
                Resumen de la orden ({cart.length} productos)
              </h4>
              {hasSlowFood && (
                <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                  🥩 Incluye Comida Lenta
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-neutral-700 gap-2">
                  <span className="truncate">
                    {item.quantity || 1}x {item.name || 'Producto'}
                    {(item.isSlowFood || item.category === 'comida_lenta') && (
                      <span className="text-rose-600 font-bold ml-1 text-[10px]">(Plancha)</span>
                    )}
                  </span>
                  <span className="font-bold shrink-0">
                    ${(item.subtotal || ((item.price || 0) * (item.quantity || 1)) || 0).toLocaleString('es-CL')}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-neutral-200 flex justify-between items-center text-sm font-black text-neutral-900">
              <span>Total a pagar</span>
              <span className="text-pedidosya-red text-base sm:text-lg">
                ${(cartTotal || 0).toLocaleString('es-CL')}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-pedidosya-red hover:bg-pedidosya-darkRed active:scale-[0.98] text-white py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-pedidosya-red/30 flex items-center justify-center gap-2 transition"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Confirmar Reserva (${(cartTotal || 0).toLocaleString('es-CL')})</span>
          </button>
        </form>

      </div>
    </div>
  );
}
