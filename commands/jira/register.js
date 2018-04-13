const config = require('../../config');

const i18n = config.locales;

function registerUser(bot, message) {
  if (message.match.input.match(/(.*?)@(.*?)\.(.*?)/)) {
    bot.replyInThread(message, i18n.t('jira.register.error.no_email'));
    return;
  }

  const usernameMatch = message.match.input.match(/"(.*)"/);
  if (!usernameMatch) {
    bot.replyInThread(message, i18n.t('jira.register.error.no_result'));
    return;
  }

  const username = usernameMatch[1];
  const userData = { id: message.user, jira_username: username };
  bot.botkit.storage.users.save(userData, (saveError) => {
    if (saveError) {
      bot.replyInThread(message, i18n.t('storage.error.save'));
      return;
    }

    bot.replyInThread(message, i18n.t('jira.register.success', { username }));
  });
}

module.exports = registerUser;
