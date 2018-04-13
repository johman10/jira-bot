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
    console.log(message.match);
    const issueKey = message.match[1];
    jira.issue.assignIssue({ issueKey, assignee: user.jira_username }, (assignError) => {
      if (assignError) {
        bot.replyInThread(message, i18n.t('jira.assign.error.api'));
        return;
      }

      bot.replyInThread(message, i18n.t('jira.assign.success', { issueKey }));
    });
  });
}

module.exports = assignUser;
