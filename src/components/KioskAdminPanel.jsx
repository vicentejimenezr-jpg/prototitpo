import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  Check
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
    adminSelectedKioskId,
    setAdminSelectedKioskId,
    setIsAdminMode,
    isKioskAuthenticated,
    kioskUser,
    logoutKiosk,
    kioskApplications,
    simulateIncomingOrder
  } = useApp();

  // Internal tab state: 'orders' | 'inventory' | 'applications'
  const [activeTab, setActiveTab] = useState('orders');
  const [orderFilter, setOrderFilter] = useState('todos'); // 'todos' | 'recibido' | 'preparando' | 'listo' | 'entregado'
  const [simulatedAlert, setSimulatedAlert] = useState(false);

  const selectedKiosk = kiosks.find(k => k.id === adminSelectedKioskId) || kiosks[0];

  // Active ASAP / Express orders currently in kitchen for this kiosk
  const activeAsapOrdersCount = getKioskActiveAsapOrders ? getKioskActiveAsapOrders(selectedKiosk.id) : 0;

  // Filter orders for this kiosk
  const kioskOrders = orders.filter(o => o.kioskId === selectedKiosk.id);
  const activeOrders = kioskOrders.filter(o => o.status !== 'entregado' && o.status !== 'cancelado');
  const totalSales = kioskOrders.reduce((acc, o) => acc + o.total, 0);

  // Filter orders by status
  const displayedOrders = kioskOrders.filter(o => {
    if (orderFilter === 'todos') return true;
    return o.status === orderFilter;
  });

  // Handle Order Simulation
  const handleSimulateOrder = () => {
    simulateIncomingOrder(selectedKiosk.id);
    setSimulatedAlert(true);
    setTimeout(() => setSimulatedAlert(false), 4000);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-pedidosya-pucv/20 shadow-xl p-3.5 sm:p-6 md:p-7 mb-6 sm:mb-8 animate-fadeIn">
      
      {/* Top Session Bar (Shows authenticated kiosk operator local123) */}
      <div className="bg-pedidosya-pucv text-white rounded-xl sm:rounded-2xl p-3 sm:p-3.5 mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pedidosya-red flex items-center justify-center text-white font-black shrink-0">
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

      {/* Simulated Alert Notification */}
      {simulatedAlert && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 px-4 py-3 rounded-2xl mb-5 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔔</span>
            <div className="text-xs">
              <strong className="block text-emerald-800 text-sm">¡Nuevo Pedido Recibido en Modo Quiosco!</strong>
              <span>Un alumno acaba de reservar para el recreo. Se ha añadido a la cola de pedidos.</span>
            </div>
          </div>
          <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2 py-1 rounded-lg">
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
            <span className="text-xs text-neutral-500">Gestión de reservas de recreo</span>
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
          <p className="text-xs font-bold text-rose-800">Reservas Activas por preparar</p>
          <p className="text-2xl font-black text-rose-900 mt-1">{activeOrders.length}</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
          <p className="text-xs font-bold text-emerald-800">Total Reservas del Día</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">{kioskOrders.length}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
          <p className="text-xs font-bold text-blue-800">Ventas Acumuladas</p>
          <p className="text-2xl font-black text-blue-900 mt-1">${totalSales.toLocaleString('es-CL')}</p>
        </div>
      </div>

      {/* KIOSK ASAP CAPACITY CONTROL (Req: Lista del 1 al 15 para 'Retirar lo antes posible') */}
      <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-200 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Control de Mesón Express
              </span>
              <span className="text-xs text-neutral-500 font-medium">Pedidos inmediatos</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
              Capacidad máxima para "Retirar lo antes posible"
            </h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Configura cuántos pedidos simultáneos puede aceptar tu quiosco bajo la modalidad exprés (1 a 15). Al coparse los cupos, los estudiantes deberán reservar para un recreo programado.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Dropdown 1 to 15 */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-neutral-700 mb-1">Cupos en simultáneo (1 a 15):</label>
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

            {/* Toggle Switch */}
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

        {/* Status Bar */}
        <div className="mt-3.5 pt-3 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800">Carga actual de cocina:</span>
            <span className="font-mono font-black text-sm text-neutral-900">
              {activeAsapOrdersCount} / {selectedKiosk.maxAsapOrders || 5} cupos ocupados
            </span>
            {activeAsapOrdersCount >= (selectedKiosk.maxAsapOrders || 5) && (
              <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                Cupos Llenos (Cerrado a nuevos exprés)
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

      {/* Internal Navigation Tabs (Orders, Inventory, Submitted Applications) */}
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-neutral-200 overflow-x-auto text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'orders'
              ? 'bg-pedidosya-red text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Cola de Pedidos ({kioskOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'inventory'
              ? 'bg-pedidosya-red text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Stock de Menú ({selectedKiosk.menu.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'applications'
              ? 'bg-pedidosya-red text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Solicitudes de Nuevos Quioscos ({kioskApplications.length})</span>
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
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="font-bold text-neutral-800">
                          {it.quantity}x {it.name}
                          {it.notes && <span className="text-[11px] font-normal text-amber-700 ml-1">({it.notes})</span>}
                        </span>
                        <span className="font-semibold text-neutral-600">${(it.price * it.quantity).toLocaleString('es-CL')}</span>
                      </div>
                    ))}
                    <div className="pt-1.5 border-t border-neutral-200 flex justify-between font-black text-neutral-900 text-xs">
                      <span>Total:</span>
                      <span className="text-pedidosya-red">${order.total.toLocaleString('es-CL')}</span>
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {order.status === 'recibido' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparando')}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Empezar Preparación</span>
                      </button>
                    )}

                    {order.status === 'preparando' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'listo')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Marcar ¡LISTO PARA RETIRAR!</span>
                      </button>
                    )}

                    {order.status === 'listo' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'entregado')}
                        className="bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1"
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

      {/* TAB 2: INVENTORY & STOCK TOGGLE */}
      {activeTab === 'inventory' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-neutral-900 text-base">
              Disponibilidad de Productos en {selectedKiosk.name}
            </h3>
            <span className="text-xs text-neutral-500">Haz clic para marcar Disponible / Agotado</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedKiosk.menu.map((product) => (
              <div
                key={product.id}
                className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 flex items-center justify-between gap-3 shadow-sm hover:border-neutral-300 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-neutral-900 leading-tight">
                      {product.name}
                    </h5>
                    <span className="text-xs text-neutral-600 font-semibold">
                      ${product.price.toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleProductAvailability(selectedKiosk.id, product.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition shadow-sm ${
                    product.available
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                  }`}
                >
                  {product.available ? '🟢 Disponible' : '🔴 Agotado'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: KIOSK AFFILIATION APPLICATIONS */}
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

    </div>
  );
}
