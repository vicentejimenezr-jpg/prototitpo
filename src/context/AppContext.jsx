import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_KIOSKS, CAMPUSES } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load kiosks from localStorage or initial (merged with latest categories)
  const [kiosks, setKiosks] = useState(() => {
    try {
      const saved = localStorage.getItem('pucv_kiosks_v3');
      if (saved) return JSON.parse(saved);
      return INITIAL_KIOSKS;
    } catch (e) {
      return INITIAL_KIOSKS;
    }
  });

  // Active campus filter
  const [selectedCampus, setSelectedCampus] = useState('todos');

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Additional filters
  const [filterOnlyOpen, setFilterOnlyOpen] = useState(false);
  const [filterAcceptsJunaeb, setFilterAcceptsJunaeb] = useState(false);

  // Cart: items must belong to ONE kiosk or handle multi-kiosk warning
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('pucv_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Current active kiosk modal
  const [activeKiosk, setActiveKiosk] = useState(null);

  // Current product modal for customization
  const [activeCustomizingProduct, setActiveCustomizingProduct] = useState(null);

  // Cart Drawer open state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Reservation checkout modal open
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Active view: 'browse' (cards) or 'map'
  const [currentView, setCurrentView] = useState('browse');

  // Admin / Kiosk Vendor mode toggle
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminSelectedKioskId, setAdminSelectedKioskId] = useState(INITIAL_KIOSKS[0].id);

  // -------------------------------------------------------------
  // KIOSK AUTHENTICATION & PORTAL STATE
  // -------------------------------------------------------------
  const [credentials, setCredentials] = useState(() => {
    try {
      const saved = localStorage.getItem('pucv_kiosk_credentials');
      return saved ? JSON.parse(saved) : { local123: 'local123' };
    } catch (e) {
      return { local123: 'local123' };
    }
  });

  const [isKioskAuthenticated, setIsKioskAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('pucv_kiosk_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [kioskUser, setKioskUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pucv_kiosk_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isKioskAuthModalOpen, setIsKioskAuthModalOpen] = useState(false);
  const [kioskAuthTab, setKioskAuthTab] = useState('login'); // 'login' | 'register' | 'recover'

  // Kiosk Affiliation Applications (Forms filled by vendors wanting to join)
  const [kioskApplications, setKioskApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('pucv_kiosk_applications');
      return saved ? JSON.parse(saved) : [
        {
          id: 'SOL-PUCV-101',
          kioskName: 'Café & Dulces Sausalito',
          campusId: 'sausalito',
          campusName: 'Campus Sausalito',
          locationDetails: 'Frente a cancha y gimnasio',
          ownerName: 'Claudio Garrido',
          rut: '14.285.320-K',
          email: 'claudio.garrido@quiosco.pucv.cl',
          phone: '+56 9 7654 3210',
          category: 'cafeteria',
          openingHours: '08:30 - 18:00',
          acceptsJunaeb: true,
          status: 'aprobado',
          createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // Orders list
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('pucv_orders');
      if (saved) return JSON.parse(saved);
      // Sample mock initial order to showcase tracking
      return [
        {
          id: 'PUCV-742',
          kioskId: 'kiosk-central-1',
          kioskName: 'El Cafecito Central',
          campusName: 'Casa Central PUCV',
          locationDetails: 'Patio Central frente a Aula Magna',
          items: [
            {
              id: 'p-c1-1',
              name: 'Sandwich Mechada Italiana en Marraqueta',
              price: 3990,
              quantity: 1,
              notes: 'Con ají verde bien tostada la marraqueta',
              selectedOptions: { bread: 'Marraqueta Porteña' }
            },
            {
              id: 'p-c1-3',
              name: 'Café Cappuccino Grano Illy (12oz)',
              price: 2200,
              quantity: 1,
              notes: '',
              selectedOptions: { milk: 'Leche Descremada' }
            }
          ],
          total: 6190,
          customerName: 'Vicente Morales',
          customerEmail: 'vicente.morales@pucv.cl',
          customerPhone: '+56 9 8765 4321',
          pickupTime: 'Recreo de mañana (11:15 - 11:30)',
          pickupTimeStr: '11:15 hrs',
          paymentMethod: 'JUNAEB Sodexo / Pluxee',
          status: 'preparando', // 'recibido' | 'preparando' | 'listo' | 'entregado'
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // Currently tracking order (for live modal)
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('pucv_kiosks_v3', JSON.stringify(kiosks));
  }, [kiosks]);

  useEffect(() => {
    localStorage.setItem('pucv_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pucv_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pucv_kiosk_credentials', JSON.stringify(credentials));
  }, [credentials]);

  useEffect(() => {
    localStorage.setItem('pucv_kiosk_applications', JSON.stringify(kioskApplications));
  }, [kioskApplications]);

  // Kiosk Authentication Handlers
  const openKioskAuth = (tab = 'login') => {
    setKioskAuthTab(tab);
    setIsKioskAuthModalOpen(true);
  };

  const closeKioskAuth = () => {
    setIsKioskAuthModalOpen(false);
  };

  const loginKiosk = (inputUsername, inputPassword) => {
    const normalizedUser = inputUsername.trim().toLowerCase();
    const storedPass = credentials[normalizedUser];

    // Check credentials (specifically handles local123 / local123 as requested)
    const isValid = 
      (normalizedUser === 'local123' && (inputPassword === 'local123' || inputPassword === storedPass)) ||
      (storedPass && storedPass === inputPassword);

    if (isValid) {
      const userObj = {
        username: normalizedUser,
        name: normalizedUser === 'local123' ? 'El Cafecito Central (local123)' : `Quiosco ${normalizedUser}`,
        kioskId: 'kiosk-central-1',
        kioskName: 'El Cafecito Central',
        campusName: 'Casa Central PUCV',
        role: 'Encargado de Quiosco',
        loginTime: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
      };

      setIsKioskAuthenticated(true);
      setKioskUser(userObj);
      setIsAdminMode(true);
      setAdminSelectedKioskId('kiosk-central-1');

      localStorage.setItem('pucv_kiosk_auth', 'true');
      localStorage.setItem('pucv_kiosk_user', JSON.stringify(userObj));

      return { success: true };
    }

    return {
      success: false,
      message: 'Credenciales inválidas. Usa el usuario demo "local123" y la contraseña "local123".'
    };
  };

  const logoutKiosk = () => {
    setIsKioskAuthenticated(false);
    setKioskUser(null);
    setIsAdminMode(false);
    localStorage.removeItem('pucv_kiosk_auth');
    localStorage.removeItem('pucv_kiosk_user');
  };

  const recoverPassword = (identifier, newPassword) => {
    const normalized = identifier.trim().toLowerCase();
    
    // Check if matches local123 or general PUCV kiosk identifier
    if (normalized === 'local123' || normalized.includes('local123') || normalized.includes('pucv.cl')) {
      const updated = { ...credentials, local123: newPassword || 'local123' };
      setCredentials(updated);
      localStorage.setItem('pucv_kiosk_credentials', JSON.stringify(updated));
      return {
        success: true,
        message: 'Contraseña restablecida exitosamente para la cuenta "local123".'
      };
    }

    if (credentials[normalized]) {
      const updated = { ...credentials, [normalized]: newPassword };
      setCredentials(updated);
      localStorage.setItem('pucv_kiosk_credentials', JSON.stringify(updated));
      return {
        success: true,
        message: `Contraseña restablecida exitosamente para ${normalized}.`
      };
    }

    return {
      success: false,
      message: 'No se encontró ningún quiosco asociado a este usuario o correo institucional.'
    };
  };

  // Submit new Kiosk Application (from the register form)
  const submitKioskApplication = (formData) => {
    const randomCode = Math.floor(100 + Math.random() * 900);
    const appId = `SOL-PUCV-${randomCode}`;
    const campusObj = CAMPUSES.find(c => c.id === formData.campusId) || CAMPUSES[1];

    const newApp = {
      id: appId,
      ...formData,
      campusName: campusObj.name,
      status: 'aprobado', // Demo auto-approval
      createdAt: new Date().toISOString()
    };

    setKioskApplications(prev => [newApp, ...prev]);

    // Add to the live kiosks list so user can see their newly created kiosk immediately
    const newKioskId = `kiosk-nuevo-${Date.now()}`;
    const newKiosk = {
      id: newKioskId,
      name: formData.kioskName,
      campusId: formData.campusId,
      campusName: campusObj.name,
      locationDetails: formData.locationDetails,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=150&q=80',
      rating: 5.0,
      reviewsCount: 1,
      pickupTimeMin: 10,
      pickupTimeMax: 15,
      minOrder: 1000,
      isOpen: true,
      openingHours: formData.openingHours || '08:00 - 18:30',
      acceptsJunaeb: formData.acceptsJunaeb ?? true,
      featuredBadge: '¡Nuevo Quiosco!',
      lat: campusObj.lat,
      lng: campusObj.lng,
      phone: formData.phone || '+56 9 1234 5678',
      menu: [
        {
          id: `p-${newKioskId}-1`,
          name: 'Promo Apertura: Sandwich + Bebida',
          description: 'Sandwich a elección caliente con bebida o jugo a elección.',
          price: 3500,
          category: 'completos',
          image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
          available: true
        },
        {
          id: `p-${newKioskId}-2`,
          name: 'Café Espresso Doble de Grano',
          description: 'Café caliente de especialidad recién molido.',
          price: 1800,
          category: 'cafeteria',
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
          available: true
        }
      ]
    };

    setKiosks(prev => [newKiosk, ...prev]);

    return { success: true, application: newApp, kiosk: newKiosk };
  };

  // Simulate an incoming order for live testing in kiosk admin mode
  const simulateIncomingOrder = (targetKioskId) => {
    const kioskId = targetKioskId || adminSelectedKioskId || 'kiosk-central-1';
    const kiosk = kiosks.find(k => k.id === kioskId) || kiosks[0];
    const randomId = Math.floor(100 + Math.random() * 900);
    const orderNum = `PUCV-${randomId}`;

    const sampleNames = ['Sofía Valenzuela', 'Benjamín Araya', 'Camila Soto', 'Matías Silva', 'Catalina Rojas', 'Ignacio Vera'];
    const randomCustomer = sampleNames[Math.floor(Math.random() * sampleNames.length)];

    const sampleItems = kiosk.menu.slice(0, 2).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
      notes: 'Para retirar en el recreo de las 11:15',
      selectedOptions: {}
    }));

    const orderTotal = sampleItems.reduce((acc, it) => acc + it.price, 0);

    const mockOrder = {
      id: orderNum,
      kioskId: kiosk.id,
      kioskName: kiosk.name,
      campusName: kiosk.campusName,
      locationDetails: kiosk.locationDetails,
      items: sampleItems,
      total: orderTotal,
      customerName: randomCustomer,
      customerEmail: `${randomCustomer.toLowerCase().replace(' ', '.')}@pucv.cl`,
      customerPhone: '+56 9 9876 5432',
      pickupTime: 'Recreo de mañana (11:15 - 11:30)',
      pickupTimeStr: '11:15 hrs',
      paymentMethod: 'JUNAEB Sodexo / Pluxee',
      status: 'recibido',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [mockOrder, ...prev]);
    return mockOrder;
  };

  // Cart Actions
  const addToCart = (product, kiosk, quantity = 1, options = {}, notes = '') => {
    // If cart has items from another kiosk, ask user or clear
    if (cart.length > 0 && cart[0].kioskId !== kiosk.id) {
      const confirmChange = window.confirm(
        `Tu carrito ya tiene productos de "${cart[0].kioskName}". ¿Deseas vaciarlo y agregar de "${kiosk.name}"?`
      );
      if (!confirmChange) return false;
      setCart([]);
    }

    const cartItemId = `${product.id}-${Date.now()}`;
    const newItem = {
      cartItemId,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      isSlowFood: Boolean(product.isSlowFood || product.category === 'comida_lenta'),
      kioskId: kiosk.id,
      kioskName: kiosk.name,
      campusName: kiosk.campusName,
      quantity,
      selectedOptions: options,
      notes,
      subtotal: product.price * quantity
    };

    setCart(prev => {
      // If exact same item and exact same options & notes exist, just increase quantity
      const existingIndex = prev.findIndex(
        item => item.id === product.id &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(options) &&
        item.notes === notes
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].subtotal = updated[existingIndex].quantity * updated[existingIndex].price;
        return updated;
      }
      return [...prev, newItem];
    });

    setIsCartOpen(true);
    return true;
  };

  const updateCartItemQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQty, subtotal: item.price * newQty }
          : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Create Reservation Order
  const createReservation = (reservationData) => {
    if (!cart || cart.length === 0) return null;
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const newOrderId = `PUCV-${randomDigits}`;
    const firstCartItem = cart[0] || {};
    const kiosk = (kiosks && kiosks.find(k => k && k.id === firstCartItem.kioskId)) || {};

    const newOrder = {
      id: newOrderId,
      kioskId: kiosk?.id || firstCartItem.kioskId || 'kiosk-central-1',
      kioskName: kiosk?.name || firstCartItem.kioskName || 'Quiosco PUCV',
      campusName: kiosk?.campusName || firstCartItem.campusName || 'Campus PUCV',
      locationDetails: kiosk?.locationDetails || 'Punto de entrega en campus',
      items: [...cart],
      total: cartTotal || 0,
      customerName: reservationData.customerName || 'Estudiante PUCV',
      customerEmail: reservationData.customerEmail || 'estudiante@pucv.cl',
      customerPhone: reservationData.customerPhone || '+56 9 0000 0000',
      pickupTime: reservationData.pickupTime || 'Horario programado',
      pickupTimeStr: reservationData.pickupTimeStr || 'Horario programado',
      paymentMethod: reservationData.paymentMethod || 'Efectivo',
      orderNote: reservationData.orderNote || '',
      status: 'recibido',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setTrackingOrder(newOrder);

    // Simulate kiosk acknowledging order after 8 seconds
    setTimeout(() => {
      setOrders(current =>
        current.map(o => (o.id === newOrderId ? { ...o, status: 'preparando' } : o))
      );
      setTrackingOrder(current =>
        current && current.id === newOrderId ? { ...current, status: 'preparando' } : current
      );
    }, 8000);

    return newOrder;
  };

  // Vendor action: Update Order Status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    if (trackingOrder && trackingOrder.id === orderId) {
      setTrackingOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Vendor action: Toggle Product Availability
  const toggleProductAvailability = (kioskId, productId) => {
    setKiosks(prev =>
      prev.map(k => {
        if (k.id !== kioskId) return k;
        return {
          ...k,
          menu: k.menu.map(p => (p.id === productId ? { ...p, available: !p.available } : p))
        };
      })
    );
  };

  // Vendor action: Toggle Kiosk Open/Closed
  const toggleKioskOpen = (kioskId) => {
    setKiosks(prev =>
      prev.map(k => (k.id === kioskId ? { ...k, isOpen: !k.isOpen } : k))
    );
  };

  // Vendor action: Update "Lo antes posible" capacity & toggle (1 to 15)
  const updateKioskAsapSettings = (kioskId, maxOrders, allowAsap) => {
    setKiosks(prev =>
      prev.map(k => {
        if (k.id !== kioskId) return k;
        return {
          ...k,
          maxAsapOrders: Math.min(15, Math.max(1, Number(maxOrders) || 5)),
          allowAsapPickup: allowAsap !== undefined ? Boolean(allowAsap) : (k.allowAsapPickup ?? true)
        };
      })
    );
  };

  // Helper to count active ASAP orders for a kiosk
  const getKioskActiveAsapOrders = (kioskId) => {
    if (!orders || !Array.isArray(orders)) return 0;
    return orders.filter(o => {
      if (!o || o.kioskId !== kioskId) return false;
      if (o.status === 'entregado' || o.status === 'cancelado') return false;
      const pt = typeof o.pickupTime === 'string' ? o.pickupTime.toLowerCase() : '';
      const pts = typeof o.pickupTimeStr === 'string' ? o.pickupTimeStr.toLowerCase() : '';
      return pt.includes('antes') || pts.includes('min') || pt.includes('inmediato');
    }).length;
  };

  // Real-time Clock & Simulated Time for Testing (e.g. Test 12:45)
  const [simulatedTime, setSimulatedTime] = useState(null); // e.g. { hour: 12, minute: 45 } or null for real time

  const getCurrentTime = () => {
    if (simulatedTime) {
      const hStr = String(simulatedTime.hour).padStart(2, '0');
      const mStr = String(simulatedTime.minute).padStart(2, '0');
      return {
        hour: simulatedTime.hour,
        minute: simulatedTime.minute,
        timeStr: `${hStr}:${mStr}`,
        isSimulated: true
      };
    }
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const hStr = String(hour).padStart(2, '0');
    const mStr = String(minute).padStart(2, '0');
    return {
      hour,
      minute,
      timeStr: `${hStr}:${mStr}`,
      isSimulated: false
    };
  };

  // Filtered Kiosks
  const filteredKiosks = kiosks.filter(kiosk => {
    // Campus filter
    if (selectedCampus !== 'todos' && kiosk.campusId !== selectedCampus) {
      return false;
    }
    // Only open
    if (filterOnlyOpen && !kiosk.isOpen) {
      return false;
    }
    // Accepts JUNAEB
    if (filterAcceptsJunaeb && !kiosk.acceptsJunaeb) {
      return false;
    }
    // Category filter: checks if kiosk has products in that category
    if (selectedCategory !== 'todos') {
      const hasCategory = kiosk.menu.some(p => p.category === selectedCategory);
      if (!hasCategory) return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = kiosk.name.toLowerCase().includes(q);
      const matchCampus = kiosk.campusName.toLowerCase().includes(q);
      const matchProduct = kiosk.menu.some(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
      if (!matchName && !matchCampus && !matchProduct) return false;
    }
    return true;
  });

  return (
    <AppContext.Provider
      value={{
        kiosks,
        filteredKiosks,
        campuses: CAMPUSES,
        selectedCampus,
        setSelectedCampus,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filterOnlyOpen,
        setFilterOnlyOpen,
        filterAcceptsJunaeb,
        setFilterAcceptsJunaeb,
        cart,
        cartTotal,
        cartItemCount,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        activeKiosk,
        setActiveKiosk,
        activeCustomizingProduct,
        setActiveCustomizingProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        currentView,
        setCurrentView,
        isAdminMode,
        setIsAdminMode,
        adminSelectedKioskId,
        setAdminSelectedKioskId,
        orders,
        trackingOrder,
        setTrackingOrder,
        createReservation,
        updateOrderStatus,
        toggleProductAvailability,
        toggleKioskOpen,
        updateKioskAsapSettings,
        getKioskActiveAsapOrders,
        simulatedTime,
        setSimulatedTime,
        getCurrentTime,
        // Kiosk Auth & Applications
        isKioskAuthenticated,
        kioskUser,
        isKioskAuthModalOpen,
        kioskAuthTab,
        setKioskAuthTab,
        openKioskAuth,
        closeKioskAuth,
        loginKiosk,
        logoutKiosk,
        recoverPassword,
        kioskApplications,
        submitKioskApplication,
        simulateIncomingOrder
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
