const envVariables = require('./env-variables');
const JiraClient = require('jira-connector');

var jira = new JiraClient( {
    host: envVariables('JIRA_HOST'),
    basic_auth: {
        username: envVariables('JIRA_USERNAME'),
        password: envVariables('JIRA_PASSWORD')
    }
});

module.exports = jira
