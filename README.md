# Rand_Play

**Rand_Play** is a bilingual, gaming-themed website built around a random browser game picker. Instead of browsing through a long list, visitors can spin a roulette-style reel to discover a game and open it in their browser.

The project combines an interactive landing page, a retro-inspired game showcase, and responsive visual design.

## Features

- **Game roulette:** Spin an animated reel to pick a browser game.
- **Game showcase:** Browse five fictional retro-game concepts in a responsive carousel powered by Swiper.js.
- **Image gallery:** Open larger game previews and navigate between them using Fancybox.
- **English and Ukrainian:** Switch the interface language without translating the game titles.
- **Responsive interface:** Layouts adapt to mobile, tablet, and desktop screens; showcase controls sit below the cards.
- **Interactive page elements:** Navigation menu, forms with client-side validation, and authentication-related UI.
- **Embedded content:** YouTube, Google Maps, and a Discord widget are included in the page.
- **Accessible interaction:** The showcase supports keyboard navigation, focus indicators, and reduced-motion preferences.

> The five showcase games are fictional concepts illustrated with local SVG artwork. They are previews, not separate playable games.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Markup and styling | HTML5, CSS3, Tailwind CSS (CDN) |
| Application logic | Vanilla JavaScript |
| Carousel | Swiper.js 11.0.0 |
| Image lightbox | Fancybox 5.0.36 |
| Form validation | JavaScript and regular expressions |
| Embedded content | YouTube, Google Maps, Discord widget |
| Hosting | GitHub Pages, Netlify, Vercel |

Swiper and Fancybox are loaded from version-pinned jsDelivr URLs, so those features require a network connection unless their assets are hosted locally.

## Live Demo

- **Vercel:** https://randplay-kappa.vercel.app/
- **Netlify:** https://randplay.netlify.app/
- **GitHub Pages:** https://ruselius-dov.github.io/Rand_Play/

Deployment links are provided as project destinations; their current deployment status has not been independently verified in this README.

## Project Structure

```text
Rand_Play/
├── index.html                 # Main website
├── reset-password.html        # Password reset page
├── css/
│   └── style.css              # Custom styles and responsive sections
├── js/
│   ├── auth.js                # Authentication-related UI logic
│   ├── i18n.js                # English/Ukrainian localization
│   ├── menu.js                # Navigation menu
│   ├── reset.js               # Password reset logic
│   ├── roulette.js            # Roulette functionality
│   ├── showcase.js            # Swiper and Fancybox integration
│   ├── stage.js               # Game stage interactions
│   └── validation.js          # Form validation
├── assets/
│   └── images/
│       └── game-showcase/     # Local retro SVG previews
├── README.md
└── DEVELOPMENT_NOTES.md       # Technical implementation notes
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Ruselius-dov/Rand_Play.git
   ```

2. Open the project folder in Visual Studio Code.
3. Run `index.html` with a local development server, such as the **Live Server** extension, or open the file directly in a browser.
4. Check that your internet connection is available for CDN-hosted libraries and embedded services.

No build step or package installation is required for the current static-site setup.

## Development Notes

See [DEVELOPMENT_NOTES.md](DEVELOPMENT_NOTES.md) for implementation details on the game showcase, localization, design system, dependency loading, and recommended quality-assurance checks.
