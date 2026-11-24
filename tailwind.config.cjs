module.exports = {
            corePlugins: { preflight: false, container: false },
            theme: {
                extend: {
                    colors: {
                        deep: '#0D0D0D',
                        surface: '#161616',
                        neon: '#2DD4BF',
                        ruby: '#E11D48',
                        muted: '#A3A3A3',
                        line: '#2A2A2D',
                        navy: { DEFAULT: '#162444', light: '#1E325C' }
                    },
                    fontFamily: {
                        heading: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
                        body: ['Inter', 'sans-serif']
                    },
                    spacing: { 18: '4.5rem' },
                    maxWidth: { content: '1264px' },
                    boxShadow: { glow: '0 0 30px rgba(45,212,191,0.2)' }
                }
            }
        };
module.exports.content = ['./*.html', './js/*.js'];
