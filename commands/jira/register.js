const config = require('../../config');
const i18n = config.locales;
const jira = config.jira;

function registerUser (bot, message) {
  bot.startConversation(message,function(err, convo) {
    convo.ask(i18n.t('jira.register.question'), [
      {
        pattern: '"(.*)"',
        callback: function(response,convo) {
          bot.botkit.storage.users.save({ id: response.user, jira_username: response.match[1] }, function(err) {
            if (err) {
              convo.say(i18n.t('storage'));
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
        callback: function(response,convo) {
          convo.say(i18n.t('jira.register.stop'));
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response,convo) {
          convo.say(i18n.t('jira.register.error.no_email'));
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
