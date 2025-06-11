const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'pt'],
  directory: path.join(__dirname, '../locales'),
  defaultLocale: 'pt',
  objectNotation: true,
  autoReload: false,
  updateFiles: false,
});

module.exports = i18n;
