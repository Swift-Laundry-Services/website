/* Swift Laundry Services — site behaviour (vanilla JS, no dependencies).
   Business details, prices and form targets live in site-config.js. */
(function () {
  "use strict";
  var CFG = window.SWIFT_CONFIG || {};
  var B = CFG.business || {};
  var P = CFG.pricing || {};
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var money = function (n) { return "$" + Number(n).toFixed(2); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var get = function (path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, CFG); };
  var ICON = function (paths, cls) { return '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + paths + "</svg>"; };
  var I_CHECK = '<path d="M20 6 9 17l-5-5"/>';
  var I_INFO = '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>';

  /* ---------- Business details ---------- */
  var smsHref = function (body) { return "sms:" + B.phoneE164 + (body ? "?&body=" + encodeURIComponent(body) : ""); };
  $$("[data-bind]").forEach(function (el) {
    var key = el.getAttribute("data-bind");
    if (key === "phone" && B.phoneDisplay) el.textContent = B.phoneDisplay;
    if (key === "email" && B.email) el.textContent = B.email;
    if (key === "address" && B.address) el.textContent = B.address;
    if (key === "hours" && B.hours) el.textContent = B.hours;
    if (key === "serviceArea" && B.serviceArea) el.textContent = B.serviceArea;
    if (key === "extraPerLb" && P.extraPerLb != null) el.textContent = money(P.extraPerLb);
    if (key === "priceFrom" && P.washFold && P.washFold.length) el.textContent = money(Math.min.apply(null, P.washFold.filter(function (x) { return x.confirmed; }).map(function (x) { return x.price; })));
    if (key === "year") el.textContent = new Date().getFullYear();
  });
  $$("[data-price]").forEach(function (el) {
    var v = get("pricing." + el.getAttribute("data-price"));
    if (typeof v === "number") el.textContent = money(v);
  });
  $$("[data-href]").forEach(function (el) {
    var t = el.getAttribute("data-href");
    if (t === "tel" && B.phoneE164) el.href = "tel:" + B.phoneE164;
    if (t === "sms" && B.phoneE164) el.href = smsHref("");
    if (t === "email" && B.email) el.href = "mailto:" + B.email;
  });
  $$("[data-requires]").forEach(function (el) { el.hidden = !get(el.getAttribute("data-requires")); });
  $$("[data-fallback-for]").forEach(function (el) { el.hidden = !!get(el.getAttribute("data-fallback-for")); });
  $$("[data-social]").forEach(function (el) {
    var url = (CFG.social || {})[el.getAttribute("data-social")];
    if (url) { el.href = url; el.hidden = false; } else { el.hidden = true; }
  });
  $$("[data-social-row]").forEach(function (row) { row.hidden = !$$("[data-social]", row).some(function (a) { return !a.hidden; }); });

  /* ---------- Service-area map ---------- */
  var MAP = CFG.map || {};
  $$("[data-map]").forEach(function (f) { if (MAP.embedUrl && f.getAttribute("src") !== MAP.embedUrl) f.setAttribute("src", MAP.embedUrl); });
  $$("[data-map-link]").forEach(function (a) { if (MAP.linkUrl) a.href = MAP.linkUrl; });
  $$("[data-map-caption]").forEach(function (el) { if (MAP.caption) el.textContent = MAP.caption; });

  /* ---------- Logo (owner is sending a new one: set brand.logo in site-config.js) ---------- */
  var BR = CFG.brand || {};
  if (BR.logo) $$("img[data-logo]").forEach(function (img) { img.src = BR.logo; });

  /* ---------- Pricing (layout matches the design PDF) ---------- */
  var IMG = "assets/img/design/";
  var art = function (it) {
    var p = function (n, w, h, style) { return '<picture><source type="image/webp" srcset="' + IMG + n + '-' + w + '.webp"><img src="' + IMG + n + '-' + w + '.png" alt="" width="' + w + '" height="' + h + '" loading="lazy" style="' + style + '"></picture>'; };
    if (it.bags === "duvet") return p("duvet", 268, 140, "height:calc(var(--u) * 101)");
    if (it.bags >= 2) return '<span style="display:flex">' + p("bag", 137, 228, "height:calc(var(--u) * 164)") + '<span style="margin-left:calc(var(--u) * -49)">' + p("bag", 137, 228, "height:calc(var(--u) * 164)") + "</span></span>";
    if (it.bags >= 1) return p("bag", 137, 228, "height:calc(var(--u) * 164)");
    return p("bag-small", 107, 141, "height:calc(var(--u) * 101)");
  };
  $$('[data-render="washFold"]').forEach(function (wrap) {
    wrap.innerHTML = (P.washFold || []).map(function (it) {
      return '<li class="wf"><div class="art" aria-hidden="true">' + art(it) + "</div>" +
        '<h3 class="h-sm">' + esc(it.name) + "</h3>" +
        '<p class="price">' + money(it.price) + (it.confirmed ? "" : '<span class="visually-hidden"> (price to be confirmed)</span>') + "</p>" +
        (it.size ? "<p>" + esc(it.size) + "</p>" : "") + (it.weight ? "<p>" + esc(it.weight) + "</p>" : "") + "</li>";
    }).join("");
  });
  $$('[data-render="dryCleaning"], [data-render="ironing"]').forEach(function (list) {
    var items = P[list.getAttribute("data-render")] || [];
    list.innerHTML = items.map(function (it) {
      return '<li><span class="name">' + esc(it.name) + '</span><span class="line" aria-hidden="true"></span><span class="amt">' + money(it.price) + (it.confirmed ? "" : '<span class="visually-hidden"> (to be confirmed)</span>') + "</span></li>";
    }).join("");
  });
  $$("[data-tbc-for]").forEach(function (el) {
    var key = el.getAttribute("data-tbc-for");
    var items = key === "any" ? [].concat(P.washFold || [], P.dryCleaning || [], P.ironing || []) : (P[key] || []);
    el.hidden = !items.some(function (x) { return x && x.confirmed === false; });
  });

  /* ---------- Header: tall on the home page until scrolled (as in the PDF) ---------- */
  var header = $(".site-header");
  var onScroll = function () { if (header) header.classList.toggle("is-scrolled", window.scrollY > 40); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var toggle = $(".menu-toggle");
  var menu = $("#site-menu");
  var setMenu = function (open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
  };
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); } });
    doc.addEventListener("click", function (e) { if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  }

  /* ---------- "View all industries" and other disclosure buttons ---------- */
  $$("[data-toggle]").forEach(function (btn) {
    var target = doc.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      if (target) target.hidden = !open;
    });
  });

  /* ---------- Reviews carousel (arrows appear once there is more than one review) ---------- */
  $$("[data-carousel]").forEach(function (c) {
    var slides = $$(".review", c);
    if (slides.length < 2) return;
    var i = 0;
    var show = function (n) { i = (n + slides.length) % slides.length; slides.forEach(function (s, k) { s.hidden = k !== i; }); };
    $$(".carousel-btn", c).forEach(function (b) {
      b.hidden = false;
      b.addEventListener("click", function () { show(i + (b.classList.contains("carousel-btn--next") ? 1 : -1)); });
    });
    show(0);
  });

  /* ---------- Prefill from query string (?topic=quote, ?service=dry-cleaning) ---------- */
  try {
    var qs = new URLSearchParams(window.location.search);
    qs.forEach(function (val, key) {
      $$('[data-prefill="' + key + '"]').forEach(function (el) {
        if (el.tagName === "SELECT") { el.value = val; }
        else if (el.type === "checkbox" || el.type === "radio") { if (el.value === val) el.checked = true; }
      });
    });
  } catch (e) { /* older browsers: ignore */ }

  /* ---------- Login tabs ---------- */
  $$("[data-tabs]").forEach(function (tabs) {
    var btns = $$('[role="tab"]', tabs);
    var select = function (btn) {
      btns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute("aria-selected", String(on));
        b.tabIndex = on ? 0 : -1;
        $("#" + b.getAttribute("aria-controls")).hidden = !on;
      });
    };
    if (window.location.hash === "#create") { var cb = doc.getElementById("tab-create"); if (cb) select(cb); }
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () { select(b); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          var n = btns[(i + (e.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length];
          select(n); n.focus(); e.preventDefault();
        }
      });
    });
  });

  /* ---------- Forms ---------- */
  var MESSAGES = {
    valueMissing: "This field is required.",
    typeMismatch: { email: "Please enter a valid email address.", tel: "Please enter a valid phone number." },
    patternMismatch: "Please check the format."
  };
  var fieldMessage = function (el) {
    var v = el.validity;
    if (v.valueMissing) return el.getAttribute("data-msg-required") || MESSAGES.valueMissing;
    if (v.typeMismatch) return MESSAGES.typeMismatch[el.type] || "Please check this value.";
    if (v.patternMismatch) return el.getAttribute("data-msg-pattern") || MESSAGES.patternMismatch;
    if (v.tooShort) return "Please use at least " + el.minLength + " characters.";
    if (v.rangeUnderflow) return el.getAttribute("data-msg-min") || "Please choose a later date.";
    return "";
  };
  var setError = function (wrap, msg) {
    if (!wrap) return;
    var out = $(".field-error", wrap);
    wrap.classList.toggle("has-error", !!msg);
    $$("input, select, textarea", wrap).forEach(function (c) { if (msg) c.setAttribute("aria-invalid", "true"); else c.removeAttribute("aria-invalid"); });
    if (out) out.textContent = msg || "";
  };
  var validate = function (form) {
    var firstBad = null;
    $$(".field", form).forEach(function (wrap) {
      var ctrl = $("input, select, textarea", wrap);
      if (!ctrl || ctrl.type === "checkbox" || ctrl.type === "radio") return;
      var msg = ctrl.checkValidity() ? "" : fieldMessage(ctrl);
      setError(wrap, msg);
      if (msg && !firstBad) firstBad = ctrl;
    });
    $$("[data-require-one]", form).forEach(function (fs) {
      var ok = $$("input", fs).some(function (i) { return i.checked; });
      setError(fs, ok ? "" : fs.getAttribute("data-require-one"));
      if (!ok && !firstBad) firstBad = $("input", fs);
    });
    var bad = $$('[aria-invalid="true"]', form);
    if (bad.length) firstBad = bad[0]; // earliest in DOM order
    if (firstBad) firstBad.focus();
    return !firstBad;
  };
  var summarize = function (form) {
    var lines = [];
    $$(".field, [data-summary-group]", form).forEach(function (wrap) {
      var label = (wrap.getAttribute("data-summary-label") || ($("label, legend", wrap) || {}).textContent || "").replace(/\(optional\)/i, "").trim();
      var vals = $$("input, select, textarea", wrap).filter(function (c) {
        return (c.type === "checkbox" || c.type === "radio") ? c.checked : c.value.trim() !== "" && c.type !== "password";
      }).map(function (c) { return (c.type === "checkbox" || c.type === "radio") ? (c.getAttribute("data-label") || c.value) : c.value.trim(); });
      if (label && vals.length) lines.push(label + ": " + vals.join(", "));
    });
    return lines;
  };
  var resultPanel = function (form, html) {
    var box = $(".form-result", form.parentNode) || doc.createElement("div");
    box.className = "form-result";
    box.setAttribute("role", "status");
    box.setAttribute("tabindex", "-1");
    box.innerHTML = html;
    if (!box.parentNode) form.parentNode.insertBefore(box, form.nextSibling);
    box.hidden = false;
    box.focus({ preventScroll: true });
    box.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  };

  $$("form[data-form]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    $$("input, select, textarea", form).forEach(function (c) {
      var evt = (c.type === "checkbox" || c.type === "radio") ? "change" : "blur";
      c.addEventListener(evt, function () {
        var wrap = c.closest(".field, [data-require-one]");
        if (!wrap || !wrap.classList.contains("has-error")) return;
        if (wrap.hasAttribute("data-require-one")) setError(wrap, $$("input", wrap).some(function (i) { return i.checked; }) ? "" : wrap.getAttribute("data-require-one"));
        else setError(wrap, c.checkValidity() ? "" : fieldMessage(c));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var kind = form.getAttribute("data-form");
      var subject = form.getAttribute("data-subject") || "Website enquiry";

      if (kind === "login") {
        resultPanel(form, "<h3>" + ICON(I_INFO) + "Customer accounts are coming soon</h3><p>Online accounts aren’t live yet. You can still book a pickup online or call or text us on <a href=\"tel:" + B.phoneE164 + "\">" + esc(B.phoneDisplay) + "</a>.</p><div class=\"btn-row\"><a class=\"btn btn--primary btn--sm\" href=\"order.html\">Order a pickup</a></div>");
        return;
      }

      var lines = summarize(form);
      var body = subject + "\n\n" + lines.join("\n");
      var F = CFG.forms || {};

      if (F.endpoint) {
        var btn = $('[type="submit"]', form);
        if (btn) { btn.disabled = true; btn.setAttribute("aria-busy", "true"); }
        var fd = new FormData(form);
        fd.append("_subject", subject);
        fetch(F.endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); })
          .then(function () {
            form.reset();
            resultPanel(form, "<h3>" + ICON(I_CHECK) + "Thank you — we’ve got your request</h3><p>We’ll be in touch soon. If it’s urgent, call or text <a href=\"tel:" + B.phoneE164 + "\">" + esc(B.phoneDisplay) + "</a>.</p>");
          })
          .catch(function () {
            resultPanel(form, "<h3>" + ICON(I_INFO) + "Something went wrong</h3><p>Your request couldn’t be sent. Please call or text us on <a href=\"tel:" + B.phoneE164 + "\">" + esc(B.phoneDisplay) + "</a>.</p>");
          })
          .then(function () { if (btn) { btn.disabled = false; btn.removeAttribute("aria-busy"); } });
        return;
      }

      if (F.email) {
        window.location.href = "mailto:" + F.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        resultPanel(form, "<h3>" + ICON(I_CHECK) + "Almost done</h3><p>Your email app should open with your request filled in — just press send. Nothing opened? Call or text <a href=\"tel:" + B.phoneE164 + "\">" + esc(B.phoneDisplay) + "</a>.</p>");
        return;
      }

      // No backend configured yet: hand the visitor a ready-made text message.
      resultPanel(form,
        "<h3>" + ICON(I_INFO) + "Online booking is almost ready</h3>" +
        "<p>Our online form isn’t connected yet, so nothing has been sent. Your details are ready to go — tap below to send them to us by text, or give us a call.</p>" +
        '<div class="btn-row"><a class="btn btn--primary btn--sm" href="' + smsHref(body) + '">' + ICON('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>') + "Text my request</a>" +
        '<a class="btn btn--outline btn--sm" href="tel:' + B.phoneE164 + '">Call ' + esc(B.phoneDisplay) + "</a></div>");
    });
  });

  /* ---------- Date inputs: no past dates ---------- */
  $$('input[type="date"][data-min-today]').forEach(function (el) {
    var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    el.min = d.toISOString().slice(0, 10);
  });
})();
