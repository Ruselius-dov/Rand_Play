# Rand_Play — Development Notes

Technical notes on the design and implementation of **Rand_Play**, a bilingual gaming-themed web experience with an interactive roulette and a curated game showcase.

## Game showcase

The showcase adds a responsive carousel and an image lightbox to the main page:

- **Swiper.js 11.0.0** powers five game cards, navigation arrows, pagination, keyboard interaction, and autoplay. Autoplay respects the user's reduced-motion preference.
- **Fancybox 5.0.36** opens larger previews and supports navigation between gallery images.
- Navigation controls sit in a dedicated row beneath the cards, with pagination between the arrows, rather than overlaying card content.
- Five local SVG illustrations provide self-contained, fictional retro-game previews. These are temporary showcase assets, not screenshots of released games.

Swiper and Fancybox are served locally when the gallery approaches the viewport.

## Localization

The showcase follows the site's existing English/Ukrainian localization system.

Game titles remain unchanged in both languages:

- Retro Puzzle
- Neon Platformer
- Pixel Invaders
- Neon Racer
- Pixel Colony

Section headings, genres, descriptions, and applicable accessible labels are localized.

## Visual design

The page maintains the Rand_Play dark palette and alternates section backgrounds below the roulette area:

| Section | Background |
| --- | --- |
| `#features` | Black (`#0D0D0D`) |
| `#how-it-works` | Dark gray (`#161616`) |
| `#game-showcase` | Black (`#0D0D0D`) |
| `#video` | Dark gray (`#161616`) |

The alternating pattern continues through the remaining sections toward `#contact`. Showcase cards use neon-accent styling consistent with the rest of the site.

## Project files

**Added**

- `js/showcase.js` — showcase initialization and gallery behavior.
- `assets/images/game-showcase/*.svg` — local retro-inspired artwork.

**Updated**

- `index.html` — showcase markup and library references.
- `css/style.css` — responsive layout, controls, and section backgrounds.
- `js/i18n.js` — bilingual showcase content.

## Quality-assurance checklist

Before publishing a release, test the following in a real browser:

- Viewport widths of **320, 375, 768, 1024, and 1440 px**; no horizontal page overflow or control/card overlap.
- Swiper arrows, pagination, automatic slide changes, and keyboard navigation.
- Reduced-motion behavior and visible keyboard-focus indicators.
- Fancybox opening, image navigation, and closing.
- English/Ukrainian switching, including unchanged game titles.
- Existing roulette, mobile menu, authentication, and form behavior.
- Browser Console for JavaScript errors and blocked resources.

This checklist describes recommended release verification; it is **not** a claim that every check has already passed.

## Known limitations and future improvements

- **Temporary artwork:** Replace the demonstration SVG previews with final approved assets when available.
- **External library delivery:** Consider self-hosting Swiper and Fancybox for better control over availability and security policy.
- **Intermittent development-environment error:** A `MutationObserver.observe()` TypeError was observed in the separate StackBlitz prototype. Its source was not identified from a call stack, so it should not be attributed to the site's code or a specific library without further evidence. The main site's `js/i18n.js` contains a separately guarded observer for the mobile menu.

## Publishing

The documentation is part of the source repository. It is not required at runtime and does not need to be loaded by the browser. Commit and deployment steps are managed separately from these notes.
