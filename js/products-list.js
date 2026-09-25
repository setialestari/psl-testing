document.addEventListener('DOMContentLoaded', function () {

  var brandGrid = document.getElementById('brand-grid');
  if (!brandGrid || typeof PSL_BRANDS === 'undefined') return; // only run on products.html

  var U = PSL_PRODUCTS_UTIL;
  var MOBILE_BRAND_LIMIT = 8;

  /* =========================================================
     FEATURED PRODUCTS
     ========================================================= */

  document.getElementById('mk-featured').innerHTML = PSL_PRODUCTS.map(function (p) { return U.cardHTML(p, { compact: true }); }).join('');

  /* =========================================================
     HERO PANEL (desktop only, hidden by CSS on tablet/phone) — cross-fading
     featured products; pauses on hover/focus, no autoplay when the visitor
     prefers reduced motion
     ========================================================= */

  // as many application names as fit on one line of the panel caption
  function shortApps(p) {
    var a = p.applications && p.applications.length ? p.applications : [p.categoryLabel];
    var two = a.slice(0, 2).join(' · ');
    return two.length <= 32 ? two : a[0];
  }

  var slidesEl = document.getElementById('mk-slides');
  if (slidesEl && PSL_PRODUCTS.length) {
    var N = PSL_PRODUCTS.length;
    var lead = U.brandById(PSL_PRODUCTS[0].brand);
    slidesEl.innerHTML =
      '<div class="mk-card-wrap"><div class="mk-card"><div class="mk-slides-stage">' +
      PSL_PRODUCTS.map(function (p, i) {
        var off = i === 0 ? '' : ' tabindex="-1"';
        return '<div class="mk-slide' + (i === 0 ? ' active' : '') + '"' + (i === 0 ? '' : ' aria-hidden="true"') + '>' +
          '<a class="mk-slide-img" href="' + U.productHref(p) + '"' + off + '><img src="' + p.image + '" alt="' + U.esc(p.name) + '"' + (i === 0 ? '' : ' loading="lazy"') + '></a>' +
          '<div class="mk-slide-cap">' +
          '<a class="mk-slide-info" href="' + U.productHref(p) + '"' + off + '><small><i>//</i>' + U.esc(shortApps(p)) + '</small><b>' + U.esc(p.name) + '</b></a>' +
          '<a class="mk-slide-enq" href="' + U.enquireHref(p) + '"' + off + '>Enquire Now</a>' +
          '</div></div>';
      }).join('') +
      '</div></div></div>' +
      '<div class="mk-vis-foot"><div class="mk-dots-row">' +
      PSL_PRODUCTS.map(function (p, i) { return '<button type="button" class="mk-dot' + (i === 0 ? ' active' : '') + '" data-i="' + i + '" aria-label="Show ' + U.esc(p.name) + '"></button>'; }).join('') +
      '</div><a class="mk-shop-link" href="brand.html?id=' + encodeURIComponent(lead.id) + '">Shop ' + U.esc(lead.name) + ' &rarr;</a></div>';

    var slideEls = slidesEl.querySelectorAll('.mk-slide');
    var dotEls = slidesEl.querySelectorAll('.mk-dot');
    var cur = 0, paused = false, timer = null;

    function showSlide(n) {
      cur = (n + N) % N;
      slideEls.forEach(function (s, i) {
        var on = i === cur;
        s.classList.toggle('active', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
        s.querySelectorAll('a').forEach(function (a) { a.tabIndex = on ? 0 : -1; });
      });
      dotEls.forEach(function (d, i) { d.classList.toggle('active', i === cur); });
    }
    function startSlides() {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      clearInterval(timer);
      timer = setInterval(function () { if (!paused && !document.hidden) showSlide(cur + 1); }, 4500);
    }
    slidesEl.addEventListener('mouseenter', function () { paused = true; });
    slidesEl.addEventListener('mouseleave', function () { paused = false; });
    slidesEl.addEventListener('focusin', function () { paused = true; });
    slidesEl.addEventListener('focusout', function () { paused = false; });
    slidesEl.addEventListener('click', function (e) {
      var dot = e.target.closest('.mk-dot');
      if (dot) { showSlide(parseInt(dot.getAttribute('data-i'), 10)); startSlides(); }
    });
    startSlides();
  }

  /* =========================================================
     SHOP BY CATEGORY — one slim row of pills; picking one filters the brands below
     ========================================================= */

  var dd = document.getElementById('mk-dd');
  var ddBtn = document.getElementById('mk-dd-btn');
  var ddMenu = document.getElementById('mk-dd-menu');
  var ddLabel = document.getElementById('mk-dd-label');
  var activeCat = null;
  var expanded = false;

  function brandsInCategory(id) {
    return PSL_BRANDS.filter(function (b) { return (b.categories || []).indexOf(id) !== -1; }).length;
  }

  var GRID_ICON = 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z';
  function ddItem(id, label, icon, count) {
    return '<button type="button" role="menuitemradio" class="mk-dd-item" data-cat="' + id + '" aria-checked="false">' +
      '<span class="mk-dd-item-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + icon + '"/></svg></span>' +
      '<span class="mk-dd-item-name">' + U.esc(label) + '</span>' +
      '<span class="mk-dd-item-count">' + count + '</span></button>';
  }
  ddMenu.innerHTML = ddItem('', 'All categories', GRID_ICON, PSL_BRANDS.length + ' brands') +
    PSL_CATEGORIES.filter(function (c) { return brandsInCategory(c.id) > 0; }).map(function (c) {
      var n = brandsInCategory(c.id);
      return ddItem(c.id, c.label, c.icon, n + (n === 1 ? ' brand' : ' brands'));
    }).join('');

  function openDd() {
    dd.classList.add('open');
    ddBtn.setAttribute('aria-expanded', 'true');
  }
  function closeDd(returnFocus) {
    if (!dd.classList.contains('open')) return;
    dd.classList.remove('open');
    ddBtn.setAttribute('aria-expanded', 'false');
    if (returnFocus) ddBtn.focus();
  }

  function setCategory(id) {
    activeCat = id;
    ddMenu.querySelectorAll('.mk-dd-item').forEach(function (it) {
      var on = it.getAttribute('data-cat') === (id || '');
      it.classList.toggle('selected', on);
      it.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    ddLabel.textContent = id ? U.categoryById(id).label : 'All categories';
    ddBtn.classList.toggle('active', !!id);
    expanded = false;
    renderBrands();
  }

  ddBtn.addEventListener('click', function () { dd.classList.contains('open') ? closeDd() : openDd(); });
  ddMenu.addEventListener('click', function (e) {
    var item = e.target.closest('.mk-dd-item');
    if (!item) return;
    var id = item.getAttribute('data-cat') || null;
    setCategory(id);
    closeDd(true);
    if (id) document.getElementById('brands-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('#mk-dd')) closeDd(); });
  dd.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDd(true); return; }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    if (!dd.classList.contains('open')) openDd();
    var items = Array.prototype.slice.call(ddMenu.querySelectorAll('.mk-dd-item'));
    var i = items.indexOf(document.activeElement);
    i = e.key === 'ArrowDown' ? (i + 1) % items.length : (i <= 0 ? items.length - 1 : i - 1);
    items[i].focus();
  });
  // initial state: "All categories" selected (the brand grid itself is rendered further down)
  (function () { var first = ddMenu.querySelector('.mk-dd-item'); first.classList.add('selected'); first.setAttribute('aria-checked', 'true'); })();

  /* =========================================================
     SHOP BY BRAND — featured brand leads; the rest are slim tiles
     ========================================================= */

  var countEl = document.getElementById('mk-brand-count');
  var activeEl = document.getElementById('mk-brand-active');
  var moreWrap = document.getElementById('mk-brand-more');
  var moreBtn = document.getElementById('mk-brand-more-btn');

  function renderBrands() {
    var list = PSL_BRANDS.filter(function (b) {
      return !activeCat || (b.categories || []).indexOf(activeCat) !== -1;
    }).sort(function (a, b) { return (b.available ? 1 : 0) - (a.available ? 1 : 0); });

    countEl.textContent = list.length + (list.length === 1 ? ' brand' : ' brands');
    activeEl.hidden = !activeCat;
    activeEl.innerHTML = activeCat
      ? '<button type="button" class="sa-chip" data-clear-cat>' + U.esc(U.categoryById(activeCat).label) + '<b aria-hidden="true">&times;</b><span class="sr-only">Clear category filter</span></button>'
      : '';

    var isMobile = window.innerWidth <= 640;
    var shown = isMobile && !expanded ? list.slice(0, MOBILE_BRAND_LIMIT) : list;

    brandGrid.innerHTML = shown.length
      ? shown.map(function (b) { return U.brandCardHTML(b, { wide: true }); }).join('')
      : '<div class="pc-no-results">No brands match this filter. <a href="contact.html" style="color:var(--red); font-weight:600;">Ask us to source it</a>.</div>';

    var hidden = list.length - shown.length;
    moreWrap.hidden = hidden <= 0;
    if (hidden > 0) moreBtn.textContent = 'Show ' + hidden + ' More';
  }

  moreBtn.addEventListener('click', function () { expanded = true; renderBrands(); });
  activeEl.addEventListener('click', function (e) { if (e.target.closest('[data-clear-cat]')) setCategory(null); });

  var lastMobile = window.innerWidth <= 640;
  window.addEventListener('resize', function () {
    var nowMobile = window.innerWidth <= 640;
    if (nowMobile !== lastMobile) { lastMobile = nowMobile; renderBrands(); }
  });

  renderBrands();

  /* =========================================================
     SEARCH — live suggestions while typing; Enter / Search shows a
     results section above the categories
     ========================================================= */

  var searchInput = document.getElementById('product-search');
  var searchClear = document.getElementById('product-search-clear');
  var dropdown = document.getElementById('search-dropdown');
  var form = document.getElementById('mk-search-form');
  var resultsSec = document.getElementById('mk-results');

  // Popular searches
  var hot = document.getElementById('mk-hot');
  hot.insertAdjacentHTML('beforeend', PSL_POPULAR_SEARCHES.map(function (t) {
    return '<button type="button" class="mk-hot-chip">' + U.esc(t) + '</button>';
  }).join(''));
  hot.addEventListener('click', function (e) {
    var chip = e.target.closest('.mk-hot-chip');
    if (!chip) return;
    searchInput.value = chip.textContent;
    searchClear.classList.add('show');
    showResults(chip.textContent);
  });

  function brandRowHTML(b) {
    var visual = b.logo
      ? '<img src="' + b.logo + '" alt="' + U.esc(b.name) + '">'
      : '<div class="srr-avatar">' + U.initials(b.name) + '</div>';
    var sub = b.available ? 'Brand &middot; Catalogue available' : 'Brand &middot; Catalogue on request';
    return '' +
      '<a class="search-result-row" href="brand.html?id=' + encodeURIComponent(b.id) + '">' +
      '  ' + visual +
      '  <div class="srr-info">' +
      '    <div class="srr-brand">' + sub + '</div>' +
      '    <div class="srr-name">' + U.esc(b.name) + '</div>' +
      '  </div>' +
      '  <svg class="srr-arrow" viewBox="0 0 24 24" width="16" height="16"><path d="M9 6l6 6-6 6"/></svg>' +
      '</a>';
  }

  function productRowHTML(p) {
    return '' +
      '<a class="search-result-row" href="' + U.productHref(p) + '">' +
      '  <img src="' + p.image + '" alt="' + U.esc(p.name) + '">' +
      '  <div class="srr-info">' +
      '    <div class="srr-brand">' + U.esc(p.brandName) + ' &middot; ' + U.esc(p.categoryLabel) + '</div>' +
      '    <div class="srr-name">' + U.esc(p.name) + '</div>' +
      '  </div>' +
      '</a>';
  }

  function renderDropdown(query) {
    query = query.trim();
    searchClear.classList.toggle('show', query.length > 0);

    if (!query) {
      dropdown.classList.remove('open');
      dropdown.innerHTML = '';
      return;
    }

    var results = U.smartSearch(query);

    if (results.products.length === 0 && results.brands.length === 0) {
      dropdown.innerHTML = '<div class="pc-no-results" style="padding:26px 20px;">Nothing matches "' + U.esc(query) + '". <a href="contact.html?product=' + encodeURIComponent(query) + '" style="color:var(--red); font-weight:600;">Send us an enquiry</a> instead.</div>';
      dropdown.classList.add('open');
      return;
    }

    var html = '';
    if (results.brands.length) {
      html += '<div class="search-dropdown-label">Brands</div>' + results.brands.slice(0, 3).map(brandRowHTML).join('');
    }
    if (results.products.length) {
      html += '<div class="search-dropdown-label">Products</div>' + results.products.slice(0, 6).map(productRowHTML).join('');
    }
    dropdown.innerHTML = html;
    dropdown.classList.add('open');
  }

  function showResults(query) {
    query = query.trim();
    dropdown.classList.remove('open');
    if (!query) { hideResults(); return; }
    var r = U.smartSearch(query);
    var body = '<div class="mk-head"><h2>Results for “' + U.esc(query) + '”</h2>' +
      '<button type="button" class="mk-link" data-clear-results>Clear search &times;</button></div>';
    if (!r.products.length && !r.brands.length) {
      body += '<div class="shop-empty"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M8 11h6"/></svg><strong>Nothing matches “' + U.esc(query) + '”</strong><p>We can still source it. Tell us what you need and our team will come back with details.</p><div><a class="btn btn-primary btn-sm" href="contact.html?product=' + encodeURIComponent(query) + '">Send an Enquiry</a></div></div>';
    } else {
      if (r.products.length) {
        body += '<div class="mk-subhead">Products <span>' + r.products.length + '</span></div><div class="shop-grid shop-grid-4">' + r.products.map(function (p) { return U.cardHTML(p, { compact: true }); }).join('') + '</div>';
      }
      if (r.brands.length) {
        body += '<div class="mk-subhead">Brands <span>' + r.brands.length + '</span></div><div class="brand-grid">' + r.brands.map(U.brandCardHTML).join('') + '</div>';
      }
    }
    resultsSec.querySelector('.container').innerHTML = body;
    resultsSec.hidden = false;
    resultsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function hideResults() {
    resultsSec.hidden = true;
    resultsSec.querySelector('.container').innerHTML = '';
  }

  resultsSec.addEventListener('click', function (e) {
    if (!e.target.closest('[data-clear-results]')) return;
    searchInput.value = '';
    searchClear.classList.remove('show');
    hideResults();
    searchInput.focus();
  });

  form.addEventListener('submit', function (e) { e.preventDefault(); showResults(searchInput.value); });
  searchInput.addEventListener('input', function () { renderDropdown(searchInput.value); });
  searchInput.addEventListener('focus', function () { if (searchInput.value.trim()) dropdown.classList.add('open'); });
  searchClear.addEventListener('click', function () {
    searchInput.value = '';
    renderDropdown('');
    hideResults();
    searchInput.focus();
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.product-search-wrap')) dropdown.classList.remove('open');
  });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { searchInput.value = ''; renderDropdown(''); searchInput.blur(); }
  });

});
