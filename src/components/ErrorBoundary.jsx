import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('EatPUCV ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('pucv_cart');
      localStorage.removeItem('pucv_orders');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-6 sm:p-8 text-center border border-neutral-200">
            <div className="w-14 h-14 bg-red-100 text-pedidosya-red rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-neutral-900 mb-2">
              ¡Ups! Algo no salió como esperábamos
            </h2>
            <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
              Ocurrió un error temporal al procesar la vista. Puedes refrescar o restablecer la sesión para continuar reservando normalmente.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-pedidosya-red hover:bg-pedidosya-darkRed text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reintentar y recargar página</span>
              </button>
              <button
                onClick={this.handleReset}
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Home className="w-4 h-4" />
                <span>Limpiar carrito y volver a inicio</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

