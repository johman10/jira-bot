const config = require('../../config');

const i18n = config.locales;
const envVariables = config['env-variables'];
const { jira } = config;

function assignUser(bot, message) {
  bot.botkit.storage.users.get(message.user, (err, user) => {
    if (err) {
      bot.reply(i18n.t('storage.error.user_get'));
      return;
    }

    if (!user) {
      bot.reply(i18n.t('storage.error.user_none'));
      return;
    }

    const issueKey = message.text.match(new RegExp(envVariables('JIRA_ISSUE_REGEX'), 'i'))[0];
    jira.issue.assignIssue({ issueKey, assignee: user.jira_username }, (error) => {
      if (error) {
        bot.reply(message, i18n.t('jira.assign.error.api'));
        return;
      }

      bot.reply(message, i18n.t('jira.assign.success', { issueKey }));
    });
  });
}

module.exports = assignUser;
