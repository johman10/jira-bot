const config = require('../../config');
const envVariables = config['env-variables'];
const i18n = config.locales;
const jira = config.jira;

const linkMap = [
  {
    name: 'Blocks',
    options: ['is blocked by', 'blocked by']
  },
  {
    name: 'Duplicate',
    options: ['is duplicated by', 'is duplicate of']
  },
  {
    name: 'Problem/Incident',
    options: ['is caused by', 'is because of', 'is created because of']
  },
  {
    name: 'Relates',
    options: ['relates to', 'is related to']
  }
]

function linkIssues(bot, message) {
  var issues = findIssues(bot, message);
  var linkName = findLinkName(bot, message);
  if (issues && linkName) {
    createLink(bot, message, issues, linkName);
  }
};

function findIssues(bot, message) {
  var issueNumbers = message.text.match(new RegExp(envVariables('JIRA_ISSUE_REGEX'), 'gi'));
  if (issueNumbers && issueNumbers.length == 2) {
    return issueNumbers;
  } else {
    bot.replyInThread(message, i18n.t('jira.link.error.message'))
    return;
  }
}

function findLinkName(bot, message) {
  var linkRegex = linkMap.map((link) => { return link.options.join('|') }).join('|');
  var linkType = message.text.match(new RegExp(linkRegex, 'i'))
  if (linkType) {
    var linkName = linkMap.find((link) => { return link.options.indexOf(linkType[0]) > -1 }).name;
    return linkName;
  } else {
    bot.replyInThread(message, i18n.t('jira.link.error.message'));
    return;
  }
}

function buildJiraBody(linkName, issues) {
  return {
    issueLink: {
      type: {
        name: linkName
      },
      outwardIssue: {
        key: issues[0]
      },
      inwardIssue: {
        key: issues[1]
      }
    }
  }
}

function createLink(bot, message, issues, linkName) {
  var linkBody = buildJiraBody(linkName, issues);
  jira.issueLink.createIssueLink(linkBody, function(error, response) {
    if (error) {
      bot.replyInThread(message, i18n.t('jira.link.error.api'));
      return;
    }

    bot.replyInThread(message, i18n.t('jira.link.success', { issue1: issues[0], issue2: issues[1] }))
  });
}

module.exports = linkIssues;
