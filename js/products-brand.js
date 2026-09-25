document.addEventListener('DOMContentLoaded', function () {

  var brandBody = document.getElementById('brand-body');
  if (!brandBody || typeof PSL_BRANDS === 'undefined') return; // only run on brand.html

  var U = PSL_PRODUCTS_UTIL;
  var params = new URLSearchParams(window.location.search);
  var brandId = params.get('id');
  var deepLinkProduct = params.get('product');
  var brand = U.brandById(brandId);

  if (!brand) {
    window.location.href = 'products.html';
    return;
  }

  var products = PSL_PRODUCTS.filter(function (p) { return p.brand === brandId; });

  var CHECK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';
  var CHEVRON_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  /* =========================================================
     PAGE CHROME + STORE HEADER
     ========================================================= */

  document.getElementById('page-title').textContent = brand.name + ' Products | Pembinaan Setia Lestari Sdn Bhd';
  document.getElementById('breadcrumb-brand').textContent = brand.name;
  document.getElementById('page-h1').textContent = brand.name;

  var logoHTML = brand.logo
    ? '<div class="store-logo"><img src="' + brand.logo + '" alt="' + U.esc(brand.name) + '"></div>'
    : '<div class="store-logo"><span class="brand-hero-avatar">' + U.initials(brand.name) + '</span></div>';

  var badgesHTML = (brand.badges || []).map(function (b) {
    return '<span class="store-badge">' + CHECK_SVG + U.esc(b) + '</span>';
  }).join('');

  var statsHTML = '';
  if (brand.available && products.length) {
    var packSizes = 0, appSeen = {};
    products.forEach(function (p) {
      packSizes += p.variants.length;
      (p.applications || []).forEach(function (a) { appSeen[a] = true; });
    });
    statsHTML =
      '<div class="store-stats">' +
      '  <div class="store-stat"><div class="n">' + products.length + '</div><div class="l">Products</div></div>' +
      '  <div class="store-stat"><div class="n">' + packSizes + '</div><div class="l">Pack Sizes</div></div>' +
      '  <div class="store-stat"><div class="n">' + Object.keys(appSeen).length + '</div><div class="l">Applications</div></div>' +
      '</div>';
  }

  document.getElementById('brand-header').innerHTML =
    '<div class="store-id">' + logoHTML +
    '  <div class="store-txt">' +
    '    <div class="store-tagline">' + U.esc(brand.tagline || 'Trading principal') + '</div>' +
    '    <p>' + (brand.available ? 'Supplied by PSL across Sarawak. Browse the range and enquire for the products you need.' : 'Available through PSL on request.') + '</p>' +
    (badgesHTML ? '    <div class="store-badges">' + badgesHTML + '</div>' : '') +
    '  </div>' +
    '</div>' +
    statsHTML +
    (brand.available ? '<div class="store-cta"><a class="btn btn-primary btn-sm" href="contact.html?product=' + encodeURIComponent(brand.name) + '">Enquire Now</a></div>' : '');

  /* =========================================================
     BRAND WITHOUT AN ONLINE CATALOGUE — enquire panel + similar brands
     ========================================================= */

  if (!brand.available) {
    var similar = PSL_BRANDS.filter(function (b) {
      return b.id !== brand.id && (b.categories || []).some(function (c) { return (brand.categories || []).indexOf(c) !== -1; });
    }).slice(0, 4);

    brandBody.innerHTML =
      '<div class="enquire-panel">' +
      '  <svg viewBox="0 0 24 24"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v4M16 3v5h5M12 12v6M9 15h6"/></svg>' +
      '  <h3>Catalogue on request</h3>' +
      '  <p>We don’t have an online catalogue listed for ' + U.esc(brand.name) + ' yet, but the range is available to order. Tell us the product you need and our team will come back with details.</p>' +
      '  <a href="contact.html?product=' + encodeURIComponent(brand.name) + '" class="btn btn-primary">Enquire About This Brand</a>' +
      '</div>' +
      (similar.length
        ? '<div class="mk-head" style="margin-top:44px;"><h2>Similar Brands</h2></div><div class="brand-grid">' + similar.map(function (b) { return U.brandCardHTML(b); }).join('') + '</div>'
        : '');
    return;
  }

  /* =========================================================
     AVAILABLE BRAND — general filters + sort + product grid.
     Only two broad filters (Category, Application) so the sidebar stays
     short as more categories arrive. Specifics (features, sizes, ...)
     are found with the store search box instead.
     ========================================================= */

  var state = { q: '', cats: {}, apps: {}, sort: 'recommended', view: 'grid' };
  var qOrder = {};   // product id -> relevance rank while a search is active
  var GROUP_LIMIT = 6;

  function anySel(o) { return Object.keys(o).length > 0; }
  function bucketOf(group) { return group === 'cat' ? state.cats : state.apps; }

  // Facet options derived from this brand's real products
  var categories = [], catSeen = {}, appCount = {};
  products.forEach(function (p) {
    if (!catSeen[p.category]) { catSeen[p.category] = true; categories.push({ value: p.category, label: p.categoryLabel }); }
    (p.applications || []).forEach(function (a) { appCount[a] = (appCount[a] || 0) + 1; });
  });
  var applications = Object.keys(appCount).sort(function (a, b) { return (appCount[b] - appCount[a]) || a.localeCompare(b); });

  /* Does the product survive every active filter? `skip` leaves one facet out,
     which is how the live counts next to each option are worked out. */
  function evaluate(p, s, skip) {
    if (skip !== 'q' && s.q && qOrder[p.id] === undefined) return false;
    if (skip !== 'cat' && anySel(s.cats) && !s.cats[p.category]) return false;
    if (skip !== 'app' && anySel(s.apps) && !(p.applications || []).some(function (a) { return s.apps[a]; })) return false;
    return true;
  }

  /* ---------- Static layout ---------- */

  function checkHTML(group, value, label, extra) {
    return '<label class="sf-check' + (extra ? ' ' + extra : '') + '" data-group="' + group + '" data-value="' + U.esc(value) + '">' +
      '<input type="checkbox"><span class="sf-box">' + CHECK_SVG + '</span>' +
      '<span class="sf-name">' + U.esc(label) + '</span><span class="sf-count"></span></label>';
  }
  function groupHTML(id, title, items) {   // items: [{ value, label }]
    var body = items.map(function (it, i) { return checkHTML(id, it.value, it.label, i >= GROUP_LIMIT ? 'sf-extra' : ''); }).join('') +
      (items.length > GROUP_LIMIT ? '<button type="button" class="sf-more" data-more>Show ' + (items.length - GROUP_LIMIT) + ' more</button>' : '');
    return '<div class="sf-group open" data-group="' + id + '">' +
      '<button type="button" class="sf-group-head" aria-expanded="true"><span>' + title + '</span>' + CHEVRON_SVG + '</button>' +
      '<div class="sf-group-body">' + body + '</div></div>';
  }

  var filtersInner = '';
  if (categories.length > 1) filtersInner += groupHTML('cat', 'Category', categories);
  if (applications.length > 1) filtersInner += groupHTML('app', 'Application', applications.map(function (a) { return { value: a, label: a }; }));

  brandBody.innerHTML =
    '<div class="shop-layout' + (filtersInner ? '' : ' no-filters') + '">' +
    (filtersInner
      ? '  <aside class="shop-filters" id="shop-filters" aria-label="Product filters">' +
        '    <div class="sf-head"><strong>Filters</strong><button type="button" class="sf-clear" data-clear-all>Clear all</button><button type="button" class="sf-close" data-close-filters aria-label="Close filters">&times;</button></div>' +
        '    <div class="sf-groups">' + filtersInner + '</div>' +
        '    <div class="sf-foot"><button type="button" class="btn btn-primary" data-close-filters id="sf-apply">Show results</button></div>' +
        '  </aside>' +
        '  <div class="sf-overlay" id="sf-overlay"></div>'
      : '') +
    '  <div class="shop-main">' +
    '    <div class="shop-toolbar">' +
    (filtersInner ? '      <button type="button" class="shop-filter-btn" id="shop-filter-btn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18l-7 8v6l-4 2v-8L3 5z"/></svg>Filters<b id="shop-filter-badge" hidden>0</b></button>' : '') +
    '      <div class="shop-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
    '        <input type="search" id="shop-q" placeholder="Search in ' + U.esc(brand.name) + '…" autocomplete="off" aria-label="Search this brand"></div>' +
    '      <label class="shop-sort"><span>Sort by</span><select id="shop-sort">' +
    '        <option value="recommended">Recommended</option><option value="name">Name: A to Z</option></select></label>' +
    '      <div class="shop-view" role="group" aria-label="Layout">' +
    '        <button type="button" class="active" data-view="grid" aria-label="Grid view"><svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg></button>' +
    '        <button type="button" data-view="list" aria-label="List view"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>' +
    '      </div>' +
    '    </div>' +
    '    <div class="shop-applied" id="shop-applied"></div>' +
    '    <div class="shop-count" id="shop-count" aria-live="polite"></div>' +
    '    <div class="shop-grid" id="shop-grid"></div>' +
    '  </div>' +
    '</div>';

  var filtersEl = document.getElementById('shop-filters');
  var filtersOverlay = document.getElementById('sf-overlay');
  var gridEl = document.getElementById('shop-grid');
  var countEl = document.getElementById('shop-count');
  var appliedEl = document.getElementById('shop-applied');
  var qInput = document.getElementById('shop-q');
  var sortSel = document.getElementById('shop-sort');

  /* ---------- Render ---------- */

  function rowsFor(s) {
    var rows = products.filter(function (p) { return evaluate(p, s); });
    if (s.sort === 'name') rows = rows.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    else if (s.q) rows = rows.slice().sort(function (a, b) { return qOrder[a.id] - qOrder[b.id]; });
    return rows;
  }

  function optionLabel(group, value) {
    if (group === 'cat') { var c = categories.filter(function (x) { return x.value === value; })[0]; return c ? c.label : value; }
    return value;
  }

  function renderApplied() {
    var chips = [];
    if (state.q) chips.push({ text: 'Search: “' + state.q + '”', clear: 'q' });
    Object.keys(state.cats).forEach(function (v) { chips.push({ text: optionLabel('cat', v), group: 'cat', value: v }); });
    Object.keys(state.apps).forEach(function (v) { chips.push({ text: v, group: 'app', value: v }); });
    appliedEl.innerHTML = chips.length
      ? chips.map(function (c) {
          return '<button type="button" class="sa-chip" data-group="' + (c.group || '') + '" data-value="' + U.esc(c.value || '') + '" data-clear="' + (c.clear || '') + '">' + U.esc(c.text) + '<b aria-hidden="true">&times;</b><span class="sr-only">Remove filter</span></button>';
        }).join('') + '<button type="button" class="sa-clear" data-clear-all>Clear all</button>'
      : '';
    var badge = document.getElementById('shop-filter-badge');
    if (badge) {
      var n = Object.keys(state.cats).length + Object.keys(state.apps).length;
      badge.textContent = n;
      badge.hidden = n === 0;
    }
  }

  function updateFilterUI(rowsCount) {
    if (!filtersEl) return;
    filtersEl.querySelectorAll('.sf-check').forEach(function (el) {
      var group = el.getAttribute('data-group'), value = el.getAttribute('data-value');
      var selected = bucketOf(group);
      var count = 0;
      products.forEach(function (p) {
        if (!evaluate(p, state, group)) return;
        if (group === 'cat' ? p.category === value : (p.applications || []).indexOf(value) !== -1) count++;
      });
      el.querySelector('.sf-count').textContent = count;
      el.querySelector('input').checked = !!selected[value];
      var off = count === 0 && !selected[value];
      el.classList.toggle('disabled', off);
      el.querySelector('input').disabled = off;
    });
    var apply = document.getElementById('sf-apply');
    if (apply) apply.textContent = 'Show ' + rowsCount + (rowsCount === 1 ? ' product' : ' products');
  }

  function render() {
    var rows = rowsFor(state);
    gridEl.className = 'shop-grid' + (state.view === 'list' ? ' list' : '');
    gridEl.innerHTML = rows.length
      ? rows.map(function (p) { return U.cardHTML(p); }).join('')
      : '<div class="shop-empty"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M8 11h6"/></svg><strong>No products match your filters</strong><p>Try removing a filter, or tell us what you need and we’ll source it.</p><div><button type="button" class="btn btn-outline-dark btn-sm" data-clear-all>Clear filters</button> <a class="btn btn-primary btn-sm" href="contact.html?product=' + encodeURIComponent(brand.name) + '">Enquire Now</a></div></div>';
    countEl.innerHTML = 'Showing <b>' + rows.length + '</b> of ' + products.length + ' products';
    renderApplied();
    updateFilterUI(rows.length);
  }

  function clearAll() {
    state.q = ''; state.cats = {}; state.apps = {};
    qInput.value = ''; qOrder = {};
    render();
  }

  /* ---------- Filter interactions ---------- */

  if (filtersEl) {
    filtersEl.addEventListener('change', function (e) {
      var opt = e.target.closest('.sf-check');
      if (!opt) return;
      var group = opt.getAttribute('data-group'), value = opt.getAttribute('data-value');
      var bucket = bucketOf(group);
      if (e.target.checked) bucket[value] = true; else delete bucket[value];
      render();
    });

    filtersEl.addEventListener('click', function (e) {
      var head = e.target.closest('.sf-group-head');
      if (head) {
        var g = head.parentNode, open = !g.classList.contains('open');
        g.classList.toggle('open', open);
        head.setAttribute('aria-expanded', open ? 'true' : 'false');
        return;
      }
      var more = e.target.closest('[data-more]');
      if (more) {
        var body = more.closest('.sf-group-body');
        var hiddenCount = body.querySelectorAll('.sf-extra').length;
        var expanded = body.classList.toggle('show-all');
        more.textContent = expanded ? 'Show fewer' : 'Show ' + hiddenCount + ' more';
      }
    });
  }

  brandBody.addEventListener('click', function (e) {
    if (e.target.closest('[data-clear-all]')) { clearAll(); return; }
    var chip = e.target.closest('.sa-chip');
    if (chip) {
      var group = chip.getAttribute('data-group'), value = chip.getAttribute('data-value'), clear = chip.getAttribute('data-clear');
      if (clear === 'q') { state.q = ''; qInput.value = ''; qOrder = {}; }
      else if (group === 'cat') delete state.cats[value];
      else if (group === 'app') delete state.apps[value];
      render();
      return;
    }
    var view = e.target.closest('[data-view]');
    if (view) {
      state.view = view.getAttribute('data-view');
      brandBody.querySelectorAll('.shop-view button').forEach(function (b) { b.classList.toggle('active', b === view); });
      render();
    }
  });

  sortSel.addEventListener('change', function () { state.sort = sortSel.value; render(); });

  var qTimer;
  qInput.addEventListener('input', function () {
    clearTimeout(qTimer);
    qTimer = setTimeout(function () {
      state.q = qInput.value.trim();
      qOrder = {};
      if (state.q) {
        U.smartSearch(state.q).products.filter(function (p) { return p.brand === brandId; })
          .forEach(function (p, i) { qOrder[p.id] = i; });
      }
      render();
    }, 140);
  });

  /* ---------- Mobile filter drawer ---------- */

  function openFilters() { if (!filtersEl) return; filtersEl.classList.add('open'); filtersOverlay.classList.add('open'); if (window.PSL_LOCK) window.PSL_LOCK.lock(); }
  function closeFilters() {
    if (!filtersEl || !filtersEl.classList.contains('open')) return;
    filtersEl.classList.remove('open'); filtersOverlay.classList.remove('open'); if (window.PSL_LOCK) window.PSL_LOCK.unlock();
  }
  if (filtersEl) {
    document.getElementById('shop-filter-btn').addEventListener('click', openFilters);
    filtersOverlay.addEventListener('click', closeFilters);
    filtersEl.addEventListener('click', function (e) { if (e.target.closest('[data-close-filters]')) closeFilters(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) closeFilters(); });
  }

  /* =========================================================
     QUICK VIEW — product page in a modal: pack-size picker, quantity,
     Enquire Now / Add to Enquiry List, description / pack sizes / service tabs
     ========================================================= */

  var qv = document.createElement('div');
  qv.className = 'qv';
  qv.setAttribute('role', 'dialog');
  qv.setAttribute('aria-modal', 'true');
  qv.setAttribute('aria-labelledby', 'qv-title');
  qv.innerHTML = '<div class="qv-backdrop" data-qv-close></div><div class="qv-panel"><button type="button" class="qv-close" data-qv-close aria-label="Close product">&times;</button><div class="qv-scroll" id="qv-scroll"></div></div>';
  document.body.appendChild(qv);
  var qvScroll = document.getElementById('qv-scroll');
  var qvProduct = null, qvSku = null, qvQty = 1, qvLastFocus = null, addTimer;

  function variantOf(p, sku) { return p.variants.filter(function (v) { return v.sku === sku; })[0] || p.variants[0]; }

  function renderQV(p) {
    var serviceItems = brand.service || [];
    var others = products.filter(function (x) { return x.id !== p.id; });
    var apps = p.applications || [];

    qvScroll.innerHTML =
      '<div class="qv-top">' +
      '  <div class="qv-media"><img src="' + p.image + '" alt="' + U.esc(p.name) + '"><span class="sc-badge">' + U.esc(p.categoryLabel) + '</span></div>' +
      '  <div class="qv-info">' +
      '    <div class="qv-brand">' + U.esc(p.brandName) + '</div>' +
      '    <h2 id="qv-title">' + U.esc(p.name) + '</h2>' +
      (apps.length ? '    <div class="qv-apps"><div class="qv-label">Application</div><div class="qv-apps-row">' + apps.map(function (a) { return '<span class="qv-app">' + U.esc(a) + '</span>'; }).join('') + '</div></div>' : '') +
      '    <div class="qv-tags">' + p.tags.map(function (t) { return '<span class="tag-pill">' + U.esc(t) + '</span>'; }).join('') + '</div>' +
      '    <div class="qv-row"><div class="qv-label">Pack size</div><div class="qv-chips" role="radiogroup" aria-label="Pack size">' +
      p.variants.map(function (x) { return '<button type="button" role="radio" class="qv-chip" data-sku="' + x.sku + '">' + U.esc(x.size) + '</button>'; }).join('') + '</div>' +
      '      <div class="qv-spec" id="qv-spec"></div></div>' +
      '    <div class="qv-row qv-qtyrow"><div class="qv-label">Quantity</div>' +
      '      <div class="eq-qty qv-qty"><button type="button" data-qv-qty="-1" aria-label="Decrease quantity">&minus;</button><span id="qv-qty" aria-live="polite">' + qvQty + '</span><button type="button" data-qv-qty="1" aria-label="Increase quantity">+</button></div></div>' +
      '    <div class="qv-cta"><a class="btn btn-primary" id="qv-enq" href="#">Enquire Now</a><button type="button" class="btn btn-outline-dark" id="qv-add">Add to Enquiry List</button></div>' +
      '    <ul class="qv-assure">' + serviceItems.slice(0, 3).map(function (s) { return '<li>' + CHECK_SVG + U.esc(s.title) + '</li>'; }).join('') + '</ul>' +
      '  </div>' +
      '</div>' +
      '<div class="qv-tabs" role="tablist">' +
      '  <button type="button" role="tab" class="qv-tab active" data-tab="desc">Description</button>' +
      '  <button type="button" role="tab" class="qv-tab" data-tab="sizes">Pack Sizes &amp; SKUs</button>' +
      (serviceItems.length ? '  <button type="button" role="tab" class="qv-tab" data-tab="service">Service Info</button>' : '') +
      '</div>' +
      '<div class="qv-panels">' +
      '  <div class="qv-tabpanel active" data-panel="desc"><p>' + U.esc(p.description) + '</p></div>' +
      '  <div class="qv-tabpanel" data-panel="sizes"><div class="pc-table-wrap"><table class="pc-variant-table"><thead><tr><th>Size</th><th>Pack</th><th>SKU</th></tr></thead><tbody>' +
      p.variants.map(function (x) { return '<tr data-sku="' + x.sku + '"><td>' + U.esc(x.size) + '</td><td>' + U.esc(x.pack) + '</td><td class="v-sku">' + U.esc(x.sku) + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="pc-variant-note">Select a row to choose that pack size, then enquire for availability.</p></div>' +
      (serviceItems.length ? '  <div class="qv-tabpanel" data-panel="service"><ul class="qv-service">' + serviceItems.map(function (s) { return '<li><strong>' + U.esc(s.title) + '</strong><span>' + U.esc(s.text) + '</span></li>'; }).join('') + '</ul></div>' : '') +
      '</div>' +
      (others.length
        ? '<div class="qv-more"><div class="qv-label">More from ' + U.esc(brand.name) + '</div><div class="qv-more-row">' +
          others.map(function (o) {
            return '<button type="button" class="qv-mini" data-qv-open="' + o.id + '"><img src="' + o.image + '" alt=""><span><b>' + U.esc(o.name) + '</b><em>' + U.esc(o.categoryLabel) + '</em></span></button>';
          }).join('') + '</div></div>'
        : '');

    updateQV();
  }

  function updateQV() {
    var p = qvProduct, v = variantOf(p, qvSku);
    qvSku = v.sku;
    document.getElementById('qv-qty').textContent = qvQty;
    document.getElementById('qv-spec').innerHTML = '<b>' + U.esc(v.size) + '</b> &middot; ' + U.esc(v.pack) + ' &middot; SKU ' + U.esc(v.sku);
    qvScroll.querySelectorAll('.qv-chip').forEach(function (c) {
      var on = c.getAttribute('data-sku') === v.sku;
      c.classList.toggle('active', on);
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    qvScroll.querySelectorAll('.pc-variant-table tbody tr').forEach(function (r) { r.classList.toggle('sel', r.getAttribute('data-sku') === v.sku); });
    var line = '- ' + p.name + ' | ' + v.size + ' (' + v.pack + ') x ' + qvQty + ' | SKU ' + v.sku;
    document.getElementById('qv-enq').setAttribute('href', 'contact.html?items=' + encodeURIComponent(line));
  }

  function openQV(pid, sku) {
    var p = U.productById(pid);
    if (!p || p.brand !== brandId) return;
    var wasOpen = qv.classList.contains('open');
    qvProduct = p;
    qvSku = sku || p.variants[0].sku;
    qvQty = 1;
    renderQV(p);
    qvScroll.scrollTop = 0;
    if (!wasOpen) {
      qvLastFocus = document.activeElement;
      qv.classList.add('open');
      if (window.PSL_LOCK) window.PSL_LOCK.lock();
    }
    qv.querySelector('.qv-close').focus();
  }

  function closeQV() {
    if (!qv.classList.contains('open')) return;
    qv.classList.remove('open');
    if (window.PSL_LOCK) window.PSL_LOCK.unlock();
    if (qvLastFocus && qvLastFocus.focus) qvLastFocus.focus();
    if (params.get('product')) { try { history.replaceState(null, '', 'brand.html?id=' + encodeURIComponent(brandId)); params.delete('product'); } catch (e) { /* ignore */ } }
  }

  qv.addEventListener('click', function (e) {
    if (e.target.closest('[data-qv-close]')) { closeQV(); return; }
    var chip = e.target.closest('.qv-chip');
    if (chip) { qvSku = chip.getAttribute('data-sku'); updateQV(); return; }
    var row = e.target.closest('.pc-variant-table tbody tr');
    if (row) { qvSku = row.getAttribute('data-sku'); updateQV(); return; }
    var qtyBtn = e.target.closest('[data-qv-qty]');
    if (qtyBtn) { qvQty = Math.max(1, Math.min(999, qvQty + parseInt(qtyBtn.getAttribute('data-qv-qty'), 10))); updateQV(); return; }
    var tab = e.target.closest('.qv-tab');
    if (tab) {
      var name = tab.getAttribute('data-tab');
      qv.querySelectorAll('.qv-tab').forEach(function (t) { t.classList.toggle('active', t === tab); });
      qv.querySelectorAll('.qv-tabpanel').forEach(function (pn) { pn.classList.toggle('active', pn.getAttribute('data-panel') === name); });
      return;
    }
    var more = e.target.closest('[data-qv-open]');
    if (more) { openQV(more.getAttribute('data-qv-open')); return; }
    var add = e.target.closest('#qv-add');
    if (add) {
      if (window.PSL_ENQUIRY) {
        window.PSL_ENQUIRY.add(qvSku, qvQty);
        add.classList.add('added'); add.textContent = 'Added ✓';
        clearTimeout(addTimer);
        addTimer = setTimeout(function () { add.classList.remove('added'); add.textContent = 'Add to Enquiry List'; }, 1600);
      } else {
        window.location.href = document.getElementById('qv-enq').getAttribute('href');
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (qv.classList.contains('open') && !(window.PSL_ENQUIRY && document.querySelector('.eq-drawer.open'))) closeQV(); else closeFilters(); }
    if (e.key === 'Tab' && qv.classList.contains('open') && !document.querySelector('.eq-drawer.open')) {
      var f = Array.prototype.filter.call(qv.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])'), function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Product cards: open Quick View instead of navigating (links still work with
     JS off, or with ctrl/cmd/shift-click). The Enquire Now button goes straight
     to the enquiry form. */
  gridEl.addEventListener('click', function (e) {
    if (e.target.closest('.sc-enquire')) return;
    var card = e.target.closest('.shop-card');
    if (!card || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    openQV(card.getAttribute('data-pid'));
  });

  /* ---------- Go ---------- */
  render();
  if (deepLinkProduct) openQV(deepLinkProduct);

});
