const envVariables = require('./env-variables');
const Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: envVariables('DEVELOPMENT'),
  log: envVariables('DEVELOPMENT')
});

// connect the bot to a stream of messages
controller.spawn({
  token: envVariables('SLACK_BOT_TOKEN'),
}).startRTM();

module.exports = controller;
