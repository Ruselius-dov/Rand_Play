/*
 * Rand_Play: панель Sign in / Sign up на екрані монітора (hero).
 * Це ДЕМОНСТРАЦІЯ: сервера немає, дані нікуди не надсилаються і не зберігаються.
 * Усі Tailwind-класи, які додає/знімає JS, записані повними літеральними рядками.
 */
(function () {
    'use strict';

    var V = window.RandPlayValidation;
    var openBtn = document.getElementById('btn-auth-open');
    var panel = document.getElementById('auth-panel');
    var stage = document.getElementById('stage');
    var heroScreen = document.querySelector('#hero .crt-screen');
    var heroContent = document.querySelector('#hero .screen-content');
    if (!V || !openBtn || !panel || !stage || !heroScreen || !heroContent) return;

    var form = document.getElementById('authForm');
    var tabs = {
        signin: document.getElementById('tab-signin'),
        signup: document.getElementById('tab-signup')
    };
    var confirmGroup = document.getElementById('auth-confirm-group');
    var forgotWrap = document.getElementById('auth-forgot-wrap');
    var forgotBtn = document.getElementById('auth-forgot');
    var backBtn = document.getElementById('auth-back');
    var statusEl = document.getElementById('auth-status');
    var announcementEl = document.getElementById('auth-announcement');
    var announceTimeout = null;
    function announce(text) {
        if (!announcementEl) return;
        clearTimeout(announceTimeout);
        announcementEl.textContent = '';
        announceTimeout = setTimeout(function () { announcementEl.textContent = tr(text); }, 60);
    }

    var fields = {
        email: { input: document.getElementById('auth-email'), error: document.getElementById('auth-emailError'), touched: false },
        password: { input: document.getElementById('auth-password'), error: document.getElementById('auth-passwordError'), touched: false },
        confirm: { input: document.getElementById('auth-confirm'), error: document.getElementById('auth-confirmError'), touched: false }
    };

    var mode = 'signin';
    var emailPreview = null;

    /* ---------- UI: стани поля ---------- */

    function tr(message) { return window.RandPlayI18n ? window.RandPlayI18n.t(message) : message; }

    function showError(field, message) {
        field.input.classList.remove('border-navy/60', 'hover:border-navy', 'focus:border-navy', 'border-navy');
        field.input.classList.add('border-ruby', 'hover:border-ruby', 'focus:border-ruby');
        field.input.setAttribute('aria-invalid', 'true');
        field.error.textContent = tr(message);
        field.error.classList.remove('hidden');
    }

    function showSuccess(field) {
        field.input.classList.remove('border-ruby', 'hover:border-ruby', 'focus:border-ruby', 'border-navy/60');
        field.input.classList.add('border-navy');
        field.input.setAttribute('aria-invalid', 'false');
        field.error.textContent = '';
        field.error.classList.add('hidden');
    }

    function clearError(field) {
        field.input.classList.remove('border-ruby', 'hover:border-ruby', 'focus:border-ruby', 'border-navy');
        field.input.classList.add('border-navy/60', 'hover:border-navy', 'focus:border-navy');
        field.input.setAttribute('aria-invalid', 'false');
        field.error.textContent = '';
        field.error.classList.add('hidden');
    }

    /* ---------- правила ---------- */

    function emailMessage() {
        var v = fields.email.input.value.trim();
        if (v === '') return 'Enter your email.';
        if (!V.isValidEmail(v)) return 'Enter a valid email, e.g. user@gmail.com.';
        return '';
    }

    function passwordMessage() {
        var v = fields.password.input.value;
        if (v === '') return 'Enter your password.';
        // при вході перевіряємо лише наявність: правила складності — для реєстрації
        if (mode === 'signup' && !V.isValidPassword(v)) {
            return 'Use ' + V.PASSWORD_MIN + '–' + V.PASSWORD_MAX + ' characters with at least one letter and one digit.';
        }
        return '';
    }

    function confirmMessage() {
        if (mode !== 'signup') return '';
        var v = fields.confirm.input.value;
        if (v === '') return 'Repeat your password.';
        if (v !== fields.password.input.value) return 'Passwords do not match.';
        return '';
    }

    var rules = { email: emailMessage, password: passwordMessage, confirm: confirmMessage };

    function checkField(name) {
        var field = fields[name];
        var message = rules[name]();
        if (message) showError(field, message); else showSuccess(field);
        return message === '';
    }

    // Помилка з'являється лише після взаємодії з полем
    function onInput(name) {
        fields[name].touched = true;
        if (name === 'password' && mode === 'signup' && fields.confirm.touched) checkField('confirm');
        checkField(name);
    }

    function activeFields() {
        return mode === 'signup' ? ['email', 'password', 'confirm'] : ['email', 'password'];
    }

    /* ---------- повідомлення ---------- */

    function setStatus(text) {
        statusEl.textContent = tr(text);
        statusEl.classList.toggle('hidden', text === '');
    }

    function removeEmailPreview() {
        if (emailPreview) {
            emailPreview.remove();
            emailPreview = null;
        }
    }

    function resetForm() {
        form.reset();
        Object.keys(fields).forEach(function (name) {
            fields[name].touched = false;
            clearError(fields[name]);
        });
        setStatus('');
        removeEmailPreview();
    }

    /* ---------- режими ---------- */

    function setMode(next, moveFocus) {
        mode = next;
        panel.dataset.mode = next;
        var isSignup = next === 'signup';

        tabs.signin.setAttribute('aria-selected', String(!isSignup));
        tabs.signup.setAttribute('aria-selected', String(isSignup));
        tabs.signin.tabIndex = isSignup ? -1 : 0;
        tabs.signup.tabIndex = isSignup ? 0 : -1;
        form.setAttribute('aria-labelledby', isSignup ? 'tab-signup' : 'tab-signin');

        confirmGroup.classList.toggle('hidden', !isSignup);
        forgotWrap.classList.toggle('hidden', isSignup);
        fields.password.input.setAttribute('autocomplete', isSignup ? 'new-password' : 'current-password');

        resetForm();
        if (moveFocus) tabs[next].focus();
    }

    /* ---------- відкриття / закриття ----------
       Перехід такий самий, як між hero і столом: екран "вимикається" (crt-off),
       вміст змінюється, екран "вмикається" (crt-reon). Тривалості беруться зі
       CSS-змінних --t-off / --t-on на #stage (при prefers-reduced-motion вони майже нульові). */

    var transitioning = false;

    function cssTime(name) {
        var v = getComputedStyle(stage).getPropertyValue(name).trim();
        var n = parseFloat(v) || 0;
        return v.slice(-2) === 'ms' ? n : n * 1000;
    }

    function wait(ms) {
        return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    function swapScreen(change) {
        transitioning = true;
        heroContent.inert = true; // під час переходу кнопки hero недоступні
        heroScreen.classList.remove('crt-on', 'crt-reon');
        heroScreen.classList.add('crt-off');

        return wait(cssTime('--t-off')).then(function () {
            change();
            heroScreen.classList.remove('crt-off');
            heroScreen.classList.add('crt-reon');
            window.dispatchEvent(new Event('resize')); // stage.js перераховує камеру
            return wait(cssTime('--t-on'));
        }).then(function () {
            transitioning = false;
        });
    }

    function isOpen() {
        return !panel.classList.contains('hidden');
    }

    function openPanel() {
        if (transitioning || isOpen()) return;
        swapScreen(function () {
            setMode('signin', false);
            // !hidden = display:none !important: .screen-content має власне display:flex у style.css
            heroContent.classList.add('!hidden');
            panel.classList.remove('hidden');
            panel.classList.add('flex');
            openBtn.setAttribute('aria-expanded', 'true');
        }).then(function () {
            fields.email.input.focus();
        });
    }

    function closePanel() {
        if (transitioning || !isOpen()) return;
        swapScreen(function () {
            panel.classList.add('hidden');
            panel.classList.remove('flex');
            heroContent.classList.remove('!hidden');
            heroContent.inert = false;
            openBtn.setAttribute('aria-expanded', 'false');
            resetForm();
        }).then(function () {
            heroContent.inert = false;
            openBtn.focus();
        });
    }

    /* ---------- імітація "forgot password" ---------- */

    function showEmailPreview(address) {
        removeEmailPreview();

        var box = document.createElement('div');
        box.className = 'rounded-lg border border-navy/60 p-3 text-sm text-navy';

        var note = document.createElement('p');
        note.className = 'mb-2 font-semibold text-navy';
        note.textContent = tr('Demo only: no server is connected, so no email was sent. This is how the email would look:');

        var to = document.createElement('p');
        to.className = 'text-sm text-navy';
        to.textContent = tr('To: ' + address); // textContent: введення користувача не інтерпретується як HTML

        var body = document.createElement('p');
        body.className = 'my-2 text-sm text-navy';
        body.textContent = tr('We received a request to reset your Rand_Play password. Confirm it with the button below.');

        var link = document.createElement('a');
        link.href = 'reset-password.html';
        link.className = 'flex min-h-11 items-center justify-center rounded-xl bg-navy px-4 py-2 text-center font-heading text-base font-bold text-white transition duration-300 hover:bg-navy-light hover:text-white focus-visible:outline-navy motion-reduce:transition-none';
        link.textContent = tr('Reset password');

        box.append(note, to, body, link);
        statusEl.insertAdjacentElement('afterend', box);
        emailPreview = box;
        announce('Demo only: no server is connected, so no email was sent. This is how the email would look:');

        // На низьких екранах панель прокручується всередині: показуємо кнопку Reset password
        var overflow = link.getBoundingClientRect().bottom - panel.getBoundingClientRect().bottom;
        if (overflow > 0) panel.scrollTop += overflow + 8;
    }

    function onForgot() {
        fields.email.touched = true;
        if (!checkField('email')) {
            fields.email.input.focus();
            announce(emailMessage());
            return;
        }
        setStatus('');
        showEmailPreview(fields.email.input.value.trim());
    }

    /* ---------- submit ---------- */

    function onSubmit(event) {
        event.preventDefault(); // сторінка не перезавантажується, дані нікуди не йдуть
        removeEmailPreview();

        var firstInvalid = null;
        activeFields().forEach(function (name) {
            fields[name].touched = true;
            if (!checkField(name) && !firstInvalid) firstInvalid = fields[name].input;
        });

        if (firstInvalid) {
            setStatus('');
            firstInvalid.focus();
            announce('Please correct this field: ' + (firstInvalid.labels && firstInvalid.labels[0] ? firstInvalid.labels[0].textContent.trim() : ''));
            return;
        }

        var text = mode === 'signup'
            ? 'Demo: the sign up form passed validation. No server is connected, nothing was saved.'
            : 'Demo: the sign in form passed validation. No server is connected, nobody was signed in.';
        form.reset();
        Object.keys(fields).forEach(function (name) {
            fields[name].touched = false;
            clearError(fields[name]);
        });
        setStatus(text);
        announce(text);
    }

    /* ---------- події ---------- */

    openBtn.addEventListener('click', openPanel);
    backBtn.addEventListener('click', closePanel);
    forgotBtn.addEventListener('click', onForgot);
    form.addEventListener('submit', onSubmit);

    tabs.signin.addEventListener('click', function () { setMode('signin', false); });
    tabs.signup.addEventListener('click', function () { setMode('signup', false); });

    // Стрілки між вкладками (патерн WAI-ARIA tabs)
    [tabs.signin, tabs.signup].forEach(function (tab) {
        tab.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                setMode(mode === 'signin' ? 'signup' : 'signin', true);
            }
        });
    });

    Object.keys(fields).forEach(function (name) {
        var field = fields[name];
        field.input.addEventListener('input', function () {
            onInput(name); // перший введений символ уже вважається взаємодією
        });
        field.input.addEventListener('blur', function () {
            // blur без жодного введення не показує помилку
            if (field.input.value !== '' || field.touched) {
                onInput(name);
                var error = rules[name]();
                if (error) announce(error);
            }
        });
    });

    window.addEventListener('randplay:languagechange', function () {
        Object.keys(fields).forEach(function (name) {
            if (fields[name].touched) checkField(name);
        });
        var current = statusEl.textContent.trim();
        if (current) {
            // Status is always one of two known demo messages.
            setStatus(mode === 'signup'
                ? 'Demo: the sign up form passed validation. No server is connected, nothing was saved.'
                : 'Demo: the sign in form passed validation. No server is connected, nobody was signed in.');
        }
        if (emailPreview) showEmailPreview(fields.email.input.value.trim());
        if (announcementEl) announcementEl.textContent = '';
    });

    // Esc, який уже обробило вікно успіху форми (validation.js викликає preventDefault),
    // не має закривати ще й панель авторизації
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !e.defaultPrevented && isOpen()) closePanel();
    });
})();
