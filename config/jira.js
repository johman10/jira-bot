const { URL } = require('url');
const envVariables = require('./env-variables');
const JiraClient = require('jira-connector');

const jira = new JiraClient({
  host: new URL(envVariables('JIRA_URL')).hostname,
  basic_auth: {
    username: envVariables('JIRA_USERNAME'),
    password: envVariables('JIRA_PASSWORD'),
  },
});

module.exports = jira;
