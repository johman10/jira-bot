const config = require('../../config');
const i18n = config.locales;

function findRegistration (bot, message) {
  bot.botkit.storage.users.get(message.user, function (err, user) {
    if (err) {
      return bot.reply(message, i18n.t('storage.error.user_get'))
    }

    if (!user) {
      return bot.reply(message, i18n.t('storage.error.user_none'))
    }

    bot.reply(message, { attachments: [buildRegistrationMessage(user)] });
  })
}

function buildRegistrationMessage (user) {
  return {
    title: i18n.t('jira.registration.title'),
    text: i18n.t('jira.registration.text', { userId: user.id }),
    fields: [
      {
        title: i18n.t('jira.registration.field.jira_username'),
        value: user.jira_username,
        short: false,
        footer: i18n.t('jira.registration.footer')
      }
    ],
  }
}

module.exports = findRegistration;
