/* ============================================
   THE LEGACY — Albert Einstein Tribute
   OASIS INFOBYTE SIP — Level 2 Task 2
   Scroll Reveal & Interactions
   ============================================ */

(function () {
  'use strict';

  // Scroll reveal using IntersectionObserver
  function initReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all immediately
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

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initHeroParallax();
  });
})();
