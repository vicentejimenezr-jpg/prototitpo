import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PICKUP_TIME_OPTIONS, 
  DEFAULT_TIME_SLOT_CAPACITIES, 
  PRODUCT_IMAGE_PRESETS 
} from '../data/mockData';
import { 
  Store, 
  Power, 
  Clock, 
  CheckCircle, 
  ChefHat, 
  PackageCheck, 
  AlertCircle, 
  TrendingUp, 
  User, 
  Phone, 
  Mail,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  LogOut,
  Bell,
  FileText,
  UtensilsCrossed,
  Layers,
  MapPin,
  Calendar,
  Check,
  QrCode,
  ScanLine,
  Search,
  PlusCircle,
  Plus,
  Trash2,
  DollarSign,
  CreditCard,
  Wallet,
  X,
  Upload,
  Image as ImageIcon,
  Flame,
  CheckCircle2,
  BarChart3,
  Sliders
} from 'lucide-react';

export default function KioskAdminPanel() {
  const { 
    kiosks, 
    orders, 
    updateOrderStatus, 
    toggleProductAvailability, 
    toggleKioskOpen,
    updateKioskAsapSettings,
    getKioskActiveAsapOrders,
    addProductToKiosk,
    deleteProductFromKiosk,
    updateKioskSlotCapacity,
    getKioskSlotOccupancy,
    adminSelectedKioskId,
    setAdminSelectedKioskId,
    setIsAdminMode,
    isKioskAuthenticated,
    kioskUser,
    logoutKiosk,
    kioskApplications,
    simulateIncomingOrder
  } = useApp();

  // Internal tab state: 'orders' | 'scanner' | 'capacities' | 'inventory' | 'metrics' | 'applications'
  const [activeTab, setActiveTab] = useState('orders');
  const [orderFilter, setOrderFilter] = useState('todos'); // 'todos' | 'recibido' | 'preparando' | 'listo' | 'entregado'
  const [simulatedAlert, setSimulatedAlert] = useState(false);

  // Scanner / Code verification state
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [scannedOrder, setScannedOrder] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle'); // 'idle' | 'success' | 'warning' | 'error'
  const [scanMessage, setScanMessage] = useState('');

  // New Product Modal State
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'comida_lenta',
    isSlowFood: true,
    prepTimeMinutes: 20,
    acceptsJunaeb: true,
    image: PRODUCT_IMAGE_PRESETS[0].url
  });
  const [productSuccessMsg, setProductSuccessMsg] = useState('');

  const selectedKiosk = kiosks.find(k => k.id === adminSelectedKioskId) || kiosks[0];

  // Active ASAP / Express orders currently in kitchen for this kiosk
  const activeAsapOrdersCount = getKioskActiveAsapOrders ? getKioskActiveAsapOrders(selectedKiosk.id) : 0;

  // Filter orders for this kiosk
  const kioskOrders = orders.filter(o => o.kioskId === selectedKiosk.id);
  const activeOrders = kioskOrders.filter(o => o.status !== 'entregado' && o.status !== 'cancelado');
  const deliveredOrders = kioskOrders.filter(o => o.status === 'entregado');
  const totalSales = kioskOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const avgTicket = kioskOrders.length > 0 ? Math.round(totalSales / kioskOrders.length) : 0;

  // Breakdown by payment method
  const salesJunaeb = kioskOrders
    .filter(o => {
      const p = (o.paymentMethod || '').toLowerCase();
      return p.includes('junaeb') || p.includes('baes') || p.includes('sodexo') || p.includes('edenred');
    })
    .reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const countJunaeb = kioskOrders
    .filter(o => {
      const p = (o.paymentMethod || '').toLowerCase();
      return p.includes('junaeb') || p.includes('baes') || p.includes('sodexo') || p.includes('edenred');
    }).length;

  const salesWebpay = kioskOrders
    .filter(o => {
      const p = (o.paymentMethod || '').toLowerCase();
      return p.includes('webpay') || p.includes('débito') || p.includes('crédito') || p.includes('tarjeta');
    })
    .reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const countWebpay = kioskOrders
    .filter(o => {
      const p = (o.paymentMethod || '').toLowerCase();
      return p.includes('webpay') || p.includes('débito') || p.includes('crédito') || p.includes('tarjeta');
    }).length;

  const salesCash = kioskOrders
    .filter(o => {
      const p = (o.paymentMethod || '').toLowerCase();
      return p.includes('efectivo') || p.includes('caja') || p.includes('quiosco');
    })
    .reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const countCash = kioskOrders
    .filter(o => {
      const p = (o.paymentMethod || '').toLowerCase();
      return p.includes('efectivo') || p.includes('caja') || p.includes('quiosco');
    }).length;

  // Filter orders by status
  const displayedOrders = kioskOrders.filter(o => {
    if (orderFilter === 'todos') return true;
    return o.status === orderFilter;
  });

  // Scheduled slots (excluding asap & custom)
  const scheduledSlots = (PICKUP_TIME_OPTIONS || []).filter(s => s.targetHour !== undefined);
  const kioskCapacities = selectedKiosk.timeSlotCapacities || { ...DEFAULT_TIME_SLOT_CAPACITIES };

  // Handle Order Simulation
  const handleSimulateOrder = () => {
    simulateIncomingOrder(selectedKiosk.id);
    setSimulatedAlert(true);
    setTimeout(() => setSimulatedAlert(false), 4000);
  };

  // Search / Scan Code Handler
  const handleSearchCode = (e) => {
    if (e) e.preventDefault();
    if (!scanCodeInput.trim()) return;
    const cleanQuery = scanCodeInput.trim().toUpperCase().replace('#', '');
    
    // Look first in this kiosk's orders, then general orders
    const found = kioskOrders.find(o => {
      if (!o) return false;
      const orderId = (o.id || '').toUpperCase();
      return orderId === cleanQuery || orderId.endsWith(cleanQuery) || orderId === `PUCV-${cleanQuery}`;
    }) || orders.find(o => {
      if (!o) return false;
      const orderId = (o.id || '').toUpperCase();
      return orderId === cleanQuery || orderId.endsWith(cleanQuery) || orderId === `PUCV-${cleanQuery}`;
    });

    if (found) {
      setScannedOrder(found);
      if (found.status === 'entregado') {
        setScanStatus('warning');
        setScanMessage(`El pedido ${found.id} ya fue retirado anteriormente.`);
      } else {
        setScanStatus('success');
        setScanMessage(`¡Pedido ${found.id} verificado! Listo para entregar al estudiante.`);
      }
    } else {
      setScannedOrder(null);
      setScanStatus('error');
      setScanMessage(`No se encontró ningún pedido con el código "${scanCodeInput}". Revisa el número en el ticket del alumno.`);
    }
  };

  // Confirm delivery of scanned order
  const handleDeliverScannedOrder = () => {
    if (!scannedOrder) return;
    updateOrderStatus(scannedOrder.id, 'entregado');
    setScannedOrder(prev => ({ ...prev, status: 'entregado' }));
    setScanStatus('success');
    setScanMessage(`🎉 ¡Pedido ${scannedOrder.id} marcado como ENTREGADO a ${scannedOrder.customerName}!`);
  };

  // Fill sample code for testing
  const handleFillDemoCode = (code) => {
    setScanCodeInput(code || 'PUCV-742');
    setTimeout(() => {
      const btn = document.getElementById('btn-submit-scan');
      if (btn) btn.click();
    }, 50);
  };

  // Handle file upload for product image
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save new product
  const handleCreateProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) {
      alert('Por favor ingresa el nombre o título del producto.');
      return;
    }
    if (!newProductForm.price || Number(newProductForm.price) <= 0) {
      alert('Por favor ingresa un precio válido mayor a 0.');
      return;
    }

    if (typeof addProductToKiosk === 'function') {
      addProductToKiosk(selectedKiosk.id, newProductForm);
      setProductSuccessMsg(`¡"${newProductForm.name}" agregado con éxito al menú de ${selectedKiosk.name}!`);
      setTimeout(() => setProductSuccessMsg(''), 4500);
      setIsNewProductModalOpen(false);
      // Reset form
      setNewProductForm({
        name: '',
        description: '',
        price: '',
        category: 'comida_lenta',
        isSlowFood: true,
        prepTimeMinutes: 20,
        acceptsJunaeb: true,
        image: PRODUCT_IMAGE_PRESETS[0].url
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-pedidosya-pucv/20 shadow-xl p-3.5 sm:p-6 md:p-7 mb-6 sm:mb-8 animate-fadeIn">
      
      {/* Top Session Bar (Shows authenticated kiosk operator local123) */}
      <div className="bg-pedidosya-pucv text-white rounded-xl sm:rounded-2xl p-3 sm:p-3.5 mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pedidosya-red flex items-center justify-center text-white font-black shrink-0 shadow-inner">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-pedidosya-pucvGold">
                MODO QUIOSCO EN VIVO
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white/90 font-mono">
                Usuario: {kioskUser?.username || 'local123'}
              </span>
            </div>
            <p className="text-xs text-white/80 font-medium">
              Operador: <strong>{kioskUser?.name || 'Administrador Local 123'}</strong> • Rol: {kioskUser?.role || 'Encargado de Quiosco'}
            </p>
          </div>
        </div>

        {/* Quick control actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateOrder}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5 active:scale-95"
            title="Simula un pedido realizado por un alumno PUCV"
          >
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            <span>Simular Pedido Entrante</span>
          </button>

          <button
            onClick={logoutKiosk}
            className="bg-white/10 hover:bg-rose-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
            title="Cerrar sesión de Modo Quiosco"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Product Added Success Message Toast */}
      {productSuccessMsg && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 px-4 py-3 rounded-2xl mb-5 flex items-center justify-between gap-3 animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-emerald-900">{productSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setProductSuccessMsg('')}
            className="text-emerald-700 hover:text-emerald-900 font-black text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Simulated Alert Notification */}
      {simulatedAlert && (
        <div className="bg-amber-50 border-2 border-amber-400 text-amber-900 px-4 py-3 rounded-2xl mb-5 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔔</span>
            <div className="text-xs">
              <strong className="block text-amber-900 text-sm">¡Nuevo Pedido Recibido en Modo Quiosco!</strong>
              <span>Un alumno acaba de reservar para el recreo. Se ha añadido a la cola de pedidos.</span>
            </div>
          </div>
          <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-1 rounded-lg">
            ¡Actualizado!
          </span>
        </div>
      )}

      {/* Top Banner & Kiosk Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-neutral-100 text-neutral-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-neutral-300">
              Terminal POS & Control de Mesón
            </span>
            <span className="text-xs text-neutral-500">Gestión de reservas de recreo PUCV</span>
          </div>
          <h2 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-pedidosya-red" />
            <span>{selectedKiosk.name}</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-pedidosya-red" />
            <span>Campus: <strong>{selectedKiosk.campusName}</strong> • {selectedKiosk.locationDetails}</span>
          </p>
        </div>

        {/* Kiosk selector & status toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={adminSelectedKioskId}
            onChange={(e) => setAdminSelectedKioskId(e.target.value)}
            className="bg-neutral-100 border border-neutral-300 text-xs font-bold px-3 py-2 rounded-xl outline-none"
          >
            {kiosks.map(k => (
              <option key={k.id} value={k.id}>
                {k.name} ({k.campusName})
              </option>
            ))}
          </select>

          {/* Open/Close toggle */}
          <button
            onClick={() => toggleKioskOpen(selectedKiosk.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              selectedKiosk.isOpen
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{selectedKiosk.isOpen ? 'Quiosco ABIERTO' : 'Quiosco CERRADO'}</span>
          </button>

          <button
            onClick={() => setIsAdminMode(false)}
            className="text-xs text-neutral-500 hover:text-neutral-800 font-bold px-2 py-1"
          >
            ✕ Ocultar Vista
          </button>
        </div>
      </div>

      {/* QUICK METRICS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-5 sm:my-6">
        <div className="bg-rose-50 border border-rose-200 p-3.5 sm:p-4 rounded-2xl shadow-2xs">
          <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">Por preparar</p>
          <p className="text-2xl sm:text-3xl font-black text-rose-900 mt-0.5">{activeOrders.length}</p>
          <span className="text-[10px] text-rose-600 font-medium">Reservas activas en mesón</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-3.5 sm:p-4 rounded-2xl shadow-2xs">
          <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Entregados hoy</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-900 mt-0.5">{deliveredOrders.length}</p>
          <span className="text-[10px] text-emerald-600 font-medium">{kioskOrders.length} pedidos totales</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-3.5 sm:p-4 rounded-2xl shadow-2xs">
          <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">Ventas acumuladas</p>
          <p className="text-xl sm:text-2xl font-black text-blue-900 mt-0.5">${totalSales.toLocaleString('es-CL')}</p>
          <span className="text-[10px] text-blue-600 font-medium">Ticket prom: ${avgTicket.toLocaleString('es-CL')}</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3.5 sm:p-4 rounded-2xl shadow-2xs">
          <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Ventas JUNAEB</p>
          <p className="text-xl sm:text-2xl font-black text-amber-900 mt-0.5">${salesJunaeb.toLocaleString('es-CL')}</p>
          <span className="text-[10px] text-amber-700 font-medium">{countJunaeb} pagos con BAES</span>
        </div>
      </div>

      {/* LECTOR / ESCÁNER DE CÓDIGO DE RETIRO (BARRA RÁPIDA DE MESÓN) */}
      <div className="bg-gradient-to-r from-neutral-900 to-pedidosya-pucv text-white rounded-2xl p-4 sm:p-5 mb-6 shadow-lg border border-neutral-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-pedidosya-red text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ScanLine className="w-3 h-3" />
                <span>Mesón de Retiro</span>
              </span>
              <span className="text-xs text-white/70">Validación de tickets y entrega rápida</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Lector & Validador de Código de Retiro</span>
            </h3>
            <p className="text-xs text-white/80 mt-0.5">
              Ingresa el código que muestra el estudiante en su celular (ej: <strong>PUCV-742</strong> o los números) para verificar y entregar.
            </p>
          </div>

          {/* Input & Action Form */}
          <form onSubmit={handleSearchCode} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={scanCodeInput}
                onChange={(e) => setScanCodeInput(e.target.value)}
                placeholder="Ej: PUCV-742 o 742"
                className="w-full bg-white/10 text-white placeholder-white/50 text-sm font-black px-3.5 py-2.5 rounded-xl border border-white/20 focus:outline-none focus:border-amber-400 uppercase font-mono tracking-wider"
              />
              {scanCodeInput && (
                <button
                  type="button"
                  onClick={() => { setScanCodeInput(''); setScannedOrder(null); setScanStatus('idle'); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              id="btn-submit-scan"
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Buscar Pedido</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemoCode(kioskOrders[0]?.id || 'PUCV-742')}
              className="bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold px-3 py-2.5 rounded-xl transition shrink-0 hidden sm:flex items-center gap-1"
              title="Carga un pedido de prueba"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Probar Código</span>
            </button>
          </form>
        </div>

        {/* Scanned Order Result Modal/Card */}
        {scanStatus !== 'idle' && (
          <div className={`mt-4 pt-4 border-t border-white/15 animate-fadeIn`}>
            {scannedOrder ? (
              <div className="bg-white text-neutral-900 rounded-2xl p-4 shadow-xl border-2 border-amber-400 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-lg font-black text-neutral-950 bg-neutral-100 px-2.5 py-0.5 rounded-lg border border-neutral-300">
                      {scannedOrder.id}
                    </span>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      scannedOrder.status === 'entregado'
                        ? 'bg-neutral-800 text-white'
                        : scannedOrder.status === 'listo'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {scannedOrder.status === 'entregado' && '✅ Ya Entregado'}
                      {scannedOrder.status === 'listo' && '🟢 ¡Listo para Retiro!'}
                      {scannedOrder.status === 'preparando' && '🟡 En Preparación'}
                      {scannedOrder.status === 'recibido' && '🔴 Nuevo Pedido'}
                    </span>
                    <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      💳 {scannedOrder.paymentMethod}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-neutral-800">
                    Estudiante: <strong>{scannedOrder.customerName}</strong> • {scannedOrder.customerPhone}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Horario de retiro programado: <strong className="text-neutral-700">{scannedOrder.pickupTimeStr}</strong>
                  </p>

                  {/* Items summary */}
                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 mt-2 text-xs space-y-1 max-w-md">
                    {scannedOrder.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between font-medium">
                        <span>{it.quantity}x {it.name}</span>
                        <span className="font-bold">${((it.price || 0) * (it.quantity || 1)).toLocaleString('es-CL')}</span>
                      </div>
                    ))}
                    <div className="pt-1 border-t border-neutral-200 flex justify-between font-black text-pedidosya-red">
                      <span>Total Pagado:</span>
                      <span>${(scannedOrder.total || 0).toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {scannedOrder.status !== 'entregado' ? (
                    <button
                      onClick={handleDeliverScannedOrder}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-5 py-3 rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
                    >
                      <PackageCheck className="w-5 h-5" />
                      <span>Confirmar Entrega de Pedido</span>
                    </button>
                  ) : (
                    <div className="bg-neutral-100 text-neutral-600 text-xs font-bold p-3 rounded-xl border border-neutral-300 text-center">
                      ✓ Pedido entregado con éxito
                    </div>
                  )}

                  <button
                    onClick={() => { setScannedOrder(null); setScanStatus('idle'); setScanCodeInput(''); }}
                    className="text-neutral-500 hover:text-neutral-800 text-xs font-bold py-1 text-center"
                  >
                    Cerrar verificación
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-rose-500/20 border border-rose-400 text-white p-3 rounded-xl text-xs font-medium flex items-center justify-between">
                <span>⚠️ {scanMessage}</span>
                <button 
                  onClick={() => setScanStatus('idle')}
                  className="text-white hover:underline text-xs font-bold"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-neutral-200 overflow-x-auto text-xs font-extrabold scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'orders'
              ? 'bg-pedidosya-red text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Cola de Pedidos ({kioskOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('capacities')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'capacities'
              ? 'bg-pedidosya-red text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Cupos por Horario</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'inventory'
              ? 'bg-pedidosya-red text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Stock y Menú ({selectedKiosk.menu.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'metrics'
              ? 'bg-pedidosya-red text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Métricas de Ventas</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition shrink-0 ${
            activeTab === 'applications'
              ? 'bg-pedidosya-red text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Solicitudes ({kioskApplications.length})</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Status filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-neutral-500 font-bold px-2">Filtrar:</span>
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'recibido', label: 'Nuevos' },
                { id: 'preparando', label: 'En Preparación' },
                { id: 'listo', label: 'Listos para Retiro' },
                { id: 'entregado', label: 'Entregados' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    orderFilter === f.id
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'bg-white text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSimulateOrder}
              className="text-xs font-bold text-pedidosya-red hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>+ Generar pedido de prueba</span>
            </button>
          </div>

          {displayedOrders.length === 0 ? (
            <div className="p-10 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-400">
              <p className="font-bold text-sm">No hay pedidos con este filtro.</p>
              <button
                onClick={handleSimulateOrder}
                className="mt-3 bg-pedidosya-red text-white text-xs font-bold px-4 py-2 rounded-xl shadow"
              >
                Simular Pedido de Prueba
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    order.status === 'listo'
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : order.status === 'preparando'
                      ? 'border-amber-300 bg-amber-50/50'
                      : order.status === 'entregado'
                      ? 'border-neutral-200 bg-neutral-50 opacity-60'
                      : 'border-pedidosya-red/40 bg-pedidosya-lightRed/40'
                  }`}
                >
                  {/* Order header */}
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-neutral-200/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-neutral-900 text-base">{order.id}</span>
                        <span className="text-[10px] uppercase font-bold bg-white px-2 py-0.5 rounded border border-neutral-200">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 font-medium mt-0.5">
                        Horario de retiro: <strong>{order.pickupTimeStr}</strong>
                      </p>
                    </div>

                    {/* Status badge */}
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      order.status === 'listo'
                        ? 'bg-emerald-600 text-white'
                        : order.status === 'preparando'
                        ? 'bg-amber-500 text-white'
                        : order.status === 'entregado'
                        ? 'bg-neutral-600 text-white'
                        : 'bg-pedidosya-red text-white animate-pulse'
                    }`}>
                      {order.status === 'recibido' && 'Nuevo Pedido'}
                      {order.status === 'preparando' && 'En Preparación'}
                      {order.status === 'listo' && '¡Listo en Mesón!'}
                      {order.status === 'entregado' && 'Entregado'}
                    </span>
                  </div>

                  {/* Customer details */}
                  <div className="py-2 text-xs text-neutral-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="font-bold text-neutral-800">👤 {order.customerName}</span>
                    <span>📱 {order.customerPhone}</span>
                    <span>✉️ {order.customerEmail}</span>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white/80 p-2.5 rounded-xl border border-neutral-200/80 space-y-1 text-xs my-2">
                    {order.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="font-bold text-neutral-800">
                          {it.quantity}x {it.name}
                          {it.notes && <span className="text-[11px] font-normal text-amber-700 ml-1">({it.notes})</span>}
                        </span>
                        <span className="font-semibold text-neutral-600">${((it.price || 0) * (it.quantity || 1)).toLocaleString('es-CL')}</span>
                      </div>
                    ))}
                    <div className="pt-1.5 border-t border-neutral-200 flex justify-between font-black text-neutral-900 text-xs">
                      <span>Total:</span>
                      <span className="text-pedidosya-red">${(order.total || 0).toLocaleString('es-CL')}</span>
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {order.status === 'recibido' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparando')}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 active:scale-95"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Empezar Preparación</span>
                      </button>
                    )}

                    {order.status === 'preparando' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'listo')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 active:scale-95"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Marcar ¡LISTO PARA RETIRAR!</span>
                      </button>
                    )}

                    {order.status === 'listo' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'entregado')}
                        className="bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 active:scale-95"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Confirmar Entrega a Alumno</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GESTIÓN DE CUPOS POR HORARIO & ASAP */}
      {activeTab === 'capacities' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* ASAP Express Capacity */}
          <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-amber-200 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Modo Exprés
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">Pedidos inmediatos (~10-15 min)</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
                  Capacidad para "Retirar lo antes posible"
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Configura cuántos pedidos simultáneos puede aceptar tu quiosco bajo modalidad exprés (1 a 15). Al llenarse, los alumnos sólo podrán reservar en horarios programados.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="flex flex-col">
                  <label className="text-[11px] font-bold text-neutral-700 mb-1">Cupos simultáneos (1 a 15):</label>
                  <select
                    value={selectedKiosk.maxAsapOrders || 5}
                    onChange={(e) => updateKioskAsapSettings(selectedKiosk.id, Number(e.target.value), selectedKiosk.allowAsapPickup ?? true)}
                    className="bg-white border-2 border-amber-300 focus:border-pedidosya-red rounded-xl px-3 py-2 text-xs sm:text-sm font-black text-neutral-900 outline-none shadow-sm cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(n => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'pedido máximo' : 'pedidos simultáneos'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[11px] font-bold text-neutral-700 mb-1">Recepción Exprés:</label>
                  <button
                    type="button"
                    onClick={() => updateKioskAsapSettings(selectedKiosk.id, selectedKiosk.maxAsapOrders || 5, !(selectedKiosk.allowAsapPickup ?? true))}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition shadow-sm ${
                      (selectedKiosk.allowAsapPickup ?? true)
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                    }`}
                  >
                    <span>{(selectedKiosk.allowAsapPickup ?? true) ? '🟢 Aceptando Inmediatos' : '⚪ Pausado por Quiosco'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-800">Carga actual:</span>
                <span className="font-mono font-black text-sm text-neutral-900">
                  {activeAsapOrdersCount} / {selectedKiosk.maxAsapOrders || 5} cupos ocupados
                </span>
                {activeAsapOrdersCount >= (selectedKiosk.maxAsapOrders || 5) && (
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                    Cupos Llenos
                  </span>
                )}
              </div>

              <div className="w-full sm:w-48 bg-neutral-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    activeAsapOrdersCount >= (selectedKiosk.maxAsapOrders || 5)
                      ? 'bg-rose-600'
                      : activeAsapOrdersCount / (selectedKiosk.maxAsapOrders || 5) > 0.6
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.round((activeAsapOrdersCount / (selectedKiosk.maxAsapOrders || 5)) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* SCHEDULED SLOTS CAPACITY BLOCK */}
          <div className="bg-white border-2 border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-pedidosya-pucv text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Control de Recreos y Almuerzos
                  </span>
                  <span className="text-xs text-neutral-500">Cupos por bloque horario</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-neutral-900">
                  Límite de Pedidos Aceptados por Horario Programado
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Establece cuántos pedidos puede preparar tu cocina para cada recreo o turno de almuerzo. Los estudiantes verán en vivo cuántos cupos quedan y se bloqueará cuando se agoten.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
              {scheduledSlots.map((slot) => {
                const capacity = kioskCapacities[slot.id] ?? 8;
                const occupancy = typeof getKioskSlotOccupancy === 'function' 
                  ? getKioskSlotOccupancy(selectedKiosk.id, slot.id) 
                  : 0;
                const isFull = occupancy >= capacity;
                const percent = Math.min(100, Math.round((occupancy / capacity) * 100));

                return (
                  <div 
                    key={slot.id} 
                    className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/70 hover:border-neutral-300 transition flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-pedidosya-red shrink-0" />
                          <h4 className="font-black text-xs sm:text-sm text-neutral-900">{slot.label}</h4>
                        </div>
                        <span className="text-[11px] font-bold text-neutral-500 ml-6 block">
                          Hora retiro: {slot.timeStr}
                        </span>
                      </div>

                      {/* Capacity Stepper */}
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-neutral-300 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateKioskSlotCapacity(selectedKiosk.id, slot.id, Math.max(1, capacity - 1))}
                          className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-black text-sm flex items-center justify-center transition active:scale-95"
                          title="Disminuir cupo"
                        >
                          -
                        </button>
                        <span className="w-9 text-center font-black text-xs text-neutral-900">
                          {capacity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateKioskSlotCapacity(selectedKiosk.id, slot.id, Math.min(25, capacity + 1))}
                          className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-black text-sm flex items-center justify-center transition active:scale-95"
                          title="Aumentar cupo"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Status */}
                    <div className="pt-2 border-t border-neutral-200">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-neutral-700">
                          Ocupación en vivo:
                        </span>
                        <span className={`font-black ${isFull ? 'text-rose-600' : 'text-neutral-900'}`}>
                          {occupancy} de {capacity} cupos ({capacity - occupancy} disponibles)
                        </span>
                      </div>

                      <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            isFull 
                              ? 'bg-rose-600' 
                              : percent > 70 
                              ? 'bg-amber-500' 
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY & STOCK WITH ADD NEW PRODUCT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
            <div>
              <h3 className="font-extrabold text-neutral-900 text-base">
                Gestión de Catálogo y Menú en {selectedKiosk.name}
              </h3>
              <p className="text-xs text-neutral-500">
                Pausa productos temporalmente o agrega nuevos platos a tu vitrina virtual.
              </p>
            </div>

            {/* BUTTON TO OPEN ADD PRODUCT MODAL */}
            <button
              onClick={() => setIsNewProductModalOpen(true)}
              className="bg-pedidosya-red hover:bg-pedidosya-red/90 text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Agregar Nuevo Producto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedKiosk.menu.map((product) => {
              const isSlow = Boolean(product.isSlowFood || product.category === 'comida_lenta');

              return (
                <div
                  key={product.id}
                  className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 flex items-center justify-between gap-3 shadow-sm hover:border-neutral-300 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-neutral-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h5 className="font-bold text-xs text-neutral-900 leading-tight truncate">
                          {product.name}
                        </h5>
                        {isSlow && (
                          <span className="text-[9px] bg-amber-100 text-amber-900 font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 text-amber-600" />
                            <span>Comida Lenta</span>
                          </span>
                        )}
                        {product.isCustomCreated && (
                          <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-md">
                            Creado por Quiosco
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                        {product.description || 'Sin descripción'}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-neutral-900 font-black">
                          ${(product.price || 0).toLocaleString('es-CL')}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          ⏱ {product.prepTimeMinutes || (isSlow ? 20 : 8)} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Availability toggle */}
                    <button
                      onClick={() => toggleProductAvailability(selectedKiosk.id, product.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition shadow-sm ${
                        product.available
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                      }`}
                    >
                      {product.available ? '🟢 Activo' : '🔴 Pausado'}
                    </button>

                    {/* Delete button if custom created */}
                    {product.isCustomCreated && (
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Seguro que deseas eliminar "${product.name}" del menú?`)) {
                            deleteProductFromKiosk(selectedKiosk.id, product.id);
                          }
                        }}
                        className="text-neutral-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: METRICS & SALES DASHBOARD */}
      {activeTab === 'metrics' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="font-extrabold text-neutral-900 text-base">
              Rendimiento y Métricas de Ventas en {selectedKiosk.name}
            </h3>
            <p className="text-xs text-neutral-500">
              Desglose financiero diario, medios de pago y flujo de reservas.
            </p>
          </div>

          {/* Financial Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-black mb-1">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>JUNAEB BAES (Sodexo / Edenred)</span>
                </span>
                <span>{countJunaeb} ventas</span>
              </div>
              <p className="text-2xl font-black text-emerald-950">${salesJunaeb.toLocaleString('es-CL')}</p>
              <p className="text-[11px] text-emerald-700 mt-1">
                Representa el {totalSales > 0 ? Math.round((salesJunaeb / totalSales) * 100) : 0}% de los ingresos
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-blue-800 text-xs font-black mb-1">
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" />
                  <span>WebPay Débito / Crédito</span>
                </span>
                <span>{countWebpay} ventas</span>
              </div>
              <p className="text-2xl font-black text-blue-950">${salesWebpay.toLocaleString('es-CL')}</p>
              <p className="text-[11px] text-blue-700 mt-1">
                Representa el {totalSales > 0 ? Math.round((salesWebpay / totalSales) * 100) : 0}% de los ingresos
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-amber-800 text-xs font-black mb-1">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>Efectivo en Caja</span>
                </span>
                <span>{countCash} ventas</span>
              </div>
              <p className="text-2xl font-black text-amber-950">${salesCash.toLocaleString('es-CL')}</p>
              <p className="text-[11px] text-amber-700 mt-1">
                Representa el {totalSales > 0 ? Math.round((salesCash / totalSales) * 100) : 0}% de los ingresos
              </p>
            </div>
          </div>

          {/* Operational summary */}
          <div className="bg-neutral-50 border border-neutral-200 p-4 sm:p-5 rounded-2xl text-xs space-y-3">
            <h4 className="font-black text-sm text-neutral-900">Resumen Operativo de la Jornada</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-neutral-700">
              <div className="bg-white p-3 rounded-xl border border-neutral-200">
                <span className="text-neutral-400 block text-[10px] font-bold">TOTAL PEDIDOS:</span>
                <strong className="text-base font-black text-neutral-900">{kioskOrders.length}</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-neutral-200">
                <span className="text-neutral-400 block text-[10px] font-bold">ENTREGADOS CON ÉXITO:</span>
                <strong className="text-base font-black text-emerald-700">{deliveredOrders.length}</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-neutral-200">
                <span className="text-neutral-400 block text-[10px] font-bold">TICKET PROMEDIO:</span>
                <strong className="text-base font-black text-neutral-900">${avgTicket.toLocaleString('es-CL')}</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-neutral-200">
                <span className="text-neutral-400 block text-[10px] font-bold">ESTADO DE CAJA:</span>
                <strong className="text-base font-black text-emerald-600">Al Día ✓</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: KIOSK AFFILIATION APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-neutral-900 text-base">
                Solicitudes de Afiliación Recibidas ({kioskApplications.length})
              </h3>
              <p className="text-xs text-neutral-500">
                Formularios completados por quioscos y casinos para incorporarse a EatPUCV
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {kioskApplications.map((app) => (
              <div
                key={app.id}
                className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 hover:border-neutral-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-neutral-900">{app.kioskName}</h4>
                      <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-neutral-300">
                        {app.id}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                        {app.status === 'aprobado' ? 'Aprobado / Activo' : 'En Revisión'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-pedidosya-red" />
                      <span>{app.campusName || 'Campus PUCV'} • {app.locationDetails}</span>
                    </p>
                  </div>

                  <span className="text-[11px] text-neutral-400 font-medium">
                    {new Date(app.createdAt).toLocaleDateString('es-CL')}
                  </span>
                </div>

                <div className="pt-2 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2 text-neutral-600">
                  <div>
                    <span className="text-neutral-400 block text-[10px] font-bold">ENCARGADO:</span>
                    <strong className="text-neutral-800">{app.ownerName}</strong> ({app.rut})
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] font-bold">CONTACTO:</span>
                    <span>{app.email} • {app.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] font-bold">CONVENIO JUNAEB:</span>
                    <span className="font-bold text-emerald-700">
                      {app.acceptsJunaeb ? '✅ Acepta JUNAEB BAES' : '❌ No'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR NUEVO PRODUCTO AL MENÚ */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div 
            className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-pedidosya-red text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg leading-tight">
                    Nuevo Plato / Producto
                  </h3>
                  <p className="text-xs text-white/80">
                    Añade un item al menú de <strong>{selectedKiosk.name}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateProductSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Product Title */}
              <div>
                <label className="block text-xs font-black text-neutral-800 mb-1">
                  Título / Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Churrasco Luco Especial en Pan Amasado"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-neutral-900 outline-none focus:border-pedidosya-red focus:bg-white transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-neutral-800 mb-1">
                  Descripción e Ingredientes
                </label>
                <textarea
                  rows="2"
                  placeholder="Ej: Carne de vacuno a la plancha, queso chanco fundido, pan amasado artesanal tostado..."
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-pedidosya-red focus:bg-white transition resize-none"
                />
              </div>

              {/* Price & Category in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-neutral-800 mb-1">
                    Precio ($ CLP) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
                    <input
                      type="number"
                      required
                      min="100"
                      step="100"
                      placeholder="3990"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-black text-neutral-900 outline-none focus:border-pedidosya-red focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-neutral-800 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setNewProductForm(prev => ({ 
                        ...prev, 
                        category: cat,
                        isSlowFood: cat === 'comida_lenta' ? true : prev.isSlowFood,
                        prepTimeMinutes: cat === 'comida_lenta' ? 20 : prev.prepTimeMinutes
                      }));
                    }}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-900 outline-none focus:border-pedidosya-red focus:bg-white transition cursor-pointer"
                  >
                    <option value="comida_lenta">🥩 Comida Lenta (A la plancha / Churrascos)</option>
                    <option value="completos">🌭 Sándwiches & Completos</option>
                    <option value="cafeteria">☕ Cafetería & Desayunos</option>
                    <option value="bebidas">🥤 Bebidas & Jugos</option>
                    <option value="dulces">🍰 Repostería & Dulces</option>
                    <option value="saludable">🥗 Saludable & Ensaladas</option>
                  </select>
                </div>
              </div>

              {/* Slow Food Switch & Prep Time */}
              <div className="bg-amber-50/80 border border-amber-300 p-3.5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="pr-2">
                    <span className="font-black text-xs text-amber-950 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      <span>¿Es Comida Lenta / Cocción a pedido?</span>
                    </span>
                    <p className="text-[11px] text-amber-800">
                      Desactivará "Lo antes posible" en el checkout para dar tiempo a la cocina.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={newProductForm.isSlowFood}
                    onChange={(e) => setNewProductForm(prev => ({ 
                      ...prev, 
                      isSlowFood: e.target.checked,
                      prepTimeMinutes: e.target.checked ? Math.max(20, prev.prepTimeMinutes) : 8
                    }))}
                    className="w-5 h-5 accent-pedidosya-red rounded cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-900">Tiempo estimado de cocción:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="2"
                      max="60"
                      value={newProductForm.prepTimeMinutes}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, prepTimeMinutes: Number(e.target.value) || 10 }))}
                      className="w-16 bg-white border border-amber-300 rounded-lg px-2 py-1 text-center font-bold text-xs"
                    />
                    <span className="text-amber-900 text-xs font-semibold">minutos</span>
                  </div>
                </div>
              </div>

              {/* Accepts JUNAEB */}
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💳</span>
                  <div>
                    <span className="font-bold text-xs text-neutral-800 block">Acepta Tarjeta JUNAEB (BAES)</span>
                    <span className="text-[10px] text-neutral-500">Permite pagar con Sodexo / Pluxee / Edenred</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={newProductForm.acceptsJunaeb}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, acceptsJunaeb: e.target.checked }))}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Image Selection */}
              <div>
                <label className="block text-xs font-black text-neutral-800 mb-1">
                  Imagen del Producto
                </label>
                
                {/* Photo Presets Grid */}
                <div className="mb-2">
                  <span className="text-[11px] text-neutral-500 font-medium block mb-1.5">
                    Selecciona una foto rápida de comida PUCV:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {PRODUCT_IMAGE_PRESETS.map((preset) => {
                      const isSelected = newProductForm.image === preset.url;
                      return (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => setNewProductForm(prev => ({ ...prev, image: preset.url }))}
                          className={`relative rounded-xl overflow-hidden border-2 transition text-left group ${
                            isSelected ? 'border-pedidosya-red ring-2 ring-pedidosya-red/30' : 'border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          <img 
                            src={preset.url} 
                            alt={preset.name} 
                            className="w-full h-12 object-cover"
                          />
                          <span className="text-[9px] font-bold text-neutral-700 block truncate px-1 py-0.5 bg-white/90">
                            {preset.name}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-pedidosya-red text-white flex items-center justify-center text-[10px]">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom URL or upload file */}
                <div className="space-y-2 mt-2 pt-2 border-t border-neutral-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="O pega una URL de imagen (https://...)"
                      value={newProductForm.image}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, image: e.target.value }))}
                      className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-800 outline-none focus:border-pedidosya-red"
                    />
                    <label className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir foto</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* Preview Box */}
                {newProductForm.image && (
                  <div className="mt-2.5 p-2 bg-neutral-100 rounded-xl flex items-center gap-3 border border-neutral-200">
                    <img 
                      src={newProductForm.image} 
                      alt="Preview" 
                      className="w-12 h-12 rounded-lg object-cover border border-neutral-300"
                    />
                    <div className="text-[11px]">
                      <span className="text-neutral-500 block">Vista previa en tienda:</span>
                      <strong className="text-neutral-900">{newProductForm.name || 'Título de producto'}</strong>
                      <span className="text-pedidosya-red font-black ml-2">${Number(newProductForm.price || 0).toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-100 font-bold transition text-xs"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-pedidosya-red hover:bg-pedidosya-red/90 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar Producto en el Menú</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
