const envalid = require('envalid');
const dotenv = require('dotenv');

const {
  email,
  num,
  str,
  url,
} = envalid;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') dotenv.load();

let config = envalid.cleanEnv(process.env, {
  NODE_ENV: str({
    default: 'development',
    choices: ['development', 'production'],
  }),
  LANGUAGE: str({
    default: 'en',
    choices: ['en'],
    desc: 'A variable set up for later on when this all become multilingual',
  }),
  SLACK_BOT_TOKEN: str({
    desc: 'The token that is retrievable from Slack',
    example: 'xoxb-123456789012-AbCdEfGhIjKlMnOpQrStUvWx',
    docs: 'https://api.slack.com/bot-users#setup',
  }),
  SLACK_COLOR_ONE: str({
    default: '#000000',
    desc: 'The default color (in HEX) that will be show next to the text that the bot generates',
    example: '#09A7DB',
  }),
  JIRA_ISSUE_REGEX: str({
    desc: 'A matching regex to all the issues the bot should reply to',
    example: 'ABC?\-([0-9]{1,4})', // eslint-disable-line no-useless-escape
  }),
  JIRA_USERNAME: email({
    desc: 'This bot needs a JIRA user, this value should be an email address and the JIRA user should have access to the JIRA board that the regex matches to.',
  }),
  JIRA_PASSWORD: str({
    desc: 'This bot needs a JIRA user, the JIRA user should have access to the JIRA board that the regex matches to.',
  }),
  JIRA_URL: url({
    desc: 'The URL to where all the boards live without any path added',
    example: 'https://company.atlassian.net',
  }),
  DATABASE_URL: url({
    desc: 'The URL to a Postgres database that can be used to store logged in users, no tables have to be created but that database has to accessible',
    example: 'postgres://[username]:[password]@[host]:[port]/[database]',
  }),
  PORT: num({
    default: 8080,
    desc: 'The port that the node server will be running on',
    example: 8080,
  }),
});

config = Object.assign({}, config, {
  DEVELOPMENT: process.env.NODE_ENV === 'development',
  PRODUCTION: process.env.NODE_ENV === 'production',
});

module.exports = (key) => {
  if (!key) return config;

  return config[key];
};
