import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PICKUP_TIME_OPTIONS, PAYMENT_METHODS } from '../data/mockData';
import { 
  X, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function ReservationModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotal, 
    createReservation 
  } = useApp();

  const [selectedTimeOption, setSelectedTimeOption] = useState('recreo-1');
  const [customTime, setCustomTime] = useState('12:15');
  const [customerName, setCustomerName] = useState('Vicente Morales');
  const [customerEmail, setCustomerEmail] = useState('vicente.morales@pucv.cl');
  const [customerPhone, setCustomerPhone] = useState('+56 9 8765 4321');
  const [selectedPayment, setSelectedPayment] = useState('junaeb_sodexo');
  const [orderNote, setOrderNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCheckoutOpen || cart.length === 0) return null;

  const firstItem = cart[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Por favor completa tus datos de contacto para avisarte cuando tu pedido esté listo.');
      return;
    }

    const timeObj = PICKUP_TIME_OPTIONS.find(t => t.id === selectedTimeOption);
    const pickupTimeStr = selectedTimeOption === 'custom' 
      ? `${customTime} hrs` 
      : timeObj?.timeStr || 'Lo antes posible';

    const paymentObj = PAYMENT_METHODS.find(p => p.id === selectedPayment);

    createReservation({
      customerName,
      customerEmail,
      customerPhone,
      pickupTime: selectedTimeOption === 'custom' ? `Personalizado (${customTime})` : timeObj?.label,
      pickupTimeStr,
      paymentMethod: paymentObj ? `${paymentObj.name} (${paymentObj.badge})` : 'Efectivo',
      orderNote
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-pedidosya-red text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full">
                Paso Final
              </span>
              <span className="text-xs text-white/80">EatPUCV</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">Reserva de Comida en Quiosco</h2>
            <p className="text-xs text-white/90 mt-0.5">
              Retiro en: <strong>{firstItem?.kioskName}</strong> • {firstItem?.campusName}
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. SELECCIONA HORARIO DE RETIRO */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-pedidosya-lightRed text-pedidosya-red flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">
                ¿A qué hora retirarás tu pedido en el quiosco?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PICKUP_TIME_OPTIONS.map((slot) => {
                const isSelected = selectedTimeOption === slot.id;
                return (
                  <button
                    type="button"
                    key={slot.id}
                    onClick={() => setSelectedTimeOption(slot.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                      isSelected
                        ? 'border-pedidosya-red bg-pedidosya-lightRed text-pedidosya-red font-bold shadow-sm'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot.label}</span>
                    </div>
                    {isSelected && <CheckCircle className="w-4 h-4 fill-pedidosya-red text-white" />}
                  </button>
                );
              })}
            </div>

            {selectedTimeOption === 'custom' && (
              <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center gap-3">
                <label className="text-xs font-bold text-neutral-700">Elige la hora exacta:</label>
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="bg-white px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-900 outline-none"
                />
              </div>
            )}
          </div>

          {/* 2. DATOS DEL ESTUDIANTE */}
          <div className="border-t border-neutral-100 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-pedidosya-lightRed text-pedidosya-red flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">
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
                    placeholder="Ej: Vicente Morales"
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-neutral-200 focus:border-pedidosya-red outline-none"
                    required
                  />
                  <User className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Correo Institucional PUCV</label>
                <div className="relative">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="vicente.morales@pucv.cl"
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-neutral-200 focus:border-pedidosya-red outline-none"
                    required
                  />
                  <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">WhatsApp (Aviso listo)</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+56 9 8765 4321"
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-neutral-200 focus:border-pedidosya-red outline-none"
                    required
                  />
                  <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. MÉTODO DE PAGO */}
          <div className="border-t border-neutral-100 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-pedidosya-lightRed text-pedidosya-red flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">
                Método de Pago
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedPayment === method.id;
                return (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-3 rounded-xl border text-left text-xs flex items-center justify-between transition ${
                      isSelected
                        ? 'border-pedidosya-red bg-pedidosya-lightRed shadow-sm'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{method.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-neutral-900">{method.name}</span>
                          <span className="text-[10px] bg-neutral-200 text-neutral-700 font-bold px-1.5 py-0.2 rounded">
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500">{method.desc}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle className="w-4 h-4 fill-pedidosya-red text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-700 mb-2">
              Resumen de la orden ({cart.length} ítems)
            </h4>
            <div className="space-y-1">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-neutral-700">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-bold">${item.subtotal.toLocaleString('es-CL')}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-neutral-200 flex justify-between items-center text-sm font-black text-neutral-900">
              <span>Total a pagar</span>
              <span className="text-pedidosya-red text-lg">${cartTotal.toLocaleString('es-CL')}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-pedidosya-red hover:bg-pedidosya-darkRed text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-pedidosya-red/30 flex items-center justify-center gap-2 transition transform active:scale-98"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Confirmar Reserva (${cartTotal.toLocaleString('es-CL')})</span>
          </button>
        </form>

      </div>
    </div>
  );
}
