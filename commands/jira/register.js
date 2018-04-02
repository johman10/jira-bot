const { URL } = require('url');
const config = require('../../config');
const envVariables = config['env-variables'];
const i18n = config.locales;
const jira = config.jira;

function registerUser (bot, message) {
  bot.startConversation(message,function(err, convo) {
    const jiraProfileUrl = new URL('secure/ViewProfile.jspa', envVariables('JIRA_URL'));
    convo.ask(i18n.t('jira.register.question', { jiraProfileUrl: jiraProfileUrl.toString() }), [
      {
        pattern: '"(.*)"',
        callback: function(response, convo) {
          bot.botkit.storage.users.save({ id: response.user, jira_username: response.match[1] }, function(err) {
            if (err) {
              convo.say(i18n.t('storage.error.save'));
              convo.repeat();
              convo.next();
            }

            convo.say(i18n.t('jira.register.success', { username: response.match[1] }));
            convo.next();
          });
        }
      },
      {
        pattern: 'cancel',
        callback: function(response, convo) {
          convo.say(i18n.t('jira.register.stop'));
          convo.next();
        }
      },
      {
        pattern: '(.*?)@(.*?)\.(.*?)',
        callback: function(response, convo) {
          convo.say(i18n.t('jira.register.error.no_email'));
          convo.repeat();
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response, convo) {
          convo.say(i18n.t('jira.register.error.no_result'));
          convo.repeat();
          convo.next();
        }
      }
    ]);
  });
}

function nameFromMessage (message) {
  let nameMatch = message.text.match(/"(.*)"/);
  if (nameMatch) {
    return nameMatch[1];
  }
}

module.exports = registerUser;
