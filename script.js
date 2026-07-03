(function () {
  'use strict';

  document.documentElement.classList.remove('js-disabled');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Page loader ---------- */
  window.addEventListener('load', function () {
    var loader = document.getElementById('pageLoader');
    if (loader) {
      setTimeout(function () { loader.classList.add('is-hidden'); }, 250);
    }
  });

  /* ---------- Sticky header state ---------- */
  var header = document.getElementById('siteHeader');
  function onScrollHeader() {
    if (window.scrollY > 30) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('burgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    burger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function toggleMenu() {
    var open = mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', toggleMenu);
  }
  document.querySelectorAll('.mobile-link, .mobile-call').forEach(function (el) {
    el.addEventListener('click', closeMenu);
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
            maybeStartCounter(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    document.querySelectorAll('.stat-num').forEach(startCounter);
  }

  /* ---------- Counters ---------- */
  function maybeStartCounter(el) {
    var counter = el.querySelector ? el.querySelector('.stat-num') : null;
    if (counter) startCounter(counter);
  }

  function startCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1100;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Close mobile menu on resize to desktop ---------- */
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1100) closeMenu();
  });
})();
