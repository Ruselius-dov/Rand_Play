/* ========================================
   RAND_PLAY - ROULETTE
   Пасивне крутіння → SPIN: розгін → швидкість → плавне гальмування
   ======================================== */
(() => {
    'use strict';

    // Шлях відносно index.html (НЕ абсолютний F:\...)
    const ICON_DIR = 'assets/images/';
    const ICONS = ['brutal-helm', 'crossbow', 'flame', 'mite-alt', 'spider-alt', 'spider-face'];

    const PASSIVE_SPEED = 28;   // px/с — повільне крутіння в очікуванні
    const ACCEL_TIME = 1.0;  // с — розгін
    const CRUISE_TIME = 1.2;  // с — максимальна швидкість
    const DECEL_TIME = 4.5;  // с — гальмування до зупинки
    const MIN_TRAVEL = 7000; // px — мінімальний шлях до зупинки
    const BLOCKS = 8;    // скільки «колод» по N іконок у стрічці
    const EXTRA_CELLS = 12;   // копія початку в кінці, щоб цикл був без шва (≥ ширина вікна / ширина клітинки)

    const TOTAL_TIME = ACCEL_TIME + CRUISE_TIME + DECEL_TIME;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const PASSIVE = reduceMotion ? 0 : PASSIVE_SPEED;

    const roulette = document.getElementById('roulette');
    const track = document.getElementById('roulette-track');
    const spinBtn = document.querySelector('.spin-button-giant');
    if (!roulette || !track || !spinBtn) return;

    /* ---------- Стрічка ---------- */
    const shuffle = (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    // Кожен блок містить усі іконки в різному порядку — так будь-який переможець гарантовано близько
    const order = [];
    for (let b = 0; b < BLOCKS; b++) order.push(...shuffle(ICONS.map((_, i) => i)));
    const total = order.length;
    const cells = [...order, ...order.slice(0, EXTRA_CELLS)];

    const frag = document.createDocumentFragment();
    cells.forEach((iconIdx) => {
        const slot = document.createElement('div');
        slot.className = 'roulette-slot';

        const tile = document.createElement('div');
        tile.className = 'slot-tile';

        const img = new Image();
        img.src = `${ICON_DIR}${ICONS[iconIdx]}.svg`;
        img.alt = ICONS[iconIdx];
        img.draggable = false;

        tile.appendChild(img);
        slot.appendChild(tile);
        frag.appendChild(slot);
    });
    track.appendChild(frag);

    /* ---------- Розміри ---------- */
    let cellW = 0;
    let viewW = 0;
    const measure = () => {
        cellW = track.firstElementChild.offsetWidth;
        viewW = roulette.clientWidth;
    };
    measure();
    window.addEventListener('resize', measure);

    /* ---------- Стан ---------- */
    let offset = Math.random() * total * cellW;  // розгорнута позиція стрічки (px)
    let mode = 'idle';                           // 'idle' | 'spinning' | 'done'
    let spin = null;
    let last = performance.now();

    const render = () => {
        const x = offset % (total * cellW);
        track.style.transform = `translate3d(${-x}px, 0, 0)`;
    };

    /* ---------- Крутіння ---------- */
    function startSpin() {
        if (mode === 'spinning') return;

        track.querySelectorAll('.is-winner').forEach((el) => el.classList.remove('is-winner'));
        roulette.classList.remove('has-winner');

        const v0 = mode === 'idle' ? PASSIVE : 0;

        // 1. переможець — рівномірно серед іконок
        const winner = Math.floor(Math.random() * ICONS.length);

        // 2. перша клітинка з цією іконкою після мінімального шляху
        let idx = Math.ceil((offset + MIN_TRAVEL + viewW / 2) / cellW);
        while (order[idx % total] !== winner) idx++;

        // 3. зупинка у випадковій точці клітинки (як у CS), але маркер усе одно над переможцем
        const jitter = (Math.random() - 0.5) * cellW * 0.5;
        const target = (idx + 0.5) * cellW + jitter - viewW / 2;
        const distance = target - offset;

        // швидкість на плато підібрана так, щоб пройти рівно distance
        const vMax = (distance - (ACCEL_TIME * v0) / 2) / (ACCEL_TIME / 2 + CRUISE_TIME + DECEL_TIME / 3);

        spin = { start: null, from: offset, v0, vMax, target, winner };
        mode = 'spinning';
        spinBtn.disabled = true;
    }

    // Пройдений шлях за t секунд від старту
    function travelled(t) {
        const { v0, vMax } = spin;

        if (t < ACCEL_TIME) {                       // розгін (плавний)
            const x = t / ACCEL_TIME;
            return ACCEL_TIME * (v0 * x + (vMax - v0) * (x ** 3 - x ** 4 / 2));
        }
        const d1 = (ACCEL_TIME * (v0 + vMax)) / 2;
        t -= ACCEL_TIME;

        if (t < CRUISE_TIME) return d1 + vMax * t;  // максимальна швидкість

        const d2 = d1 + vMax * CRUISE_TIME;         // гальмування: швидкість ∝ (1 - s)²
        const s = Math.min((t - CRUISE_TIME) / DECEL_TIME, 1);
        return d2 + ((vMax * DECEL_TIME) / 3) * (1 - (1 - s) ** 3);
    }

    function finish() {
        mode = 'done';
        spinBtn.disabled = false;

        const x = offset % (total * cellW);
        const slot = track.children[Math.floor((x + viewW / 2) / cellW)];
        if (slot) slot.classList.add('is-winner');
        roulette.classList.add('has-winner');

        // хук для наступних кроків (картка гри тощо):
        // document.addEventListener('roulette:result', (e) => console.log(e.detail.icon));
        document.dispatchEvent(new CustomEvent('roulette:result', { detail: { icon: ICONS[spin.winner] } }));
    }

    /* ---------- Цикл анімації ---------- */
    function frame(now) {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        if (mode === 'idle') {
            offset += PASSIVE * dt;
        } else if (mode === 'spinning') {
            if (spin.start === null) spin.start = now;
            const t = Math.max(0, (now - spin.start) / 1000);
            if (t >= TOTAL_TIME) {
                offset = spin.target;
                finish();
            } else {
                offset = spin.from + travelled(t);
            }
        }

        render();
        requestAnimationFrame(frame);
    }

    spinBtn.addEventListener('click', startSpin);
    render();
    requestAnimationFrame(frame);
})();