const config = require('./config');

const botController = config['bot-controller'];
const commands = require('./commands');
const { getIssueRegexString, getIssueRegex } = require('./modules/jira-regex');

const listenFor = [
  {
    regex: '^link',
    on: ['mention', 'direct_mention', 'direct_message'],
    handler: commands.jira.link,
  },
  {
    regex: new RegExp(`^assign me to (${getIssueRegexString()})`, 'i'),
    on: ['mention', 'direct_mention', 'direct_message'],
    handler: commands.jira.assign,
  },
  {
    regex: getIssueRegex(),
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
    handler: commands.jira.whoami,
  },
  {
    regex: new RegExp('love|heart', 'gi'),
    on: ['direct_message', 'mention', 'direct_mention'],
    handler: commands.love,
  },
  {
    regex: new RegExp('help', 'gi'),
    on: ['direct_message', 'mention', 'direct_mention'],
    handler: commands.help,
  },
];

listenFor.forEach((listenItem) => {
  botController.hears(listenItem.regex, listenItem.on, listenItem.handler);
});
