const config = require('../../config');

const i18n = config.locales;

function findRegistration(bot, message) {
  bot.botkit.storage.users.get(message.user, (error, user) => {
    if (error) {
      bot.reply(message, i18n.t('storage.error.user_get'));
      return;
    }

    if (!user) {
      bot.reply(message, i18n.t('storage.error.user_none'));
      return;
    }

    bot.reply(message, { attachments: [buildRegistrationMessage(user)] });
  });
}

function buildRegistrationMessage(user) {
  return {
    title: i18n.t('jira.whoami.title'),
    text: i18n.t('jira.whoami.text', { userId: user.id }),
    fields: [
      {
        title: i18n.t('jira.whoami.field.jira_username'),
        value: user.jira_username,
        short: false,
        footer: i18n.t('jira.whoami.footer'),
      },
    ],
  };
}

module.exports = findRegistration;
