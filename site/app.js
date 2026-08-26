(function () {
  "use strict";

  var TAX_RATE = 22 / 78; // income tax on the amount exceeding the tax-free limit
  var PAYROLL_LIMIT_SHARE = 0.03; // 3% of payroll subject to social tax
  var PROFIT_LIMIT_SHARE = 0.10; // 10% of previous financial year's profit
  var ROW_CAP = 200;

  var LINKS = {
    emtaDonations: {
      et: "https://www.emta.ee/ariklient/maksud-ja-tasumine/tulumaks-ja-sotsiaalmaks/kingitused-annetused-ja-vastuvotukulud",
      en: "https://www.emta.ee/en/business-client/taxes-and-payment/income-and-social-taxes/gifts-and-donations",
    },
    register: {
      et: "https://ariregister.rik.ee/est/company/",
      en: "https://ariregister.rik.ee/eng/company/",
    },
  };

  var state = {
    lang: "et",
    query: "",
    county: "",
    type: "",
    showAll: false,
    orgs: [],
    asOf: "",
  };

  try {
    var saved = localStorage.getItem("lang");
    if (saved === "et" || saved === "en") state.lang = saved;
  } catch (e) { /* storage unavailable */ }

  var $ = function (id) { return document.getElementById(id); };

  function t(key) {
    var dict = window.I18N[state.lang] || window.I18N.et;
    return dict[key] || window.I18N.et[key] || key;
  }

  function fmt(template, params) {
    return template.replace(/\{(\w+)\}/g, function (_, k) {
      return params[k] !== undefined ? params[k] : "{" + k + "}";
    });
  }

  function formatDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return p[2] + "." + p[1] + "." + p[0];
  }

  var moneyFmt = null;
  function money(value) {
    if (!moneyFmt) {
      moneyFmt = new Intl.NumberFormat(state.lang === "et" ? "et-EE" : "en-GB", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      });
    }
    return moneyFmt.format(value);
  }

  // Case- and diacritics-insensitive matching, so "polva" finds "Põlva".
  function normalize(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function orgType(org) {
    return org.code.charAt(0) === "9" ? "sa" : "mtu";
  }

  /* ---------- i18n ---------- */

  function applyI18n() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === state.lang);
    });

    var date = formatDate(state.asOf);
    $("unofficial-notice").textContent = fmt(t("notice.unofficial"), { date: date });
    $("footer-updated").textContent = fmt(t("footer.updated"), { date: date });
    $("emta-link").href = LINKS.emtaDonations[state.lang];
    $("info-emta").href = LINKS.emtaDonations[state.lang];

    var countyAll = $("county-filter").querySelector('option[value=""]');
    if (countyAll) countyAll.textContent = t("filter.county.all");

    moneyFmt = null;
    renderTable();
    renderCalc();
  }

  function setLang(lang) {
    state.lang = lang;
    try { localStorage.setItem("lang", lang); } catch (e) { /* ignore */ }
    applyI18n();
  }

  /* ---------- table ---------- */

  function filteredOrgs() {
    var q = normalize(state.query.trim());
    return state.orgs.filter(function (org) {
      if (state.county && org.county !== state.county) return false;
      if (state.type && orgType(org) !== state.type) return false;
      if (q && org._search.indexOf(q) === -1) return false;
      return true;
    });
  }

  function renderTable() {
    var matches = filteredOrgs();
    var shown = state.showAll ? matches : matches.slice(0, ROW_CAP);
    var tbody = $("org-tbody");
    var frag = document.createDocumentFragment();

    shown.forEach(function (org) {
      var tr = document.createElement("tr");

      var name = document.createElement("td");
      name.textContent = org.name;
      tr.appendChild(name);

      var code = document.createElement("td");
      code.className = "code";
      var link = document.createElement("a");
      link.href = LINKS.register[state.lang] + org.code;
      link.target = "_blank";
      link.rel = "noopener";
      link.title = t("row.registerLink");
      link.textContent = org.code;
      code.appendChild(link);
      tr.appendChild(code);

      var county = document.createElement("td");
      county.textContent = org.county;
      tr.appendChild(county);

      var place = document.createElement("td");
      place.textContent = org.place;
      tr.appendChild(place);

      var since = document.createElement("td");
      since.className = "since";
      since.textContent = formatDate(org.since);
      tr.appendChild(since);

      frag.appendChild(tr);
    });

    tbody.replaceChildren(frag);
    $("no-results").classList.toggle("hidden", matches.length > 0);
    $("results-count").textContent = fmt(t("results.showing"), {
      shown: shown.length,
      total: matches.length,
    });
    $("show-all").classList.toggle("hidden", matches.length <= shown.length);
  }

  function buildCountyFilter() {
    var counties = Array.from(new Set(state.orgs.map(function (o) { return o.county; })));
    counties.sort(function (a, b) { return a.localeCompare(b, "et"); });
    var select = $("county-filter");
    var all = document.createElement("option");
    all.value = "";
    all.textContent = t("filter.county.all");
    select.replaceChildren(all);
    counties.forEach(function (c) {
      var opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      select.appendChild(opt);
    });
  }

  /* ---------- calculator ---------- */

  function num(id) {
    var v = parseFloat($(id).value);
    return isFinite(v) && v > 0 ? v : 0;
  }

  function renderCalc() {
    var donation = num("calc-donation");
    var payroll = num("calc-payroll");
    var profit = num("calc-profit");

    var payrollLimit = PAYROLL_LIMIT_SHARE * payroll;
    var profitLimit = PROFIT_LIMIT_SHARE * profit;
    var limit = Math.max(payrollLimit, profitLimit);
    var excess = Math.max(0, donation - limit);
    var tax = excess * TAX_RATE;

    $("calc-limit").textContent = money(limit);
    $("calc-limit-basis").textContent =
      limit > 0
        ? "(" + t(profitLimit >= payrollLimit ? "calc.limitBasisProfit" : "calc.limitBasisPayroll") + ")"
        : "";
    $("calc-excess").textContent = money(excess);
    $("calc-tax").textContent = money(tax);
    $("calc-total").textContent = money(donation + tax);
    $("calc-unlisted").textContent =
      donation > 0
        ? fmt(t("calc.unlisted"), { amount: money(donation * (1 + TAX_RATE)) })
        : "";
  }

  /* ---------- init ---------- */

  function init(data) {
    state.asOf = data.asOf;
    state.orgs = data.organizations;
    state.orgs.forEach(function (org) {
      org._search = normalize(org.name + " " + org.code);
    });
    buildCountyFilter();
    applyI18n();
  }

  $("search").addEventListener("input", function () {
    state.query = this.value;
    state.showAll = false;
    renderTable();
  });
  $("county-filter").addEventListener("change", function () {
    state.county = this.value;
    state.showAll = false;
    renderTable();
  });
  $("type-filter").addEventListener("change", function () {
    state.type = this.value;
    state.showAll = false;
    renderTable();
  });
  $("show-all").addEventListener("click", function () {
    state.showAll = true;
    renderTable();
  });
  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-lang"));
    });
  });
  ["calc-donation", "calc-payroll", "calc-profit"].forEach(function (id) {
    $(id).addEventListener("input", renderCalc);
  });

  fetch("data.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(init)
    .catch(function (err) {
      $("results-count").textContent = "Andmete laadimine ebaõnnestus / failed to load data (" + err.message + ")";
    });
})();
