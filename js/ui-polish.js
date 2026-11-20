/* Rand_Play: accessible custom advisor controls + precise section navigation */
(() => {
  'use strict';
  function initAdvisorSelect(select) {
    if (!(select instanceof HTMLSelectElement) || select.dataset.enhanced) return;
    const field = select.closest('.rp-advisor-field');
    const label = field?.querySelector('label');
    if (!field || !label) return;
    const widget = document.createElement('div');
    widget.className = 'rp-advisor-combobox';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.id = select.id + '-trigger';
    trigger.className = 'rp-advisor-combo-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    const valueText = document.createElement('span');
    valueText.className = 'rp-advisor-combo-value';
    const arrow = document.createElement('span');
    arrow.className = 'rp-advisor-combo-chevron';
    arrow.setAttribute('aria-hidden', 'true');
    trigger.append(valueText, arrow);
    const choices = document.createElement('div');
    choices.id = select.id + '-choices';
    choices.className = 'rp-advisor-options';
    choices.setAttribute('role', 'listbox');
    choices.setAttribute('aria-label', label.textContent.trim());
    choices.hidden = true;
    trigger.setAttribute('aria-controls', choices.id);
    const buttons = [];
    [...select.options].forEach((option, index) => {
      const entry = document.createElement('button');
      entry.type = 'button';
      entry.className = 'rp-advisor-option';
      entry.textContent = option.textContent;
      entry.setAttribute('role', 'option');
      entry.setAttribute('aria-selected', String(option.selected));
      entry.tabIndex = -1;
      entry.dataset.value = option.value;
      entry.id = choices.id + '-option-' + index;
      choices.append(entry);
      buttons.push(entry);
    });
    widget.append(trigger, choices);
    select.insertAdjacentElement('afterend', widget);
    select.classList.add('rp-advisor-native-select');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    field.classList.add('rp-advisor-select-enhanced');
    label.htmlFor = trigger.id;
    select.dataset.enhanced = 'true';
    const selectedIndex = () => Math.max(0, select.selectedIndex);
    const sync = () => {
      const idx = selectedIndex();
      buttons.forEach((btn, i) => { btn.textContent = select.options[i]?.textContent || ''; });
      valueText.textContent = buttons[idx]?.textContent || '';
      buttons.forEach((btn, i) => btn.setAttribute('aria-selected', String(i === idx)));
      choices.setAttribute('aria-label', label.textContent.trim());
    };
    const close = (restoreFocus = false) => {
      choices.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus) trigger.focus();
    };
    const open = (focusIndex = selectedIndex()) => {
      document.querySelectorAll('.rp-advisor-options').forEach(el => {
        if (el !== choices) {
          el.hidden = true;
          el.previousElementSibling?.setAttribute('aria-expanded', 'false');
        }
      });
      choices.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      buttons[focusIndex]?.focus();
    };
    const choose = (idx) => {
      if (!buttons[idx]) return;
      if (select.selectedIndex !== idx) {
        select.selectedIndex = idx;
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      sync();
      close(true);
    };
    trigger.addEventListener('click', () => choices.hidden ? open() : close());
    trigger.addEventListener('keydown', event => {
      if (['ArrowDown','ArrowUp','Home','End',' ','Enter'].includes(event.key)) {
        event.preventDefault();
        open(event.key === 'End' ? buttons.length - 1 : event.key === 'Home' ? 0 : selectedIndex());
      }
    });
    choices.addEventListener('click', event => {
      const index = buttons.indexOf(event.target.closest('.rp-advisor-option'));
      if (index >= 0) choose(index);
    });
    choices.addEventListener('keydown', event => {
      const idx = buttons.indexOf(document.activeElement);
      let next = idx;
      if (event.key === 'ArrowDown') next = Math.min(buttons.length-1, idx+1);
      else if (event.key === 'ArrowUp') next = Math.max(0, idx-1);
      else if (event.key === 'Home') next=0;
      else if (event.key === 'End') next=buttons.length-1;
      else if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
      else if (event.key === 'Tab') { close(); return; }
      else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault(); choose(idx); return;
      } else return;
      event.preventDefault();
      buttons[next]?.focus();
    });
    document.addEventListener('pointerdown', event => {
      if (!widget.contains(event.target)) close();
    });
    // i18n updates captured option text on languagechange.
    window.addEventListener('randplay:languagechange', () => {
      // The translated option labels have been updated by i18n at this point.
      sync();
    });
    select.addEventListener('change', sync);
    sync();
  }
  document.querySelectorAll('#advisor-genre, #advisor-difficulty').forEach(initAdvisorSelect);

  // Single click-navigation handler. Do not stack CSS and JS offsets.
  const header = document.querySelector('body > header');
  const hasReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const advisorForm = document.getElementById('advisor-form');
  advisorForm?.addEventListener('focusin', () => {
    // Cancel an in-flight section animation before the user operates the form.
    window.scrollTo({ top: window.scrollY, left: window.scrollX, behavior: 'instant' });
  });
  const scrollToTarget = (target) => {
    if (advisorForm?.contains(document.activeElement)) return;
    // Sections contain generous top padding. Align their *visible heading*,
    // not the section boundary, below the sticky navigation bar.
    const margin = 14;
    const headerHeight = header?.getBoundingClientRect().height || 72;
    const anchor = target.querySelector('.rp-advisor-heading, .rp-showcase-heading, h1, h2, h3') || target;
    const absoluteTop = window.scrollY + anchor.getBoundingClientRect().top;
    const top = target.id === 'home' ? 0 : Math.max(0, absoluteTop - headerHeight - margin);
    window.scrollTo({ top, behavior: hasReducedMotion() ? 'instant' : 'smooth' });
  };

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href')?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    // The game table is a camera scene, not an ordinary anchored section.
    if (id === 'desk-view') {
      event.preventDefault();
      const stage = document.getElementById('stage');
      if (stage?.dataset.state === 'hero') {
        document.getElementById('btn-spin-roulette')?.click();
      } else if (stage?.dataset.state === 'desk') {
        window.scrollTo({ top: 0, behavior: hasReducedMotion() ? 'instant' : 'smooth' });
      }
      history.replaceState(null, '', '#desk-view');
      return;
    }
    // The return-to-hero control belongs to js/stage.js.
    if (link.classList.contains('monitor-return')) return;
    event.preventDefault();
    const path = '#' + encodeURIComponent(id);
    history.replaceState(null, '', path);
    // Closeable menus can have their own scroll position; calculate after close.
    requestAnimationFrame(() => scrollToTarget(target));
  });

  // Direct URL navigation and browser history also get the header correction.
  const applyHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id || id === 'desk-view') return;
    const target = document.getElementById(id);
    if (target) requestAnimationFrame(() => scrollToTarget(target));
  };
  window.addEventListener('hashchange', applyHash);
  if (location.hash && location.hash !== '#desk-view') {
    window.addEventListener('load', applyHash, { once: true });
  }
})();
