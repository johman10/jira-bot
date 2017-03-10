const config = require('../../config');
const i18n = config.locales;
const envVariables = config['env-variables'];
const jira = config.jira;

function assignUser (bot, message) {
  bot.botkit.storage.users.get(message.user, function (err, user) {
    if (err) {
      return bot.reply(i18n.t('storage.error.user_get'))
    }

    if (!user) {
      return bot.reply(i18n.t('storage.error.user_none'))
    }

    let issueKey = message.text.match(new RegExp(envVariables('JIRA_ISSUE_REGEX'), 'i'))[0];
    jira.issue.assignIssue({ issueKey, assignee: user.jira_username }, function (error, issue) {
      if (error) {
        return bot.reply(message, i18n.t('jira.assign.error.api'));
      }

      bot.reply(message, i18n.t('jira.assign.success', { issueKey }));
    })
  })
}

module.exports = assignUser;
