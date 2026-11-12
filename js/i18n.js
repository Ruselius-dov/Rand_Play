
/* Rand_Play bilingual UI. English is the default; only explicit UI strings are translated.
   Do not translate user input, JSON-LD, code examples, or URLs. */
(function () {
    'use strict';
    var pairs = [
        // Common navigation, hero and authentication
        ['Home','Головна'], ['Features','Переваги'], ['Games','Ігри'], ['Contacts','Контакти'],
        ['LIVE SYSTEM','СИСТЕМА АКТИВНА'], ['Sign in and sign up','Вхід і реєстрація'],
        ['Sign in','Увійти'], ['Sign up','Зареєструватися'], ['Email','Електронна пошта'],
        ['Password','Пароль'], ['Confirm password','Підтвердіть пароль'], ['Enter','Продовжити'],
        ['Forgot your password?','Забули пароль?'], ['← return to the main screen','← повернутися на головний екран'],
        ['RANDOMIZE YOUR BREAK','ЗРОБИ ПЕРЕРВУ ВИПАДКОВОЮ'], ['Zero Scrolling.','Жодного гортання.'],
        ['Only one click for your perfect game.','Лише один клік до твоєї ідеальної гри.'],
        ['Spin the Roulette','Крутити рулетку'], ['Sign in | Sign up','Увійти | Зареєструватися'],
        ['← return','← повернутися'], ['Press the button','Натисни кнопку'],
        ['Choose genre','Обери жанр'],
        ['Less Choosing.','Менше вибору.'], ['More Gaming.','Більше гри.'],
        ['Provably Fair','Перевірна чесність'], ['Cloud Autosave','Хмарне автозбереження'],
        ['0-friction Instant Play','Миттєвий старт без перешкод'],
        // Existing Ukrainian content: English defaults
        ['Відкритий Seed 1/N та захист від повторів.','Open seed 1/N and protection from repeats.'],
        ['Збереження та архівація рекордів у хмарі.','Your records are saved and archived in the cloud.'],
        ['Без реєстрації. Просто натисни червону кнопку.','No registration. Just press the red button.'],
        ['Рандомайзер ігор онлайн:','Online game randomizer:'],
        ['як це працює','how it works'],
        ['Натисни Spin','Press Spin'],
        ['Один клік по великій червоній кнопці — і рулетка починає крутитися.','One click on the big red button starts the roulette.'],
        ['Рулетка обирає гру','The roulette picks a game'],
        ['Гра обирається з пулу випадково. За бажанням пул можна звузити до улюбленого жанру.','A game is selected at random. You can narrow the pool to your favorite genre.'],
        ['Грай у браузері','Play in your browser'],
        ['Гра запускається у вкладці браузера, а прогрес зберігається в хмарі.','The game opens in a browser tab, and progress is saved to the cloud.'],
        ['Рулетка випадкових ігор онлайн','Online random game roulette'], ['у дії','in action'],
        ['Замість тисяч однотипних сторінок — один клік.','One click instead of thousands of repetitive pages.'],
        ['Чому ми: браузерні ігри','Why us: browser games'], ['без параличу вибору','without decision paralysis'],
        ['Знайомий сценарій: у тебе є 20 хвилин на перерву, ти відкриваєш каталог ігор — і витрачаєш увесь час на нескінченний скролінг. Коли нарешті щось знаходиш, перерва вже скінчилась.','Sound familiar? You have 20 minutes for a break, open a game catalog, and waste the whole time scrolling. By the time you find something, your break is over.'],
        ['Замість тисяч однотипних сторінок — один клік. Звужуй пул до улюблених Puzzle або одразу тисни Spin. Ми перетворили пошук на азартний кейс-опенінг, після якого ти одразу потрапляєш у гру.','One click instead of thousands of repetitive pages. Narrow the pool to Puzzle games or hit Spin right away. We turn discovery into an exciting roulette that takes you straight into a game.'],
        ['Знайомий сценарій: у тебе є 20 хвилин на перерву, ти відкриваєш каталог ігор — і витрачаєш увесь час на нескінченний скролінг. Коли нарешті щось знаходиш, перерва вже закінчилася. Ми створили цю платформу, щоб назавжди прибрати «параліч вибору».','Sound familiar? You have 20 minutes for a break, open the game catalog, and spend all that time scrolling. By the time you find something, your break is over. We built this platform to end decision paralysis.'],
        ['Замість тисяч однотипних сторінок — один клік. Звужуй пул до улюблених Puzzle або одразу тисни Spin. Ми перетворили пошук на азартний кейс-опенінг, після якого гра миттєво запускається у вкладці браузера навіть без реєстрації.','One click instead of thousands of repetitive pages. Narrow the pool to Puzzle games or hit Spin. We turn discovery into a game of chance that launches instantly in your browser, even without registering.'],
        ['Твій прогрес також у безпеці: хмарний автосейв миттєво фіксує кожен рівень. Навіть якщо вирішиш почати гру з нуля, ми не зітремо старий рекорд, а дбайливо перенесемо його в твій архів історії.','Your progress is protected too: cloud autosave tracks every level. If you decide to restart, your previous record remains in your history.'],
        ['© 2026 Rand_Play. Всі права захищено.','© 2026 Rand_Play. All rights reserved.'],
        ['Чому нашому алгоритму довіряють?','Why trust our algorithm?'],
        ['Тут немає прихованого просування чи зациклень. Система автоматично знижує шанс випадіння ігор, які ти вже бачив, а чесність кожного спіну можна перевірити за секунду через відкритий криптографічний Seed.','No hidden promotions or endless repeats. The system reduces the likelihood of games you have already seen, and each spin can be checked with an open cryptographic seed.'],
        ['Твій прогрес також у безпеці: хмарний автосейв миттєво фіксує кожен рівень. Навіть якщо вирішиш почати гру з нуля, ми не зітремо старий рекорд, а дбайливо перенесемо його в архів історії.','Your progress is protected, too: cloud autosave records each level. Even if you restart, your previous record is preserved in your history.'],
        ['Ми забрали на себе муки вибору. Тобі залишився чистий геймплей.','We take care of choosing so you can focus on playing.'],
        ['Приєднуйся до Discord','Join us on Discord'],
        ['Часті питання:','Frequently asked questions:'], ['грати в ігри без реєстрації','play without registering'],
        ['Чи потрібна реєстрація, щоб почати грати?','Do I need to register to start playing?'],
        ['Ні. Гра миттєво запускається у вкладці браузера навіть без реєстрації — Guest-mode, 100% безкоштовно і без жодних завантажень.','No. Games open directly in your browser, even as a guest. It is free and requires no downloads.'],
        ['Чи можна обрати улюблений жанр?','Can I choose my favorite genre?'],
        ['Так. Можна звузити пул до улюблених Puzzle або одразу натиснути Spin.','Yes. Narrow the selection to Puzzle games, or press Spin immediately.'],
        ['Як перевірити чесність спіну?','How can I verify a spin is fair?'],
        ['Чесність кожного спіну можна перевірити за секунду через відкритий криптографічний Seed.','Each spin can be checked using an open cryptographic seed.'],
        ['Чи будуть ігри повторюватися?','Will games repeat?'],
        ['Система автоматично знижує шанс випадіння ігор, які ти вже бачив. Прихованого просування чи зациклень немає.','The system reduces the chance of showing games you have already seen. No hidden promotions or endless loops.'],
        ['Що буде з моїм прогресом і рекордом?','What happens to my progress and records?'],
        ['Хмарний автосейв миттєво фіксує кожен рівень. Якщо почати гру з нуля, старий рекорд не стирається — його переносять в архів історії.','Cloud autosave tracks your progress. If you restart, your previous record is kept in your history.'],
        ['У що пограти, коли нудно?','What should I play when I am bored?'],
        ['Просто натисни Spin','Just press Spin'], ['Крутити рулетку зараз','Spin the roulette now'],
        ['Обрати улюблений жанр','Choose a favorite genre'],
        ['Миттєвий старт у Guest-mode • 100% безкоштовно • Жодних завантажень','Instant guest access • 100% free • No downloads'],
        // Feedback form and modal
        ['Зворотний','Contact'], ['зв’язок','form'],
        ['Усі поля, крім телефону, обов’язкові.','All fields except phone are required.'],
        ['Ім’я','Name'], ['Телефон (необов’язково)','Phone (optional)'],
        ['Формат: +380XXXXXXXXX, без пробілів і дужок','Format: +380XXXXXXXXX, without spaces or parentheses'],
        ['Повідомлення','Message'], ['Я погоджуюсь на обробку моїх даних','I agree to the processing of my data'],
        ['Надіслати','Submit'], ['0 / 1000 символів','0 / 1000 characters'],
        ['Контакти','Contacts'], ['Печера Тамплієрів','Templars Cave'],
        ['Всі права захищено.','All rights reserved.'],
        ['Info','Інформація'], ['Privacy Policy','Політика конфіденційності'], ['FAQ','Поширені запитання'],
        ['Валідація пройдена','Validation passed'],
        ['Форма успішно пройшла клієнтську валідацію. Демонстрація, дані нікуди не надсилаються.','The form passed client-side validation. Demo only: no data was sent.'],
        ['Закрити','Close'],
        ['Reset password','Скидання пароля'], ['Reset password | Rand_Play','Скидання пароля | Rand_Play'], ['Demo page: nothing is saved anywhere.','Демонстраційна сторінка: дані ніде не зберігаються.'],
        ['New password','Новий пароль'], ['Confirm new password','Підтвердіть новий пароль'],
        ['Change password','Змінити пароль'],
        ['8–64 characters, at least one letter and one digit.','8–64 символи, принаймні одна літера й одна цифра.'],
        // Accessibility and attributes
        ['Перейти до контенту','Skip to content'], ['Головна сторінка Rand_Play','Rand_Play home page'],
        ['Головна навігація','Main navigation'], ['Мобільна навігація','Mobile navigation'],
        ['Пошук ігор','Search games'], ['Профіль користувача','User profile'],
        ['Відкрити меню','Open menu'], ['Закрити меню','Close menu'],
        ['Соціальні мережі','Social media'], ['відкриється в новій вкладці','opens in a new tab'],
        ['Authentication mode','Режим авторизації'], ['Spin Roulette','Крутити рулетку'],
        ['Відео: як працює рандомайзер ігор Rand_Play','Video: how the Rand_Play game randomizer works'],
        ['Карта Google Maps: Печера Тамплієрів','Google Maps: Templars Cave'],
        ['Discord сервер Rand_Play','Rand_Play Discord server'], ['search game...','пошук гри...'],
        ['Рандомайзер ігор онлайн — грати без реєстрації | Rand_Play','Online game randomizer — play without registering | Rand_Play'],
        // JS validation messages and statuses
        ['Введіть ім’я.','Enter your name.'], ['Ім’я має містити щонайменше {n} символи.','Name must contain at least {n} characters.'],
        ['Ім’я має містити не більше {n} символів.','Name must contain no more than {n} characters.'],
        ['Ім’я може містити лише літери, пробіли, апострофи та дефіси.','Name may contain only letters, spaces, apostrophes and hyphens.'],
        ['Введіть електронну пошту.','Enter your email.'],
        ['Введіть коректну пошту, наприклад user@gmail.com.','Enter a valid email, e.g. user@gmail.com.'],
        ['Номер не може містити літери. Формат: +380XXXXXXXXX.','Phone cannot contain letters. Format: +380XXXXXXXXX.'],
        ['Приберіть пробіли, дужки й дефіси. Формат: +380XXXXXXXXX.','Remove spaces, parentheses and hyphens. Format: +380XXXXXXXXX.'],
        ['Після +380 має бути рівно {n} цифр, зараз {n2}. Не вистачає {n3}.','There must be exactly {n} digits after +380, currently {n2}. Missing {n3}.'],
        ['Після +380 має бути рівно {n} цифр, зараз {n2}. Приберіть зайві.','There must be exactly {n} digits after +380, currently {n2}. Remove extras.'],
        ['Номер має починатися з +380. Формат: +380XXXXXXXXX.','Phone must start with +380. Format: +380XXXXXXXXX.'],
        ['Введіть номер у форматі +380XXXXXXXXX.','Enter a phone number in format +380XXXXXXXXX.'],
        ['Введіть повідомлення.','Enter a message.'],
        ['Повідомлення має містити щонайменше {n} символів.','Message must contain at least {n} characters.'],
        ['Повідомлення має містити не більше {n} символів.','Message must contain no more than {n} characters.'],
        ['Підтвердіть згоду на обробку даних.','Please agree to data processing.'],
        ['✓ Коректно','✓ Valid'], ['✓ Номер коректний','✓ Valid phone'], ['✓ Згоду надано','✓ Consent given'],
        ['Підставити {n}','Use {n}'], ['Є пропозиція виправлення: підставити {n}. Натисніть Tab, щоб перейти до кнопки.','Suggested correction: use {n}. Press Tab to reach the button.'],
        ['{n} / {n2} символів','{n} / {n2} characters'],
        ['Форму не надіслано. Полів з помилками: {n}.','Form not submitted. Fields with errors: {n}.'],
        ['Ім’я','Name'], ['Телефон','Phone'], ['Згода','Consent'],
        // Auth/reset dynamic text
        ['Enter your email.','Введіть електронну пошту.'],
        ['Enter a valid email, e.g. user@gmail.com.','Введіть коректну пошту, наприклад user@gmail.com.'],
        ['Enter your password.','Введіть пароль.'], ['Enter a new password.','Введіть новий пароль.'],
        ['Repeat your password.','Повторіть пароль.'], ['Repeat the new password.','Повторіть новий пароль.'],
        ['Passwords do not match.','Паролі не збігаються.'],
        ['Use {n}–{n2} characters with at least one letter and one digit.','Використайте {n}–{n2} символи, принаймні одну літеру й одну цифру.'],
        ['Demo: the sign up form passed validation. No server is connected, nothing was saved.','Демонстрація: реєстраційна форма пройшла перевірку. Сервера немає, нічого не збережено.'],
        ['Demo: the sign in form passed validation. No server is connected, nobody was signed in.','Демонстрація: форма входу пройшла перевірку. Сервера немає, вхід не виконано.'],
        ['Demo: the new password passed validation. No server is connected, nothing was saved.','Демонстрація: новий пароль пройшов перевірку. Сервера немає, нічого не збережено.'],
        ['Demo only: no server is connected, so no email was sent. This is how the email would look:','Демонстрація: сервера немає, лист не надіслано. Ось як він міг би виглядати:'],
        ['We received a request to reset your Rand_Play password. Confirm it with the button below.','Ми отримали запит на скидання пароля Rand_Play. Підтвердьте його кнопкою нижче.'],
        ['To: {n}','Кому: {n}'],
        ['Form not submitted. Please correct {n} fields.','Форму не надіслано. Виправте поля з помилками: {n}.'],
        ['Please correct this field: {n}','Виправте це поле: {n}']
    ];

    var enToUa = Object.create(null), uaToEn = Object.create(null);
    pairs.forEach(function (pair) {
        if (/[А-Яа-яІіЇїЄєҐґ]/.test(pair[0])) {
            uaToEn[pair[0]] = pair[1];
            enToUa[pair[1]] = pair[0];
        } else {
            enToUa[pair[0]] = pair[1];
            uaToEn[pair[1]] = pair[0];
        }
    });

    function patternTranslate(value, dict) {
        if (dict[value] !== undefined) return dict[value];

        // Match the most specific template first: generic 'Use {n}' must not
        // capture 'Use 8–64 characters with at least one letter and one digit.'
        var keys = Object.keys(dict).sort(function (a, b) {
            return b.replace(/\{n\d*\}/g, '').length - a.replace(/\{n\d*\}/g, '').length;
        });

        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (k.indexOf('{n}') < 0) continue;

            var regex = new RegExp(
                '^' +
                k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                 .replace(/\\\{n\\\}/g, '(.+?)')
                 .replace(/\\\{n2\\\}/g, '(.+?)')
                 .replace(/\\\{n3\\\}/g, '(.+?)') +
                '$'
            );

            var match = value.match(regex);
            if (match) {
                var output = dict[k];
                for (var j = match.length - 1; j >= 1; j--) {
                    output = output.replace(
                        '{n' + (j === 1 ? '' : j) + '}',
                        match[j]
                    );
                }
                return output;
            }
        }

        return value;
    }

    var language = 'en';

    function t(value) {
        var original = String(value);
        return patternTranslate(
            original,
            language === 'en' ? uaToEn : enToUa
        );
    }

    var textNodes = [], attrs = [];

    function capture() {
        var walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    var parent = node.parentElement;
                    if (
                        !parent ||
                        /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(parent.tagName)
                    ) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return node.nodeValue.trim()
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            }
        );

        while (walker.nextNode()) {
            var node = walker.currentNode;
            textNodes.push({
                node: node,
                original: node.nodeValue
            });
        }

        document.querySelectorAll(
            '[aria-label],[placeholder],[title]'
        ).forEach(function (el) {
            ['aria-label', 'placeholder', 'title'].forEach(function (name) {
                if (el.hasAttribute(name)) {
                    attrs.push({
                        el: el,
                        name: name,
                        original: el.getAttribute(name)
                    });
                }
            });
        });

        var pageTitle = document.title;

        attrs.push({
            el: document,
            name: 'title',
            original: pageTitle
        });
    }

    function apply() {
        document.documentElement.lang = language;

        textNodes.forEach(function (item) {
            // Nodes owned by other scripts can be edited after startup;
            // do not overwrite live validation output.
            if (
                !item.node.isConnected ||
                item.node.parentElement.closest(
                    '[id$="Error"], #feedbackStatus, #auth-status, ' +
                    '#reset-status, #messageCounter, #phoneFix'
                )
            ) {
                return;
            }

            var original = item.original;
            var trimmed = original.trim();

            // Keep the roulette button labeled SPIN in both languages.
            if (
                item.node.parentElement.closest('#spin-btn') ||
                trimmed.toUpperCase() === 'SPIN'
            ) {
                return;
            }

            item.node.nodeValue = original.replace(
                trimmed,
                t(trimmed)
            );
        });

        attrs.forEach(function (item) {
            if (item.el === document) {
                document.title = t(item.original);
            } else if (item.el.isConnected) {
                item.el.setAttribute(
                    item.name,
                    t(item.original)
                );
            }
        });

        var button = document.getElementById('lang-toggle');

        if (button) {
            button.textContent = language.toUpperCase();

            button.setAttribute(
                'aria-label',
                language === 'en'
                    ? 'Switch language to Ukrainian'
                    : 'Змінити мову на англійську'
            );

            button.setAttribute(
                'title',
                language === 'en'
                    ? 'Switch to Ukrainian'
                    : 'Перемкнути на англійську'
            );
        }

        window.dispatchEvent(
            new CustomEvent('randplay:languagechange', {
                detail: { language: language }
            })
        );
    }

    function setLanguage(next) {
        if (next !== 'en' && next !== 'ua') return;

        language = next;

        try {
            sessionStorage.setItem(
                'randplay-language',
                language
            );
        } catch (e) {
            /* storage unavailable */
        }

        apply();
    }

    window.RandPlayI18n = {
        t: t,
        getLanguage: function () {
            return language;
        },
        setLanguage: setLanguage
    };

    function init() {
        capture();

        var saved = 'en';

        try {
            saved =
                sessionStorage.getItem('randplay-language') || 'en';
        } catch (e) {
            /* storage unavailable */
        }

        language = saved === 'ua' ? 'ua' : 'en';

        var button = document.getElementById('lang-toggle');

        if (button) {
            button.addEventListener('click', function () {
                setLanguage(language === 'en' ? 'ua' : 'en');
            });
        }

        var menu = document.getElementById('menu-btn');

        if (menu) {
            new MutationObserver(function () {
                var label = menu.getAttribute('aria-label');
                var translated = t(label);

                if (label !== translated) {
                    menu.setAttribute(
                        'aria-label',
                        translated
                    );
                }
            }).observe(menu, {
                attributes: true,
                attributeFilter: ['aria-label']
            });
        }

        apply();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
