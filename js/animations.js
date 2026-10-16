/**
 * DHANANJAY SHARMA — ANIMATION SYSTEM
 * Uses IntersectionObserver, requestAnimationFrame, and CSS transitions
 * Respects prefers-reduced-motion
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Scroll-Triggered Element Reveals
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!revealElements.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 2. Active Section Spy for Navigation
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const header = document.querySelector('.site-header');

    if (!sections.length) return;

    function onScroll() {
      const scrollPos = window.scrollY + 140;

      // Header border/bg toggle on scroll
      if (header) {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 3. Indian Standard Time (IST) Real-time Clock
  function initTimeClock() {
    const timeEl = document.getElementById('ist-time-display');
    if (!timeEl) return;

    function updateIST() {
      try {
        const now = new Date();
        const options = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        const formatter = new Intl.DateTimeFormat([], options);
        timeEl.textContent = `${formatter.format(now)} IST`;
      } catch (e) {
        timeEl.textContent = 'IST (UTC+5:30)';
      }
    }

    updateIST();
    setInterval(updateIST, 1000);
  }

  // 4. Smooth Anchor Scrolling with Header Offset
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });

          // Close mobile menu if open
          const mobileDrawer = document.getElementById('mobile-drawer');
          const mobileToggle = document.getElementById('mobile-toggle');
          if (mobileDrawer && mobileDrawer.classList.contains('open')) {
            mobileDrawer.classList.remove('open');
            mobileToggle.classList.remove('is-active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          }
        }
      });
    });
  }

  // Initialize all animation subsystems
  window.PortfolioAnimations = {
    init: function () {
      initScrollReveals();
      initScrollSpy();
      initTimeClock();
      initSmoothScroll();
    }
  };
})();
