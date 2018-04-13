const {
  email,
  str,
  url,
  makeValidator,
  cleanEnv,
} = require('envalid');
const dotenv = require('dotenv');

const array = makeValidator((input) => {
  let returnValue = input;
  if (typeof returnValue === 'number') throw new TypeError(`Invalid array value: "${returnValue}"`);
  if (returnValue === '') return returnValue;
  if (returnValue[0] === '[') returnValue = returnValue.slice(1);
  if (returnValue[returnValue.length - 1] === ']') {
    returnValue = returnValue.slice(0, returnValue.length - 1);
  }
  if (returnValue === '') return returnValue;
  return returnValue.split(/,\s?/);
});

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') dotenv.load();

let config = cleanEnv(process.env, {
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
  SLACK_COLORS: array({
    default: '#000000',
    desc: 'A coma seperated list of of HEX colors that will be use together with the JIRA_ISSUE_REGEX variable to match. The index of the element in the array should match the index of that regex groups.',
    example: '#09A7DB, #000000',
  }),
  JIRA_BOARD_KEYS: array({
    desc: 'A coma seperated list of of board keys. This will be used to find the issue key in the message that is send and will be used with SLACK_COLORS to find the right colour for the message (based on index). Please note that the more specific value has to be first so do `ABC, AB`.',
    example: 'ABC, DEF',
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
});

config = Object.assign({}, config, {
  DEVELOPMENT: process.env.NODE_ENV === 'development',
  PRODUCTION: process.env.NODE_ENV === 'production',
});

module.exports = (key) => {
  if (!key) return config;

  return config[key];
};
