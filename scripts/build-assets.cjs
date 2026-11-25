const fs = require('node:fs/promises');
const { minify } = require('terser');

async function build() {
  const modules = ['showcase', 'roulette', 'stage', 'menu', 'ui-polish', 'game-advisor', 'i18n', 'validation', 'auth'];
  const scripts = await Promise.all(modules.map(name => fs.readFile('js/' + name + '.js', 'utf8')));
  const result = await minify(scripts.join('\n;\n'));
  await fs.writeFile('js/main.min.js', result.code + '\n');
  const styles = await Promise.all(['fonts', 'tailwind', 'style'].map(name => fs.readFile('css/' + name + '.css', 'utf8')));
  await fs.writeFile('css/main.css', styles.join('\n').replace(/\r\n/g, '\n'));
}
build().catch(error => { console.error(error); process.exitCode = 1; });
