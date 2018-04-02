const config = require('./config');

const botController = config['bot-controller'];
const envVariables = config['env-variables'];
const commands = require('./commands');

const listenFor = [
  {
    regex: '^link',
    on: ['mention', 'direct_message'],
    handler: commands.jira.link,
  },
  {
    regex: [new RegExp(`assign me to ${envVariables('JIRA_ISSUE_REGEX')}`, 'i')],
    on: ['mention', 'direct_message'],
    handler: commands.jira.assign,
  },
  {
    regex: [new RegExp(envVariables('JIRA_ISSUE_REGEX'), 'gi')],
    on: ['ambient', 'direct_message'],
    handler: commands.jira.find,
  },
  {
    regex: '^register',
    on: ['direct_message'],
    handler: commands.jira.register,
  },
  {
    regex: '^whoami',
    on: ['direct_message'],
    handler: commands.jira.registration,
  },
  {
    regex: [new RegExp('[love|heart]', 'gi')],
    on: ['direct_message', 'mention'],
    handler: commands.love,
  },
];

listenFor.forEach((listenItem) => {
  botController.hears(listenItem.regex, listenItem.on, listenItem.handler);
});
