/* ========================================
   RAND_PLAY - MOBILE MENU
   Гамбургер: відкрити / закрити (клік, Esc, перехід на md+)
   ======================================== */
(() => {
    'use strict';

    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    const setOpen = (open) => {
        menu.classList.toggle('hidden', !open);
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    };

    btn.addEventListener('click', () => {
        setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });

    // клік по пункту меню закриває його
    menu.addEventListener('click', (e) => {
        if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
            setOpen(false);
            btn.focus();
        }
    });

    // при розширенні екрана до lg (1024px) меню має сховатися
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
        if (e.matches) setOpen(false);
    });
})();