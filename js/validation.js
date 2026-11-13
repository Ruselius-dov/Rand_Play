/*
 * Rand_Play: спільні правила валідації (ЛР №9).
 * Підключається перед auth.js.
 * Валідація на клієнті — лише UX, безпеку вона не забезпечує:
 * дані нікуди не надсилаються, сервера немає.
 */
(function () {
    'use strict';

    /* ==========================================================
     * 1. Спільні helper-и (використовує js/auth.js)
     * ========================================================== */

    // local@domain.tld: без пробілів, зона не коротша за 2 літери
    var REGEX_EMAIL = /^[A-Za-z0-9_%+-]+(?:[A-Za-z0-9._%+-]*[A-Za-z0-9_%+-])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

    // Телефон: +380 і рівно 9 цифр, без пробілів, дужок і дефісів
    var REGEX_PHONE = /^\+380\d{9}$/;

    // Роздільники в номері: пробіли, дужки, дефіси, типографські дефіси (U+2010–U+2015) і мінус (U+2212)
    var REGEX_SEPARATORS = /[\s()\-\u2010-\u2015\u2212]/;
    var REGEX_SEPARATORS_ALL = /[\s()\-\u2010-\u2015\u2212]/g;

    // Пароль: 8–64 символи, хоча б одна літера і одна цифра
    var PASSWORD_MIN = 8;
    var PASSWORD_MAX = 64;
    var REGEX_LETTER = /[A-Za-z\u0400-\u04FF]/;
    var REGEX_DIGIT = /\d/;

    // Максимальна довжина email (RFC 5321). Спільна для форми зворотного зв’язку і панелі авторизації.
    var EMAIL_MAX = 254;

    function isValidEmail(value) {
        var v = String(value).trim();
        return v.length <= EMAIL_MAX && v.split('@')[0].length <= 64 && !v.includes('..') && REGEX_EMAIL.test(v);
    }

    function isValidPassword(value) {
        var v = String(value);
        return v.length >= PASSWORD_MIN && v.length <= PASSWORD_MAX &&
            REGEX_LETTER.test(v) && REGEX_DIGIT.test(v);
    }

    /* ==========================================================
     * 2. Правила форми зворотного зв’язку (етап 7)
     * Кожна validateX повертає '' (все гаразд) або текст помилки.
     * ========================================================== */

    var NAME_MIN = 2;
    var NAME_MAX = 50;
    var MESSAGE_MIN = 10;
    var MESSAGE_MAX = 1000;
    var PHONE_DIGITS = 9;
    var REGEX_NAME = /^[\p{L}\p{M}]+(?:[ '\u2019\-\u2010-\u2015][\p{L}\p{M}]+)*$/u;
    function countCharacters(value) {
        var text = String(value);
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
            return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)).length;
        }
        return Array.from(text).length; // older browsers: code-point fallback
    }
    function tr(text) { return window.RandPlayI18n ? window.RandPlayI18n.t(text) : text; }

    function validateName(value) {
        var v = String(value).trim();
        if (v === '') return 'Введіть ім’я.';
        if (countCharacters(v) < NAME_MIN) return 'Ім’я має містити щонайменше ' + NAME_MIN + ' символи.';
        if (countCharacters(v) > NAME_MAX) return 'Ім’я має містити не більше ' + NAME_MAX + ' символів.';
        if (!REGEX_NAME.test(v)) return 'Ім’я може містити лише літери, пробіли, апострофи та дефіси.';
        return '';
    }

    function validateEmail(value) {
        var v = String(value).trim();
        if (v === '') return 'Введіть електронну пошту.';
        if (!isValidEmail(v)) {
            return 'Введіть коректну пошту, наприклад user@gmail.com.';
        }
        return '';
    }

    // Телефон необов’язковий: порожнє поле не є помилкою.
    // Повідомлення залежать від того, що саме не так (етап 9).
    function validatePhone(value) {
        var v = String(value).trim();
        if (v === '') return '';
        if (REGEX_PHONE.test(v)) return '';

        if (/[A-Za-z\u0400-\u04FF]/.test(v)) {
            return 'Номер не може містити літери. Формат: +380XXXXXXXXX.';
        }
        if (REGEX_SEPARATORS.test(v)) {
            return 'Приберіть пробіли, дужки й дефіси. Формат: +380XXXXXXXXX.';
        }
        if (/^\+380\d*$/.test(v)) {
            var after = v.length - 4;
            if (after < PHONE_DIGITS) {
                return 'Після +380 має бути рівно ' + PHONE_DIGITS + ' цифр, зараз ' + after +
                    '. Не вистачає ' + (PHONE_DIGITS - after) + '.';
            }
            return 'Після +380 має бути рівно ' + PHONE_DIGITS + ' цифр, зараз ' + after +
                '. Приберіть зайві.';
        }
        if (v.charAt(0) !== '+') {
            return 'Номер має починатися з +380. Формат: +380XXXXXXXXX.';
        }
        return 'Введіть номер у форматі +380XXXXXXXXX.';
    }

    // Пропозиція виправлення (етап 9). НЕ змінює поле сама:
    // користувач підтверджує натисканням кнопки. null, якщо безпечно виправити не можна.
    function suggestPhone(value) {
        var compact = String(value).trim().replace(REGEX_SEPARATORS_ALL, '');
        if (REGEX_PHONE.test(compact)) return compact;               // +380 50 123 45 67
        if (/^380\d{9}$/.test(compact)) return '+' + compact;        // 380501234567
        if (/^0\d{9}$/.test(compact)) return '+38' + compact;        // 0501234567
        return null;
    }

    function validateMessage(value) {
        var v = String(value).trim();
        if (v === '') return 'Введіть повідомлення.';
        if (countCharacters(v) < MESSAGE_MIN) return 'Повідомлення має містити щонайменше ' + MESSAGE_MIN + ' символів.';
        if (countCharacters(v) > MESSAGE_MAX) return 'Повідомлення має містити не більше ' + MESSAGE_MAX + ' символів.';
        return '';
    }

    function validateAgreement(checked) {
        return checked ? '' : 'Підтвердіть згоду на обробку даних.';
    }

    // Return localized messages from the existing public validation functions.
    var baseValidateName = validateName, baseValidateEmail = validateEmail;
    var baseValidatePhone = validatePhone, baseValidateMessage = validateMessage;
    var baseValidateAgreement = validateAgreement;
    validateName = function (v) { return tr(baseValidateName(v)); };
    validateEmail = function (v) { return tr(baseValidateEmail(v)); };
    validatePhone = function (v) { return tr(baseValidatePhone(v)); };
    validateMessage = function (v) { return tr(baseValidateMessage(v)); };
    validateAgreement = function (v) { return tr(baseValidateAgreement(v)); };

    /* ==========================================================
     * 3. UI-стани полів (етап 4)
     * Усі Tailwind-класи — повними літеральними рядками.
     * ========================================================== */

    var CLASSES_NORMAL = ['border-zinc-500', 'hover:border-muted', 'focus:border-neon'];
    var CLASSES_ERROR = ['border-ruby', 'hover:border-ruby', 'focus:border-ruby'];
    var CLASSES_SUCCESS = ['border-neon', 'hover:border-neon', 'focus:border-neon'];

    // Success не лише кольором: під полем з’являється короткий текст «✓ …».
    // Абзац спільний із помилкою; у success він aria-hidden (стан уже в aria-invalid).
    var OK_TEXT = {
        username: '✓ Коректно',
        email: '✓ Коректно',
        phone: '✓ Номер коректний',
        message: '✓ Коректно',
        agreement: '✓ Згоду надано'
    };

    function setDescribedBy(field, withError) {
        var ids = field.baseDescribedBy.slice();
        if (withError) ids.push(field.error.id);
        if (ids.length) field.input.setAttribute('aria-describedby', ids.join(' '));
        else field.input.removeAttribute('aria-describedby');
    }

    function swapBorder(field, remove, add) {
        if (field.isCheckbox) return; // у чекбокса немає рамки-стану (accent-neon)
        field.input.classList.remove.apply(field.input.classList, remove);
        field.input.classList.add.apply(field.input.classList, add);
    }

    function showError(field, message) {
        swapBorder(field, CLASSES_NORMAL.concat(CLASSES_SUCCESS), CLASSES_ERROR);
        field.input.setAttribute('aria-invalid', 'true');
        field.error.textContent = message; // textContent: HTML у тексті не виконується
        field.error.classList.remove('hidden', 'text-neon');
        field.error.classList.add('text-rose-400');
        field.error.removeAttribute('aria-hidden');
        setDescribedBy(field, true);
    }

    function showSuccess(field) {
        swapBorder(field, CLASSES_NORMAL.concat(CLASSES_ERROR), CLASSES_SUCCESS);
        field.input.setAttribute('aria-invalid', 'false');
        field.error.textContent = tr(OK_TEXT[field.key] || '✓');
        field.error.classList.remove('hidden', 'text-rose-400');
        field.error.classList.add('text-neon');
        field.error.setAttribute('aria-hidden', 'true');
        setDescribedBy(field, false);
    }

    function clearError(field) {
        swapBorder(field, CLASSES_ERROR.concat(CLASSES_SUCCESS), CLASSES_NORMAL);
        field.input.setAttribute('aria-invalid', 'false');
        field.error.textContent = '';
        field.error.classList.add('hidden');
        field.error.classList.remove('text-neon');
        field.error.classList.add('text-rose-400');
        field.error.removeAttribute('aria-hidden');
        setDescribedBy(field, false);
    }

    /* ==========================================================
     * 4. Форма #feedbackForm: поля, події, submit, модальне вікно
     * ========================================================== */

    var FIELD_KEYS = ['username', 'email', 'phone', 'message', 'agreement'];

    var feedbackFields = {};
    var form = null;
    var submitBtn = null;
    var counter = null;
    var phoneFix = null;
    var modal = null;
    var dialog = null;
    var modalClose = null;
    var modalOpen = false;
    var statusRegion = null;

    var FIELD_LABELS = {
        username: "Ім’я",
        email: 'Email',
        phone: 'Телефон',
        message: 'Повідомлення',
        agreement: 'Згода'
    };

    function registerField(key) {
        var input = document.getElementById(key);
        var error = document.getElementById(key + 'Error');
        if (!input || !error) return null;

        // id підказок/лічильника лишаються в aria-describedby, id помилки додає JS
        var base = (input.getAttribute('aria-describedby') || '')
            .split(/\s+/)
            .filter(function (id) { return id !== '' && id !== error.id; });

        return {
            key: key,
            input: input,
            error: error,
            baseDescribedBy: base,
            isCheckbox: input.type === 'checkbox',
            touched: false // true після першого blur / change / спроби submit
        };
    }

    // Повідомлення про помилку для поля ('' = коректно або порожній необов’язковий)
    function getMessage(field) {
        var input = field.input;
        switch (field.key) {
            case 'username': return validateName(input.value);
            case 'email': return validateEmail(input.value);
            case 'phone': return validatePhone(input.value);
            case 'message': return validateMessage(input.value);
            case 'agreement': return validateAgreement(input.checked);
        }
        return '';
    }

    // Повідомлення для скрінрідера (aria-live="polite"). Порожній рядок спочатку,
    // потім текст з паузою: так однаковий текст озвучується повторно.
    var announceTimer = null;
    function announce(text) {
        if (!statusRegion) return;
        window.clearTimeout(announceTimer);
        statusRegion.textContent = '';
        announceTimer = window.setTimeout(function () { statusRegion.textContent = text; }, 60);
    }

    // Необов’язковий порожній телефон не отримує ні помилки, ні success
    function isEmptyOptional(field) {
        return field.key === 'phone' && field.input.value.trim() === '';
    }

    function updatePhoneFix(message) {
        if (!phoneFix) return;
        var suggestion = message ? suggestPhone(feedbackFields.phone.input.value) : null;
        if (suggestion) {
            // Озвучуємо лише появу нової пропозиції, а не кожне натискання клавіші
            if (phoneFix.dataset.value !== suggestion) {
                announce(tr('Є пропозиція виправлення: підставити ' + suggestion +
                    '. Натисніть Tab, щоб перейти до кнопки.'));
            }
            phoneFix.textContent = tr('Підставити ' + suggestion);
            phoneFix.dataset.value = suggestion;
            phoneFix.classList.remove('hidden');
            phoneFix.classList.add('flex');
        } else {
            phoneFix.textContent = '';
            phoneFix.dataset.value = '';
            phoneFix.classList.remove('flex');
            phoneFix.classList.add('hidden');
        }
    }

    // showErrors = false: до першого blur показуємо лише успіх, помилку не показуємо
    function renderField(field, showErrors) {
        var message = getMessage(field);
        if (isEmptyOptional(field)) {
            clearError(field);
        } else if (message === '') {
            showSuccess(field);
        } else if (showErrors) {
            showError(field, message);
        } else {
            clearError(field);
        }
        // Пропозицію виправлення показуємо одразу (не чекаємо blur), щоб до кнопки
        // можна було дійти клавішею Tab з поля телефону
        if (field.key === 'phone') updatePhoneFix(message);
        return message === '';
    }

    function updateCounter() {
        var m = feedbackFields.message;
        if (counter && m) counter.textContent = tr(countCharacters(m.input.value) + ' / ' + MESSAGE_MAX + ' символів');
    }

    function onInput(field) {
        if (field.key === 'message') updateCounter();
        renderField(field, false);
    }

    function onBlur(field) {
        field.touched = true;
        if (!renderField(field, true)) {
            announce(tr(FIELD_LABELS[field.key]) + ': ' + getMessage(field));
        }
    }

    var invalidCount = 0;

    function validateAll() {
        var firstInvalid = null;
        invalidCount = 0;
        FIELD_KEYS.forEach(function (key) {
            var field = feedbackFields[key];
            if (!field) return;
            field.touched = true;
            if (!renderField(field, true)) {
                invalidCount += 1;
                if (!firstInvalid) firstInvalid = field;
            }
        });
        return firstInvalid;
    }

    function resetFormUI() {
        form.reset();
        FIELD_KEYS.forEach(function (key) {
            var field = feedbackFields[key];
            if (!field) return;
            field.touched = false;
            clearError(field);
        });
        updatePhoneFix('');
        updateCounter();
    }

    /* ---------- модальне вікно успіху (етап 10) ---------- */

    // Фон (шапка, main, футер) недоступний для Tab і скрінрідерів, поки вікно відкрите.
    // Скрол сторінки це не блокує (свідомо: overflow-hidden на body ламає sticky).
    function setBackgroundInert(on) {
        ['header', 'main', 'footer'].forEach(function (tag) {
            var el = document.querySelector(tag);
            if (el) el.inert = on;
        });
    }

    function openModal() {
        modalOpen = true;
        setBackgroundInert(true);
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modalClose.focus();
    }

    function closeModal() {
        if (!modalOpen) return;
        modalOpen = false;
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        setBackgroundInert(false); // спершу знімаємо inert, інакше фокус не повернеться
        submitBtn.focus(); // повертаємо фокус на кнопку, що відкрила вікно
    }

    function onDocumentKeydown(event) {
        if (!modalOpen) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
        } else if (event.key === 'Tab') {
            // У вікні одна кнопка: утримуємо фокус усередині
            event.preventDefault();
            modalClose.focus();
        }
    }

    function onModalClick(event) {
        // Закриваємо лише клік по затемненню; клік усередині картки не закриває
        if (event.target === modal) closeModal();
    }

    /* ---------- submit ---------- */

    function onSubmit(event) {
        event.preventDefault();
        if (modalOpen) return; // захист від повторного submit

        var firstInvalid = validateAll();
        if (firstInvalid) {
            firstInvalid.input.focus();
            announce(tr('Форму не надіслано. Полів з помилками: ' + invalidCount + '.'));
            return;
        }
        // Імітація: нічого не надсилаємо
        resetFormUI();
        if (modal && dialog && modalClose && submitBtn) openModal();
    }

    function onPhoneFixClick() {
        var value = phoneFix.dataset.value;
        var field = feedbackFields.phone;
        if (!value || !field) return;
        field.input.value = value; // змінюємо лише за явною дією користувача
        field.touched = true;
        renderField(field, true);
        field.input.focus();
    }

    function initFeedbackForm() {
        form = document.getElementById('feedbackForm');
        if (!form) return; // на reset-password.html форми немає

        submitBtn = document.getElementById('feedbackSubmit');
        counter = document.getElementById('messageCounter');
        phoneFix = document.getElementById('phoneFix');
        modal = document.getElementById('successModal');
        statusRegion = document.getElementById('feedbackStatus');
        dialog = document.getElementById('successDialog');
        modalClose = document.getElementById('successModalClose');

        FIELD_KEYS.forEach(function (key) {
            var field = registerField(key);
            if (!field) return;
            feedbackFields[key] = field;

            if (field.isCheckbox) {
                field.input.addEventListener('change', function () { onBlur(field); });
            } else {
                field.input.addEventListener('input', function () { onInput(field); });
            }
            field.input.addEventListener('blur', function () { onBlur(field); });
        });

        form.addEventListener('submit', onSubmit);
        if (phoneFix) phoneFix.addEventListener('click', onPhoneFixClick);

        if (modal && dialog && modalClose && submitBtn) {
            modalClose.addEventListener('click', closeModal);
            modal.addEventListener('click', onModalClick);
            document.addEventListener('keydown', onDocumentKeydown);
        }
        updateCounter();
        window.addEventListener('randplay:languagechange', function () {
            FIELD_KEYS.forEach(function (key) {
                var field = feedbackFields[key];
                if (field) renderField(field, field.touched);
            });
            updateCounter();
            if (statusRegion) statusRegion.textContent = '';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFeedbackForm);
    } else {
        initFeedbackForm();
    }

    window.RandPlayValidation = {
        REGEX_EMAIL: REGEX_EMAIL,
        REGEX_PHONE: REGEX_PHONE,
        PASSWORD_MIN: PASSWORD_MIN,
        PASSWORD_MAX: PASSWORD_MAX,
        isValidEmail: isValidEmail,
        isValidPassword: isValidPassword,
        validateName: validateName,
        validateEmail: validateEmail,
        validatePhone: validatePhone,
        validateMessage: validateMessage,
        validateAgreement: validateAgreement,
        suggestPhone: suggestPhone,
        countCharacters: countCharacters,
        announce: announce,
        feedback: {
            fields: feedbackFields,
            showError: showError,
            showSuccess: showSuccess,
            clearError: clearError
        }
    };
})();
