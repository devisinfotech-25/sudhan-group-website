/* Sudhan Group: vanilla JavaScript. No libraries. Each block is independent. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- intro animation trigger ---------- */
  requestAnimationFrame(function () { requestAnimationFrame(function () { document.body.classList.add('go'); }); });

  /* ---------- navigation ---------- */
  var nav = $('[data-nav]');
  var mega = $('[data-mega]');
  var megaBtn = mega && $('button', mega);
  var megaPanel = mega && $('.mega', mega);
  var toggle = $('.nav__toggle');
  var drawer = $('#drawer');
  var closeTimer;

  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMega(open) {
    if (!mega) return;
    megaBtn.setAttribute('aria-expanded', String(open));
    megaPanel.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
  }
  if (mega) {
    mega.addEventListener('mouseenter', function () { clearTimeout(closeTimer); setMega(true); });
    mega.addEventListener('mouseleave', function () { closeTimer = setTimeout(function () { setMega(false); }, 140); });
    megaBtn.addEventListener('click', function () { setMega(megaBtn.getAttribute('aria-expanded') !== 'true'); });
    mega.addEventListener('focusout', function (e) { if (!mega.contains(e.relatedTarget)) setMega(false); });
  }
  function setDrawer(open) {
    drawer.classList.toggle('is-open', open);
    nav.classList.toggle('is-drawer', open);
    toggle.setAttribute('aria-expanded', String(open));
    $('.sr', toggle).textContent = open ? 'Close menu' : 'Open menu';
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setDrawer(!drawer.classList.contains('is-open')); });
  var dBtn = $('.drawer__link--btn');
  dBtn.addEventListener('click', function () {
    var open = dBtn.getAttribute('aria-expanded') !== 'true';
    dBtn.setAttribute('aria-expanded', String(open));
    $('#drawer-biz').classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setMega(false); if (drawer.classList.contains('is-open')) { setDrawer(false); toggle.focus(); } }
  });
  window.addEventListener('resize', function () { if (window.innerWidth >= 900 && drawer.classList.contains('is-open')) setDrawer(false); });

  /* ---------- scroll reveal ---------- */
  var revealEls = $$('[data-reveal],[data-split]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- scroll-lit statement words ---------- */
  var lit = $('[data-lit]');
  var words = [];
  if (lit) {
    var text = lit.textContent.trim().split(/\s+/);
    lit.setAttribute('aria-label', text.join(' '));
    lit.textContent = '';
    text.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'w'; s.setAttribute('aria-hidden', 'true'); s.textContent = w;
      lit.appendChild(s); if (i < text.length - 1) lit.appendChild(document.createTextNode(' '));
      words.push(s);
    });
  }
  function updateLit() {
    if (!lit) return;
    var r = lit.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh * 0.82 - r.top) / (r.height + vh * 0.25);
    p = Math.max(0, Math.min(1, p));
    var n = Math.round(p * words.length);
    words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
  }

  /* ---------- parallax (scroll) ---------- */
  var par = $$('[data-parallax]');
  function updateParallax() {
    if (reduce) return;
    var vh = window.innerHeight;
    par.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var k = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * -k).toFixed(1) + 'px,0)';
    });
  }

  /* ---------- timeline progress ---------- */
  var tls = $$('[data-timeline]');
  function updateTimeline() {
    tls.forEach(function (t) {
      var r = t.getBoundingClientRect(), vh = window.innerHeight;
      var p = (vh * 0.6 - r.top) / r.height;
      t.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    });
  }

  var ticking = false;
  function onFrame() { ticking = false; updateLit(); updateParallax(); updateTimeline(); }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  onFrame();

  /* ---------- hero: mouse light and ring depth ---------- */
  var hero = $('[data-hero]');
  if (hero && finePointer && !reduce) {
    var rings = $$('.ring', hero);
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      hero.style.setProperty('--mx', x + 'px'); hero.style.setProperty('--my', y + 'px');
      var nx = x / r.width - 0.5, ny = y / r.height - 0.5;
      rings.forEach(function (ring) {
        var d = parseFloat(ring.getAttribute('data-depth')) || 10;
        ring.style.setProperty('--rx', (nx * d).toFixed(1) + 'px'); ring.style.setProperty('--ry', (ny * d).toFixed(1) + 'px');
      });
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduce) {
    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.2).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
    /* phone tilt */
    $$('[data-tilt]').forEach(function (p) {
      var wrap = p.parentElement;
      wrap.addEventListener('pointermove', function (e) {
        var r = wrap.getBoundingClientRect();
        p.style.setProperty('--ty', (((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(1) + 'deg');
        p.style.setProperty('--tx', ((0.5 - (e.clientY - r.top) / r.height) * 10).toFixed(1) + 'deg');
      });
      wrap.addEventListener('pointerleave', function () { p.style.setProperty('--ty', '0deg'); p.style.setProperty('--tx', '0deg'); });
    });
  }

  /* ---------- business ecosystem: country tabs + accordion ---------- */
  var tabsWrap = $('[data-eco-tabs]');
  if (tabsWrap) {
    var tabs = $$('[role=tab]', tabsWrap), bar = $('.eco__bar', tabsWrap);
    var moveBar = function () {
      var t = tabs.filter(function (x) { return x.getAttribute('aria-selected') === 'true'; })[0];
      if (!t) return;
      tabsWrap.style.setProperty('--bw', t.offsetWidth + 'px'); tabsWrap.style.setProperty('--bx', t.offsetLeft + 'px');
    };
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
        var set = document.getElementById(t.getAttribute('aria-controls')); if (set) set.hidden = !on;
      });
      var sec = tab.closest('.eco'); if (sec) sec.classList.toggle('is-sg', tab.getAttribute('data-eco-tab') === 'singapore');
      moveBar(); if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          select(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
        }
      });
    });
    var want = (location.hash || '').replace('#', '');
    var pre = tabs.filter(function (t) { return t.getAttribute('data-eco-tab') === want; })[0];
    if (pre) select(pre);
    moveBar(); window.addEventListener('resize', moveBar); window.addEventListener('load', moveBar);
  }
  $$('[data-eco-acc]').forEach(function (acc) {
    var items = $$('[data-eco-item]', acc);
    var activate = function (it) { items.forEach(function (x) { x.classList.toggle('is-active', x === it); }); };
    items.forEach(function (it) {
      it.addEventListener('mouseenter', function () { activate(it); });
      it.addEventListener('focusin', function () { activate(it); });
      /* touch: first tap opens the panel on tablets, second tap follows the link */
      it.addEventListener('click', function (e) {
        if (window.innerWidth > 820 && !finePointer && !it.classList.contains('is-active')) { e.preventDefault(); activate(it); }
      });
    });
  });

  /* ---------- horizontal scrollers: buttons + drag ---------- */
  $$('.branches').forEach(function (sec) {
    var track = $('[data-drag]', sec); if (!track) return;
    $$('[data-scroll]', sec).forEach(function (b) {
      b.addEventListener('click', function () {
        track.scrollBy({ left: parseInt(b.getAttribute('data-scroll'), 10) * track.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    var down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; sx = e.clientX; sl = track.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 4) { moved = true; track.classList.add('dragging'); }
      track.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () { down = false; track.classList.remove('dragging'); });
  });

  /* ---------- enquiry form: opens WhatsApp or email, never claims to send ---------- */
  var form = $('[data-enquiry]');
  if (form) {
    var WA = '916383456556', MAIL = 'hr@sudhangroup.co', note = $('[data-note]', form);
    var compose = function () {
      var d = new FormData(form), lines = ['Name: ' + d.get('name')];
      if (d.get('reply')) lines.push('Phone or email: ' + d.get('reply'));
      if (d.get('business')) lines.push('Business: ' + d.get('business'));
      lines.push('', d.get('message'));
      return { text: lines.join('\n'), business: d.get('business') };
    };
    $$('[data-send]', form).forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!form.reportValidity()) return;
        var c = compose();
        if (btn.getAttribute('data-send') === 'whatsapp') {
          window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent('Hello,\n' + c.text), '_blank', 'noopener,noreferrer');
          note.textContent = 'WhatsApp opened in a new tab. Press send there to deliver your message.';
        } else {
          window.location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(c.business ? 'Enquiry: ' + c.business : 'Enquiry') + '&body=' + encodeURIComponent(c.text);
          note.textContent = 'Your email app should open with the message addressed to ' + MAIL + '. Press send there to deliver it.';
        }
      });
    });
  }

  /* ---------- video: pause when off screen to save battery ---------- */
  var vids = $$('video');
  if ('IntersectionObserver' in window && vids.length && !reduce) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { var v = en.target; if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); } });
    }, { threshold: 0.05 });
    vids.forEach(function (v) { vio.observe(v); });
  }
})();
/* =======================================================
   PHILOSOPHY SCROLL REVEAL
======================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const philosophy = document.querySelector(".philo");

  if (!philosophy) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          philosophy.classList.add("is-visible");
          obs.unobserve(philosophy);
        }
      });
    },
    {
      threshold: 0.25
    }
  );

  observer.observe(philosophy);
});
