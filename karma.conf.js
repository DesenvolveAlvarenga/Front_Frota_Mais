// Karma + Jasmine (decisão aprovada no CLAUDE.md). Navegador: Chromium headless
// baixado pelo Puppeteer para o cache do usuário (~/.cache/puppeteer), fora do repositório.
// Se CHROME_BIN estiver definido, ele tem prioridade.
const fs = require('fs');
const os = require('os');
const path = require('path');

function chromiumDoPuppeteer() {
  const base = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome-headless-shell');
  if (!fs.existsSync(base)) return undefined;
  for (const versao of fs.readdirSync(base).sort().reverse()) {
    const executavel = path.join(base, versao, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (fs.existsSync(executavel)) return executavel;
  }
  return undefined;
}

process.env.CHROME_BIN = process.env.CHROME_BIN || chromiumDoPuppeteer();

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage')
    ],
    client: { jasmine: {}, clearContext: false },
    jasmineHtmlReporter: { suppressAll: true },
    coverageReporter: {
      dir: path.join(__dirname, 'coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeadlessFrota'],
    customLaunchers: {
      // --no-sandbox: necessário em contêineres (Codespaces) sem namespaces de usuário.
      ChromeHeadlessFrota: { base: 'ChromeHeadless', flags: ['--no-sandbox', '--window-size=1280,900'] }
    },
    restartOnFileChange: true
  });
};
