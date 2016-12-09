const path = require('path');
const envVariables = require('./env-variables');
const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');

i18next.use(Backend)
i18next.init({
  lng: envVariables('LANGUAGE'),
  debug: envVariables('DEVELOPMENT'),
  fallbackLng: false,
  load: 'current',
  saveMissing: true,
  backend: {
    loadPath: path.resolve(__dirname, '../locales/{{lng}}.json'),
    addPath: path.resolve(__dirname, '../locales/{{lng}}.missing.json'),
    jsonIndent: 2
  }
});

module.exports = i18next;
