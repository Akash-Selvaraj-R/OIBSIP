/* ============================================
   THE LEGACY — ANTI-DESIGN EDITORIAL
   Scroll Reveal & Interactions
   ============================================ */

(function () {
  'use strict';

  // Scroll reveal using IntersectionObserver
  function initReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Smooth parallax on hero image (subtle)
  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    var heroImage = document.querySelector('.hero__image');
    if (!hero || !heroImage) return;

    // Respect prefers-reduced-motion
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) return;

    var ticking = false;

    function updateParallax() {
      var scrollY = window.pageYOffset;
      var heroHeight = hero.offsetHeight;
      if (scrollY < heroHeight) {
        var offset = scrollY * 0.3;
        heroImage.style.transform = 'translateY(' + offset + 'px) scale(1.05)';
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // Nav background on scroll
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var ticking = false;

    function updateNav() {
      var scrollY = window.pageYOffset;
      if (scrollY > 100) {
        nav.style.background = 'rgba(245, 240, 232, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.webkitBackdropFilter = 'blur(10px)';
      } else {
        nav.style.background = 'var(--color-bone)';
        nav.style.backdropFilter = 'none';
        nav.style.webkitBackdropFilter = 'none';
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          requestAnimationFrame(updateNav);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // Smooth scroll for nav links
  function initSmoothScroll() {
    var links = document.querySelectorAll('.nav__links a');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('href');
        var target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initHeroParallax();
    initNavScroll();
    initSmoothScroll();
  });
})();