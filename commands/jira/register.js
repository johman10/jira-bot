const { URL } = require('url');
const config = require('../../config');

const envVariables = config['env-variables'];
const i18n = config.locales;

function registerUser(bot, message) {
  bot.startConversation(message, (error, conversation) => {
    const jiraProfileUrl = new URL('secure/ViewProfile.jspa', envVariables('JIRA_URL'));
    conversation.ask(i18n.t('jira.register.question', { jiraProfileUrl: jiraProfileUrl.toString() }), [
      {
        pattern: /"(.*)"/,
        callback(response) {
          const userData = { id: response.user, jira_username: response.match[1] };
          bot.botkit.storage.users.save(userData, (saveError) => {
            if (saveError) {
              conversation.say(i18n.t('storage.error.save'));
              conversation.repeat();
              conversation.next();
            }

            conversation.say(i18n.t('jira.register.success', { username: response.match[1] }));
            conversation.next();
          });
        },
      },
      {
        pattern: /cancel/,
        callback() {
          conversation.say(i18n.t('jira.register.stop'));
          conversation.next();
        },
      },
      {
        pattern: /(.*?)@(.*?)\.(.*?)/,
        callback() {
          conversation.say(i18n.t('jira.register.error.no_email'));
          conversation.repeat();
          conversation.next();
        },
      },
      {
        default: true,
        callback() {
          conversation.say(i18n.t('jira.register.error.no_result'));
          conversation.repeat();
          conversation.next();
        },
      },
    ]);
  });
}

module.exports = registerUser;
