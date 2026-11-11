export const CAMPUSES = [
  {
    id: 'todos',
    name: 'Todos los Campus PUCV',
    city: 'Región de Valparaíso',
    shortName: 'Todos los Campus',
    address: 'Valparaíso y Viña del Mar',
    lat: -33.0300,
    lng: -71.5800,
    zoom: 12
  },
  {
    id: 'casa-central',
    name: 'Casa Central PUCV',
    shortName: 'Casa Central',
    city: 'Valparaíso',
    address: 'Av. Brasil 2950, Valparaíso',
    lat: -33.0445,
    lng: -71.6148,
    zoom: 16
  },
  {
    id: 'sausalito',
    name: 'Campus Sausalito',
    shortName: 'Campus Sausalito',
    city: 'Viña del Mar',
    address: 'Av. El Bosque 1290, Santa Inés, Viña del Mar',
    lat: -33.0125,
    lng: -71.5398,
    zoom: 16
  },
  {
    id: 'ibc',
    name: 'Edificio Isabel Brown Caces (IBC)',
    shortName: 'IBC Ingeniería',
    city: 'Valparaíso',
    address: 'Av. Brasil 2241, Valparaíso',
    lat: -33.0428,
    lng: -71.6185,
    zoom: 16
  },
  {
    id: 'curauma',
    name: 'Campus Curauma',
    shortName: 'Campus Curauma',
    city: 'Valparaíso (Placilla)',
    address: 'Av. Universidad 330, Curauma, Valparaíso',
    lat: -33.1348,
    lng: -71.5429,
    zoom: 15
  },
  {
    id: 'recreo',
    name: 'Campus Recreo (Filosofía y Educación)',
    shortName: 'Campus Recreo',
    city: 'Viña del Mar',
    address: 'Av. El Bosque 1380, Recreo, Viña del Mar',
    lat: -33.0232,
    lng: -71.5772,
    zoom: 16
  }
];

export const FOOD_CATEGORIES = [
  { id: 'todos', name: 'Todo', icon: '🍽️' },
  { id: 'comida_lenta', name: 'Comida Lenta (A la Plancha)', icon: '🥩' },
  { id: 'completos', name: 'Completos & Sandwiches', icon: '🌭' },
  { id: 'cafeteria', name: 'Café & Desayuno', icon: '☕' },
  { id: 'almuerzos', name: 'Menú & Almuerzos', icon: '🍲' },
  { id: 'empanadas', name: 'Empanadas & Masas', icon: '🥟' },
  { id: 'vegano', name: 'Veggie & Fit', icon: '🥗' },
  { id: 'dulces', name: 'Pastelería & Dulces', icon: '🍩' },
  { id: 'bebidas', name: 'Bebidas & Jugos', icon: '🧃' }
];

export const INITIAL_KIOSKS = [
  {
    id: 'kiosk-central-1',
    name: 'El Cafecito Central',
    campusId: 'casa-central',
    campusName: 'Casa Central PUCV',
    locationDetails: 'Patio Central frente a Aula Magna y Sala de Lectura',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    reviewsCount: 142,
    pickupTimeMin: 10,
    pickupTimeMax: 15,
    minOrder: 1000,
    isOpen: true,
    openingHours: '08:00 - 18:30',
    acceptsJunaeb: true,
    featuredBadge: 'Favorito Estudiantes',
    maxAsapOrders: 5,
    allowAsapPickup: true,
    lat: -33.0445,
    lng: -71.6148,
    phone: '+56 9 8765 4321',
    menu: [
      {
        id: 'p-c1-slow-1',
        name: 'Churrasco Italiano a la Plancha (100% Posta)',
        description: 'Finas láminas de posta rosada cocinadas al momento en plancha caliente con abundante palta hass molida, tomate natural y mayonesa casera en marraqueta tostada.',
        price: 4490,
        category: 'comida_lenta',
        image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        isSlowFood: true,
        prepTimeMinutes: 20,
        options: {
          bread: ['Marraqueta Porteña', 'Pan Frica', 'Pan Ciabatta'],
          extras: ['Con Ají Verde (+ $300)', 'Queso fundido extra (+ $600)', 'Mayo tradicional', 'Sin ajo']
        }
      },
      {
        id: 'p-c1-slow-2',
        name: 'Churrasco Chacarero Porteño a la Plancha',
        description: 'Carne de vacuno a la plancha, porotos verdes frescos recién hervidos, ají verde encurtido, rodajas de tomate jugoso y mayonesa casera.',
        price: 4690,
        category: 'comida_lenta',
        image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        isSlowFood: true,
        prepTimeMinutes: 22,
        options: {
          bread: ['Marraqueta Porteña', 'Pan Frica Artesanal'],
          extras: ['Con Ají Verde', 'Sin Ají Verde', 'Porotos Verdes Extra (+ $300)']
        }
      },
      {
        id: 'p-c1-1',
        name: 'Sandwich Mechada Italiana de Larga Cocción',
        description: 'Carne mechada de larga cocción deshilachada braseada 4 horas, palta hass fresca, tomate y mayonesa casera en crujiente marraqueta porteña.',
        price: 4290,
        originalPrice: 4800,
        category: 'comida_lenta',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        isSlowFood: true,
        prepTimeMinutes: 18,
        options: {
          bread: ['Marraqueta Porteña', 'Pan Frica', 'Pan Ciabatta'],
          extras: ['Con Ají Verde (+ $300)', 'Queso fundido extra (+ $600)', 'Mayo normal', 'Mayo sin ajo']
        }
      },
      {
        id: 'p-c1-2',
        name: 'Completo Italiano Tradicional',
        description: 'Vienesa de primera calidad, abundante palta hass, tomate picado fino y mayonesa clásica.',
        price: 2490,
        category: 'completos',
        image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 8,
        options: {
          extras: ['Mostaza', 'Kétchup', 'Ají en crema', 'Chucrut extra (+ $200)']
        }
      },
      {
        id: 'p-c1-3',
        name: 'Café Cappuccino Grano Illy (12oz)',
        description: 'Doble shot de espresso de grano recién molido con leche cremada y toque de canela opcional.',
        price: 2200,
        category: 'cafeteria',
        image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 5,
        options: {
          milk: ['Leche Entera', 'Leche Descremada', 'Leche de Almendras (+ $300)', 'Leche de Avena (+ $300)'],
          sweetener: ['Sin endulzar', 'Azúcar rubia', 'Sucralosa', 'Stevia']
        }
      },
      {
        id: 'p-c1-4',
        name: 'Croissant Jamón Pierna & Queso Mantecoso Caliente',
        description: 'Masa hojaldrada horneada en la mañana con queso fundido y jamón pierna artesanal.',
        price: 2800,
        category: 'cafeteria',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
        available: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 5
      },
      {
        id: 'p-c1-5',
        name: 'Muffin de Arándanos y Limón',
        description: 'Esponjoso muffin casero con arándanos frescos de la V región.',
        price: 1600,
        category: 'dulces',
        image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 3
      }
    ]
  },
  {
    id: 'kiosk-central-2',
    name: 'Punto Saludable DAE',
    campusId: 'casa-central',
    campusName: 'Casa Central PUCV',
    locationDetails: 'Subterráneo Zócalo, junto al Gimnasio y DAE',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=150&q=80',
    rating: 4.7,
    reviewsCount: 89,
    pickupTimeMin: 8,
    pickupTimeMax: 15,
    minOrder: 1500,
    isOpen: true,
    openingHours: '08:30 - 17:30',
    acceptsJunaeb: true,
    featuredBadge: '100% Opciones Veggie',
    lat: -33.0449,
    lng: -71.6152,
    phone: '+56 9 9123 4567',
    menu: [
      {
        id: 'p-c2-1',
        name: 'Wrap Integral Falafel & Hummus Casero',
        description: 'Tortilla integral con falafel crocante, hummus de garbanzo con sésamo, mix de verdes y tomate cherry.',
        price: 3600,
        category: 'vegano',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 8
      },
      {
        id: 'p-c2-2',
        name: 'Acai Bowl Energético Frutos Rojos',
        description: 'Acai orgánico batido con plátano, coronado con granola crocante de la casa, frutillas y semillas de chía.',
        price: 3800,
        category: 'vegano',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 7
      },
      {
        id: 'p-c2-3',
        name: 'Jugo Natural Naranja & Zanahoria (500ml)',
        description: 'Prensado en frío en el momento, sin azúcar añadida ni conservantes.',
        price: 2100,
        category: 'bebidas',
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 5
      }
    ]
  },
  {
    id: 'kiosk-sausalito-1',
    name: 'Pérgola & Sabor Sausalito',
    campusId: 'sausalito',
    campusName: 'Campus Sausalito (Viña del Mar)',
    locationDetails: 'Pérgola central Sausalito, frente al prado de Humanidades',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    reviewsCount: 230,
    pickupTimeMin: 12,
    pickupTimeMax: 18,
    minOrder: 1000,
    isOpen: true,
    openingHours: '08:00 - 19:00',
    acceptsJunaeb: true,
    featuredBadge: 'Más Pedido de Viña',
    maxAsapOrders: 5,
    allowAsapPickup: true,
    lat: -33.0125,
    lng: -71.5398,
    phone: '+56 9 7788 9900',
    menu: [
      {
        id: 'p-s1-slow-1',
        name: 'Churrasco Luco Doble Queso a la Plancha',
        description: 'Churrasco de vacuno abundante a la plancha cubierto de doble queso gouda fundido al vapor en pan amasado caliente.',
        price: 4390,
        category: 'comida_lenta',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        isSlowFood: true,
        prepTimeMinutes: 18,
        options: {
          bread: ['Pan Amasado Casero', 'Marraqueta'],
          extras: ['Cebolla caramelizada (+ $400)', 'Ají verde (+ $300)']
        }
      },
      {
        id: 'p-s1-slow-2',
        name: 'Hamburguesa Casera 180g con Cheddar & Tocino',
        description: 'Carne molida seleccionada amasada a mano y asada a la plancha con queso cheddar derretido, tocino crujiente, cebolla morada y lechuga fresca.',
        price: 4890,
        category: 'comida_lenta',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        isSlowFood: true,
        prepTimeMinutes: 25,
        options: {
          bread: ['Pan Brioche Artesanal', 'Pan Frica'],
          extras: ['Salsa BBQ Ahumada', 'Mayo Ajo Casera', 'Kétchup Clásico', 'Mostaza Miel']
        }
      },
      {
        id: 'p-s1-1',
        name: 'Promo Dúo Completos Italianos + Bebida',
        description: '2 Completos Italianos en pan fresco con palta hass recién molida + lata de Coca-Cola o bebida a elección.',
        price: 4990,
        originalPrice: 5800,
        category: 'completos',
        image: 'https://images.unsplash.com/photo-1627054234594-55079a4ecbf6?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 10,
        options: {
          drinks: ['Coca-Cola Normal', 'Coca-Cola Zero', 'Sprite Zero', 'Fanta', 'Agua Mineral'],
          sauces: ['Con todo (Kétchup, Mostaza, Mayo)', 'Solo Mayo y Kétchup', 'Sin condimentos']
        }
      },
      {
        id: 'p-s1-2',
        name: 'Empanada de Horno Pino Vacuno Tradicional',
        description: 'Receta casera porteña con carne picada suave, cebolla caramelizada, aceituna del valle y huevo duro.',
        price: 2600,
        category: 'empanadas',
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 4
      },
      {
        id: 'p-s1-3',
        name: 'Empanada Horno Queso Champiñón & Ciboulette',
        description: 'Masa suave con abundante queso mantecoso fundido y champiñones salteados.',
        price: 2600,
        category: 'empanadas',
        image: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=600&q=80',
        available: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 4
      },
      {
        id: 'p-s1-4',
        name: 'Donut Glaseada Rellena de Manjar',
        description: 'Donut esponjosa bañada en chocolate y rellena de dulce de leche casero.',
        price: 1500,
        category: 'dulces',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 2
      }
    ]
  },
  {
    id: 'kiosk-sausalito-2',
    name: 'Casino & Menú del Día Sausalito',
    campusId: 'sausalito',
    campusName: 'Campus Sausalito (Viña del Mar)',
    locationDetails: 'Sector Comedor Central Sausalito, 1er nivel',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80',
    rating: 4.6,
    reviewsCount: 115,
    pickupTimeMin: 15,
    pickupTimeMax: 25,
    minOrder: 2500,
    isOpen: true,
    openingHours: '11:30 - 15:30',
    acceptsJunaeb: true,
    featuredBadge: 'Almuerzos Caseros',
    lat: -33.0130,
    lng: -71.5392,
    phone: '+56 9 6655 4433',
    menu: [
      {
        id: 'p-s2-1',
        name: 'Menú Almuerzo: Pastel de Choclo Casero + Ensalada + Jugo',
        description: 'Pastel de choclo dorado al horno con pino de vacuno, presa de pollo, huevo y aceituna. Incluye ensalada chilena y jugo.',
        price: 4900,
        category: 'almuerzos',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 15
      },
      {
        id: 'p-s2-2',
        name: 'Lasaña Boloñesa Gratinada con Queso Parmesano',
        description: 'Capas de pasta artesanal con salsa boloñesa de carne magra, bechamel casera y mozzarella gratinada.',
        price: 4600,
        category: 'almuerzos',
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80',
        available: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 12
      },
      {
        id: 'p-s2-3',
        name: 'Guiso de Lentejas Caseras con Huevo Pochado (Opción Veggie)',
        description: 'Lentejas cocinadas con verduras de estación, zapallo camote y coronadas con huevo de campo.',
        price: 4100,
        category: 'almuerzos',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
        available: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 10
      }
    ]
  },
  {
    id: 'kiosk-ibc-1',
    name: 'El Byte & Sandwich IBC',
    campusId: 'ibc',
    campusName: 'Edificio Isabel Brown Caces (IBC)',
    locationDetails: 'Nivel Zócalo frente al patio de Computación e Ingeniería',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    reviewsCount: 194,
    pickupTimeMin: 7,
    pickupTimeMax: 12,
    minOrder: 1000,
    isOpen: true,
    openingHours: '07:30 - 20:00',
    acceptsJunaeb: true,
    featuredBadge: 'Rápido para Recreos',
    maxAsapOrders: 5,
    allowAsapPickup: true,
    lat: -33.0428,
    lng: -71.6185,
    phone: '+56 9 5544 3322',
    menu: [
      {
        id: 'p-ibc-slow-1',
        name: 'Chorrillana Porteña Individual a la Plancha',
        description: 'Papas fritas caseras doradas, carne de vacuno salteada a la plancha con cebolla caramelizada suave y 2 huevos fritos al punto.',
        price: 4990,
        category: 'comida_lenta',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        isSlowFood: true,
        prepTimeMinutes: 25
      },
      {
        id: 'p-ibc-1',
        name: 'Churrasco Italiano a la Plancha en Pan Frica',
        description: 'Finas láminas de posta paleta a la plancha, palta fresca, tomate y mayonesa casera en pan frica tostado.',
        price: 4200,
        category: 'comida_lenta',
        image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        isSlowFood: true,
        prepTimeMinutes: 20,
        options: {
          bread: ['Pan Frica Casero', 'Marraqueta'],
          extras: ['Con Ají Verde (+ $300)', 'Queso derretido (+ $500)']
        }
      },
      {
        id: 'p-ibc-2',
        name: 'Combo Programador: Café Americano + Tostadas Palta',
        description: 'Taza grande de café americano de grano colombiano con dos mitades de pan marraqueta con abundante palta.',
        price: 3200,
        originalPrice: 3800,
        category: 'cafeteria',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 6
      },
      {
        id: 'p-ibc-3',
        name: 'Bebida Energética Monster / Red Bull 473ml Helada',
        description: 'Lata de bebida energética bien fría para jornadas de estudio y certámenes.',
        price: 2400,
        category: 'bebidas',
        image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 2
      }
    ]
  },
  {
    id: 'kiosk-curauma-1',
    name: 'Sabor Científico Curauma',
    campusId: 'curauma',
    campusName: 'Campus Curauma (Placilla)',
    locationDetails: 'Sector Ciencias Básicas, con vista a la Laguna La Luz',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=150&q=80',
    rating: 4.7,
    reviewsCount: 108,
    pickupTimeMin: 10,
    pickupTimeMax: 15,
    minOrder: 1200,
    isOpen: true,
    openingHours: '08:30 - 18:00',
    acceptsJunaeb: true,
    featuredBadge: 'Vista a la Laguna',
    lat: -33.1348,
    lng: -71.5429,
    phone: '+56 9 4433 2211',
    menu: [
      {
        id: 'p-cur-1',
        name: 'Fajita Mechada & Pimientos Salteados',
        description: 'Carne desmechada jugosa, queso mozzarella fundido, pimientos caramelizados y salsa tártara en tortilla de trigo.',
        price: 3700,
        category: 'completos',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 9
      },
      {
        id: 'p-cur-2',
        name: 'Empanada Frita de Queso Camarón',
        description: 'Masa frita crocante rellena de queso mantecoso y colitas de camarón seleccionadas.',
        price: 2700,
        category: 'empanadas',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 7
      },
      {
        id: 'p-cur-3',
        name: 'Kombucha Artesanal Valparaíso 330ml',
        description: 'Kombucha probiótica elaborada localmente sabor frutos del bosque o jengibre limón.',
        price: 2500,
        category: 'bebidas',
        image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 2
      }
    ]
  },
  {
    id: 'kiosk-recreo-1',
    name: 'El Rincón Porteño Recreo',
    campusId: 'recreo',
    campusName: 'Campus Recreo',
    locationDetails: 'Entrada Facultades de Filosofía y Educación, patio techado',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80',
    rating: 4.6,
    reviewsCount: 77,
    pickupTimeMin: 8,
    pickupTimeMax: 14,
    minOrder: 1000,
    isOpen: true,
    openingHours: '08:00 - 18:00',
    acceptsJunaeb: true,
    featuredBadge: 'Pastelería Casera',
    lat: -33.0232,
    lng: -71.5772,
    phone: '+56 9 3322 1100',
    menu: [
      {
        id: 'p-rec-1',
        name: 'Queque Casero de Limón & Semillas de Amapola',
        description: 'Porción generosa de queque esponjoso con glaseado de limón natural.',
        price: 1600,
        category: 'dulces',
        image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
        available: true,
        isPopular: true,
        prepTimeMinutes: 2
      },
      {
        id: 'p-rec-2',
        name: 'Prensado Porteño Jamón Queso en Marraqueta',
        description: 'Tostado a la plancha hasta que el queso quede derretido con mantequilla sureña.',
        price: 2500,
        category: 'completos',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
        available: true,
        acceptsJunaeb: true,
        prepTimeMinutes: 6
      },
      {
        id: 'p-rec-3',
        name: 'Té Chai Latte Especiado (12oz)',
        description: 'Té negro con cardamomo, clavo de olor, canela y leche emulsionada caliente.',
        price: 2200,
        category: 'cafeteria',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
        available: true,
        prepTimeMinutes: 5
      }
    ]
  }
];

export const PICKUP_TIME_OPTIONS = [
  { id: 'asap', label: 'Lo antes posible (~10-15 min)', timeStr: 'En 15 min', isAsap: true },
  { id: 'recreo-1', label: 'Recreo de mañana (11:15 - 11:30)', timeStr: '11:15 hrs', targetHour: 11, targetMinute: 15 },
  { id: 'almuerzo-1', label: 'Primer turno almuerzo (12:45 - 13:15)', timeStr: '12:45 hrs', targetHour: 12, targetMinute: 45 },
  { id: 'almuerzo-2', label: 'Segundo turno almuerzo (13:30 - 14:00)', timeStr: '13:30 hrs', targetHour: 13, targetMinute: 30 },
  { id: 'recreo-tarde', label: 'Recreo de la tarde (15:45 - 16:00)', timeStr: '15:45 hrs', targetHour: 15, targetMinute: 45 },
  { id: 'salida', label: 'Horario de salida (17:30 - 18:00)', timeStr: '17:30 hrs', targetHour: 17, targetMinute: 30 },
  { id: 'custom', label: 'Horario personalizado...', timeStr: 'Personalizado', isCustom: true }
];

export const PAYMENT_METHODS = [
  { id: 'junaeb_sodexo', name: 'JUNAEB Sodexo / Pluxee', icon: '💳', badge: 'BAES', desc: 'Pago con tarjeta o App JUNAEB' },
  { id: 'junaeb_edenred', name: 'JUNAEB Edenred', icon: '💳', badge: 'BAES', desc: 'Ticket Junaeb Edenred' },
  { id: 'debito_credito', name: 'Tarjeta Débito / Crédito (Webpay)', icon: '🏧', badge: 'Online', desc: 'Transbank Redcompra' },
  { id: 'efectivo', name: 'Efectivo al Retirar en Quiosco', icon: '💵', badge: 'En Caja', desc: 'Paga directo en el mostrador del quiosco' }
];
