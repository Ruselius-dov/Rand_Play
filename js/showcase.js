/* Rand_Play Lab 10 — isolated Swiper + Fancybox component */
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
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
