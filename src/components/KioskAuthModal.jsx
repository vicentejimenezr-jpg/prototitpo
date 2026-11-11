import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Sparkles, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  FileText, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  PlusCircle,
  Building
} from 'lucide-react';

export default function KioskAuthModal() {
  const {
    isKioskAuthModalOpen,
    closeKioskAuth,
    kioskAuthTab,
    setKioskAuthTab,
    loginKiosk,
    recoverPassword,
    submitKioskApplication,
    campuses
  } = useApp();

  // Tab State: 'login' | 'register' | 'recover'
  const currentTab = kioskAuthTab || 'login';

  // Login form state
  const [username, setUsername] = useState('local123');
  const [password, setPassword] = useState('local123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Recovery form state
  const [recoverIdentifier, setRecoverIdentifier] = useState('local123');
  const [recoverStep, setRecoverStep] = useState(1); // 1: search, 2: reset password, 3: success
  const [recoverCode, setRecoverCode] = useState('123456');
  const [newPassword, setNewPassword] = useState('local123');
  const [confirmPassword, setConfirmPassword] = useState('local123');
  const [recoverError, setRecoverError] = useState('');
  const [recoverSuccessMsg, setRecoverSuccessMsg] = useState('');

  // Register form state (Unirse al quiosco)
  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [regForm, setRegForm] = useState({
    kioskName: '',
    campusId: 'casa-central',
    locationDetails: '',
    ownerName: '',
    rut: '',
    email: '',
    phone: '',
    category: 'cafeteria',
    openingHours: '08:00 - 18:30',
    acceptsJunaeb: true,
    prepTime: '10-15 min',
    menuNotes: '',
    acceptTerms: true
  });
  const [regErrors, setRegErrors] = useState({});

  if (!isKioskAuthModalOpen) return null;

  // Handle Quick Demo Fill
  const handleAutoFillDemo = () => {
    setUsername('local123');
    setPassword('local123');
    setLoginError('');
  };

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!username.trim() || !password.trim()) {
      setLoginError('Por favor completa el usuario y la contraseña.');
      return;
    }

    const result = loginKiosk(username, password);
    if (result.success) {
      setLoginSuccess(true);
      setTimeout(() => {
        setLoginSuccess(false);
        closeKioskAuth();
      }, 700);
    } else {
      setLoginError(result.message);
    }
  };

  // Handle Recovery Submit - Step 1: Find Account
  const handleRecoverSearch = (e) => {
    e.preventDefault();
    setRecoverError('');

    if (!recoverIdentifier.trim()) {
      setRecoverError('Ingresa tu usuario o correo institucional.');
      return;
    }

    const id = recoverIdentifier.trim().toLowerCase();
    if (id === 'local123' || id.includes('local123') || id.includes('pucv.cl')) {
      setRecoverStep(2);
    } else {
      setRecoverError('No encontramos ningún quiosco registrado con ese usuario o correo. Para la prueba usa "local123".');
    }
  };

  // Handle Recovery Submit - Step 2: Set New Password
  const handleRecoverReset = (e) => {
    e.preventDefault();
    setRecoverError('');

    if (!newPassword.trim()) {
      setRecoverError('Por favor ingresa una nueva contraseña.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setRecoverError('Las contraseñas no coinciden.');
      return;
    }

    const res = recoverPassword(recoverIdentifier, newPassword);
    if (res.success) {
      setRecoverSuccessMsg(res.message);
      setRecoverStep(3);
      // Pre-fill login
      setPassword(newPassword);
    } else {
      setRecoverError(res.message);
    }
  };

  // Handle Register Form Change
  const handleRegChange = (field, value) => {
    setRegForm(prev => ({ ...prev, [field]: value }));
    if (regErrors[field]) {
      setRegErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!regForm.kioskName.trim()) errors.kioskName = 'Ingresa el nombre de tu quiosco o casino';
    if (!regForm.locationDetails.trim()) errors.locationDetails = 'Ingresa la ubicación dentro del campus';
    if (!regForm.ownerName.trim()) errors.ownerName = 'Ingresa el nombre del responsable';
    if (!regForm.rut.trim()) errors.rut = 'Ingresa el RUT del comercio o titular';
    if (!regForm.email.trim()) errors.email = 'Ingresa un correo de contacto';
    if (!regForm.phone.trim()) errors.phone = 'Ingresa un teléfono de contacto';
    if (!regForm.acceptTerms) errors.acceptTerms = 'Debes aceptar los términos de afiliación';

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }

    const result = submitKioskApplication(regForm);
    if (result.success) {
      setRegisterSuccess(result);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden transition-all my-0 sm:my-8 relative flex flex-col h-[94vh] sm:h-auto sm:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar with PedidosYa + PUCV Theme */}
        <div className="bg-gradient-to-r from-pedidosya-pucv via-[#003961] to-pedidosya-pucv text-white p-4 sm:p-6 relative shrink-0">
          <button
            onClick={closeKioskAuth}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-pedidosya-red flex items-center justify-center text-white shadow-lg shadow-pedidosya-red/40 shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-pedidosya-pucvGold text-neutral-900 px-2 py-0.5 rounded-md">
                  PORTAL QUIOSCOS PUCV
                </span>
                <span className="text-xs text-white/70">Gestión de Mesón y Comercios</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {currentTab === 'login' && 'Iniciar Sesión en Modo Quiosco'}
                {currentTab === 'register' && 'Formulario para Unirse a EatPUCV'}
                {currentTab === 'recover' && 'Recuperar Acceso de Quiosco'}
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-5 bg-black/20 p-1 rounded-2xl border border-white/10 overflow-x-auto text-xs">
            <button
              onClick={() => {
                setKioskAuthTab('login');
                setLoginError('');
              }}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                currentTab === 'login'
                  ? 'bg-white text-pedidosya-pucv shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              onClick={() => {
                setKioskAuthTab('register');
                setRegisterSuccess(null);
              }}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                currentTab === 'register'
                  ? 'bg-white text-pedidosya-pucv shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Unirse al Quiosco</span>
            </button>

            <button
              onClick={() => {
                setKioskAuthTab('recover');
                setRecoverStep(1);
                setRecoverError('');
              }}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                currentTab === 'recover'
                  ? 'bg-white text-pedidosya-pucv shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recuperar Clave</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1">

          {/* ======================================================== */}
          {/* TAB 1: INICIAR SESIÓN (MODO QUIOSCO)                    */}
          {/* ======================================================== */}
          {currentTab === 'login' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Demo Credentials Helper Pill */}
              <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-amber-900 tracking-wide">
                      Credenciales de Demostración
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Usuario: <span className="font-black bg-amber-200/70 px-1.5 py-0.5 rounded text-amber-950 font-mono">local123</span> &nbsp;•&nbsp; Contraseña: <span className="font-black bg-amber-200/70 px-1.5 py-0.5 rounded text-amber-950 font-mono">local123</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFillDemo}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition shadow-sm shrink-0 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Autocompletar</span>
                </button>
              </div>

              {loginSuccess && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">¡Inicio de sesión exitoso!</p>
                    <p className="text-xs text-emerald-700">Entrando al panel de administración del quiosco...</p>
                  </div>
                </div>
              )}

              {loginError && (
                <div className="bg-rose-50 border border-rose-300 text-rose-800 p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <p className="text-xs font-bold">{loginError}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Usuario / Identificador del Quiosco
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ej: local123"
                      className="w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-300 focus:border-pedidosya-red pl-10 pr-4 py-3 rounded-2xl text-sm font-semibold text-neutral-900 outline-none transition"
                      autoFocus
                    />
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Usa <strong className="text-neutral-700">local123</strong> para acceder en modo prueba.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Contraseña del Quiosco
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setKioskAuthTab('recover');
                        setRecoverStep(1);
                      }}
                      className="text-xs font-bold text-pedidosya-red hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-300 focus:border-pedidosya-red pl-10 pr-11 py-3 rounded-2xl text-sm font-semibold text-neutral-900 outline-none transition"
                    />
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-neutral-300 text-pedidosya-red focus:ring-pedidosya-red w-4 h-4 cursor-pointer"
                    />
                    <span>Recordar este quiosco en este navegador</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-pedidosya-red hover:bg-pedidosya-darkRed text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-pedidosya-red/30 transition transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm mt-3"
                >
                  <Store className="w-4 h-4" />
                  <span>Iniciar Sesión en Modo Quiosco</span>
                </button>
              </form>

              {/* Call to register new kiosk */}
              <div className="pt-4 border-t border-neutral-200 text-center">
                <p className="text-xs text-neutral-600">
                  ¿Tienes un quiosco en la PUCV y todavía no estás en la plataforma?
                </p>
                <button
                  type="button"
                  onClick={() => setKioskAuthTab('register')}
                  className="mt-2 text-xs font-extrabold text-pedidosya-pucv hover:text-pedidosya-red transition inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200/80 px-4 py-2 rounded-xl"
                >
                  <PlusCircle className="w-4 h-4 text-pedidosya-red" />
                  <span>Rellenar Formulario de Afiliación para Unirse</span>
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: FORMULARIO PARA UNIRSE AL QUIOSCO                 */}
          {/* ======================================================== */}
          {currentTab === 'register' && (
            <div className="animate-fadeIn">
              {registerSuccess ? (
                /* Success Screen for Application */
                <div className="text-center py-6 px-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                      ¡Solicitud Registrada con Éxito!
                    </span>
                    <h3 className="text-xl font-black text-neutral-900 mt-2">
                      Bienvenido a la red de quioscos EatPUCV
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1 max-w-md mx-auto">
                      Hemos recibido la postulación de <strong>{registerSuccess.application.kioskName}</strong> para el campus <strong>{registerSuccess.kiosk.campusName}</strong>.
                    </p>
                  </div>

                  {/* Ticket Details */}
                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-left max-w-md mx-auto space-y-2 text-xs">
                    <div className="flex justify-between pb-2 border-b border-neutral-200">
                      <span className="text-neutral-500 font-medium">N° Solicitud:</span>
                      <span className="font-mono font-bold text-neutral-900">{registerSuccess.application.id}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-neutral-200">
                      <span className="text-neutral-500 font-medium">Local:</span>
                      <span className="font-bold text-neutral-900">{registerSuccess.application.kioskName}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-neutral-200">
                      <span className="text-neutral-500 font-medium">Encargado:</span>
                      <span className="font-bold text-neutral-900">{registerSuccess.application.ownerName}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-neutral-200">
                      <span className="text-neutral-500 font-medium">Convenio JUNAEB:</span>
                      <span className="font-bold text-emerald-700">
                        {registerSuccess.application.acceptsJunaeb ? '✅ Acepta Sodexo / Edenred' : '❌ No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 font-medium">Estado demo:</span>
                      <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                        Activo en catálogo
                      </span>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 max-w-md mx-auto">
                    💡 <strong>Demostración activa:</strong> Tu quiosco ya ha sido incorporado al catálogo para que los alumnos puedan hacer pedidos y reservas. Puedes probar el acceso con las credenciales demo: <strong>local123</strong> / <strong>local123</strong>.
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setKioskAuthTab('login');
                        setUsername('local123');
                        setPassword('local123');
                      }}
                      className="w-full sm:w-auto bg-pedidosya-red hover:bg-pedidosya-darkRed text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-md"
                    >
                      Iniciar Sesión en Modo Quiosco
                    </button>
                    <button
                      type="button"
                      onClick={closeKioskAuth}
                      className="w-full sm:w-auto bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs px-5 py-3 rounded-xl transition"
                    >
                      Ver en la tienda
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div className="bg-pedidosya-lightRed/50 border border-pedidosya-red/20 rounded-2xl p-3.5 text-xs text-neutral-700">
                    <p className="font-bold text-pedidosya-red flex items-center gap-1.5 mb-1">
                      <Store className="w-4 h-4" />
                      <span>Formulario de Incorporación a EatPUCV</span>
                    </p>
                    <p className="text-neutral-600 leading-relaxed">
                      Completa los datos de tu quiosco, cafetería o casino para recibir pedidos anticipados y eliminar las filas durante los recreos.
                    </p>
                  </div>

                  {/* Section 1: Kiosk Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-neutral-200">
                      <Building className="w-3.5 h-3.5 text-pedidosya-red" />
                      <span>1. Datos del Quiosco o Comercio</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Nombre del Quiosco / Local *
                        </label>
                        <input
                          type="text"
                          value={regForm.kioskName}
                          onChange={(e) => handleRegChange('kioskName', e.target.value)}
                          placeholder="Ej: Snack Bar Casa Central"
                          className={`w-full bg-neutral-50 border ${
                            regErrors.kioskName ? 'border-rose-500' : 'border-neutral-300'
                          } text-xs font-semibold px-3 py-2.5 rounded-xl outline-none focus:border-pedidosya-red`}
                        />
                        {regErrors.kioskName && (
                          <span className="text-[10px] text-rose-600 font-bold mt-0.5 block">
                            {regErrors.kioskName}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Campus PUCV *
                        </label>
                        <select
                          value={regForm.campusId}
                          onChange={(e) => handleRegChange('campusId', e.target.value)}
                          className="w-full bg-neutral-50 border border-neutral-300 text-xs font-semibold px-3 py-2.5 rounded-xl outline-none focus:border-pedidosya-red"
                        >
                          {campuses.filter(c => c.id !== 'todos').map(c => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.city})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Ubicación específica dentro del campus *
                      </label>
                      <input
                        type="text"
                        value={regForm.locationDetails}
                        onChange={(e) => handleRegChange('locationDetails', e.target.value)}
                        placeholder="Ej: Patio de los Naranjos, frente a Aula Magna y Biblioteca"
                        className={`w-full bg-neutral-50 border ${
                          regErrors.locationDetails ? 'border-rose-500' : 'border-neutral-300'
                        } text-xs font-semibold px-3 py-2.5 rounded-xl outline-none focus:border-pedidosya-red`}
                      />
                      {regErrors.locationDetails && (
                        <span className="text-[10px] text-rose-600 font-bold mt-0.5 block">
                          {regErrors.locationDetails}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Categoría Gastronómica Principal
                        </label>
                        <select
                          value={regForm.category}
                          onChange={(e) => handleRegChange('category', e.target.value)}
                          className="w-full bg-neutral-50 border border-neutral-300 text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
                        >
                          <option value="cafeteria">Cafetería & Desayunos</option>
                          <option value="completos">Completos & Sandwiches</option>
                          <option value="almuerzos">Almuerzos & Menú</option>
                          <option value="empanadas">Empanadas & Masas</option>
                          <option value="vegano">Veggie & Saludable</option>
                          <option value="dulces">Pastelería & Snacks</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Horario de Atención Estimado
                        </label>
                        <input
                          type="text"
                          value={regForm.openingHours}
                          onChange={(e) => handleRegChange('openingHours', e.target.value)}
                          placeholder="Ej: 08:00 - 18:30"
                          className="w-full bg-neutral-50 border border-neutral-300 text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Owner Info */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-neutral-200">
                      <User className="w-3.5 h-3.5 text-pedidosya-red" />
                      <span>2. Datos del Responsable o Concesionario</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Nombre del Encargado *
                        </label>
                        <input
                          type="text"
                          value={regForm.ownerName}
                          onChange={(e) => handleRegChange('ownerName', e.target.value)}
                          placeholder="Nombre y Apellidos"
                          className={`w-full bg-neutral-50 border ${
                            regErrors.ownerName ? 'border-rose-500' : 'border-neutral-300'
                          } text-xs font-semibold px-3 py-2.5 rounded-xl outline-none focus:border-pedidosya-red`}
                        />
                        {regErrors.ownerName && (
                          <span className="text-[10px] text-rose-600 font-bold mt-0.5 block">
                            {regErrors.ownerName}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          RUT del Comercio o Titular *
                        </label>
                        <input
                          type="text"
                          value={regForm.rut}
                          onChange={(e) => handleRegChange('rut', e.target.value)}
                          placeholder="Ej: 15.345.678-9"
                          className={`w-full bg-neutral-50 border ${
                            regErrors.rut ? 'border-rose-500' : 'border-neutral-300'
                          } text-xs font-semibold px-3 py-2.5 rounded-xl outline-none focus:border-pedidosya-red`}
                        />
                        {regErrors.rut && (
                          <span className="text-[10px] text-rose-600 font-bold mt-0.5 block">
                            {regErrors.rut}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Correo Electrónico de Contacto *
                        </label>
                        <input
                          type="email"
                          value={regForm.email}
                          onChange={(e) => handleRegChange('email', e.target.value)}
                          placeholder="quiosco@pucv.cl"
                          className={`w-full bg-neutral-50 border ${
                            regErrors.email ? 'border-rose-500' : 'border-neutral-300'
                          } text-xs font-semibold px-3 py-2.5 rounded-xl outline-none focus:border-pedidosya-red`}
                        />
                        {regErrors.email && (
                          <span className="text-[10px] text-rose-600 font-bold mt-0.5 block">
                            {regErrors.email}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          value={regForm.phone}
                          onChange={(e) => handleRegChange('phone', e.target.value)}
                          placeholder="+56 9 1234 5678"
                          className={`w-full bg-neutral-50 border ${
                            regErrors.phone ? 'border-rose-500' : 'border-neutral-300'
                          } text-xs font-semibold px-3 py-2.5 rounded-xl outline-none focus:border-pedidosya-red`}
                        />
                        {regErrors.phone && (
                          <span className="text-[10px] text-rose-600 font-bold mt-0.5 block">
                            {regErrors.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Operations & Agreements */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-neutral-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-pedidosya-red" />
                      <span>3. Métodos y Condiciones de Atención</span>
                    </h4>

                    {/* JUNAEB Checkbox */}
                    <label className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-50 border border-neutral-200 cursor-pointer hover:bg-neutral-100/60 transition">
                      <input
                        type="checkbox"
                        checked={regForm.acceptsJunaeb}
                        onChange={(e) => handleRegChange('acceptsJunaeb', e.target.checked)}
                        className="rounded border-neutral-300 text-pedidosya-red focus:ring-pedidosya-red w-4 h-4 mt-0.5"
                      />
                      <div className="text-xs">
                        <span className="font-extrabold text-neutral-900 block">
                          Aceptamos pago con Beca JUNAEB BAES (Sodexo / Edenred)
                        </span>
                        <span className="text-neutral-500">
                          Habilita la etiqueta JUNAEB destacada en el catálogo para aumentar las reservas.
                        </span>
                      </div>
                    </label>

                    {/* Terms */}
                    <div>
                      <label className="flex items-start gap-2.5 text-xs text-neutral-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regForm.acceptTerms}
                          onChange={(e) => handleRegChange('acceptTerms', e.target.checked)}
                          className="rounded border-neutral-300 text-pedidosya-red focus:ring-pedidosya-red w-4 h-4 mt-0.5"
                        />
                        <span>
                          Declaro ser concesionario o dependiente autorizado de quiosco en la Pontificia Universidad Católica de Valparaíso y acepto los términos de servicio de EatPUCV.
                        </span>
                      </label>
                      {regErrors.acceptTerms && (
                        <span className="text-[10px] text-rose-600 font-bold mt-0.5 block">
                          {regErrors.acceptTerms}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-pedidosya-red hover:bg-pedidosya-darkRed text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-pedidosya-red/30 transition transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Enviar Solicitud de Afiliación</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: RECUPERAR CONTRASEÑA                              */}
          {/* ======================================================== */}
          {currentTab === 'recover' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Step indicator */}
              <div className="flex items-center justify-between px-2 text-xs font-bold text-neutral-500 pb-2 border-b border-neutral-200">
                <span className={recoverStep >= 1 ? 'text-pedidosya-red' : ''}>1. Identificar Cuenta</span>
                <span>→</span>
                <span className={recoverStep >= 2 ? 'text-pedidosya-red' : ''}>2. Restablecer Clave</span>
                <span>→</span>
                <span className={recoverStep >= 3 ? 'text-emerald-600' : ''}>3. ¡Listo!</span>
              </div>

              {recoverError && (
                <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{recoverError}</span>
                </div>
              )}

              {/* STEP 1: Identification */}
              {recoverStep === 1 && (
                <form onSubmit={handleRecoverSearch} className="space-y-4">
                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
                    <p className="font-bold text-neutral-900 mb-1">
                      ¿Olvidaste tu contraseña de Modo Quiosco?
                    </p>
                    <p>
                      Ingresa el nombre de usuario de tu quiosco o el correo institucional con el que fue registrado.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Usuario o Correo del Quiosco
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={recoverIdentifier}
                        onChange={(e) => setRecoverIdentifier(e.target.value)}
                        placeholder="Ej: local123 o quiosco@pucv.cl"
                        className="w-full bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-300 focus:border-pedidosya-red pl-10 pr-4 py-3 rounded-2xl text-sm font-semibold text-neutral-900 outline-none transition"
                        autoFocus
                      />
                      <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setRecoverIdentifier('local123')}
                      className="text-xs font-bold text-pedidosya-pucv hover:text-pedidosya-red transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Probar con usuario demo: local123</span>
                    </button>

                    <button
                      type="submit"
                      className="bg-pedidosya-red hover:bg-pedidosya-darkRed text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <span>Continuar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Verification Code & Set New Password */}
              {recoverStep === 2 && (
                <form onSubmit={handleRecoverReset} className="space-y-4 animate-fadeIn">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900">
                    <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Cuenta Encontrada: local123</span>
                    </p>
                    <p className="mt-1 text-emerald-700">
                      Quiosco: <strong>El Cafecito Central (Casa Central PUCV)</strong>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Código de Verificación Simulado
                    </label>
                    <input
                      type="text"
                      value={recoverCode}
                      onChange={(e) => setRecoverCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-neutral-50 border border-neutral-300 font-mono font-bold text-center tracking-widest text-base py-2.5 rounded-2xl text-neutral-900 outline-none"
                    />
                    <span className="text-[11px] text-neutral-400 mt-1 block text-center">
                      Código de prueba pre-cargado: 123456
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nueva contraseña"
                      className="w-full bg-neutral-50 border border-neutral-300 text-sm font-semibold px-4 py-2.5 rounded-2xl text-neutral-900 outline-none focus:border-pedidosya-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repetir nueva contraseña"
                      className="w-full bg-neutral-50 border border-neutral-300 text-sm font-semibold px-4 py-2.5 rounded-2xl text-neutral-900 outline-none focus:border-pedidosya-red"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setRecoverStep(1)}
                      className="text-xs font-bold text-neutral-500 hover:text-neutral-800"
                    >
                      Volver atrás
                    </button>

                    <button
                      type="submit"
                      className="bg-pedidosya-red hover:bg-pedidosya-darkRed text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition"
                    >
                      Guardar Nueva Contraseña
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Success Confirmation */}
              {recoverStep === 3 && (
                <div className="text-center py-6 space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-neutral-900">
                      ¡Contraseña Restablecida!
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
                      {recoverSuccessMsg || 'Tu nueva contraseña ha sido configurada correctamente en el sistema.'}
                    </p>
                  </div>

                  <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 text-xs font-mono max-w-xs mx-auto">
                    <span>Usuario: <strong>local123</strong></span><br />
                    <span>Contraseña: <strong>{newPassword}</strong></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setKioskAuthTab('login');
                      setUsername('local123');
                      setPassword(newPassword);
                    }}
                    className="bg-pedidosya-red hover:bg-pedidosya-darkRed text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition"
                  >
                    Ir a Iniciar Sesión Ahora
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
