/**
 * Fuente única del catálogo ShoeX.
 * Para cambiar imágenes, nombres, precios o descripciones, edita INITIAL_PRODUCTS.
 * Para renombrar categorías, modifica únicamente CATEGORIES[].name.
 * Los identificadores de categoría (id) se mantienen estables para no romper filtros.
 */
export const INITIAL_PRODUCTS = [
  {
    "id": "SHX-001",
    "name": "Nike Pegasus 42",
    "brand": "Nike",
    "category": "running",
    "price": 794950,
    "compareAt": 894950,
    "image": "assets/images/products/PegasusLateral-Der.png",
    "imageFront": "assets/images/products/PegasusLateral-Izq.png",
    "imagePair": "assets/images/products/Pegasus-Par.png",
    "color": "Verde / Blanco",
    "colors": [
      "Verde / Blanco",
      "Blanco / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#13e02e",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Calzado de correr en pavimento para hombre.",
    "rating": 4.9,
    "reviews": 128,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": true
  },
  {
    "id": "SHX-002",
    "name": "Air Jordan 1 Low",
    "brand": "Nike",
    "category": "lifestyle",
    "price": 679950,
    "compareAt": 779950,
    "image": "assets/images/products/AirJordan-LateralDer.png",
    "imageFront": "assets/images/products/AirJordan-LateralIzq.png",
    "imagePair": "assets/images/products/AirJordan-LateralPar.png",
    "color": "Negro / Rojo",
    "colors": [
      "Negro / Rojo",
      "Blanco / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#141414",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Air Jordan 1 Low ofrece un estilo clásico impecable que se resulta familiar, pero renovado. .",
    "rating": 4.8,
    "reviews": 94,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-003",
    "name": "UA Charged Surge 4",
    "brand": "Under Armour",
    "category": "running",
    "price": 239920,
    "compareAt": 339920,
    "image": "assets/images/products/UALateralDer.webp",
    "imageFront": "assets/images/products/UALateralIzq.webp",
    "imagePair": "assets/images/products/UAPar.webp",
    "color": "Azul / Blanco",
    "colors": [
      "Azul / Blanco",
      "Negro / Naranja",
      "Blanco / Gris",      
    ],
    "colorHexes": [
      "#315c9a",
      "#292d35",
      "#e7e4dd"      
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Tenis Hombre UA Running Charged Surge 4 UNDER ARMOUR.",
    "rating": 4.9,
    "reviews": 76,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-004",
    "name": "Jordan All Game",
    "brand": "Nike",
    "category": "basketball",
    "price": 499950,
    "compareAt": 499950,
    "image": "assets/images/products/JordanAllGame-LateralDer.png",
    "imageFront": "assets/images/products/JordanAllGame-LateralIzq.png",
    "imagePair": "assets/images/products/JordanAllGame-Par.png",
    "color": "Blanco / Negro",
    "colors": [
      "Blanco / Negro",
      "Negro / Naranja",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#eff0f3",
      "#0e0d0d",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Los Jordan All Game, unos tenis innovadores que marcan la diferencia en la cancha, se diseñaron para los amantes del básquetbol de todo el mundo.",
    "rating": 4.9,
    "reviews": 130,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": true
  },
  {
    "id": "SHX-005",
    "name": "Nike Air Force 1 '07",
    "brand": "Nike",
    "category": "casual",
    "price": 754950,
    "compareAt": 854950,
    "image": "assets/images/products/Nike-Aair-Force-White-LateralDer.png",
    "imageFront": "assets/images/products/Nike-Aair-Force-White-LateralIzq.png",
    "imagePair": "assets/images/products/Nike-Aair-Force-White-Par.png",
    "color": "Blanco / Gris",
    "colors": [
      "Blanco / Gris",
      "Negro / Naranja",      
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#e9ecf3",
      "#141413",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Cómodos, duraderos y atemporales: por algo son los número 1. Los Air Force 1 combinan su estilo clásico con cuero auténtico para ofrecer un look impecable.",
    "rating": 4.7,
    "reviews": 65,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-006",
    "name": "UA Forge 96 Reissue ",
    "brand": "Under Armour",
    "category": "outdoor",
    "price": 349950 ,
    "compareAt": 449950 ,
    "image": "assets/images/products/UA-Forge-96-Reissue-LateralaDer.webp",
    "imageFront": "assets/images/products/UA-Forge-96-Reissue-LateralaIzq.webp",
    "imagePair": "assets/images/products/UA-Forge-96-Reissue-Par.webp",
    "color": "Negro / Marrón",
    "colors": [
      "Negro / Marrón",
      "Blanco / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#292d35",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "El zapato inspirado en 1996, el año en que se fundó Under Armour. Utiliza los mejores materiales y tecnología retro para brindar máxima transpirabilidad y vibraciones de ropa deportiva retro a tu rotación diaria de zapatillas..",
    "rating": 4.8,
    "reviews": 52,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-007",
    "name": "Air Jordan 1 Retro High",
    "brand": "Nike",
    "category": "basketball",
    "price": 1129950,
    "compareAt": 1229950,
    "image": "assets/images/products/Air Jordan 1 High OG LateralDer.png",
    "imageFront": "assets/images/products/Air Jordan 1 High OG LateralIzq.png",
    "imagePair": "assets/images/products/Air Jordan 1 High OG Par.png",
    "color": "Negro / Rojo",
    "colors": [
      "Negro / Rojo",
      "Blanco / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#292d35",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Los materiales premium, la amortiguación suave y el cuello acolchado en el tobillo brindan máximo soporte y celebran el calzado que lo inició todo.",
    "rating": 4.8,
    "reviews": 81,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-008",
    "name": "Nike Air Force 1 '07 Black",
    "brand": "Nike",
    "category": "casual",
    "price": 584950,
    "compareAt": 684950,
    "image": "assets/images/products/Nike-Aair-Force-Black-LateralDer.png",
    "imageFront": "assets/images/products/Nike-Aair-Force-Black-LateralIzq.png",
    "imagePair": "assets/images/products/Nike-Aair-Force-Black-Par.png",
    "color": "Negro / Naranja",
    "colors": [
      "Negro / Naranja",
      "Blanco / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#080808",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "l fulgor vive en Nike Air Force 1 ’07, el ícono del básquetbol que le da un toque fresco a las características más recordadas: colores audaces y la cantidad perfecta de destellos para que brilles.",
    "rating": 4.6,
    "reviews": 48,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-009",
    "name": "Gel Kayano 33",
    "brand": "Asics",
    "category": "running",
    "price": 699900,
    "compareAt": 799900,
    "image": "assets/images/products/AsicsLateraalDer.png",
    "imageFront": "assets/images/products/AsicsLateraalIzq.png",
    "imagePair": "assets/images/products/AsicsPair.png",
    "color": "Grey / Midnight",
    "colors": [
      "Grey / Midnight",
      "Blanco / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#676869",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "ASICS GEL KAYANO 33: Estabilidad sin rigidez.",
    "rating": 4.9,
    "reviews": 40,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": true
  },
  {
    "id": "SHX-010",
    "name": "Tenis Samba OG",
    "brand": "Adidas",
    "category": "lifestyle",
    "price": 499950,
    "compareAt": 599950,
    "image": "assets/images/products/Tenis Samba OG LateraalDer.png",
    "imageFront": "assets/images/products/Tenis Samba OG LateraalIzq.png",
    "imagePair": "assets/images/products/Tenis Samba OG Diagonaal.png",
    "color":  "Blanco / Gris",
    "colors": [
       "Blanco / Gris",
      "Negro / Naranja",     
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#eeeef1",
      "#050505",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Nacidas en la cancha, las Samba son un ícono atemporal del estilo urbano.",
    "rating": 4.7,
    "reviews": 73,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-011",
    "name": "Redmond III Mid BM0168286 ",
    "brand": "Columbia",
    "category": "outdoor",
    "price": 358636,
    "compareAt": 358636,
    "image": "assets/images/products/Columbia Redmond III  LateraalDer.png",
    "imageFront": "assets/images/products/Columbia Redmond III  LateraalIzq.png",
    "imagePair": "assets/images/products/Columbia Redmond III  Diaagonal.png",
    "color": "Mostaza / Naranja",
    "colors": [
      "Mostaza / Naranja",
      "Blanco / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#292d35",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Impermeable Entrenadores Atléticos Botas.",
    "rating": 4.8,
    "reviews": 36,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-012",
    "name": "Response Runner 2",
    "brand": "Adidas",
    "category": "running",
    "price": 219990,
    "compareAt": 219.990,
    "image": "assets/images/products/AdidasLateralDer.png",
    "imageFront": "assets/images/products/AdidasLateralIzq.png",
    "imagePair": "assets/images/products/AdidasPar.png",
    "color": "Azul / Blanco",
    "colors": [
      "Azul / Blanco",
      "Negro / Naranja",
      "Blanco / Gris"      
    ],
    "colorHexes": [
      "#315c9a",
      "#292d35",
      "#e7e4dd",      
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Tenis Adidas Hombre Running Response Runner 2.",
    "rating": 4.7,
    "reviews": 91,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-013",
    "name": "UA Lockdown 7 ",
    "brand": "Under Armour",
    "category": "basketball",
    "price": 319920,
    "compareAt": 419920,
    "image": "assets/images/products/UA-LOCKDOWN-7-LateralDer.webp",
    "imageFront": "assets/images/products/UA-LOCKDOWN-7-LateralIzq.webp",
    "imagePair": "assets/images/products/UA-LOCKDOWN-7-Par.webp",
    "color": "Rojo / Negro",
    "colors": [
      "Rojo / Negro",
      "Blanco / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#f10505",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Son ligeras, cómodas y lo suficientemente resistentes como para durar toda la temporada, lo que las convierte en las zapatillas para la cancha de basketball año tras año.",
    "rating": 4.8,
    "reviews": 58,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-014",
    "name": "Brunette",
    "brand": "Quest",
    "category": "casual",
    "price": 249900,
    "compareAt": 349900,
    "image": "assets/images/products/Brunette  Quest LateraalDer.png",
    "imageFront": "assets/images/products/Brunette  Quest LateraalIzq.png",
    "imagePair": "assets/images/products/Brunette  Quest Par.png",
    "color": "Blanco / Brunette",
    "colors": [
      "Blanco / Brunette",
      "Blanco / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#754804",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Los Tenis Quest mezclan lo mejor del universo casual y deportivo para que puedas sentirte cómodo y lucir apropiado para días llenos de movimiento.",
    "rating": 4.6,
    "reviews": 115,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-015",
    "name": "Nike Journey Run",
    "brand": "Nike",
    "category": "running",
    "price": 509950,
    "compareAt": 609950,
    "image": "assets/images/products/Nike Journey RunLateralDer.png",
    "imageFront": "assets/images/products/Nike Journey RunLateralIzq.png",
    "imagePair": "assets/images/products/Nike Journey RunPar.png",
    "color": "Negro / Rojo",
    "colors": [
      "Negro / Rojo",
      "Negro / Naranja",
      "Azul / Gris",      
    ],
    "colorHexes": [
      "#0c0c0c",
      "#d66b24",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Disfruta de cada paso, ruta y excursión con los Nike Journey Run.",
    "rating": 4.9,
    "reviews": 44,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": true
  },
  {
    "id": "SHX-016",
    "name": "New Balance 550",
    "brand": "New Balance",
    "category": "lifestyle",
    "price": 519920,
    "compareAt": 619920,
    "image": "assets/images/products/New Balance 550 LateraalDer.png",
    "imageFront": "assets/images/products/New Balance 550 LateraalIzq.png",
    "imagePair": "assets/images/products/New Balance 550 Zuelaa.png",
    "color": "Beige / Marrón",
    "colors": [
      "Beige / Marrón",
      "Blanco / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#292d35",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "El modelo 550 original debutó en 1989 y dejó huella en las canchas de baloncesto de todo el país.",
    "rating": 4.7,
    "reviews": 67,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-017",
    "name": "Senderismo Strata Trail",
    "brand": "Columbia",
    "category": "outdoor",
    "price": 499900,
    "compareAt": 99900,
    "image": "assets/images/products/Senderismo Strata Trail LateralDer.png",
    "imageFront": "assets/images/products/Senderismo Strata Trail Lateral Izq.png",
    "imagePair": "assets/images/products/Senderismo Strata Trail Posterior.png",
    "color": "Marrón / Beige",
    "colors": [
      "Marrón / Beige",
      "Blanco / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#967009",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Estas botas de Columbia para hombre tienen un diseño clásico, ligero y resistente, y cuentan con una confección impermeable para afrontar los días de senderismo bajo la lluvia.",
    "rating": 4.8,
    "reviews": 31,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-018",
    "name": "Sneakers Quest",
    "brand": "Quest",
    "category": "casual",
    "price": 239900,
    "compareAt": 339900,
    "image": "assets/images/products/Sneakers Quest LateralDer.png",
    "imageFront": "assets/images/products/Sneakers Quest LateralIzq.png",
    "imagePair": "assets/images/products/Sneakers Quest Par.png",
    "color": "Blanco / Verde",
    "colors": [
      "Blanco / Verde",
      "Negro / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#076407",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Los Tenis Quest mezclan lo mejor del universo casual y deportivo para que puedas sentirte cómodo y lucir apropiado para días llenos de movimiento.",
    "rating": 4.7,
    "reviews": 59,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-019",
    "name": "New Balance 574",
    "brand": "New Balance",
    "category": "lifestyle",
    "price":  286990,
    "compareAt":  386990,
    "image": "assets/images/products/New Balance 574 Lateral Der.png",
    "imageFront": "assets/images/products/New Balance 574 Lateral Izq.png",
    "imagePair": "assets/images/products/New Balance 574 Lateral Paar.png",
    "color": "Beige / Verde",
    "colors": [
      "Beige / Verde",
      "Negro / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#f1e9c5",
      "#0c0c0c",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Estos tenis casuales están diseñados con materiales de primera calidad y tecnología avanzada, para ofrecerte lo mejor en calidad y estilo.",
    "rating": 4.8,
    "reviews": 88,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  },
  {
    "id": "SHX-020",
    "name": "Tenis FILA 19566H",
    "brand": "Fila",
    "category": "running",
    "price": 195993,
    "compareAt": 279900,
    "image": "assets/images/products/FILA-19566H_LateralDer.png",
    "imageFront": "assets/images/products/FILA-19566H_LateralIzq.png",
    "imagePair": "assets/images/products/FILA-19566H_Par.png",
    "color": "Negro / Blanco",
    "colors": [
      "Negro / Blanco",
      "Blanco / Gris",
      "Azul / Blanco"
    ],
    "colorHexes": [
      "#292d35",
      "#e7e4dd",
      "#315c9a"
    ],
    "sizes": [
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44
    ],
    "stock": 27,
    "description": "Tenis con suela y estructura sintetica, goma u otro material que permiten un buen ajuste y comodidad..",
    "rating": 4.8,
    "reviews": 47,
    "features": [
      "Capellada transpirable",
      "Plantilla acolchada",
      "Suela de goma flexible"
    ],
    "featured": false
  }
];

/** Categorías disponibles y producto que representa su imagen editorial. */
export const CATEGORIES = [
  {
    id: 'running',
    name: 'Running',
    representativeProductId: 'SHX-001',
    eyebrow: '01 / PERFORMANCE',
    description: 'Para ir más lejos',
    theme: 'dark',
    showOnDesktop: true
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    representativeProductId: 'SHX-010',
    eyebrow: '02 / STREET',
    description: 'Tu estilo, tu ruta',
    theme: 'orange',
    showOnDesktop: true
  },
  {
    id: 'basketball',
    name: 'Basketball',
    representativeProductId: 'SHX-007',
    eyebrow: '03 / COURT',
    description: 'Domina el espacio',
    theme: 'light',
    showOnDesktop: true
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    representativeProductId: 'SHX-006',
    eyebrow: '04 / OUTDOOR',
    description: 'Explora sin límites',
    theme: 'sand',
    showOnDesktop: true
  },
  {
    id: 'casual',
    name: 'Casual',
    representativeProductId: 'SHX-005',
    eyebrow: '05 / EVERYDAY',
    description: 'Comodidad para cada día',
    theme: 'dark',
    showOnDesktop: false
  }
];

/** Productos destacados que alimentan los espacios editoriales del Home. */
export const HOME_SHOWCASE = {
  mobileHeroProductId: 'SHX-001',
  desktopHeroProductId: 'SHX-004',
  promotionProductId: 'SHX-001'
};

/** Creatividad vertical independiente para la pantalla inicial de bienvenida. */
export const ONBOARDING_BACKGROUND = {
  image: 'assets/images/brand/onboarding.webp',
  alt: 'Zapatilla protagonista de Draco Shoes sobre una composición vertical oscura'
};


/**
 * Creatividades publicitarias independientes de las fotografías de producto.
 * Cada anuncio declara su espacio (slot), archivo gráfico y producto de destino.
 * Estas imágenes nunca forman parte de la galería lateral/frontal/par del producto.
 */
export const HOME_ADS = [
  {
    id: 'AD-HERO-MOBILE',
    slot: 'mobileHero',
    placement: 'Hero móvil',
    eyebrow: 'Retro collection',
    title: 'Air Jordan 1 Retro High',
    titleAccent: 'OG',
    description: 'Diseño, comodidad y movimiento para cada día.',
    image: 'assets/images/ads/AirJordan.webp',
    alt: 'Creatividad de la nueva colección Draco para móvil',
    ctaLabel: 'Shop Now',
    productId: 'SHX-007',
    badge: ''
  },
  {
    id: 'AD-HERO-DESKTOP',
    slot: 'desktopHero',
    placement: 'Hero escritorio',
    eyebrow: 'Retro collection · 2026',
    title: 'Step into your style.',
    titleAccent: 'your style.',
    description: 'Encuentra zapatillas que acompañan tu ritmo. Diseño, comodidad y carácter en cada paso.',
    image: 'assets/images/ads/AirJordan.webp',
    alt: 'Creatividad editorial de la colección Draco Shoes para escritorio',
    ctaLabel: 'Explorar colección',
    productId: 'SHX-007',
    badge: ''
  },
  {
    id: 'AD-PROMOTION',
    slot: 'promotion',
    placement: 'Oferta destacada',
    eyebrow: 'Oferta de bienvenida',
    title: 'Tu próximo par está más cerca.',
    description: 'Usa el código SHOE10 en el carrito y simula un 10% de descuento.',
    image: 'assets/images/ads/nike-pegasus-42-velocidad-neon.webp',
    alt: 'Creatividad de la oferta de bienvenida Draco Shoes',
    ctaLabel: 'Comprar ahora',
    productId: 'SHX-001',
    badge: '−10%'
  }
];

/** Devuelve la creatividad asignada a una ubicación concreta del Home. */
export function getHomeAd(slot) {
  return HOME_ADS.find((ad) => ad.slot === slot) || null;
}

/** Devuelve el nombre visible de una categoría a partir de su ID estable. */
export function getCategoryName(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId)?.name
    || String(categoryId || 'Sin categoría');
}

/**
 * Firma automática del catálogo semilla. Si cambian productos, imágenes,
 * categorías o la selección de los hero, la firma cambia sin editar una versión.
 */
function createCatalogSignature() {
  const source = JSON.stringify({ products: INITIAL_PRODUCTS, categories: CATEGORIES, home: HOME_SHOWCASE, onboarding: ONBOARDING_BACKGROUND, ads: HOME_ADS });
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `shoex-${(hash >>> 0).toString(36)}`;
}

export const CATALOG_VERSION = createCatalogSignature();
