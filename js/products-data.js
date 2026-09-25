/* =========================================================
   Shared product/brand data — used by products.html (brand picker)
   and brand.html (per-brand catalogue).
   Sourced from the Simple Green product brochures and SDS sheets.
   Prices are deliberately NOT published on the site (they change
   often) — every product routes to an enquiry instead.
   ========================================================= */

/* Top-level shop categories. Brands are tagged with the categories they sit in,
   taken from each brand's own tagline / the Trading categories on services.html. */
var PSL_CATEGORIES = [
  { id: 'chemicals',   label: 'Cleaners & Chemicals',     icon: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8' },
  { id: 'fire-safety', label: 'Fire Protection & Safety', icon: 'M12 2c-1 3-4 4-4 8a4 4 0 0 0 8 0c0-1-.5-2-1-3 1 0 2 1 2 3a5 5 0 0 1-10 0c0-4.5 3-5.5 5-8z' },
  { id: 'hydraulics',  label: 'Hydraulics',               icon: 'M12 2s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z' },
  { id: 'filtration',  label: 'Filtration & Fluid',       icon: 'M4 4h16l-6.5 8.5V19l-3 1.5v-8L4 4z' },
  { id: 'industrial',  label: 'Industrial Components',    icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z' }
];

var PSL_BRANDS = [
  {
    id: 'simple-green', name: 'Simple Green', logo: 'assets/products/simple-green-logo.png', tagline: 'Industrial cleaners & degreasers', available: true,
    categories: ['chemicals'],
    badges: ['Petronas Licensed', 'Approved Vendor', 'Stocked in Kuching'],
    service: [
      { title: 'Petronas Licensed', text: 'Registered under Licence & Registration Code 10111600 — Disinfectants / Cleaner / Degreasing Agent — valid to 30/04/2027.' },
      { title: 'Approved Vendor', text: 'Registered vendor with Brooke Holding Sdn Bhd for Chemicals — Commodity Chemicals / Disinfectants, Cleaner & Degreasing Agent.' },
      { title: 'Stocked Locally', text: 'Held in Kuching for prompt delivery across Sarawak, from single trigger bottles to full pallet and drum quantities.' },
      { title: 'Bulk Orders', text: 'Pallet and drum quantities are available on request. Tell us your requirement and we will advise.' }
    ]
  },
  { id: 'steel-recon', name: 'Steel Recon Industries', tagline: 'Fire-fighting equipment', available: false, categories: ['fire-safety'] },
  { id: 'lumitrade', name: 'Lumitrade — Grandberg / Sumirubber', tagline: 'PPE gloves', available: false, categories: ['fire-safety'] },
  { id: 'jebat-hydac', name: 'Jebat Dynamic — Hydac', tagline: 'Accumulators & filtration', available: false, categories: ['hydraulics', 'filtration'] },
  { id: 'oem-cylinders', name: 'OEM Cylinders (OEM Singapore)', tagline: 'Hydraulic cylinders', available: false, categories: ['hydraulics'] },
  { id: 'moog', name: 'Moog', tagline: 'Precision hydraulic components', available: false, categories: ['hydraulics'] },
  { id: 'atos-hydrome', name: 'Atos & Hydrome', tagline: 'Hydraulic systems', available: false, categories: ['hydraulics'] },
  { id: 'internormen', name: 'Internormen Technology', tagline: 'Fluid & filter technology', available: false, categories: ['filtration'] },
  { id: 'danfoss', name: 'Danfoss', tagline: 'Hydraulic & industrial components', available: false, categories: ['hydraulics', 'industrial'] },
  { id: 'eaton', name: 'Eaton', tagline: 'Hydraulic & industrial components', available: false, categories: ['hydraulics', 'industrial'] },
  { id: 'stauff', name: 'Stauff', tagline: 'Hydraulic accessories', available: false, categories: ['hydraulics'] },
  { id: 'd-cylinder', name: 'D-Cylinder', tagline: 'Hydraulic cylinders', available: false, categories: ['hydraulics'] },
  { id: 'tdz-bezares', name: 'TDZ Bezares', tagline: 'Hydraulic components', available: false, categories: ['hydraulics'] },
  { id: 'huade', name: 'Huade', tagline: 'Hydraulic valves', available: false, categories: ['hydraulics'] }
];

var PSL_POPULAR_SEARCHES = ['Rig wash', 'Degreaser', 'Rust remover', 'Food safe', 'Hydraulic'];

var PSL_SIZE_LABELS = { trigger: 'Trigger / Aerosol', '1gal': '1 Gallon', '5gal': '5 Gallon', '55gal': '55 Gallon' };
var PSL_SIZE_SHORT = { trigger: 'Trigger', '1gal': '1 Gal', '5gal': '5 Gal', '55gal': '55 Gal' };

var PSL_PRODUCTS = [
  {
    id: 'sg-original',
    brand: 'simple-green',
    brandName: 'Simple Green',
    name: 'Simple Green Industrial Cleaner & Degreaser — Original Scent',
    category: 'cleaner-degreaser',
    categoryLabel: 'Industrial Cleaner & Degreaser',
    image: 'assets/products/sg-original-lineup.jpg',
    description: 'Heavy-duty degreaser and all-purpose cleaner that cuts through thick grease, oils and built-up grime on equipment and machinery, while doubling as a deodorizing cleaner for floors, restrooms and break rooms. Certified Safer for Workplaces & the Environment by the U.S. EPA Safer Choice Program.',
    tags: ['EPA Safer Choice', 'Solvent-Free', 'Non-Flammable', 'Non-Caustic', 'Biodegradable'],
    applications: ['Manufacturing & Industrial', 'Facilities & Commercial'],
    variants: [
      { sku: '2710001213012', size: '24 fl oz Trigger', pack: '12 / case', sizeKey: 'trigger' },
      { sku: '2710200613005', size: '1 US Gal Jug', pack: '6 / case', sizeKey: '1gal' },
      { sku: '2700000113006', size: '5 US Gal Pail', pack: '1 / unit', sizeKey: '5gal' },
      { sku: '2700000113008', size: '55 US Gal Drum', pack: '1 / unit', sizeKey: '55gal' }
    ]
  },
  {
    id: 'sg-crystal',
    brand: 'simple-green',
    brandName: 'Simple Green',
    name: 'Crystal Simple Green Industrial Cleaner & Degreaser',
    category: 'cleaner-degreaser',
    categoryLabel: 'Industrial Cleaner & Degreaser',
    image: 'assets/products/sg-crystal-lineup.jpg',
    description: "The colorless, unscented version of Simple Green's industrial degreaser. NSF registered for use in food processing facilities (cooking/smoking equipment, floors, walls, utensils) and suited to manufacturing, MRO, pharmaceutical, cosmetic, medical and electronics applications requiring a clean-rinsing, non-tainting formula.",
    tags: ['NSF Registered', 'No Added Color/Scent', 'Biodegradable', 'Non-Caustic', 'Low VOC'],
    applications: ['Food & Beverage', 'Manufacturing & Industrial'],
    variants: [
      { sku: '0610001219024', size: '24 oz Trigger', pack: '12 / case', sizeKey: 'trigger' },
      { sku: '0610000619128', size: '1 US Gal Jug', pack: '6 / case', sizeKey: '1gal' },
      { sku: '0600000119005', size: '5 US Gal Pail', pack: '1 / unit', sizeKey: '5gal' },
      { sku: '0600000119055', size: '55 US Gal Drum', pack: '1 / unit', sizeKey: '55gal' }
    ]
  },
  {
    id: 'sg-extreme',
    brand: 'simple-green',
    brandName: 'Simple Green',
    name: 'Extreme Simple Green Aircraft & Precision Cleaner',
    category: 'aircraft-precision',
    categoryLabel: 'Aircraft & Precision Cleaner',
    image: 'assets/products/sg-extreme-lineup.jpg',
    description: 'Formulated to meet Boeing and aviation-industry testing specifications. Cuts tough grease, oils and grime from aircraft, engines, machinery and structural metals without risk of hydrogen embrittlement, rust or plastic degradation — ideal for aviation, oil & gas, power, mining and precision manufacturing.',
    tags: ['Meets Boeing D6-17487', 'Non-Caustic', 'Petroleum-Distillate-Free', 'Non-Flammable', 'VOC Compliant'],
    applications: ['Aviation', 'Oil & Gas', 'Power & Mining', 'Manufacturing & Industrial'],
    variants: [
      { sku: '0110001213412', size: '32 fl oz Trigger', pack: '12 / case', sizeKey: 'trigger' },
      { sku: '0110000413406', size: '1 US Gal Jug', pack: '4 / case', sizeKey: '1gal' },
      { sku: '0100000113405', size: '5 US Gal Pail', pack: '1 / unit', sizeKey: '5gal' },
      { sku: '0100000113455', size: '55 US Gal Drum', pack: '1 / unit', sizeKey: '55gal' }
    ]
  },
  {
    id: 'sg-rigwash',
    brand: 'simple-green',
    brandName: 'Simple Green',
    name: 'Simple Green Rig Wash',
    category: 'oilfield',
    categoryLabel: 'Oilfield & Rig Wash',
    image: 'assets/products/sg-rigwash-lineup.jpg',
    description: 'Purpose-built for on- and off-shore drilling rigs and oilfield equipment — platforms, decks, derricks, liners, casings, blowout preventers, pumps and support vehicles. Biodegradable quick-break formula releases oil and grease back out of solution, suited for use ahead of oil/water separators and clarifiers.',
    tags: ['Biodegradable Quick-Break', 'Non-Flammable', 'Non-Abrasive', 'Non-Corrosive to Metals'],
    applications: ['Oil & Gas', 'Marine & Offshore'],
    variants: [
      { sku: '0110000403001', size: '1 US Gal Jug', pack: '4 / case', sizeKey: '1gal' },
      { sku: '0100000103005', size: '5 US Gal Pail', pack: '1 / unit', sizeKey: '5gal' },
      { sku: '0100000103055', size: '55 US Gal Drum', pack: '1 / unit', sizeKey: '55gal' }
    ]
  }
];

var PSL_PRODUCTS_UTIL = {
  esc: function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  },
  brandById: function (id) {
    return PSL_BRANDS.filter(function (b) { return b.id === id; })[0] || null;
  },
  categoryById: function (id) {
    return PSL_CATEGORIES.filter(function (c) { return c.id === id; })[0] || null;
  },
  productById: function (id) {
    return PSL_PRODUCTS.filter(function (p) { return p.id === id; })[0] || null;
  },
  productHref: function (p) {
    return 'brand.html?id=' + encodeURIComponent(p.brand) + '&product=' + encodeURIComponent(p.id);
  },
  enquireHref: function (p) {
    return 'contact.html?product=' + encodeURIComponent(p.name);
  },
  initials: function (name) {
    return name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
  },

  /* opts.wide: the featured-supplier layout (logo left, details right) for a brand with a live catalogue.
     Brands without a catalogue render as slim single-line tiles, so 13 of them don't dominate the page. */
  brandCardHTML: function (b, opts) {
    var U = PSL_PRODUCTS_UTIL;
    var wide = !!(opts && opts.wide && b.available);
    if (!b.available) {
      return '<a class="brand-card mini" href="brand.html?id=' + encodeURIComponent(b.id) + '">' +
        '<span class="bm-avatar">' + U.initials(b.name) + '</span>' +
        '<span class="bm-txt"><b>' + U.esc(b.name) + '</b><em>' + U.esc(b.tagline || '') + '</em></span>' +
        '</a>';
    }
    var mine = PSL_PRODUCTS.filter(function (p) { return p.brand === b.id; });
    var visual = b.logo
      ? '<img class="brand-logo-badge" src="' + b.logo + '" alt="' + U.esc(b.name) + '">'
      : '<div class="brand-avatar">' + U.initials(b.name) + '</div><span class="brand-name-text">' + U.esc(b.name) + '</span>';
    var status = b.available ? 'View ' + mine.length + ' Products' : 'Catalogue On Request';
    var href = 'brand.html?id=' + encodeURIComponent(b.id);
    var cls = 'brand-card' + (b.available ? ' featured' : ' unavailable') + (wide ? ' wide' : '');
    if (wide) {
      var sizes = 0; mine.forEach(function (p) { sizes += p.variants.length; });
      return '<a class="' + cls + '" href="' + href + '">' + visual +
        '<span class="bc-info">' +
        '<span class="brand-tagline">' + U.esc(b.tagline || '') + '</span>' +
        (mine.length ? '<span class="bc-meta">' + mine.length + ' products &middot; ' + sizes + ' pack sizes</span>' : '') +
        '<span class="brand-status-pill">' + status + '</span>' +
        '</span></a>';
    }
    return '<a class="' + cls + '" href="' + href + '">' + visual +
      '<span class="brand-tagline">' + U.esc(b.tagline || '') + '</span>' +
      '<span class="brand-status-pill">' + status + '</span>' +
      '</a>';
  },

  /* One product card, shared by the Products page (links to the brand page)
     and the brand page (JS intercepts the click and opens Quick View).
     opts.variants = the variants that currently match the active filters.
     opts.compact  = landing page: photo, name, application and button only. */
  cardHTML: function (p, opts) {
    opts = opts || {};
    var U = PSL_PRODUCTS_UTIL;
    var live = opts.variants && opts.variants.length ? opts.variants : p.variants;
    var href = U.productHref(p);
    var apps = (p.applications || []).slice(0, opts.compact ? 2 : 3);
    var appHTML = apps.length ? '    <div class="sc-app"><span>Application</span><b>' + U.esc(apps.join(' · ')) + '</b></div>' : '';
    var desc = opts.compact ? '' : '    <p class="sc-desc">' + U.esc(p.description) + '</p>';
    var sizes = opts.compact ? '' : '    <div class="sc-sizes">' + p.variants.map(function (v) {
      return '<span class="sc-chip' + (live.indexOf(v) === -1 ? ' dim' : '') + '">' + U.esc(PSL_SIZE_SHORT[v.sizeKey] || v.size) + '</span>';
    }).join('') + '</div>';
    return '' +
      '<article class="shop-card" data-pid="' + p.id + '">' +
      '  <a class="sc-media" href="' + href + '" tabindex="-1" aria-hidden="true">' +
      '    <img src="' + p.image + '" alt="' + U.esc(p.name) + '" loading="lazy">' +
      '    <span class="sc-badge">' + U.esc(p.categoryLabel) + '</span>' +
      '  </a>' +
      '  <div class="sc-body">' +
      '    <a class="sc-title" href="' + href + '">' + U.esc(p.name) + '</a>' +
      desc + appHTML + sizes +
      '    <a class="btn btn-primary btn-sm sc-btn sc-enquire" href="' + U.enquireHref(p) + '">Enquire Now</a>' +
      '  </div>' +
      '</article>';
  }
};

/* =========================================================
   SMART SEARCH ENGINE
   Multi-word, order-independent, typo-tolerant (Levenshtein),
   and keyword/synonym aware — so a search for "rust remover" or
   "food safe" or "offshore" surfaces the right product even when
   that exact phrase never appears in its copy, and a search for
   a brand name surfaces the brand itself.
   ========================================================= */

// keyword/application terms -> product ids they should also match
var PSL_SEARCH_SYNONYMS = {
  'rust': ['sg-extreme'], 'corrosion': ['sg-extreme'], 'corrosive': ['sg-extreme'],
  'aviation': ['sg-extreme'], 'plane': ['sg-extreme'], 'airplane': ['sg-extreme'],
  'aircraft': ['sg-extreme'], 'boeing': ['sg-extreme'], 'precision': ['sg-extreme'],
  'hangar': ['sg-extreme'], 'embrittlement': ['sg-extreme'],
  'engine': ['sg-original', 'sg-crystal', 'sg-extreme'],
  'grease': ['sg-original', 'sg-crystal', 'sg-rigwash'],
  'oil': ['sg-original', 'sg-crystal', 'sg-rigwash'],
  'degreaser': ['sg-original', 'sg-crystal'], 'degreasing': ['sg-original', 'sg-crystal'],
  'degreser': ['sg-original', 'sg-crystal'],
  'kitchen': ['sg-crystal'], 'food': ['sg-crystal'], 'nsf': ['sg-crystal'],
  'unscented': ['sg-crystal'], 'scentfree': ['sg-crystal'], 'fragrancefree': ['sg-crystal'],
  'colorless': ['sg-crystal'], 'colourless': ['sg-crystal'], 'clear': ['sg-crystal'],
  'offshore': ['sg-rigwash'], 'oilfield': ['sg-rigwash'], 'drilling': ['sg-rigwash'],
  'rig': ['sg-rigwash'], 'derrick': ['sg-rigwash'], 'platform': ['sg-rigwash'],
  'wellhead': ['sg-rigwash'], 'mud': ['sg-rigwash'],
  'eco': ['sg-original', 'sg-crystal', 'sg-extreme', 'sg-rigwash'],
  'green': ['sg-original', 'sg-crystal', 'sg-extreme', 'sg-rigwash'],
  'biodegradable': ['sg-original', 'sg-crystal', 'sg-extreme', 'sg-rigwash'],
  'safe': ['sg-original', 'sg-crystal', 'sg-extreme'],
  'nontoxic': ['sg-original', 'sg-crystal', 'sg-extreme'],
  'restroom': ['sg-original'], 'toilet': ['sg-original'], 'deodorizer': ['sg-original'], 'deodorize': ['sg-original'],
  'floor': ['sg-original', 'sg-crystal'], 'carpet': ['sg-original', 'sg-extreme'],
  'workshop': ['sg-original', 'sg-crystal'], 'garage': ['sg-original', 'sg-crystal'],
  'marine': ['sg-rigwash', 'sg-extreme'], 'boat': ['sg-rigwash', 'sg-extreme'], 'vessel': ['sg-rigwash', 'sg-extreme'],
  'industrial': ['sg-original', 'sg-crystal'], 'cleanser': ['sg-original', 'sg-crystal'],
  'degreasant': ['sg-original', 'sg-crystal'], 'wash': ['sg-rigwash'], 'cleaner': ['sg-original', 'sg-crystal', 'sg-extreme']
};

function pslTokenize(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter(Boolean);
}

function pslLevenshtein(a, b) {
  if (a === b) return 0;
  var al = a.length, bl = b.length;
  if (!al) return bl;
  if (!bl) return al;
  var prev = [];
  for (var j = 0; j <= al; j++) prev[j] = j;
  for (var i = 1; i <= bl; i++) {
    var cur = [i];
    for (j = 1; j <= al; j++) {
      cur[j] = b[i - 1] === a[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return prev[al];
}

// does a single query word plausibly mean this text word? (substring both ways,
// or close-enough edit distance scaled to word length — tolerates typos).
// Short tokens (<3 chars — stray initials like the "U"/"S" in "U.S.", or "a",
// "of", "by"...) are required to match exactly: without this, e.g. "rust"
// would trivially "contain" the stray token "u" and match everything.
function pslWordMatches(qWord, textWord) {
  if (!qWord || !textWord) return false;
  if (qWord === textWord) return true;
  if (qWord.length < 3 || textWord.length < 3) return false;
  if (textWord.indexOf(qWord) !== -1 || qWord.indexOf(textWord) !== -1) return true;
  var maxDist = qWord.length <= 5 ? 1 : (qWord.length <= 8 ? 2 : 3);
  return pslLevenshtein(qWord, textWord) <= maxDist;
}

PSL_PRODUCTS_UTIL.smartSearch = function (query) {
  var qWords = pslTokenize(query);
  if (!qWords.length) return { products: [], brands: [] };

  var productResults = PSL_PRODUCTS.map(function (p) {
    var textWords = pslTokenize([p.name, p.brandName, p.categoryLabel, p.description, p.tags.join(' '), (p.applications || []).join(' ')].join(' '));
    Object.keys(PSL_SEARCH_SYNONYMS).forEach(function (kw) {
      if (PSL_SEARCH_SYNONYMS[kw].indexOf(p.id) !== -1) textWords.push(kw);
    });
    var hits = 0;
    qWords.forEach(function (qw) {
      if (textWords.some(function (tw) { return pslWordMatches(qw, tw); })) hits++;
    });
    return { item: p, hits: hits, allMatched: hits === qWords.length };
  }).filter(function (r) { return r.hits > 0; });

  var brandResults = PSL_BRANDS.map(function (b) {
    var textWords = pslTokenize([b.name, b.tagline || ''].join(' '));
    var hits = 0;
    qWords.forEach(function (qw) {
      if (textWords.some(function (tw) { return pslWordMatches(qw, tw); })) hits++;
    });
    return { item: b, hits: hits, allMatched: hits === qWords.length };
  }).filter(function (r) { return r.hits > 0; });

  function bySortOrder(a, b) { return (b.allMatched - a.allMatched) || (b.hits - a.hits); }
  productResults.sort(bySortOrder);
  brandResults.sort(bySortOrder);

  return {
    products: productResults.map(function (r) { return r.item; }),
    brands: brandResults.map(function (r) { return r.item; })
  };
};
