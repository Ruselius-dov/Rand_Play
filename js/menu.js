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

    const desktopDropdown = document.getElementById('desktop-sections');
    const links = Array.from(document.querySelectorAll('.rp-nav-link'));
    const backTop = document.getElementById('back-to-top');

    if (desktopDropdown) {
        desktopDropdown.addEventListener('click', (event) => {
            if (event.target.closest('a[href^="#"]')) desktopDropdown.open = false;
        });
        document.addEventListener('click', (event) => {
            if (!desktopDropdown.contains(event.target)) desktopDropdown.open = false;
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && desktopDropdown.open) {
                desktopDropdown.open = false;
                desktopDropdown.querySelector('summary')?.focus();
            }
        });
    }

    // Recalculate only on scroll, with one scheduled frame per burst.
    const sectionLinks = new Map();
    links.forEach(link => {
        const id = link.getAttribute('href')?.slice(1);
        if (id && document.getElementById(id)) {
            if (!sectionLinks.has(id)) sectionLinks.set(id, []);
            sectionLinks.get(id).push(link);
        }
    });
    const sections = [...sectionLinks.keys()].map(id => document.getElementById(id));
    let frameRequested = false;
    const syncNavigation = () => {
        frameRequested = false;
        const checkpoint = Math.min(window.innerHeight * 0.3, 220);
        let activeId = sections[0]?.id;
        for (const section of sections) {
            if (section.getBoundingClientRect().top <= checkpoint) activeId = section.id;
        }
        links.forEach(link => {
            if (link.getAttribute('href') === '#' + activeId) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
        if (backTop) backTop.hidden = window.scrollY < 420;
    };
    const requestSync = () => {
        if (!frameRequested) {
            frameRequested = true;
            requestAnimationFrame(syncNavigation);
        }
    };
    window.addEventListener('scroll', requestSync, {passive:true});
    window.addEventListener('resize', requestSync);
    requestSync();
})();