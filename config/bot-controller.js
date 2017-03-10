const envVariables = require('./env-variables');
const Botkit = require('botkit');
const botkitStoragePostgres = require('botkit-storage-postgres');
const url = require('url');
const databaseUrl = url.parse(envVariables('DATABASE_URL'));

var controller = Botkit.slackbot({
  debug: envVariables('DEVELOPMENT'),
  log: envVariables('DEVELOPMENT'),
  storage: botkitStoragePostgres({
    host: databaseUrl.host.split(':')[0],
    port: databaseUrl.host.split(':')[1],
    user: databaseUrl.auth.split(':')[0],
    password: databaseUrl.auth.split(':')[1],
    database: databaseUrl.path.replace('/', '')
  })
});

// connect the bot to a stream of messages
controller.spawn({
  token: envVariables('SLACK_BOT_TOKEN'),
}).startRTM();

module.exports = controller;
