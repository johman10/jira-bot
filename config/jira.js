const envVariables = require('./env-variables');
const JiraClient = require('jira-connector');

const jira = new JiraClient({
  host: envVariables('JIRA_URL'),
  basic_auth: {
    username: envVariables('JIRA_USERNAME'),
    password: envVariables('JIRA_PASSWORD'),
  },
});

module.exports = jira;
