/* ========================================
   RAND_PLAY - STAGE / CAMERA
   Перехід між hero (екран зблизька) і столом:

   Spin the Roulette:  екран hero вимикається + камера відʼїжджає (паралельно)
                       -> камера зупинилась -> вмикається екран на столі
   <- return:          екран на столі вимикається -> камера наїжджає
                       -> вмикається стартовий екран hero

   Усі тривалості лежать у CSS (змінні --t-* на .stage), тут вони лише читаються.
   ======================================== */

(() => {
    'use strict';

    const stage = document.getElementById('stage');
    if (!stage) return;

    const hero = document.getElementById('hero');
    const desk = document.getElementById('desk-view');
    const heroMonitor = hero.querySelector('.crt-monitor-fullscreen');
    const heroScreen = hero.querySelector('.crt-screen');
    const deskFrame = desk.querySelector('.monitor-screen');
    const deskDisplay = desk.querySelector('.crt-display');
    const heroSpinBtn = document.getElementById('btn-spin-roulette');
    const returnLink = desk.querySelector('.monitor-return');
    const deskSpinBtn = desk.querySelector('.spin-button-giant');

    let busy = false;

    /* ---------- helpers ---------- */

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // читає тривалість зі CSS-змінної (--t-cam: 1.8s / 600ms) і повертає мс
    const time = (name) => {
        const v = getComputedStyle(stage).getPropertyValue(name).trim();
        const n = parseFloat(v) || 0;
        return v.endsWith('ms') ? n : n * 1000;
    };

    const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // data-state: hero | busy | desk. inert блокує фокус/кліки по прихованій сцені
    const setState = (state) => {
        stage.dataset.state = state;
        hero.inert = state !== 'hero';
        desk.inert = state !== 'desk';
    };

    const setScreen = (el, cls) => {
        el.classList.remove('crt-on', 'crt-off', 'crt-reon');
        if (cls) el.classList.add(cls);
    };

    /* ---------- масштаб столу на вузьких екранах ----------
       Стіл верстається мінімум на DESK_MIN_W px і стискається transform-ом до ширини екрана.
       transform не змінює розміри в потоці, тому ширину збільшуємо в 1/fit разів (CSS),
       а зайву висоту прибираємо від'ємним margin-bottom (--desk-pull). */
    const DESK_MIN_W = 900;

    function fitDesk() {
        const fit = Math.min(1, stage.clientWidth / DESK_MIN_W);
        desk.style.transition = 'none';
        stage.style.setProperty('--desk-fit', fit);
        stage.style.setProperty('--desk-pull', '0px');
        const h = desk.offsetHeight; // висота в потоці, transform на неї не впливає
        stage.style.setProperty('--desk-pull', `${-(1 - fit) * h}px`);
        void desk.offsetWidth;
        desk.style.transition = '';
        return fit;
    }

    /* ---------- геометрія камери ----------
       Хочемо, щоб екран на столі (збільшений у s разів) збігся з екраном hero.
       Стіл: transform = translate(cam-x, cam-y) scale(s), origin 0 0.
       Hero-монітор їде назустріч: scale(1/s) і зсув у центр екрана на столі,
       тож вони рухаються як одна жорстка сцена. */
    function updateCamera() {
        const fit = fitDesk(); // ширина/масштаб столу на вузьких екранах
        const layers = [desk, heroMonitor];

        // вимірюємо без жодних transform
        layers.forEach((el) => {
            el.style.transition = 'none';
            el.style.transform = 'none';
        });

        const stageRect = stage.getBoundingClientRect();
        const deskRect = deskFrame.getBoundingClientRect();
        const heroRect = heroMonitor.getBoundingClientRect();

        const deskCx = deskRect.left + deskRect.width / 2 - stageRect.left;
        const deskCy = deskRect.top + deskRect.height / 2 - stageRect.top;
        const heroCx = heroRect.left + heroRect.width / 2 - stageRect.left;
        const heroCy = heroRect.top + heroRect.height / 2 - stageRect.top;

        // offsetWidth не залежить від transform / анімацій
        const s = heroScreen.offsetWidth / deskDisplay.offsetWidth;

        stage.style.setProperty('--cam-s', s);
        stage.style.setProperty('--cam-x', `${heroCx - s * deskCx}px`);
        stage.style.setProperty('--cam-y', `${heroCy - s * deskCy}px`);

        // у стані "камера віддалена" стіл стиснутий у fit разів, hero-монітор їде в ту саму точку
        stage.style.setProperty('--hero-s', fit / s);
        stage.style.setProperty('--hero-dx', `${fit * deskCx - heroCx}px`);
        stage.style.setProperty('--hero-dy', `${fit * deskCy - heroCy}px`);

        // повертаємо керування CSS без стрибка: спершу transform, reflow, потім transition
        layers.forEach((el) => { el.style.transform = ''; });
        void stage.offsetWidth;
        layers.forEach((el) => { el.style.transition = ''; });
    }

    /* ---------- переходи ---------- */

    async function goToDesk() {
        if (busy || stage.dataset.state !== 'hero') return;
        busy = true;

        scrollTop();
        setState('busy');
        updateCamera();

        // 1) паралельно: hero-екран гасне, камера відʼїжджає
        setScreen(heroScreen, 'crt-off');
        stage.classList.add('cam-out');
        await wait(time('--t-cam'));

        // 2) камера зафіксувалась -> вмикається екран на столі
        setScreen(deskDisplay, 'crt-on');
        await wait(time('--t-on'));

        setState('desk');
        deskSpinBtn.focus({ preventScroll: true });
        busy = false;
    }

    async function goToHero() {
        if (busy || stage.dataset.state !== 'desk') return;
        busy = true;

        scrollTop();
        setState('busy');

        // 1) екран на столі вимикається
        setScreen(deskDisplay, 'crt-off');
        await wait(time('--t-off'));

        // 2) камера наїжджає на екран
        updateCamera();
        stage.classList.remove('cam-out');
        await wait(time('--t-cam'));

        // 3) вмикається стартовий екран
        setScreen(heroScreen, 'crt-reon');
        await wait(time('--t-on'));

        setState('hero');
        heroSpinBtn.focus({ preventScroll: true });
        busy = false;
    }

    // миттєво показати стіл (для переходу за #desk-view)
    function showDeskInstantly() {
        stage.classList.add('no-anim');
        stage.classList.add('cam-out');
        setScreen(heroScreen, 'crt-off');
        setScreen(deskDisplay, 'crt-on');
        setState('desk');
        void stage.offsetWidth;
        stage.classList.remove('no-anim');
    }

    /* ---------- події ---------- */

    heroSpinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToDesk();
    });

    returnLink.addEventListener('click', (e) => {
        e.preventDefault(); // не даємо якорю #hero прокручувати сторінку
        goToHero();
    });

    let resizeRaf = 0;
    window.addEventListener('resize', () => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
            const st = stage.dataset.state;
            if (st === 'hero') updateCamera();
            else if (st === 'desk') fitDesk();
        });
    });

    /* ---------- старт ---------- */

    setState('hero');
    updateCamera();
    window.addEventListener('load', () => {
        // шрифти/картинки могли змінити розміри
        if (stage.dataset.state === 'hero') updateCamera();
        else fitDesk();
    });

    if (location.hash === '#desk-view') showDeskInstantly();
})();