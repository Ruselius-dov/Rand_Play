/* Rand_Play — isolated Swiper + Fancybox component */
(function () {
  'use strict';
  function init() {
    const slider = document.querySelector('.rp-game-swiper');
    if (!(slider instanceof HTMLElement)) {
      console.warn('Rand_Play showcase: slider element not found; initialization skipped.');
      return;
    }
    if (typeof Swiper === 'undefined') {
      console.error('Rand_Play showcase: Swiper library is unavailable.');
      return;
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gameSwiper = new Swiper(slider, {
      slidesPerView: 1, spaceBetween: 20, speed: reducedMotion ? 0 : 600,
      rewind: true,
      autoplay: reducedMotion ? false : { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.rp-game-swiper .swiper-pagination', clickable: true },
      navigation: { nextEl: '.rp-game-swiper .swiper-button-next', prevEl: '.rp-game-swiper .swiper-button-prev' },
      keyboard: { enabled: true, onlyInViewport: true },
      a11y: { enabled: true },
      breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
    let modalOpen = false;
    const pause = () => {
      if (gameSwiper.autoplay && gameSwiper.autoplay.running) gameSwiper.autoplay.pause();
    };
    const resume = () => {
      if (!reducedMotion && !modalOpen && gameSwiper.autoplay && gameSwiper.autoplay.running && !slider.contains(document.activeElement)) {
        gameSwiper.autoplay.resume();
      }
    };
    slider.addEventListener('focusin', pause);
    slider.addEventListener('focusout', (event) => {
      if (!slider.contains(event.relatedTarget)) resume();
    });
    if (typeof Fancybox !== 'undefined') {
      Fancybox.bind('.rp-game-swiper [data-fancybox="rp-game-gallery"]', {
        on: {
          init: () => { modalOpen = true; pause(); },
          destroy: () => { modalOpen = false; resume(); }
        }
      });
    } else {
      console.error('Rand_Play showcase: Fancybox library is unavailable.');
    }
  }
  const loadScript = src => new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = src; script.onload = resolve; script.onerror = reject; document.head.append(script);
  });
  const loadStyle = href => new Promise((resolve, reject) => {
    const sheet = document.createElement('link');
    sheet.rel = 'stylesheet';
    sheet.href = href;
    sheet.onload = resolve;
    sheet.onerror = reject;
    document.head.insertBefore(sheet, document.querySelector('link[href="css/main.css"]'));
  });
  let started = false;
  async function start() {
    if (started) return; started = true;
    try { await Promise.all([loadStyle('assets/vendor/swiper.min.css'), loadStyle('assets/vendor/fancybox.css'), loadScript('assets/vendor/swiper.min.js'), loadScript('assets/vendor/fancybox.min.js')]); init(); }
    catch (error) { started = false; console.error('Showcase could not load', error); }
  }
  const target = document.querySelector('.rp-game-swiper');
  if (target && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); start(); } }, {rootMargin:'400px'});
    observer.observe(target);
    target.addEventListener('focusin', start, {once:true});
  } else start();
})();
