document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  var overlay = document.querySelector('.nav-overlay');

  function closeNav() {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('open');
  }

  if (toggle && navLinks && overlay) {
    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      overlay.classList.toggle('open', isOpen);
    });
    overlay.addEventListener('click', closeNav);
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
  }

  /* Active nav link based on current page */
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* Sticky header shadow on scroll */
  var header = document.querySelector('.site-header');
  window.addEventListener('scroll', function () {
    if (header) header.style.boxShadow = window.scrollY > 10 ? '0 4px 18px rgba(0,0,0,.12)' : '0 2px 10px rgba(0,0,0,.08)';

    var btt = document.querySelector('.back-to-top');
    if (btt) btt.classList.toggle('show', window.scrollY > 400);
  });

  /* Back to top */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Counter animation */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 1400;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          el.textContent = Math.floor(progress * target);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* Project filter + "Show More" pagination */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');
  var showMoreBtn = document.getElementById('gallery-show-more');
  if (filterBtns.length && projectCards.length) {
    var GALLERY_PAGE_SIZE = 6;
    var showCount = GALLERY_PAGE_SIZE;

    function activeFilter() {
      var active = document.querySelector('.filter-btn.active');
      return active ? active.getAttribute('data-filter') : 'all';
    }

    function renderGallery() {
      var filter = activeFilter();
      var matching = [];
      projectCards.forEach(function (card) {
        var cat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cat) matching.push(card);
      });
      projectCards.forEach(function (card) { card.classList.add('hidden-card'); });
      matching.slice(0, showCount).forEach(function (card) { card.classList.remove('hidden-card'); });
      if (showMoreBtn) {
        showMoreBtn.style.display = matching.length > showCount ? 'inline-flex' : 'none';
      }
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        showCount = GALLERY_PAGE_SIZE;
        renderGallery();
      });
    });

    if (showMoreBtn) {
      showMoreBtn.addEventListener('click', function () {
        showCount += GALLERY_PAGE_SIZE;
        renderGallery();
      });
    }

    renderGallery();
  }

  /* Track record — mobile "More Info" toggle */
  document.querySelectorAll('.track-more-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.nextElementSibling;
      var isOpen = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btn.childNodes[0].textContent = isOpen ? 'Less Info ' : 'More Info ';
    });
  });

  /* Mobile "Show More" collapse — any grid marked data-collapse-mobile="N"
     shows only its first N children on narrow screens, with a "Show More"
     button revealing the rest. Prevents long card grids (8 construction
     services, 14 brands, etc.) from forcing endless scroll on phones while
     keeping every item present (and fully visible) on desktop.
     Exposed on window so pages that render a grid's items dynamically
     (e.g. products.html's brand grid, filled in after this file runs) can
     call it again once their content exists — re-runs are safe, already-
     wired grids are skipped via the data-collapse-ready flag. */
  var MOBILE_COLLAPSE_BP = 640;
  function setupMobileCollapse(root) {
    (root || document).querySelectorAll('[data-collapse-mobile]').forEach(function (grid) {
      if (grid.dataset.collapseReady) return;
      var limit = parseInt(grid.getAttribute('data-collapse-mobile'), 10);
      var items = Array.prototype.slice.call(grid.children);
      if (!limit || items.length <= limit) return;
      grid.dataset.collapseReady = '1';

      var onDark = !!grid.closest('.why-section, .cta-banner, .site-footer');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn ' + (onDark ? 'btn-outline' : 'btn-outline-dark') + ' btn-sm show-more-btn';
      var hiddenCount = items.length - limit;
      btn.textContent = 'Show ' + hiddenCount + ' More';

      var wrap = document.createElement('div');
      wrap.className = 'center show-more-wrap';
      wrap.appendChild(btn);
      grid.insertAdjacentElement('afterend', wrap);

      var expanded = false;
      function apply() {
        var isMobile = window.innerWidth <= MOBILE_COLLAPSE_BP;
        items.forEach(function (item, i) {
          if (i < limit) { item.style.display = ''; return; }
          item.style.display = (isMobile && !expanded) ? 'none' : '';
        });
        wrap.style.display = (isMobile && !expanded) ? 'flex' : 'none';
      }
      btn.addEventListener('click', function () {
        expanded = true;
        items.slice(limit).forEach(function (item) { item.classList.add('in'); }); // bypass reveal-on-scroll for now-visible items
        apply();
      });
      apply();
      window.addEventListener('resize', apply);
    });
  }
  window.PSL_setupMobileCollapse = setupMobileCollapse;
  setupMobileCollapse(document);

  /* Contact form (client-side only — no backend wired up yet) */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('form-msg');
      msg.textContent = 'Thank you for your enquiry. Our team will get back to you shortly. (Note: this form is not yet connected to an email service — see setup notes.)';
      msg.classList.add('show', 'success');
      form.reset();
    });
  }

});
