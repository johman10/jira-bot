const config = require('../config');

const i18n = config.locales;

function showLove(bot, message) {
  bot.reply(message, i18n.t('meta.love'));
}

module.exports = showLove;
