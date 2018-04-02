const envVariables = require('./env-variables');
const Botkit = require('botkit');
const botkitStoragePostgres = require('botkit-storage-postgres');
const { URL } = require('url');

const databaseUrl = new URL(envVariables('DATABASE_URL'));

const controller = Botkit.slackbot({
  debug: envVariables('DEVELOPMENT'),
  log: envVariables('DEVELOPMENT'),
  // TODO: consider moving away from postgres since botkit-storage-postgres is unmaintained
  storage: botkitStoragePostgres({
    host: databaseUrl.hostname,
    port: databaseUrl.port,
    user: databaseUrl.username,
    password: databaseUrl.password,
    database: databaseUrl.pathname.replace('/', ''),
  }),
});

// connect the bot to a stream of messages
controller.spawn({
  token: envVariables('SLACK_BOT_TOKEN'),
}).startRTM();

module.exports = controller;
