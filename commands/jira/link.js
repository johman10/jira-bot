const config = require('../../config');

const envVariables = config['env-variables'];
const i18n = config.locales;
const { jira } = config;

const linkMap = [
  {
    name: 'Blocks',
    options: ['is blocked by', 'blocked by'],
  },
  {
    name: 'Duplicate',
    options: ['is duplicated by', 'is duplicate of'],
  },
  {
    name: 'Problem/Incident',
    options: ['is caused by', 'is because of', 'is created because of'],
  },
  {
    name: 'Relates',
    options: ['relates to', 'is related to'],
  },
];

function linkIssues(bot, message) {
  const issues = findIssues(bot, message);
  const linkName = findLinkName(bot, message);
  if (issues && linkName) {
    createLink(bot, message, issues, linkName);
  }
}

function findIssues(bot, message) {
  const issueNumbers = message.text.match(new RegExp(envVariables('JIRA_ISSUE_REGEX'), 'gi'));
  if (issueNumbers && issueNumbers.length === 2) {
    return issueNumbers;
  }
  return bot.replyInThread(message, i18n.t('jira.link.error.message'));
}

function findLinkName(bot, message) {
  const linkRegex = linkMap.map(link => link.options.join('|')).join('|');
  const linkType = message.text.match(new RegExp(linkRegex, 'i'));
  if (linkType) {
    const linkName = linkMap.find(link => link.options.indexOf(linkType[0]) > -1).name;
    return linkName;
  }
  return bot.replyInThread(message, i18n.t('jira.link.error.message'));
}

function buildJiraBody(linkName, issues) {
  return {
    issueLink: {
      type: {
        name: linkName,
      },
      outwardIssue: {
        key: issues[0],
      },
      inwardIssue: {
        key: issues[1],
      },
    },
  };
}

function createLink(bot, message, issues, linkName) {
  const linkBody = buildJiraBody(linkName, issues);
  jira.issueLink.createIssueLink(linkBody, (error) => {
    if (error) {
      bot.replyInThread(message, i18n.t('jira.link.error.api'));
      return;
    }

    bot.replyInThread(message, i18n.t('jira.link.success', { issue1: issues[0], issue2: issues[1] }));
  });
}

module.exports = linkIssues;
