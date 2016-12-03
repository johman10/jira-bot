const config = require('./config');
const botController = config['bot-controller'];
const jira = config.jira;
const envVariables = config['env-variables'];
const commands = require('./commands');

botController.hears("^link", ['direct_mention', 'direct_message'], commands.jira.link);
botController.hears([new RegExp(envVariables('JIRA_ISSUE_REGEX'), 'gi')], ['ambient', 'direct_message'], commands.jira.find);
