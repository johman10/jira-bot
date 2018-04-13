const config = require('../../config');

const i18n = config.locales;
const { jira } = config;

function assignUser(bot, message) {
  bot.botkit.storage.users.get(message.user, (error, user) => {
    if (error) {
      bot.replyInThread(message, i18n.t('storage.error.user_get'));
      return;
    }

    if (!user) {
      bot.replyInThread(message, i18n.t('storage.error.user_none'));
      return;
    }

    const issueKey = message.match[1];
    jira.issue.assignIssue({ issueKey, assignee: user.jira_username })
      .then(() => {
        bot.replyInThread(message, i18n.t('jira.assign.success', { issueKey }));
      })
      .catch(() => {
        bot.replyInThread(message, i18n.t('jira.assign.error.api'));
      });
  });
}

module.exports = assignUser;
