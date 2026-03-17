/**
 * App.js - Sistema de Gestion Completo para Papeleria
 * Maneja: Login, Dashboard, Productos, Catalogo, Ventas, Clientes, Reportes
 * Almacenamiento: localStorage (frontend) + preparado para API backend
 */

const App = (() => {
  // ==================== STORAGE KEYS ====================
  const KEYS = {
    products: 'papeleria_products',
    clients: 'papeleria_clients',
    sales: 'papeleria_sales',
    session: 'papeleria_session',
    cart: 'papeleria_cart',
  };

  // ==================== DEFAULT DATA ====================
  const DEFAULT_PRODUCTS = [
    { id: 1, name: 'Lapiz HB No.2', category: 'Escritura', price: 5.00, stock: 150, minStock: 20, description: 'Lapiz de grafito clasico para escritura y dibujo.' },
    { id: 2, name: 'Boligrafo Azul', category: 'Escritura', price: 8.50, stock: 200, minStock: 30, description: 'Boligrafo de tinta azul punta media.' },
    { id: 3, name: 'Cuaderno Profesional 100h', category: 'Cuadernos', price: 45.00, stock: 80, minStock: 15, description: 'Cuaderno de raya profesional con espiral.' },
    { id: 4, name: 'Cuaderno Universitario 200h', category: 'Cuadernos', price: 65.00, stock: 50, minStock: 10, description: 'Cuaderno universitario cuadricula grande.' },
    { id: 5, name: 'Resma de Papel A4', category: 'Papel', price: 120.00, stock: 40, minStock: 10, description: 'Paquete de 500 hojas de papel bond blanco A4.' },
    { id: 6, name: 'Goma de Borrar Blanca', category: 'Escritura', price: 3.50, stock: 300, minStock: 50, description: 'Goma suave para borrar grafito.' },
    { id: 7, name: 'Marcadores Colores x12', category: 'Arte', price: 85.00, stock: 35, minStock: 8, description: 'Set de 12 marcadores de colores punta fina.' },
    { id: 8, name: 'Tijeras Escolares', category: 'Escolar', price: 25.00, stock: 60, minStock: 15, description: 'Tijeras con punta redonda ideales para ninos.' },
    { id: 9, name: 'Pegamento en Barra', category: 'Escolar', price: 15.00, stock: 90, minStock: 20, description: 'Pegamento en barra de 40g, no toxico.' },
    { id: 10, name: 'Regla 30cm Transparente', category: 'Escolar', price: 10.00, stock: 120, minStock: 25, description: 'Regla plastica transparente de 30cm.' },
    { id: 11, name: 'Carpeta de Argollas', category: 'Oficina', price: 55.00, stock: 30, minStock: 8, description: 'Carpeta de 3 argollas tamano carta.' },
    { id: 12, name: 'Post-it Notas Adhesivas', category: 'Oficina', price: 35.00, stock: 70, minStock: 15, description: 'Block de 100 notas adhesivas amarillas.' },
    { id: 13, name: 'Colores de Madera x24', category: 'Arte', price: 95.00, stock: 4, minStock: 8, description: 'Set de 24 lapices de colores.' },
    { id: 14, name: 'Calculadora Basica', category: 'Tecnologia', price: 75.00, stock: 2, minStock: 5, description: 'Calculadora de 12 digitos.' },
    { id: 15, name: 'Cinta Adhesiva Transp.', category: 'Oficina', price: 12.00, stock: 0, minStock: 20, description: 'Cinta adhesiva transparente 18mm x 33m.' },
    { id: 16, name: 'Sacapuntas Metalico', category: 'Escritura', price: 4.00, stock: 180, minStock: 30, description: 'Sacapuntas de metal con un orificio.' },
    { id: 17, name: 'Corrector Liquido', category: 'Oficina', price: 18.00, stock: 45, minStock: 10, description: 'Corrector liquido blanco de secado rapido.' },
    { id: 18, name: 'Papel Construccion x50', category: 'Arte', price: 40.00, stock: 25, minStock: 5, description: 'Paquete de 50 hojas de colores surtidos.' },
  ];

  const DEFAULT_CLIENTS = [
    { id: 1, name: 'Maria Lopez', email: 'maria@correo.com', phone: '(555) 100-2000', address: 'Calle Juarez 123', notes: 'Cliente frecuente', purchases: 5, totalSpent: 850.00 },
    { id: 2, name: 'Carlos Garcia', email: 'carlos@correo.com', phone: '(555) 200-3000', address: 'Av. Reforma 456', notes: '', purchases: 3, totalSpent: 520.00 },
    { id: 3, name: 'Ana Martinez', email: 'ana@correo.com', phone: '(555) 300-4000', address: 'Col. Centro 789', notes: 'Compras al mayoreo', purchases: 8, totalSpent: 2340.00 },
    { id: 4, name: 'Pedro Ramirez', email: 'pedro@correo.com', phone: '(555) 400-5000', address: 'Blvd. Norte 321', notes: '', purchases: 2, totalSpent: 280.00 },
    { id: 5, name: 'Laura Hernandez', email: 'laura@correo.com', phone: '(555) 500-6000', address: 'Calle Sur 654', notes: 'Profesora - descuento escolar', purchases: 12, totalSpent: 4100.00 },
  ];

  const DEFAULT_SALES = [
    { id: 1, date: '2026-02-20 09:15', clientId: 1, clientName: 'Maria Lopez', items: [{ productId: 1, name: 'Lapiz HB No.2', qty: 10, price: 5.00 }, { productId: 3, name: 'Cuaderno Profesional 100h', qty: 2, price: 45.00 }], subtotal: 140.00, tax: 22.40, total: 162.40 },
    { id: 2, date: '2026-02-20 11:30', clientId: 3, clientName: 'Ana Martinez', items: [{ productId: 5, name: 'Resma de Papel A4', qty: 5, price: 120.00 }, { productId: 12, name: 'Post-it Notas Adhesivas', qty: 10, price: 35.00 }], subtotal: 950.00, tax: 152.00, total: 1102.00 },
    { id: 3, date: '2026-02-21 14:00', clientId: 5, clientName: 'Laura Hernandez', items: [{ productId: 7, name: 'Marcadores Colores x12', qty: 5, price: 85.00 }, { productId: 8, name: 'Tijeras Escolares', qty: 10, price: 25.00 }, { productId: 9, name: 'Pegamento en Barra', qty: 15, price: 15.00 }], subtotal: 900.00, tax: 144.00, total: 1044.00 },
    { id: 4, date: '2026-02-22 10:45', clientId: 2, clientName: 'Carlos Garcia', items: [{ productId: 2, name: 'Boligrafo Azul', qty: 20, price: 8.50 }], subtotal: 170.00, tax: 27.20, total: 197.20 },
    { id: 5, date: '2026-02-23 16:20', clientId: 4, clientName: 'Pedro Ramirez', items: [{ productId: 10, name: 'Regla 30cm Transparente', qty: 5, price: 10.00 }, { productId: 6, name: 'Goma de Borrar Blanca', qty: 10, price: 3.50 }], subtotal: 85.00, tax: 13.60, total: 98.60 },
    { id: 6, date: '2026-02-24 08:30', clientId: 5, clientName: 'Laura Hernandez', items: [{ productId: 3, name: 'Cuaderno Profesional 100h', qty: 20, price: 45.00 }, { productId: 1, name: 'Lapiz HB No.2', qty: 40, price: 5.00 }], subtotal: 1100.00, tax: 176.00, total: 1276.00 },
  ];

  // Users for login
  const USERS = [
    { username: 'admin', password: 'admin123', name: 'Administrador' },
    { username: 'vendedor', password: 'venta123', name: 'Vendedor' },
  ];

  const CATEGORY_ICONS = {
    'Escritura': '&#9997;',
    'Cuadernos': '&#128210;',
    'Papel': '&#128196;',
    'Oficina': '&#128188;',
    'Arte': '&#127912;',
    'Tecnologia': '&#128187;',
    'Escolar': '&#127891;',
  };

  const CATEGORY_COLORS = {
    'Escritura': '#2563eb',
    'Cuadernos': '#7c3aed',
    'Papel': '#059669',
    'Oficina': '#d97706',
    'Arte': '#ec4899',
    'Tecnologia': '#0891b2',
    'Escolar': '#dc2626',
  };

  // ==================== DATA ACCESS ====================
  function getData(key, defaults) {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaults));
      return JSON.parse(JSON.stringify(defaults));
    }
    return JSON.parse(data);
  }

  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function getProducts() { return getData(KEYS.products, DEFAULT_PRODUCTS); }
  function saveProducts(p) { saveData(KEYS.products, p); }
  function getClients() { return getData(KEYS.clients, DEFAULT_CLIENTS); }
  function saveClients(c) { saveData(KEYS.clients, c); }
  function getSales() { return getData(KEYS.sales, DEFAULT_SALES); }
  function saveSales(s) { saveData(KEYS.sales, s); }

  function nextId(arr) {
    if (arr.length === 0) return 1;
    return Math.max(...arr.map(i => i.id)) + 1;
  }

  // ==================== UTILITIES ====================
  function formatPrice(price) {
    return '$' + Number(price).toFixed(2);
  }

  function getStockStatus(product) {
    if (product.stock === 0) return { label: 'Sin stock', class: 'badge-danger' };
    if (product.stock <= product.minStock) return { label: 'Stock bajo', class: 'badge-warning' };
    return { label: 'Disponible', class: 'badge-success' };
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }

  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = { success: '&#9989;', danger: '&#10060;', warning: '&#9888;' };
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.success}</span>
      <span class="toast-message">${escapeHtml(message)}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  // ==================== SIDEBAR ====================
  function initSidebar() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (toggle && sidebar) {
      toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      });
    }
  }

  // ==================== LOGIN ====================
  function initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    // If already logged in, redirect
    const session = localStorage.getItem(KEYS.session);
    if (session) {
      window.location.href = 'Home.html';
      return;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('loginUser').value.trim();
      const pass = document.getElementById('loginPassword').value;
      const errorEl = document.getElementById('loginError');

      const found = USERS.find(u => u.username === user && u.password === pass);
      if (found) {
        saveData(KEYS.session, { username: found.username, name: found.name, loginTime: new Date().toISOString() });
        window.location.href = 'Home.html';
      } else {
        errorEl.textContent = 'Usuario o contrasena incorrectos';
        errorEl.style.display = 'block';
      }
    });
  }

  // ==================== HOME / DASHBOARD ====================
  function initHome() {
    const products = getProducts();

    // Stats
    const el = (id) => document.getElementById(id);
    const totalProducts = products.length;
    const totalValue = products.reduce((s, p) => s + (p.price * p.stock), 0);
    const inStock = products.filter(p => p.stock > p.minStock).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;

    if (el('statTotalProducts')) el('statTotalProducts').textContent = totalProducts;
    if (el('statTotalValue')) el('statTotalValue').textContent = formatPrice(totalValue);
    if (el('statInStock')) el('statInStock').textContent = inStock;
    if (el('statLowStock')) el('statLowStock').textContent = lowStock;

    // Category chart
    renderCategoryChart(products);

    // Recent products table
    const tbody = document.getElementById('recentProductsTable');
    if (tbody) {
      const recent = products.slice(-5).reverse();
      tbody.innerHTML = recent.map(p => {
        const st = getStockStatus(p);
        return `<tr>
          <td>${escapeHtml(p.name)}</td>
          <td>${escapeHtml(p.category)}</td>
          <td>${formatPrice(p.price)}</td>
          <td>${p.stock}</td>
          <td><span class="badge ${st.class}">${st.label}</span></td>
        </tr>`;
      }).join('');
    }
  }

  function renderCategoryChart(products) {
    const container = document.getElementById('categoryChart');
    if (!container) return;
    const cats = {};
    products.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
    const maxCount = Math.max(...Object.values(cats), 1);
    container.innerHTML = '';
    Object.entries(cats).forEach(([cat, count]) => {
      const height = Math.max((count / maxCount) * 180, 20);
      const color = CATEGORY_COLORS[cat] || '#6b7280';
      const bar = document.createElement('div');
      bar.className = 'chart-bar';
      bar.style.height = height + 'px';
      bar.style.backgroundColor = color;
      bar.innerHTML = `<span class="bar-value">${count}</span><span class="bar-label">${escapeHtml(cat)}</span>`;
      container.appendChild(bar);
    });
  }

  // ==================== PRODUCTS ====================
  let deleteTargetId = null;

  function initProducts() {
    renderProductsTable();
    bindProductEvents();
  }

  function getFilteredProducts() {
    let products = getProducts();
    const search = document.getElementById('searchProduct');
    const catFilter = document.getElementById('filterCategory');
    const stockFilter = document.getElementById('filterStock');

    if (search && search.value.trim()) {
      const q = search.value.trim().toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q));
    }
    if (catFilter && catFilter.value) {
      products = products.filter(p => p.category === catFilter.value);
    }
    if (stockFilter && stockFilter.value) {
      if (stockFilter.value === 'available') products = products.filter(p => p.stock > p.minStock);
      else if (stockFilter.value === 'low') products = products.filter(p => p.stock > 0 && p.stock <= p.minStock);
      else if (stockFilter.value === 'out') products = products.filter(p => p.stock === 0);
    }
    return products;
  }

  function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    const products = getFilteredProducts();
    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray-400);">No se encontraron productos.</td></tr>';
      return;
    }
    tbody.innerHTML = products.map(p => {
      const st = getStockStatus(p);
      return `<tr>
        <td>#${p.id}</td>
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.category)}</td>
        <td>${formatPrice(p.price)}</td>
        <td>${p.stock}</td>
        <td><span class="badge ${st.class}">${st.label}</span></td>
        <td>
          <button class="btn-icon btn-secondary" title="Editar" onclick="App.editProduct(${p.id})">&#9998;</button>
          <button class="btn-icon btn-danger" title="Eliminar" onclick="App.confirmDelete(${p.id})" style="margin-left:4px;">&#128465;</button>
        </td>
      </tr>`;
    }).join('');
  }

  function bindProductEvents() {
    const btnAdd = document.getElementById('btnAddProduct');
    if (btnAdd) btnAdd.addEventListener('click', () => openProductModal());

    const modalClose = document.getElementById('modalClose');
    const btnCancel = document.getElementById('btnCancelProduct');
    if (modalClose) modalClose.addEventListener('click', closeProductModal);
    if (btnCancel) btnCancel.addEventListener('click', closeProductModal);

    const btnSave = document.getElementById('btnSaveProduct');
    if (btnSave) btnSave.addEventListener('click', saveProduct);

    const search = document.getElementById('searchProduct');
    const catFilter = document.getElementById('filterCategory');
    const stockFilter = document.getElementById('filterStock');
    if (search) search.addEventListener('input', renderProductsTable);
    if (catFilter) catFilter.addEventListener('change', renderProductsTable);
    if (stockFilter) stockFilter.addEventListener('change', renderProductsTable);

    const deleteClose = document.getElementById('deleteModalClose');
    const btnCancelDel = document.getElementById('btnCancelDelete');
    const btnConfirmDel = document.getElementById('btnConfirmDelete');
    if (deleteClose) deleteClose.addEventListener('click', closeDeleteModal);
    if (btnCancelDel) btnCancelDel.addEventListener('click', closeDeleteModal);
    if (btnConfirmDel) btnConfirmDel.addEventListener('click', deleteProduct);
  }

  function openProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');
    if (form) form.reset();

    if (product) {
      title.textContent = 'Editar Producto';
      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productCategory').value = product.category;
      document.getElementById('productPrice').value = product.price;
      document.getElementById('productStock').value = product.stock;
      document.getElementById('productMinStock').value = product.minStock;
      document.getElementById('productDescription').value = product.description || '';
    } else {
      title.textContent = 'Agregar Producto';
      document.getElementById('productId').value = '';
    }
    modal.classList.add('active');
  }

  function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
  }

  function saveProduct() {
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value, 10);
    const minStock = parseInt(document.getElementById('productMinStock').value, 10);
    const description = document.getElementById('productDescription').value.trim();
    const editId = document.getElementById('productId').value;

    if (!name || !category || isNaN(price) || isNaN(stock) || isNaN(minStock)) {
      showToast('Completa todos los campos obligatorios.', 'warning');
      return;
    }

    const products = getProducts();
    if (editId) {
      const idx = products.findIndex(p => p.id === parseInt(editId, 10));
      if (idx !== -1) {
        products[idx] = { ...products[idx], name, category, price, stock, minStock, description };
        showToast('Producto actualizado correctamente.');
      }
    } else {
      products.push({ id: nextId(products), name, category, price, stock, minStock, description });
      showToast('Producto agregado correctamente.');
    }

    saveProducts(products);
    closeProductModal();
    renderProductsTable();
  }

  function editProduct(id) {
    const product = getProducts().find(p => p.id === id);
    if (product) openProductModal(product);
  }

  function confirmDelete(id) {
    const product = getProducts().find(p => p.id === id);
    if (!product) return;
    deleteTargetId = id;
    document.getElementById('deleteProductName').textContent = product.name;
    document.getElementById('deleteModal').classList.add('active');
  }

  function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deleteTargetId = null;
  }

  function deleteProduct() {
    if (deleteTargetId === null) return;
    let products = getProducts();
    products = products.filter(p => p.id !== deleteTargetId);
    saveProducts(products);
    closeDeleteModal();
    renderProductsTable();
    showToast('Producto eliminado.', 'danger');
  }

  // ==================== CATALOG ====================
  function initCatalog() {
    renderCatalog();
    const search = document.getElementById('catalogSearch');
    const catFilter = document.getElementById('catalogCategory');
    const sortSelect = document.getElementById('catalogSort');
    if (search) search.addEventListener('input', renderCatalog);
    if (catFilter) catFilter.addEventListener('change', renderCatalog);
    if (sortSelect) sortSelect.addEventListener('change', renderCatalog);
  }

  function renderCatalog() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    const emptyState = document.getElementById('catalogEmpty');

    let products = getProducts();
    const search = document.getElementById('catalogSearch');
    const catFilter = document.getElementById('catalogCategory');
    const sortSelect = document.getElementById('catalogSort');

    if (search && search.value.trim()) {
      const q = search.value.trim().toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q));
    }
    if (catFilter && catFilter.value) products = products.filter(p => p.category === catFilter.value);
    if (sortSelect) {
      const s = sortSelect.value;
      if (s === 'name-asc') products.sort((a, b) => a.name.localeCompare(b.name));
      else if (s === 'name-desc') products.sort((a, b) => b.name.localeCompare(a.name));
      else if (s === 'price-asc') products.sort((a, b) => a.price - b.price);
      else if (s === 'price-desc') products.sort((a, b) => b.price - a.price);
      else if (s === 'stock-desc') products.sort((a, b) => b.stock - a.stock);
    }

    if (products.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }
    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = products.map(p => {
      const st = getStockStatus(p);
      const icon = CATEGORY_ICONS[p.category] || '&#128230;';
      return `<div class="catalog-card">
        <div class="catalog-card-img">${icon}</div>
        <div class="catalog-card-body">
          <span class="category-tag">${escapeHtml(p.category)}</span>
          <h3>${escapeHtml(p.name)}</h3>
          <div class="price">${formatPrice(p.price)}</div>
          <div class="stock-info">Stock: ${p.stock} uds. <span class="badge ${st.class}">${st.label}</span></div>
        </div>
      </div>`;
    }).join('');
  }

  // ==================== SALES / POS ====================
  let cart = [];

  function initSales() {
    cart = [];
    renderPosProducts();
    renderCart();
    renderRecentSales();
    loadClientSelect();
    bindSalesEvents();
  }

  function bindSalesEvents() {
    const search = document.getElementById('posSearch');
    const catFilter = document.getElementById('posCategory');
    if (search) search.addEventListener('input', renderPosProducts);
    if (catFilter) catFilter.addEventListener('change', renderPosProducts);

    const btnClear = document.getElementById('btnClearCart');
    if (btnClear) btnClear.addEventListener('click', () => {
      cart = [];
      renderCart();
    });

    const btnComplete = document.getElementById('btnCompleteSale');
    if (btnComplete) btnComplete.addEventListener('click', completeSale);
  }

  function loadClientSelect() {
    const select = document.getElementById('posClient');
    if (!select) return;
    const clients = getClients();
    select.innerHTML = '<option value="">Cliente general</option>' +
      clients.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
  }

  function renderPosProducts() {
    const grid = document.getElementById('posProductGrid');
    if (!grid) return;

    let products = getProducts();
    const search = document.getElementById('posSearch');
    const catFilter = document.getElementById('posCategory');

    if (search && search.value.trim()) {
      const q = search.value.trim().toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q));
    }
    if (catFilter && catFilter.value) products = products.filter(p => p.category === catFilter.value);

    grid.innerHTML = products.map(p => {
      const icon = CATEGORY_ICONS[p.category] || '&#128230;';
      const outClass = p.stock === 0 ? ' out-of-stock' : '';
      return `<div class="pos-product-item${outClass}" onclick="App.addToCart(${p.id})" title="${escapeHtml(p.name)}">
        <div class="pos-item-icon">${icon}</div>
        <div class="pos-item-name">${escapeHtml(p.name)}</div>
        <div class="pos-item-price">${formatPrice(p.price)}</div>
        <div class="pos-item-stock">Stock: ${p.stock}</div>
      </div>`;
    }).join('');
  }

  function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;

    const existing = cart.find(i => i.productId === productId);
    if (existing) {
      if (existing.qty >= product.stock) {
        showToast('No hay suficiente stock.', 'warning');
        return;
      }
      existing.qty++;
    } else {
      cart.push({ productId: product.id, name: product.name, price: product.price, qty: 1, maxStock: product.stock });
    }
    renderCart();
  }

  function updateCartQty(productId, delta) {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.productId !== productId);
    } else if (item.qty > item.maxStock) {
      item.qty = item.maxStock;
      showToast('Stock maximo alcanzado.', 'warning');
    }
    renderCart();
  }

  function removeFromCart(productId) {
    cart = cart.filter(i => i.productId !== productId);
    renderCart();
  }

  function renderCart() {
    const container = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    const totalsEl = document.getElementById('cartTotals');
    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = '<div class="empty-state" id="cartEmpty"><div class="empty-icon">&#128722;</div><p>Agrega productos al carrito</p></div>';
      if (totalsEl) totalsEl.style.display = 'none';
      return;
    }

    container.innerHTML = cart.map(item => {
      const lineTotal = item.price * item.qty;
      return `<div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${escapeHtml(item.name)}</div>
          <div class="cart-item-price">${formatPrice(item.price)} c/u</div>
        </div>
        <div class="cart-item-qty">
          <button onclick="App.updateCartQty(${item.productId}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="App.updateCartQty(${item.productId}, 1)">+</button>
        </div>
        <div class="cart-item-total">${formatPrice(lineTotal)}</div>
        <button class="cart-item-remove" onclick="App.removeFromCart(${item.productId})">&times;</button>
      </div>`;
    }).join('');

    const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    if (totalsEl) {
      totalsEl.style.display = 'block';
      document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
      document.getElementById('cartTax').textContent = formatPrice(tax);
      document.getElementById('cartTotal').textContent = formatPrice(total);
    }
  }

  function completeSale() {
    if (cart.length === 0) return;

    const clientSelect = document.getElementById('posClient');
    const clientId = clientSelect ? parseInt(clientSelect.value, 10) : 0;
    const clients = getClients();
    const client = clients.find(c => c.id === clientId);

    const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    const sales = getSales();
    const now = new Date();
    const dateStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0');

    const sale = {
      id: nextId(sales),
      date: dateStr,
      clientId: clientId || 0,
      clientName: client ? client.name : 'Cliente general',
      items: cart.map(i => ({ productId: i.productId, name: i.name, qty: i.qty, price: i.price })),
      subtotal, tax, total
    };

    sales.push(sale);
    saveSales(sales);

    // Update stock
    const products = getProducts();
    cart.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) prod.stock = Math.max(0, prod.stock - item.qty);
    });
    saveProducts(products);

    // Update client stats
    if (client) {
      client.purchases = (client.purchases || 0) + 1;
      client.totalSpent = (client.totalSpent || 0) + total;
      saveClients(clients);
    }

    cart = [];
    renderCart();
    renderPosProducts();
    renderRecentSales();
    showToast('Venta completada - Total: ' + formatPrice(total));
  }

  function renderRecentSales() {
    const tbody = document.getElementById('recentSalesTable');
    if (!tbody) return;
    const sales = getSales().slice(-10).reverse();
    if (sales.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--gray-400);">No hay ventas registradas.</td></tr>';
      return;
    }
    tbody.innerHTML = sales.map(s => {
      const itemsSummary = s.items.map(i => i.name + ' x' + i.qty).join(', ');
      return `<tr>
        <td>#${s.id}</td>
        <td>${formatDate(s.date)}</td>
        <td>${escapeHtml(s.clientName)}</td>
        <td title="${escapeHtml(itemsSummary)}">${s.items.length} producto(s)</td>
        <td><strong>${formatPrice(s.total)}</strong></td>
      </tr>`;
    }).join('');
  }

  // ==================== CLIENTS ====================
  let deleteClientTargetId = null;

  function initClients() {
    renderClientStats();
    renderClientsTable();
    bindClientEvents();
  }

  function renderClientStats() {
    const clients = getClients();
    const sales = getSales();
    const el = (id) => document.getElementById(id);

    if (el('statTotalClients')) el('statTotalClients').textContent = clients.length;

    const totalSales = sales.reduce((s, sale) => s + sale.total, 0);
    if (el('statTotalClientSales')) el('statTotalClientSales').textContent = formatPrice(totalSales);

    if (clients.length > 0) {
      const top = clients.reduce((a, b) => (a.totalSpent || 0) > (b.totalSpent || 0) ? a : b);
      if (el('statTopClient')) el('statTopClient').textContent = top.name;
    }
  }

  function renderClientsTable() {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;

    let clients = getClients();
    const search = document.getElementById('searchClient');
    if (search && search.value.trim()) {
      const q = search.value.trim().toLowerCase();
      clients = clients.filter(c =>
        c.name.toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q)
      );
    }

    if (clients.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray-400);">No se encontraron clientes.</td></tr>';
      return;
    }

    tbody.innerHTML = clients.map(c => `<tr>
      <td>#${c.id}</td>
      <td>${escapeHtml(c.name)}</td>
      <td>${escapeHtml(c.email || '-')}</td>
      <td>${escapeHtml(c.phone || '-')}</td>
      <td>${c.purchases || 0}</td>
      <td>${formatPrice(c.totalSpent || 0)}</td>
      <td>
        <button class="btn-icon btn-secondary" title="Editar" onclick="App.editClient(${c.id})">&#9998;</button>
        <button class="btn-icon btn-danger" title="Eliminar" onclick="App.confirmDeleteClient(${c.id})" style="margin-left:4px;">&#128465;</button>
      </td>
    </tr>`).join('');
  }

  function bindClientEvents() {
    const btnAdd = document.getElementById('btnAddClient');
    if (btnAdd) btnAdd.addEventListener('click', () => openClientModal());

    const close = document.getElementById('clientModalClose');
    const cancel = document.getElementById('btnCancelClient');
    if (close) close.addEventListener('click', closeClientModal);
    if (cancel) cancel.addEventListener('click', closeClientModal);

    const save = document.getElementById('btnSaveClient');
    if (save) save.addEventListener('click', saveClient);

    const search = document.getElementById('searchClient');
    if (search) search.addEventListener('input', renderClientsTable);

    const delClose = document.getElementById('deleteClientModalClose');
    const delCancel = document.getElementById('btnCancelDeleteClient');
    const delConfirm = document.getElementById('btnConfirmDeleteClient');
    if (delClose) delClose.addEventListener('click', closeDeleteClientModal);
    if (delCancel) delCancel.addEventListener('click', closeDeleteClientModal);
    if (delConfirm) delConfirm.addEventListener('click', deleteClient);
  }

  function openClientModal(client = null) {
    const modal = document.getElementById('clientModal');
    const title = document.getElementById('clientModalTitle');
    const form = document.getElementById('clientForm');
    if (form) form.reset();

    if (client) {
      title.textContent = 'Editar Cliente';
      document.getElementById('clientId').value = client.id;
      document.getElementById('clientName').value = client.name;
      document.getElementById('clientEmail').value = client.email || '';
      document.getElementById('clientPhone').value = client.phone || '';
      document.getElementById('clientAddress').value = client.address || '';
      document.getElementById('clientNotes').value = client.notes || '';
    } else {
      title.textContent = 'Agregar Cliente';
      document.getElementById('clientId').value = '';
    }
    modal.classList.add('active');
  }

  function closeClientModal() {
    document.getElementById('clientModal').classList.remove('active');
  }

  function saveClient() {
    const name = document.getElementById('clientName').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const address = document.getElementById('clientAddress').value.trim();
    const notes = document.getElementById('clientNotes').value.trim();
    const editId = document.getElementById('clientId').value;

    if (!name) {
      showToast('El nombre del cliente es obligatorio.', 'warning');
      return;
    }

    const clients = getClients();
    if (editId) {
      const idx = clients.findIndex(c => c.id === parseInt(editId, 10));
      if (idx !== -1) {
        clients[idx] = { ...clients[idx], name, email, phone, address, notes };
        showToast('Cliente actualizado correctamente.');
      }
    } else {
      clients.push({ id: nextId(clients), name, email, phone, address, notes, purchases: 0, totalSpent: 0 });
      showToast('Cliente agregado correctamente.');
    }

    saveClients(clients);
    closeClientModal();
    renderClientsTable();
    renderClientStats();
  }

  function editClient(id) {
    const client = getClients().find(c => c.id === id);
    if (client) openClientModal(client);
  }

  function confirmDeleteClient(id) {
    const client = getClients().find(c => c.id === id);
    if (!client) return;
    deleteClientTargetId = id;
    document.getElementById('deleteClientName').textContent = client.name;
    document.getElementById('deleteClientModal').classList.add('active');
  }

  function closeDeleteClientModal() {
    document.getElementById('deleteClientModal').classList.remove('active');
    deleteClientTargetId = null;
  }

  function deleteClient() {
    if (deleteClientTargetId === null) return;
    let clients = getClients();
    clients = clients.filter(c => c.id !== deleteClientTargetId);
    saveClients(clients);
    closeDeleteClientModal();
    renderClientsTable();
    renderClientStats();
    showToast('Cliente eliminado.', 'danger');
  }

  // ==================== REPORTS ====================
  function initReports() {
    const sales = getSales();
    const products = getProducts();
    const clients = getClients();
    const el = (id) => document.getElementById(id);

    // Summary stats
    const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
    const totalSalesCount = sales.length;
    const totalProductsSold = sales.reduce((s, sale) => s + sale.items.reduce((ss, i) => ss + i.qty, 0), 0);
    const avgSale = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;

    if (el('reportTotalRevenue')) el('reportTotalRevenue').textContent = formatPrice(totalRevenue);
    if (el('reportTotalSales')) el('reportTotalSales').textContent = totalSalesCount;
    if (el('reportProductsSold')) el('reportProductsSold').textContent = totalProductsSold;
    if (el('reportAvgSale')) el('reportAvgSale').textContent = formatPrice(avgSale);

    // Sales by day chart
    renderSalesChart(sales);

    // Top products
    renderTopProducts(sales);

    // Top clients
    renderTopClients(clients);

    // Low stock alert
    renderLowStockAlert(products);

    // All sales history
    renderAllSales(sales);
  }

  function renderSalesChart(sales) {
    const container = document.getElementById('salesChart');
    if (!container) return;

    const byDay = {};
    sales.forEach(s => {
      const day = s.date.split(' ')[0];
      byDay[day] = (byDay[day] || 0) + s.total;
    });

    const days = Object.entries(byDay).sort((a, b) => a[0].localeCompare(b[0])).slice(-7);
    const maxVal = Math.max(...days.map(d => d[1]), 1);
    container.innerHTML = '';

    const colors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#ec4899', '#0891b2', '#dc2626'];
    days.forEach(([day, total], i) => {
      const height = Math.max((total / maxVal) * 180, 20);
      const bar = document.createElement('div');
      bar.className = 'chart-bar';
      bar.style.height = height + 'px';
      bar.style.backgroundColor = colors[i % colors.length];
      bar.style.width = '50px';
      const shortDay = day.slice(5);
      bar.innerHTML = `<span class="bar-value">${formatPrice(total)}</span><span class="bar-label">${shortDay}</span>`;
      container.appendChild(bar);
    });
  }

  function renderTopProducts(sales) {
    const tbody = document.getElementById('topProductsTable');
    if (!tbody) return;

    const productStats = {};
    sales.forEach(s => {
      s.items.forEach(item => {
        if (!productStats[item.name]) productStats[item.name] = { qty: 0, revenue: 0 };
        productStats[item.name].qty += item.qty;
        productStats[item.name].revenue += item.price * item.qty;
      });
    });

    const sorted = Object.entries(productStats).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5);
    if (sorted.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:20px;color:var(--gray-400);">Sin datos</td></tr>';
      return;
    }

    tbody.innerHTML = sorted.map(([name, stats]) =>
      `<tr><td>${escapeHtml(name)}</td><td>${stats.qty}</td><td>${formatPrice(stats.revenue)}</td></tr>`
    ).join('');
  }

  function renderTopClients(clients) {
    const tbody = document.getElementById('topClientsTable');
    if (!tbody) return;

    const sorted = [...clients].sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0)).slice(0, 5);
    if (sorted.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:20px;color:var(--gray-400);">Sin datos</td></tr>';
      return;
    }

    tbody.innerHTML = sorted.map(c =>
      `<tr><td>${escapeHtml(c.name)}</td><td>${c.purchases || 0}</td><td>${formatPrice(c.totalSpent || 0)}</td></tr>`
    ).join('');
  }

  function renderLowStockAlert(products) {
    const tbody = document.getElementById('lowStockTable');
    if (!tbody) return;

    const lowStock = products.filter(p => p.stock <= p.minStock);
    if (lowStock.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--gray-400);">No hay alertas de stock bajo.</td></tr>';
      return;
    }

    tbody.innerHTML = lowStock.map(p => {
      const st = getStockStatus(p);
      return `<tr>
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.category)}</td>
        <td>${p.stock}</td>
        <td>${p.minStock}</td>
        <td><span class="badge ${st.class}">${st.label}</span></td>
      </tr>`;
    }).join('');
  }

  function renderAllSales(sales) {
    const tbody = document.getElementById('allSalesTable');
    if (!tbody) return;

    const sorted = [...sales].reverse();
    if (sorted.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--gray-400);">Sin ventas registradas.</td></tr>';
      return;
    }

    tbody.innerHTML = sorted.map(s => {
      const items = s.items.map(i => i.name + ' x' + i.qty).join(', ');
      return `<tr>
        <td>#${s.id}</td>
        <td>${formatDate(s.date)}</td>
        <td>${escapeHtml(s.clientName)}</td>
        <td title="${escapeHtml(items)}">${s.items.length} producto(s)</td>
        <td><strong>${formatPrice(s.total)}</strong></td>
      </tr>`;
    }).join('');
  }

  // ==================== INIT ====================
  function init(page) {
    initSidebar();

    switch (page) {
      case 'login': initLogin(); break;
      case 'home': initHome(); break;
      case 'products': initProducts(); break;
      case 'catalog': initCatalog(); break;
      case 'sales': initSales(); break;
      case 'clients': initClients(); break;
      case 'reports': initReports(); break;
    }
  }

  // Public API
  return {
    init,
    editProduct,
    confirmDelete,
    addToCart,
    updateCartQty,
    removeFromCart,
    editClient,
    confirmDeleteClient,
  };
})();
