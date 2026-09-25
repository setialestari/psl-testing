/* =========================================================
   Enquiry List — a lightweight quote basket (like Alibaba's "inquiry
   basket"). Visitors add pack sizes from any product, adjust quantities,
   then send one enquiry to the PSL team. No payment, no checkout.
   Stored in localStorage; every read/write is guarded because storage can
   be unavailable (private windows, blocked site data).
   ========================================================= */
(function () {
  if (typeof PSL_PRODUCTS === 'undefined' || typeof PSL_PRODUCTS_UTIL === 'undefined') return;

  var U = PSL_PRODUCTS_UTIL;
  var KEY = 'psl_enquiry_v1';
  var list = []; // [{ sku, qty }]

  /* Shared page-scroll lock (counter, so a drawer opened on top of a modal
     doesn't unlock the page when it closes). */
  var lockCount = 0;
  window.PSL_LOCK = {
    lock: function () { lockCount++; document.documentElement.classList.add('no-scroll'); },
    unlock: function () { lockCount = Math.max(0, lockCount - 1); if (!lockCount) document.documentElement.classList.remove('no-scroll'); }
  };

  function lookup(sku) {
    for (var i = 0; i < PSL_PRODUCTS.length; i++) {
      var p = PSL_PRODUCTS[i];
      for (var j = 0; j < p.variants.length; j++) {
        if (p.variants[j].sku === sku) return { product: p, variant: p.variants[j] };
      }
    }
    return null;
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var arr = raw ? JSON.parse(raw) : [];
      list = (Array.isArray(arr) ? arr : []).filter(function (it) {
        return it && lookup(it.sku) && it.qty > 0;
      });
    } catch (e) { list = []; }
  }
  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
  }

  function buildMessage() {
    return list.map(function (it) {
      var l = lookup(it.sku);
      if (!l) return '';
      return '- ' + l.product.name + ' | ' + l.variant.size + ' (' + l.variant.pack + ') x ' + it.qty + ' | SKU ' + l.variant.sku;
    }).filter(Boolean).join('\n');
  }

  var fab, overlay, drawer, listEl, footEl, toast, toastTimer, lastFocus;

  function build() {
    fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'eq-fab';
    fab.setAttribute('aria-label', 'Open enquiry list');
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1zM8 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2M9 12h6M9 16h4"/></svg>' +
      '<span class="eq-fab-label">Enquiry List</span><b class="eq-count">0</b>';

    overlay = document.createElement('div');
    overlay.className = 'eq-overlay';

    drawer = document.createElement('aside');
    drawer.className = 'eq-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Enquiry list');
    drawer.innerHTML =
      '<div class="eq-head"><h3>Enquiry List</h3><button type="button" class="eq-close" aria-label="Close enquiry list">&times;</button></div>' +
      '<ul class="eq-list"></ul>' +
      '<div class="eq-foot"></div>';

    toast = document.createElement('div');
    toast.className = 'eq-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    document.body.appendChild(fab);
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    document.body.appendChild(toast);

    listEl = drawer.querySelector('.eq-list');
    footEl = drawer.querySelector('.eq-foot');

    fab.addEventListener('click', open);
    overlay.addEventListener('click', close);
    drawer.querySelector('.eq-close').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('open')) close(); });

    drawer.addEventListener('click', function (e) {
      var act = e.target.closest('[data-act]');
      if (!act) return;
      var row = act.closest('.eq-item');
      var sku = row ? row.getAttribute('data-sku') : null;
      var action = act.getAttribute('data-act');
      if (action === 'inc' || action === 'dec') setQty(sku, qtyOf(sku) + (action === 'inc' ? 1 : -1));
      else if (action === 'remove') remove(sku);
      else if (action === 'clear') { list = []; save(); render(); }
      else if (action === 'send') { window.location.href = 'contact.html?items=' + encodeURIComponent(buildMessage()); }
    });

    toast.addEventListener('click', function (e) { if (e.target.closest('[data-act="view"]')) open(); });
  }

  function qtyOf(sku) {
    for (var i = 0; i < list.length; i++) if (list[i].sku === sku) return list[i].qty;
    return 0;
  }
  function setQty(sku, qty) {
    if (qty < 1) { remove(sku); return; }
    qty = Math.min(qty, 999);
    for (var i = 0; i < list.length; i++) if (list[i].sku === sku) { list[i].qty = qty; break; }
    save(); render();
  }
  function remove(sku) {
    list = list.filter(function (it) { return it.sku !== sku; });
    save(); render();
  }

  function add(sku, qty) {
    if (!lookup(sku)) return;
    qty = Math.max(1, Math.min(999, parseInt(qty, 10) || 1));
    var found = false;
    for (var i = 0; i < list.length; i++) {
      if (list[i].sku === sku) { list[i].qty = Math.min(999, list[i].qty + qty); found = true; break; }
    }
    if (!found) list.push({ sku: sku, qty: qty });
    save(); render();
    var l = lookup(sku);
    showToast('Added to your enquiry list: ' + l.variant.size);
    fab.classList.remove('bump'); void fab.offsetWidth; fab.classList.add('bump');
  }

  function showToast(text) {
    toast.innerHTML = '<span>' + U.esc(text) + '</span><button type="button" data-act="view">View list</button>';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }

  function render() {
    fab.classList.toggle('show', list.length > 0);
    fab.querySelector('.eq-count').textContent = list.length;

    if (!list.length) {
      listEl.innerHTML =
        '<li class="eq-empty">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1zM8 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2M9 12h6M9 16h4"/></svg>' +
        '<strong>Your enquiry list is empty</strong>' +
        '<p>Add products to enquire about several items at once.</p>' +
        '</li>';
      footEl.innerHTML = '';
      return;
    }

    listEl.innerHTML = list.map(function (it) {
      var l = lookup(it.sku);
      return '' +
        '<li class="eq-item" data-sku="' + U.esc(it.sku) + '">' +
        '  <img src="' + l.product.image + '" alt="">' +
        '  <div class="eq-info">' +
        '    <div class="eq-name">' + U.esc(l.product.name) + '</div>' +
        '    <div class="eq-var">' + U.esc(l.variant.size) + ' &middot; ' + U.esc(l.variant.pack) + '</div>' +
        '  </div>' +
        '  <div class="eq-side">' +
        '    <button type="button" class="eq-remove" data-act="remove" aria-label="Remove item">&times;</button>' +
        '    <div class="eq-qty">' +
        '      <button type="button" data-act="dec" aria-label="Decrease quantity">&minus;</button>' +
        '      <span aria-live="polite">' + it.qty + '</span>' +
        '      <button type="button" data-act="inc" aria-label="Increase quantity">+</button>' +
        '    </div>' +
        '  </div>' +
        '</li>';
    }).join('');

    footEl.innerHTML =
      '<div class="eq-sum"><span>' + list.length + (list.length === 1 ? ' item' : ' items') + ' in your list</span></div>' +
      '<p class="eq-note">Send your list to our team and we will come back to you with availability and delivery details.</p>' +
      '<button type="button" class="btn btn-primary eq-send" data-act="send">Send Enquiry</button>' +
      '<button type="button" class="eq-clear" data-act="clear">Clear list</button>';
  }

  function open() {
    lastFocus = document.activeElement;
    toast.classList.remove('show');
    drawer.classList.add('open');
    overlay.classList.add('open');
    window.PSL_LOCK.lock();
    drawer.querySelector('.eq-close').focus();
  }
  function close() {
    if (!drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    window.PSL_LOCK.unlock();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  window.PSL_ENQUIRY = { add: add, open: open, close: close, count: function () { return list.length; } };

  document.addEventListener('DOMContentLoaded', function () {
    load();
    build();
    render();
  });
})();
