/*
 * Rand_Play: сторінка зміни пароля (ДЕМОНСТРАЦІЯ).
 * Токена з листа немає, сервера немає: пароль нікуди не надсилається і не зберігається.
 */
(function () {
    'use strict';

    var V = window.RandPlayValidation;
    var form = document.getElementById('resetForm');
    if (!V || !form) return;

    var statusEl = document.getElementById('reset-status');
    var announcementEl = document.getElementById('reset-announcement');
    var announceTimeout = null;
    function announce(text) {
        if (!announcementEl) return;
        clearTimeout(announceTimeout);
        announcementEl.textContent = '';
        announceTimeout = setTimeout(function () { announcementEl.textContent = tr(text); }, 60);
    }
    var fields = {
        password: { input: document.getElementById('reset-password'), error: document.getElementById('reset-passwordError'), touched: false },
        confirm: { input: document.getElementById('reset-confirm'), error: document.getElementById('reset-confirmError'), touched: false }
    };

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

    var rules = {
        password: function () {
            var v = fields.password.input.value;
            if (v === '') return 'Enter a new password.';
            if (!V.isValidPassword(v)) {
                return 'Use ' + V.PASSWORD_MIN + '–' + V.PASSWORD_MAX + ' characters with at least one letter and one digit.';
            }
            return '';
        },
        confirm: function () {
            var v = fields.confirm.input.value;
            if (v === '') return 'Repeat the new password.';
            if (v !== fields.password.input.value) return 'Passwords do not match.';
            return '';
        }
    };

    function checkField(name) {
        var message = rules[name]();
        if (message) showError(fields[name], message); else showSuccess(fields[name]);
        return message === '';
    }

    Object.keys(fields).forEach(function (name) {
        fields[name].input.addEventListener('input', function () {
            fields[name].touched = true;
            if (name === 'password' && fields.confirm.touched) checkField('confirm');
            checkField(name);
        });
        fields[name].input.addEventListener('blur', function () {
            if (fields[name].input.value !== '' || fields[name].touched) {
                fields[name].touched = true;
                checkField(name);
                var error = rules[name]();
                if (error) announce(error);
            }
        });
    });

    window.addEventListener('randplay:languagechange', function () {
        Object.keys(fields).forEach(function (name) { if (fields[name].touched) checkField(name); });
        if (!statusEl.classList.contains('hidden')) statusEl.textContent = tr('Demo: the new password passed validation. No server is connected, nothing was saved.');
        if (announcementEl) announcementEl.textContent = '';
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var firstInvalid = null;
        Object.keys(fields).forEach(function (name) {
            fields[name].touched = true;
            if (!checkField(name) && !firstInvalid) firstInvalid = fields[name].input;
        });

        if (firstInvalid) {
            statusEl.classList.add('hidden');
            firstInvalid.focus();
            announce('Please correct this field: ' + (firstInvalid.labels && firstInvalid.labels[0] ? firstInvalid.labels[0].textContent.trim() : ''));
            return;
        }

        form.reset();
        Object.keys(fields).forEach(function (name) {
            fields[name].touched = false;
            clearError(fields[name]);
        });
        statusEl.textContent = tr('Demo: the new password passed validation. No server is connected, nothing was saved.');
        announce('Demo: the new password passed validation. No server is connected, nothing was saved.');
        statusEl.classList.remove('hidden');
    });
})();
