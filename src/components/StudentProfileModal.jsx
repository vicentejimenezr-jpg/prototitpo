import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUSES, PAYMENT_METHODS } from '../data/mockData';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  LogOut, 
  ChevronRight, 
  Sparkles, 
  ShoppingBag, 
  Calendar, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function StudentProfileModal() {
  const { 
    studentUser, 
    isProfileModalOpen, 
    setIsProfileModalOpen, 
    loginStudent, 
    logoutStudent, 
    updateStudentProfile,
    orders = [],
    setTrackingOrder,
    setSelectedCampus
  } = useApp();

  // Form states for login
  const [usernameInput, setUsernameInput] = useState('vicente.morales');
  const [passwordInput, setPasswordInput] = useState('pucv2026');
  const [loginError, setLoginError] = useState('');

  // Active sub-tab inside profile (optional, default to all sections in clean layout)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  if (!isProfileModalOpen) return null;

  // Filter active and past reservations
  const activeOrder = orders.find(o => o.status !== 'entregado' && o.status !== 'cancelado');
  const pastOrders = orders.filter(o => o.status === 'entregado');

  // Available campuses for preference (excluding 'todos')
  const validCampuses = CAMPUSES.filter(c => c.id !== 'todos');

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setLoginError('Ingresa la parte inicial de tu correo institucional PUCV.');
      return;
    }
    setLoginError('');
    loginStudent(usernameInput, passwordInput);
  };

  // Quick Demo Auto-fill
  const handleDemoFill = () => {
    setUsernameInput('vicente.morales');
    setPasswordInput('demo123');
    setLoginError('');
  };

  // Handle updates to profile fields
  const handleCampusChange = (campusId) => {
    updateStudentProfile({ preferredCampus: campusId });
    // Also sync the app filter to the preferred campus
    if (typeof setSelectedCampus === 'function') {
      setSelectedCampus(campusId);
    }
    showSavedNotification('Campus preferido actualizado');
  };

  const handlePaymentChange = (paymentId) => {
    updateStudentProfile({ preferredPayment: paymentId });
    showSavedNotification('Método de pago preferido actualizado');
  };

  const showSavedNotification = (msg) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 2800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsProfileModalOpen(false)}
    >
      <div 
        className="relative bg-white w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-neutral-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-pedidosya-pucv to-[#003358] text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition active:scale-95"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-inner shrink-0">
              <User className="w-6 h-6 text-pedidosya-pucvGold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-pedidosya-pucvGold text-neutral-950 px-2 py-0.5 rounded-full">
                  Portal Estudiantes
                </span>
                <span className="text-xs text-white/70 font-medium">PUCV Valparaíso</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {studentUser?.isAuthenticated ? studentUser.name : 'Iniciar Sesión Estudiante'}
              </h2>
              {studentUser?.isAuthenticated && (
                <p className="text-xs text-white/80 font-mono mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-pedidosya-pucvGold" />
                  <span>{studentUser.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Toast feedback */}
          {saveSuccessMsg && (
            <div className="absolute bottom-2 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 text-neutral-800">

          {/* VIEW A: LOGIN FORM IF NOT AUTHENTICATED */}
          {!studentUser?.isAuthenticated ? (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 text-amber-900 text-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Acceso para Estudiantes PUCV</p>
                  <p className="text-amber-800/90 mt-0.5 leading-relaxed">
                    Ingresa solo el usuario de tu correo institucional. Se completará automáticamente con <strong className="font-mono text-amber-950">@mail.pucv.cl</strong>. Al ser página de demostración, la contraseña puede ser cualquiera.
                  </p>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Username Input with Auto @mail.pucv.cl */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
                    Usuario Institucional PUCV
                  </label>
                  <div className="relative flex rounded-xl shadow-sm border border-neutral-300 focus-within:ring-2 focus-within:ring-pedidosya-pucv focus-within:border-pedidosya-pucv overflow-hidden bg-white">
                    <div className="pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <User className="w-4 h-4 text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => {
                        let val = e.target.value.toLowerCase().trim();
                        // Auto-strip if they paste the domain
                        val = val.replace('@mail.pucv.cl', '').replace('@pucv.cl', '');
                        setUsernameInput(val);
                      }}
                      placeholder="nombre.apellido"
                      className="w-full py-2.5 px-2.5 text-sm font-semibold text-neutral-800 focus:outline-none"
                      autoFocus
                    />
                    <div className="bg-neutral-100 border-l border-neutral-300 px-3 py-2.5 flex items-center text-xs font-bold text-pedidosya-pucv select-none font-mono">
                      @mail.pucv.cl
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Solo ingresa la parte previa al @ (ejemplo: <span className="font-semibold text-neutral-700">vicente.morales</span>).
                  </p>
                </div>

                {/* Password Input (strict type="password", accepts anything) */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative flex rounded-xl shadow-sm border border-neutral-300 focus-within:ring-2 focus-within:ring-pedidosya-pucv focus-within:border-pedidosya-pucv overflow-hidden bg-white">
                    <div className="pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Lock className="w-4 h-4 text-neutral-400" />
                    </div>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full py-2.5 px-2.5 text-sm font-semibold text-neutral-800 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>Modo demostración: cualquier clave es válida.</span>
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 bg-pedidosya-pucv hover:bg-[#003961] active:scale-95 text-white font-extrabold py-3 px-4 rounded-xl text-sm transition shadow-md shadow-pedidosya-pucv/25 flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Ingresar a mi Perfil</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoFill}
                    className="bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-700 font-bold py-3 px-4 rounded-xl text-xs transition border border-neutral-200/80"
                  >
                    Demo: Vicente Morales
                  </button>
                </div>
              </form>
            </div>
          ) : (

            /* VIEW B: LOGGED IN PROFILE VIEW */
            <div className="space-y-6">

              {/* 1. CAMPUS PREFERIDO */}
              <section className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-pedidosya-red/10 text-pedidosya-red flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">Campus Preferido</h3>
                      <p className="text-xs text-neutral-500">Tu sede habitual para ver quioscos y tiempos de retiro</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {validCampuses.map(campus => {
                    const isSelected = studentUser?.preferredCampus === campus.id;
                    return (
                      <button
                        key={campus.id}
                        type="button"
                        onClick={() => handleCampusChange(campus.id)}
                        className={`text-left p-3 rounded-xl border text-xs transition flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-white border-pedidosya-red shadow-sm ring-1 ring-pedidosya-red'
                            : 'bg-white/60 border-neutral-200 hover:bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-neutral-900">{campus.name}</div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">{campus.city}</div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-pedidosya-red shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 2. MÉTODO DE PAGO PREFERIDO */}
              <section className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">Método de Pago Preferido</h3>
                    <p className="text-xs text-neutral-500">Se preseleccionará automáticamente al pedir en cualquier quiosco</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {PAYMENT_METHODS.map(method => {
                    const isSelected = studentUser?.preferredPayment === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => handlePaymentChange(method.id)}
                        className={`text-left p-3 rounded-xl border text-xs transition flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-white border-amber-500 shadow-sm ring-1 ring-amber-500'
                            : 'bg-white/60 border-neutral-200 hover:bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{method.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-neutral-900">{method.name}</span>
                              {method.badge && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                                  {method.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-neutral-500">{method.desc}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 3. RESERVA ACTUAL */}
              <section className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">Reserva Actual</h3>
                      <p className="text-xs text-neutral-500">Tu pedido en curso para retirar hoy</p>
                    </div>
                  </div>

                  {activeOrder && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      {activeOrder.status === 'listo' ? '¡Listo para retiro!' : 'En preparación'}
                    </span>
                  )}
                </div>

                {activeOrder ? (
                  <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-neutral-900 tracking-tight">{activeOrder.kioskName}</span>
                          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {activeOrder.id}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-pedidosya-red" />
                          <span>{activeOrder.campusName} - {activeOrder.locationDetails || 'Patio Central'}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-neutral-500 block">Horario de retiro</span>
                        <span className="text-xs font-extrabold text-neutral-900 bg-neutral-100 px-2 py-1 rounded-lg inline-block mt-0.5">
                          {activeOrder.pickupTimeStr || activeOrder.pickupTime}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-1.5 text-xs text-neutral-700">
                      {activeOrder.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-0.5">
                          <span>
                            <strong className="text-neutral-900">{item.quantity}x</strong> {item.name}
                          </span>
                          <span className="font-semibold text-neutral-600">
                            ${((item.price || 0) * (item.quantity || 1)).toLocaleString('es-CL')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <div>
                        <span className="text-xs text-neutral-500 block">Total a pagar / pagado</span>
                        <span className="text-base font-black text-pedidosya-red">
                          ${(activeOrder.total || 0).toLocaleString('es-CL')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileModalOpen(false);
                          setTrackingOrder(activeOrder);
                        }}
                        className="bg-pedidosya-red hover:bg-pedidosya-darkRed active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ver Ticket & QR de Retiro</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 text-center text-neutral-500 text-xs">
                    <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="font-semibold text-neutral-700">No tienes ninguna reserva activa en este momento</p>
                    <p className="mt-0.5 text-neutral-400">Pide con anticipación en cualquier quiosco para evitar filas en tu próximo recreo.</p>
                  </div>
                )}
              </section>

              {/* 4. RESERVAS ANTERIORES */}
              <section className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base">Reservas Anteriores</h3>
                    <p className="text-xs text-neutral-500">Historial de tus pedidos ya retirados y completados</p>
                  </div>
                </div>

                {pastOrders.length > 0 ? (
                  <div className="space-y-2.5">
                    {pastOrders.map(order => (
                      <div 
                        key={order.id} 
                        className="bg-white rounded-2xl p-3.5 border border-neutral-200/90 text-xs hover:border-neutral-300 transition space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                              {order.id}
                            </span>
                            <span className="font-bold text-neutral-900">{order.kioskName}</span>
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Entregado
                          </span>
                        </div>

                        <div className="text-neutral-600 pl-1">
                          {order.items?.map((it, i) => (
                            <span key={i} className="inline-block mr-2 text-[11px]">
                              {it.quantity}x {it.name}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-neutral-100 text-neutral-500 text-[11px]">
                          <span>Retirado: {order.pickupTimeStr || '12:45 hrs'}</span>
                          <span className="font-bold text-neutral-900 text-xs">
                            Total: ${(order.total || 0).toLocaleString('es-CL')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 text-center text-neutral-400 text-xs">
                    Aún no tienes pedidos completados en el historial.
                  </div>
                )}
              </section>

              {/* Botón Cerrar Sesión */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={logoutStudent}
                  className="flex items-center gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2.5 rounded-xl font-bold text-xs transition border border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-50 border-t border-neutral-200/80 px-4 py-3 sm:px-6 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>EatPUCV Sistema Estudiantil</span>
          </div>

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(false)}
            className="font-bold text-neutral-700 hover:text-neutral-950 px-3 py-1.5 rounded-lg hover:bg-neutral-200/60 transition"
          >
            Listo
          </button>
        </div>

      </div>
    </div>
  );
}
