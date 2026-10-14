/* ══════════════════════════════════════════════════════════════════
   BT LATAM TEC – script.js
   Carrito, filtros, modales, búsqueda, persistencia, timer, hero
   ══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── DATA: PRODUCTOS ─────────────────────────────────────────────── */
const PRODUCTS = window.BT_PRODUCTS || [
  {
    id: 1, name: 'MacBook Pro M3 14"', brand: 'Apple', category: 'laptops',
    price: 1799, originalPrice: 2199, icon: '💻', rating: 4.9, reviews: 1240,
    badge: 'sale', discount: 18, shipping: 'Envío gratis',
    desc: 'Chip M3, 18 GB RAM, 512 GB SSD. Rendimiento extraordinario para profesionales. Pantalla Liquid Retina XDR.'
  },
  {
    id: 2, name: 'Samsung Galaxy S25 Ultra', brand: 'Samsung', category: 'smartphones',
    price: 899, originalPrice: 1199, icon: '📱', rating: 4.8, reviews: 832,
    badge: 'sale', discount: 25, shipping: 'Envío gratis',
    desc: 'Pantalla 6.8" AMOLED, Snapdragon 8 Elite, 256 GB, cámara 200 MP. El flagship definitivo de 2025.'
  },
  {
    id: 3, name: 'Sony WH-1000XM6', brand: 'Sony', category: 'audifonos',
    price: 299, originalPrice: 399, icon: '🎧', rating: 4.9, reviews: 2105,
    badge: 'hot', discount: 25, shipping: 'Envío gratis',
    desc: 'Cancelación de ruido líder del mercado, 30h batería, audio Hi-Res inalámbrico. Perfectos para trabajo y viaje.'
  },
  {
    id: 4, name: 'LG OLED evo C4 65"', brand: 'LG', category: 'tvs',
    price: 1299, originalPrice: 1799, icon: '📺', rating: 4.8, reviews: 456,
    badge: 'sale', discount: 28, shipping: 'Instalación gratis',
    desc: 'Panel OLED 4K 120Hz, Dolby Atmos, webOS, compatible con PS5 y Xbox. La mejor experiencia visual del hogar.'
  },
  {
    id: 5, name: 'iPad Pro M4 11"', brand: 'Apple', category: 'tablets',
    price: 799, originalPrice: 999, icon: '📲', rating: 4.7, reviews: 698,
    badge: 'new', discount: 20, shipping: 'Envío gratis',
    desc: 'Chip M4, pantalla Ultra Retina XDR OLED, Apple Pencil Pro. La tablet más potente del mundo.'
  },
  {
    id: 6, name: 'PlayStation 5 Slim', brand: 'Sony', category: 'consolas',
    price: 449, originalPrice: 499, icon: '🎮', rating: 4.9, reviews: 3210,
    badge: 'hot', discount: 10, shipping: 'Envío gratis',
    desc: 'Consola PS5 edición Slim, SSD ultrarrápido, DualSense, compatible con todos los juegos PS4 y PS5.'
  },
  {
    id: 7, name: 'DJI Mini 4 Pro', brand: 'DJI', category: 'drones',
    price: 759, originalPrice: 959, icon: '🚁', rating: 4.8, reviews: 341,
    badge: 'new', discount: 21, shipping: 'Envío gratis',
    desc: 'Drone 4K HDR, cámara rotación 360°, 34 min vuelo, omnidireccional. El mejor drone compacto de 2025.'
  },
  {
    id: 8, name: 'Logitech MX Master 3S', brand: 'Logitech', category: 'accesorios',
    price: 89, originalPrice: 119, icon: '🖱️', rating: 4.8, reviews: 4521,
    badge: 'sale', discount: 25, shipping: 'Envío gratis',
    desc: 'Mouse ergonómico, scroll MagSpeed, compatible Windows/Mac/Linux. El favorito de creativos y programadores.'
  },
  {
    id: 9, name: 'Dell XPS 15 OLED', brand: 'Dell', category: 'laptops',
    price: 1499, originalPrice: 1899, icon: '💻', rating: 4.7, reviews: 387,
    badge: 'sale', discount: 21, shipping: 'Envío gratis',
    desc: 'Intel Core i9, NVIDIA RTX 4070, pantalla OLED 3.5K táctil. Para creadores y desarrolladores exigentes.'
  },
  {
    id: 10, name: 'iPhone 16 Pro Max', brand: 'Apple', category: 'smartphones',
    price: 1199, originalPrice: 1399, icon: '📱', rating: 4.9, reviews: 5432,
    badge: 'hot', discount: 14, shipping: 'Envío gratis',
    desc: 'Chip A18 Pro, cámara 48 MP Fusion, pantalla Super Retina XDR 6.9", Action Button. El iPhone más avanzado.'
  },
  {
    id: 11, name: 'Apple AirPods Pro 3', brand: 'Apple', category: 'audifonos',
    price: 249, originalPrice: 299, icon: '🎧', rating: 4.7, reviews: 1893,
    badge: 'new', discount: 17, shipping: 'Envío gratis',
    desc: 'ANC adaptativo, audio espacial, chip H2, 36h batería total. La mejor experiencia de audio inalámbrico.'
  },
  {
    id: 12, name: 'Samsung Neo QLED 8K 75"', brand: 'Samsung', category: 'tvs',
    price: 2499, originalPrice: 3499, icon: '📺', rating: 4.6, reviews: 178,
    badge: 'sale', discount: 29, shipping: 'Instalación gratis',
    desc: 'Resolución 8K, Neo Quantum HDR, Tizen OS, 144Hz para gaming. La pantalla definitiva para tu hogar.'
  },
  {
    id: 13, name: 'Samsung Galaxy Tab S10+', brand: 'Samsung', category: 'tablets',
    price: 699, originalPrice: 899, icon: '📲', rating: 4.7, reviews: 412,
    badge: 'sale', discount: 22, shipping: 'Envío gratis',
    desc: 'Snapdragon 8 Gen 3, AMOLED 12.4" 120Hz, S Pen incluido. Productividad y entretenimiento de nivel Pro.'
  },
  {
    id: 14, name: 'Xbox Series X', brand: 'Microsoft', category: 'consolas',
    price: 499, originalPrice: 549, icon: '🎮', rating: 4.8, reviews: 2134,
    badge: 'new', discount: 9, shipping: 'Envío gratis',
    desc: '12 TFLOPS, 4K 120fps, SSD 1TB, Game Pass Ultimate. El Xbox más potente de la historia.'
  },
  {
    id: 15, name: 'DJI Osmo Pocket 3', brand: 'DJI', category: 'drones',
    price: 519, originalPrice: 599, icon: '📷', rating: 4.8, reviews: 265,
    badge: 'new', discount: 13, shipping: 'Envío gratis',
    desc: 'Cámara 4K/120fps, sensor 1", 3 ejes estabilización, ActiveTrack 6.0. La cámara gimbal perfecta para vlogs.'
  },
  {
    id: 16, name: 'Keychron Q3 Pro', brand: 'Keychron', category: 'accesorios',
    price: 169, originalPrice: 199, icon: '⌨️', rating: 4.9, reviews: 1102,
    badge: 'hot', discount: 15, shipping: 'Envío gratis',
    desc: 'Teclado mecánico 75%, switches Gateron G Pro, aluminio CNC, Bluetooth/USB. El favorito de los entusiastas.'
  },
];

/* Productos para flash sale (selección) */
const FLASH_PRODUCTS = [
  { id: 3, stock: 12 },
  { id: 6, stock: 5  },
  { id: 8, stock: 28 },
  { id: 11, stock: 9 },
  { id: 16, stock: 7 },
].map(f => ({ ...PRODUCTS.find(p => p.id === f.id), stock: f.stock }));

/* ─── STATE ───────────────────────────────────────────────────────── */
let cart       = JSON.parse(localStorage.getItem('btlatam_cart') || '[]');
let activeFilter = { cat: 'all', maxPrice: 0, sort: 'default', search: '' };

/* ─── UTILS ───────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const fmt = n => `$${n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

function showToast(msg, icon = 'check-circle') {
  const t = $('toast');
  $('toastMsg').textContent = msg;
  t.querySelector('i').className = `fas fa-${icon}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function saveCart() {
  localStorage.setItem('btlatam_cart', JSON.stringify(cart));
}

/* ─── CART ────────────────────────────────────────────────────────── */
function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  $('cartBadge').textContent = total;
  $('cartBadge').style.display = total ? 'flex' : 'none';
}

function addToCart(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...p, qty: 1 });
  }
  saveCart();
  updateCartBadge();
  renderCart();
  showToast(`${p.name} añadido al carrito`);
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartBadge();
  renderCart();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  saveCart();
  renderCart();
}

function renderCart() {
  const container = $('cartItems');
  const empty     = $('cartEmpty');
  const footer    = $('cartFooter');

  if (!cart.length) {
    container.innerHTML = '';
    empty.style.display = 'flex';
    empty.style.flexDirection = 'column';
    empty.style.alignItems = 'center';
    footer.style.display = 'none';
    $('cartSubtotal').textContent = '$0.00';
    $('cartTotal').textContent    = '$0.00';
    return;
  }

  empty.style.display  = 'none';
  footer.style.display = 'block';

  container.innerHTML = cart.map(item => `
    <div class="cart__item">
      <div class="cart__item-icon">${item.icon}</div>
      <div class="cart__item-info">
        <div class="cart__item-name">${item.name}</div>
        <div class="cart__item-price">${fmt(item.price * item.qty)}</div>
      </div>
      <div class="cart__item-qty">
        <button class="qty__btn" onclick="changeQty(${item.id}, -1)"><i class="fas fa-minus"></i></button>
        <span class="qty__val">${item.qty}</span>
        <button class="qty__btn" onclick="changeQty(${item.id}, 1)"><i class="fas fa-plus"></i></button>
      </div>
      <button class="cart__remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 50 ? 'Gratis' : fmt(9.99);
  const total    = subtotal + (subtotal >= 50 ? 0 : 9.99);

  $('cartSubtotal').textContent = fmt(subtotal);
  $('cartShipping').textContent = shipping;
  $('cartTotal').textContent    = fmt(total);
}

/* ─── MODAL SISTEMA ──────────────────────────────────────────────── */
function openModal(id) {
  document.querySelectorAll('.modal__overlay').forEach(m => m.classList.remove('active'));
  $(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  $(id).classList.remove('active');
  document.body.style.overflow = '';
}

function initModalListeners() {
  // Cerrar por botón [data-modal]
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modal));
  });
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modalClose));
  });
  // Cerrar al clic en overlay
  document.querySelectorAll('.modal__overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });
  // ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal__overlay.active').forEach(m => closeModal(m.id));
    }
  });
}

/* ─── PRODUCT MODAL ──────────────────────────────────────────────── */
function openProductModal(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;

  $('productModalInner').innerHTML = `
    <div class="pm__img">${p.icon}</div>
    <div class="pm__info">
      <div class="pm__brand">${p.brand}</div>
      <h2 class="pm__name">${p.name}</h2>
      <div class="pm__rating">
        <span class="stars">${stars(p.rating)}</span>
        <span>${p.rating} (${p.reviews.toLocaleString()} reseñas)</span>
      </div>
      ${p.originalPrice ? `<div class="pm__original">${fmt(p.originalPrice)}</div>` : ''}
      <div class="pm__price">${fmt(p.price)}</div>
      ${p.discount ? `<div class="pm__discount">Ahorrás ${fmt(p.originalPrice - p.price)} (${p.discount}% OFF)</div>` : ''}
      <p class="pm__desc">${p.desc}</p>
      <button class="btn btn--primary btn--full pm__add-cart" onclick="addToCart(${p.id}); closeModal('productModal');">
        <i class="fas fa-cart-plus"></i> Añadir al carrito
      </button>
      <p class="pm__shipping"><i class="fas fa-shipping-fast"></i> ${p.shipping}</p>
    </div>
  `;
  openModal('productModal');
}

/* ─── PRODUCTS RENDER ────────────────────────────────────────────── */
function getFilteredProducts() {
  let list = [...PRODUCTS];

  if (activeFilter.cat !== 'all') {
    list = list.filter(p => p.category === activeFilter.cat);
  }
  if (activeFilter.search) {
    const q = activeFilter.search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  if (activeFilter.maxPrice > 0) {
    list = list.filter(p => p.price <= activeFilter.maxPrice);
  }

  switch (activeFilter.sort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
  }

  return list;
}

function renderProducts() {
  const grid   = $('productsGrid');
  const empty  = $('productsEmpty');
  const list   = getFilteredProducts();

  if (!list.length) {
    grid.innerHTML = '';
    grid.style.display = 'none';
    empty.style.display = 'flex';
    empty.style.flexDirection = 'column';
    empty.style.alignItems = 'center';
    return;
  }

  grid.style.display = '';
  empty.style.display = 'none';

  grid.innerHTML = list.map(p => `
    <div class="product-card" data-id="${p.id}">
      ${p.badge ? `<span class="product-card__badge badge--${p.badge}">${badgeLabel(p.badge)}</span>` : ''}
      <button class="product-card__wish" onclick="event.stopPropagation(); toggleWish(this)" title="Lista de deseos">
        <i class="far fa-heart"></i>
      </button>
      <div class="product-card__img" onclick="openProductModal(${p.id})">${p.icon}</div>
      <div class="product-card__body" onclick="openProductModal(${p.id})">
        <div class="product-card__brand">${p.brand}</div>
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__rating">
          <span class="stars">${stars(p.rating)}</span>
          <span class="rating__count">(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-card__price-block">
          ${p.originalPrice ? `<div class="product-card__original">${fmt(p.originalPrice)}</div>` : ''}
          <div class="product-card__price">${fmt(p.price)}</div>
          ${p.discount ? `<div class="product-card__discount">-${p.discount}% OFF</div>` : ''}
          <div class="product-card__shipping"><i class="fas fa-shipping-fast"></i> ${p.shipping}</div>
        </div>
      </div>
      <div class="product-card__footer">
        <button class="btn--add-cart" onclick="event.stopPropagation(); addToCart(${p.id})">
          <i class="fas fa-cart-plus"></i> Añadir
        </button>
        <button class="btn--quick-view" onclick="event.stopPropagation(); openProductModal(${p.id})" title="Ver detalle">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function badgeLabel(badge) {
  return { sale: '% OFERTA', new: '✦ NUEVO', hot: '🔥 POPULAR' }[badge] || badge.toUpperCase();
}

function toggleWish(btn) {
  btn.classList.toggle('active');
  const icon = btn.querySelector('i');
  if (btn.classList.contains('active')) {
    icon.className = 'fas fa-heart';
    showToast('Añadido a tu lista de deseos', 'heart');
  } else {
    icon.className = 'far fa-heart';
    showToast('Eliminado de tu lista de deseos', 'heart-broken');
  }
}

/* ─── FLASH SALE RENDER ──────────────────────────────────────────── */
function renderFlash() {
  $('flashGrid').innerHTML = FLASH_PRODUCTS.map(p => {
    const pct = Math.min(95, Math.round((1 - p.stock / 30) * 100));
    return `
      <div class="flash-card" onclick="openProductModal(${p.id})">
        <div class="flash-card__discount-tag">-${p.discount}%</div>
        <div class="flash-card__img">${p.icon}</div>
        <div class="flash-card__info">
          <div class="flash-card__name">${p.name}</div>
          <div class="flash-card__original">${fmt(p.originalPrice)}</div>
          <div class="flash-card__price">${fmt(p.price)}</div>
        </div>
        <div class="flash-card__bar-wrap">
          <div class="flash-card__bar"><div class="flash-card__bar-fill" style="width:${pct}%"></div></div>
          <div class="flash-card__stock">¡Solo quedan ${p.stock}!</div>
        </div>
      </div>
    `;
  }).join('');
}

/* ─── SEARCH ─────────────────────────────────────────────────────── */
function initSearch() {
  const input   = $('searchInput');
  const suggestions = $('searchSuggestions');

  function doSearch() {
    const q = input.value.trim();
    activeFilter.search = q;
    activeFilter.cat = 'all';
    updateNavHighlight('all');
    renderProducts();
    $('productsTitle').textContent = q ? `Resultados para "${q}"` : 'Productos Destacados';
    suggestions.classList.remove('active');
    scrollToProducts();
  }

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { suggestions.classList.remove('active'); return; }

    const matches = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    ).slice(0, 6);

    if (!matches.length) { suggestions.classList.remove('active'); return; }

    suggestions.innerHTML = matches.map(p => `
      <div class="suggestion__item" data-id="${p.id}">
        <i class="fas fa-search"></i>
        <span>${p.name}</span>
        <strong>${fmt(p.price)}</strong>
      </div>
    `).join('');
    suggestions.classList.add('active');

    suggestions.querySelectorAll('.suggestion__item').forEach(item => {
      item.addEventListener('click', () => {
        openProductModal(parseInt(item.dataset.id));
        suggestions.classList.remove('active');
        input.value = '';
      });
    });
  });

  $('searchBtn').addEventListener('click', doSearch);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  document.addEventListener('click', e => {
    if (!e.target.closest('.header__search')) suggestions.classList.remove('active');
  });
}

/* ─── FILTERS ────────────────────────────────────────────────────── */
function initFilters() {
  $('sortSelect').addEventListener('change', e => {
    activeFilter.sort = e.target.value;
    renderProducts();
  });

  $('priceFilter').addEventListener('change', e => {
    activeFilter.maxPrice = parseInt(e.target.value);
    renderProducts();
  });

  // Nav category links
  document.querySelectorAll('[data-cat]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const cat = el.dataset.cat;
      activeFilter.cat = cat;
      activeFilter.search = '';
      $('searchInput').value = '';
      updateNavHighlight(cat);
      renderProducts();
      const label = el.textContent.trim();
      $('productsTitle').textContent = label.replace(/[^\w\sáéíóúñ]/gi, '').trim() || 'Productos';
      scrollToProducts();
    });
  });
}

function updateNavHighlight(cat) {
  document.querySelectorAll('[data-cat]').forEach(el => {
    el.classList.toggle('active', el.dataset.cat === cat);
  });
}

function resetFilters() {
  activeFilter = { cat: 'all', maxPrice: 0, sort: 'default', search: '' };
  $('searchInput').value  = '';
  $('sortSelect').value   = 'default';
  $('priceFilter').value  = '0';
  $('productsTitle').textContent = 'Productos Destacados';
  updateNavHighlight('all');
  renderProducts();
}

/* ─── HERO SLIDER ────────────────────────────────────────────────── */
function initHero() {
  const slides = document.querySelectorAll('.hero__slide');
  const dots   = document.querySelectorAll('.hero__dot');
  let current  = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('hero__slide--active');
    dots[current].classList.remove('hero__dot--active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('hero__slide--active');
    dots[current].classList.add('hero__dot--active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function autoPlay() {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  $('heroNext').addEventListener('click', () => { next(); autoPlay(); });
  $('heroPrev').addEventListener('click', () => { prev(); autoPlay(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(parseInt(d.dataset.slide)); autoPlay(); }));
  autoPlay();
}

/* ─── COUNTDOWN TIMER ────────────────────────────────────────────── */
function initTimer() {
  const end = Date.now() + (8 * 3600 + 45 * 60 + 30) * 1000;

  function tick() {
    const diff = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    const pad = n => String(n).padStart(2, '0');
    $('timerH').textContent = pad(h);
    $('timerM').textContent = pad(m);
    $('timerS').textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

/* ─── THEME TOGGLE ───────────────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem('btlatam_theme') || 'light';
  applyTheme(saved);

  $('themeToggle').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('btlatam_theme', next);
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $('themeToggle').querySelector('i').className =
    theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ─── LOGIN/TABS ─────────────────────────────────────────────────── */
function initLogin() {
  $('loginBtn').addEventListener('click', () => openModal('loginModal'));
  $('promoBannerBtn').addEventListener('click', () => {
    openModal('loginModal');
    // auto-select register tab
    switchTab('register');
  });

  document.querySelectorAll('.tab__btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  $('loginSubmit').addEventListener('click', () => {
    showToast('¡Bienvenido de nuevo!', 'user-check');
    closeModal('loginModal');
  });

  $('registerSubmit').addEventListener('click', () => {
    showToast('¡Cuenta creada! Revisa tu email para activar.', 'check-circle');
    closeModal('loginModal');
  });
}

function switchTab(name) {
  document.querySelectorAll('.tab__btn').forEach(b => {
    b.classList.toggle('tab__btn--active', b.dataset.tab === name);
  });
  document.querySelectorAll('.tab__content').forEach(c => {
    c.classList.toggle('tab__content--active', c.id === `tab-${name}`);
  });
}

/* ─── CHECKOUT ───────────────────────────────────────────────────── */
function initCheckout() {
  $('cartBtn').addEventListener('click', () => { renderCart(); openModal('cartModal'); });

  $('checkoutBtn').addEventListener('click', () => {
    if (!cart.length) return;
    closeModal('cartModal');
    const orderNum = '#BT-' + String(Math.floor(Math.random() * 90000) + 10000);
    $('orderNumber').textContent = orderNum;
    openModal('successModal');
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();
  });
}

/* ─── SCROLL HELPERS ─────────────────────────────────────────────── */
function scrollToProducts() {
  $('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── HEADER SCROLL ──────────────────────────────────────────────── */
function initHeaderScroll() {
  window.addEventListener('scroll', () => {
    $('header').classList.toggle('header--scrolled', window.scrollY > 60);
  });
}

/* ─── INIT ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHero();
  initTimer();
  initSearch();
  initFilters();
  initLogin();
  initCheckout();
  initModalListeners();
  renderProducts();
  renderFlash();
  updateCartBadge();
  initHeaderScroll();

  // Sticky header style
  const style = document.createElement('style');
  style.textContent = `.header--scrolled { box-shadow: 0 4px 20px rgba(0,0,0,.2); }`;
  document.head.appendChild(style);
});


document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const footerLoginLink = document.getElementById('footerLoginLink');
  const promoBannerBtn = document.getElementById('promoBannerBtn');

  if (loginBtn) loginBtn.addEventListener('click', () => openModal('loginModal'));
  if (footerLoginLink) footerLoginLink.addEventListener('click', (e) => { e.preventDefault(); openModal('loginModal'); });
  if (promoBannerBtn) promoBannerBtn.addEventListener('click', () => openModal('loginModal'));
});
