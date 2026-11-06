# EatPUCV 🍔☕ - Plataforma para Quioscos de la PUCV

Aplicación web interactiva estilo **PedidosYa** diseñada específicamente para la comunidad universitaria de la **Pontificia Universidad Católica de Valparaíso (PUCV)** en la Región de Valparaíso (Valparaíso, Viña del Mar y Curauma).

Permite a los estudiantes explorar quioscos por campus, ver menús, personalizar pedidos, **reservar comida para retirar sin hacer filas en los recreos**, rastrear el estado del pedido en tiempo real con ticket/código QR y pagar con la Beca JUNAEB BAES (Sodexo/Edenred) o Webpay.

---

## 🚀 Características Principales

### 1. Exploración y Mapa de Quioscos en la Región de Valparaíso
- **Selector de Campus PUCV**:
  - **Casa Central** (Av. Brasil 2950, Valparaíso)
  - **Campus Sausalito** (Av. El Bosque 1290, Viña del Mar)
  - **Edificio Isabel Brown Caces - IBC** (Facultad de Ingeniería, Valparaíso)
  - **Campus Curauma** (Placilla de Peñuelas, Valparaíso)
  - **Campus Recreo** (Viña del Mar)
- **Mapa Interactivo (Leaflet / OpenStreetMap)**:
  - Pines estilo PedidosYa en las coordenadas exactas de cada campus y patio.
  - Indicadores en vivo de estado (Abierto/Cerrado) y tiempo estimado de retiro.
  - Clic en el pin para ver el menú y reservar directamente.

### 2. Sistema de Reserva Anticipada de Comida (Cero Filas)
- **Programación de Horario de Retiro**:
  - *Lo antes posible (~10-15 min)*
  - *Recreo de mañana (11:15 - 11:30 hrs)*
  - *Primer turno almuerzo (12:45 - 13:15 hrs)*
  - *Segundo turno almuerzo (13:30 - 14:00 hrs)*
  - *Recreo de la tarde (15:45 - 16:00 hrs)*
  - *Horario personalizado con selector de hora*
- **Personalización de Menús**:
  - Elección de tipo de pan (Marraqueta porteña, Frica, Ciabatta).
  - Aderezos y extras (Ají verde, mayonesa casera, queso fundido).
  - Opciones de leche para café (Entera, descremada, avena, almendras).
  - Notas especiales para el personal del quiosco.

### 3. Métodos de Pago Universitarios
- **JUNAEB BAES Sodexo / Pluxee**
- **JUNAEB Edenred**
- **Tarjeta Débito / Webpay (Transbank)**
- **Efectivo en caja del quiosco al retirar**

### 4. Seguimiento en Vivo (Live Order Tracker)
- **Ticket de Retiro con Identificador Único**: Ej. `#PUCV-742`.
- **Código QR digital** para validación rápida en el mostrador del quiosco.
- **Barra de Progreso**:
  1. *Reserva Recibida*
  2. *En Preparación*
  3. *¡Listo para Retirar!*
  4. *Entregado*

### 5. Portal para Administradores de Quiosco (Modo Quiosco)
- **Inicio de Sesión y Autenticación de Quiosco**:
  - Ventana modal dedicada para acceso a dependientes y administradores de quiosco.
  - **Credenciales Demo**: Usuario `local123` / Contraseña `local123` (con botón de autocompletado rápido).
  - Indicador de operador activo en la barra superior con opción de cerrar sesión.
- **Formulario para Unirse como Quiosco**:
  - Formulario de afiliación completo para dependientes o nuevos concesionarios PUCV (nombre, campus, ubicación, RUT, contacto, JUNAEB, términos).
  - Generación de código de solicitud y alta inmediata en la plataforma.
  - Registro visible desde el panel de administración bajo la pestaña de solicitudes.
- **Base de Recuperación de Contraseña**:
  - Flujo de 3 pasos para validación de cuenta (`local123`), código de verificación y restablecimiento de contraseña con persistencia local.
- **Operaciones en Tiempo Real**:
  - Ver la cola de pedidos de los alumnos en tiempo real.
  - Cambiar el estado de cada pedido (*Empezar Preparación*, *Marcar Listo para Retiro*, *Confirmar Entrega*).
  - Botón de **Simular Pedido Entrante** para probar el flujo completo con alertas sonoras/visuales.
  - Desactivar o activar stock de productos al instante (*Disponible* / *Agotado*).
  - Abrir o cerrar el quiosco para recepción de nuevas reservas.

---

## 🛠️ Tecnologías Utilizadas

- **React 18** + **Vite**
- **Tailwind CSS** con paleta oficial de PedidosYa y acentos PUCV
- **Leaflet & OpenStreetMap** para visualización geográfica
- **Lucide React** para iconografía moderna
- **Local Storage API** para persistencia de pedidos, carrito y estado

---

## 💻 Instrucciones para Ejecutar

```bash
# Instalar dependencias (si no están instaladas)
npm install

# Iniciar servidor de desarrollo
npm run dev

# Generar versión de producción optimizada
npm run build
```

El servidor estará disponible en [http://localhost:3000](http://localhost:3000).
