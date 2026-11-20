/* Game Match Advisor — deterministic, validated, local recommendations. */
(() => {
  'use strict';
  const form = document.getElementById('advisor-form');
  if (!(form instanceof HTMLFormElement)) return;
  const genre = document.getElementById('advisor-genre');
  const minutes = document.getElementById('advisor-time');
  const difficulty = document.getElementById('advisor-difficulty');
  const multiplayer = document.getElementById('advisor-multiplayer');
  const error = document.getElementById('advisor-time-error');
  const title = document.getElementById('advisor-result-title');
  const description = document.getElementById('advisor-result-description');
  const content = document.getElementById('advisor-result-content');
  if (![genre, minutes, difficulty, multiplayer, error, title, description, content].every(Boolean)) return;

  const games = Object.freeze([
    {name:'Retro Puzzle',genre:'Puzzle',time:15,difficulty:'Easy',multiplayer:false,image:'retro-puzzle.svg'},
    {name:'Neon Platformer',genre:'Platformer',time:25,difficulty:'Medium',multiplayer:false,image:'neon-platformer.svg'},
    {name:'Pixel Invaders',genre:'Arcade',time:10,difficulty:'Hard',multiplayer:true,image:'pixel-invaders.svg'},
    {name:'Neon Racer',genre:'Racing',time:20,difficulty:'Medium',multiplayer:true,image:'neon-racer.svg'},
    {name:'Pixel Colony',genre:'Strategy',time:45,difficulty:'Hard',multiplayer:false,image:'pixel-colony.svg'}
  ]);
  const words = {
    en: {
      empty:'Enter the available time.', invalid:'Enter a whole number from 5 to 240.',
      noMatch:'No games fit the available time.', noMatchDetails:'Try increasing your session time to at least 10 minutes.',
      initial:'Your game match will appear here', initialText:'Choose your preferences to see a personalized suggestion.',
      match:'Your best match', closest:'Closest available match',
      genreUnavailable:'No game in your preferred genre fits the available time.', pts:'Match score (out of 100 points)',
      gameTime:'Typical session', mins:'min', reason:'Why this game?',
      matchedGenre:'preferred genre', fittingTime:'fits your available time',
      matchedDifficulty:'preferred difficulty', matchedMultiplayer:'multiplayer preference',
      unmatched:'Other preferences may differ.',
      categories:['Genre','Time','Difficulty','Multiplayer']
    },
    ua: {
      empty:'Введи доступний час.', invalid:'Введи ціле число від 5 до 240.',
      noMatch:'За вибраний час жодна гра не підходить.', noMatchDetails:'Спробуй збільшити час до щонайменше 10 хвилин.',
      initial:'Тут з’явиться підібрана гра', initialText:'Обери параметри, щоб отримати персональну рекомендацію.',
      match:'Найкраща відповідність', closest:'Найближчий доступний варіант',
      genreUnavailable:'Ігри вибраного жанру не вкладаються в доступний час.', pts:'Рейтинг відповідності (зі 100 балів)',
      gameTime:'Тривалість сеансу', mins:'хв', reason:'Чому саме ця гра?',
      matchedGenre:'улюблений жанр', fittingTime:'вкладається у доступний час',
      matchedDifficulty:'бажана складність', matchedMultiplayer:'побажання щодо мультиплеєра',
      unmatched:'Інші вподобання можуть відрізнятися.',
      categories:['Жанр','Час','Складність','Мультиплеєр']
    }
  };
  const currentLanguage = () => window.RandPlayI18n?.getLanguage() === 'ua' ? 'ua' : 'en';
  const text = () => words[currentLanguage()];

  function validateTime(raw) {
    const value = String(raw).trim();
    if (!value) return {ok:false, reason:'empty'};
    if (!/^\d+$/.test(value)) return {ok:false, reason:'invalid'};
    const num = Number(value);
    if (!Number.isSafeInteger(num) || num < 5 || num > 240) return {ok:false, reason:'invalid'};
    return {ok:true, value:num};
  }
  function readPreferences() {
    const time = validateTime(minutes.value);
    const validGenres = games.map(game => game.genre);
    if (!validGenres.includes(genre.value) || !['Easy','Medium','Hard'].includes(difficulty.value)) {
      return {ok:false, reason:'invalid'};
    }
    return time.ok ? {ok:true, genre:genre.value, time:time.value,
      difficulty:difficulty.value, multiplayer:multiplayer.checked} : time;
  }
  function scoreGame(game, prefs) {
    if (game.time > prefs.time) return null;
    const parts = [
      game.genre === prefs.genre ? 40 : 0,
      30,
      game.difficulty === prefs.difficulty ? 20 : 0,
      (!prefs.multiplayer || game.multiplayer) ? 10 : 0
    ];
    return { game, parts, total: parts.reduce((sum, n) => sum + n, 0) };
  }
  function recommend(prefs) {
    return games.map(game => scoreGame(game, prefs)).filter(Boolean)
      .sort((a,b) => b.total - a.total || a.game.time - b.game.time)[0] || null;
  }
  function setValidation() {
    const validation = validateTime(minutes.value);
    const w = text();
    const message = validation.ok ? '' : w[validation.reason];
    error.textContent = message;
    minutes.setAttribute('aria-invalid', String(!validation.ok));
    return validation.ok;
  }
  let lastResult = null;
  let lastPreferences = null;
  let resultState = 'idle';
  function resetResult() {
    lastResult = null;
    lastPreferences = null;
    resultState = 'idle';
    const w = text();
    title.textContent = w.initial;
    description.textContent = w.initialText;
    content.replaceChildren();
  }
  function node(tag, className, value) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (value !== undefined) el.textContent = value;
    return el;
  }
  function renderResult(result) {
    lastResult = result;
    resultState = result ? 'match' : 'none';
    const w = text();
    content.replaceChildren();
    if (!result) {
      title.textContent = w.noMatch;
      description.textContent = w.noMatchDetails;
      return;
    }
    const {game, parts, total} = result;
    title.textContent = game.name; // Product titles remain English in both languages.
    const differentGenre = lastPreferences && game.genre !== lastPreferences.genre;
    description.textContent = `${differentGenre ? w.closest : w.match} · ${w.gameTime}: ${game.time} ${w.mins}`;
    content.append(node('p','rp-advisor-result-score',`${total}/100`));
    content.append(node('p','rp-advisor-score-label',w.pts));
    const img = node('img','rp-advisor-game-image');
    img.src = 'assets/images/game-showcase/' + game.image;
    img.alt = game.name;
    img.loading = 'lazy';
    content.append(img);
    parts.forEach((pts, index) => {
      const line = node('div','rp-advisor-score-detail');
      line.append(node('span','',w.categories[index]));
      const bar = document.createElement('progress');
      bar.max = [40,30,20,10][index];
      bar.value = pts;
      bar.setAttribute('aria-label',w.categories[index]);
      line.append(bar,node('strong','',`${pts}/${bar.max}`));
      content.append(line);
    });
    const reason = [
      parts[0] ? w.matchedGenre : null,
      w.fittingTime,
      parts[2] ? w.matchedDifficulty : null,
      (parts[3] && !result.game.multiplayer) ? null : (parts[3] && result.game.multiplayer ? w.matchedMultiplayer : null)
    ].filter(Boolean).join(' · ');
    content.append(node('p','rp-advisor-result-explanation',`${w.reason} ${reason}.${differentGenre ? ' ' + w.genreUnavailable : (total === 100 ? '' : ' ' + w.unmatched)}`));
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const prefs = readPreferences();
    if (!prefs.ok) {setValidation(); minutes.focus(); resetResult(); return;}
    setValidation();
    lastPreferences = prefs;
    renderResult(recommend(prefs));
  });
  minutes.addEventListener('input', () => {
    setValidation();
    resetResult();
  });
  // Any preference edit invalidates the previously submitted recommendation.
  [genre, difficulty, multiplayer].forEach(control => {
    control.addEventListener('change', resetResult);
  });
  window.addEventListener('randplay:languagechange', () => {
    setValidation();
    if (lastResult) renderResult(lastResult);
    else if (resultState === 'none') renderResult(null);
    else resetResult();
  });
  // Public pure calculation hooks for repeatable QA checks, without DOM manipulation.
  window.RandPlayAdvisor = Object.freeze({ validateTime, scoreGame, recommend });
})();
