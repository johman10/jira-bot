const config = require('./config');
const botController = config['bot-controller'];
const jira = config.jira;
const envVariables = config['env-variables'];
const commands = require('./commands');
const listenFor = [
  {
    regex: '^link',
    on: ['direct_mention', 'direct_message'],
    handler: commands.jira.link
  },
  {
    regex: [new RegExp(envVariables('JIRA_ISSUE_REGEX'), 'gi')],
    on: ['ambient', 'direct_message'],
    handler: commands.jira.find
  }
]

listenFor.forEach((listenItem) => {
  botController.hears(listenItem.regex, listenItem.on, listenItem.handler);
});
