const config = require('../../config');
const envVariables = config['env-variables'];
const jira = config.jira
// TODO: probably move this to another place
const linkMap = [
  {
    name: 'Blocks',
    options: ['is blocked by', 'is blocking', 'blocks']
  },
  {
    name: 'Duplicate',
    options: ['is duplicated by', 'is duplicate of']
  },
  {
    name: 'Problem/Incident',
    options: ['is caused by', 'is because of']
  },
  {
    name: 'Relates',
    options: ['relates to', 'is related to']
  }
]

function linkIssues(bot, message) {
  var issueNumbers = message.text.match(new RegExp(envVariables('JIRA_ISSUE_REGEX'), 'gi'));
  if (issueNumbers && issueNumbers.length == 2) {
    var outwardIssue = issueNumbers[0];
    var inwardIssue = issueNumbers[1];
    // TODO: improve those matches to include more syntaxes
    // TODO: make the different link types dynamically by loading them on server start through the jira.issueLinkType functions
    var linkRegex = linkMap.map((link) => { console.log(link.options); return link.options.join('|') }).join('|');
    var linkType = message.text.match(new RegExp(linkRegex, 'i'))
    if (linkType) {
      var linkName = linkMap.find((link) => { return link.options.indexOf(linkType[0]) > -1 }).name;
      var linkBody = {
        issueLink: {
          type: {
              name: linkName
          },
          inwardIssue: {
              key: inwardIssue
          },
          outwardIssue: {
              key: outwardIssue
          }
        }
      }
      jira.issueLink.createIssueLink(linkBody, function(error, response) {
        if (error) {
          console.debug('ERROR: ' + error)
          bot.reply(
            message,
            "I tried to link two issues but I failed. :( There was an error when requesting the API, please try again later"
          )
          return;
        }

        bot.reply(
          message,
          'The link between ' + issueNumbers[0] + ' & ' + issueNumbers[1] + ' was successfully created. Please double check JIRA to make sure that it was done correctly.'
        )
      });
    } else {
      bot.reply(
        message,
        "I tried to link two issues but I failed. :( I couldn't find the link type in your message. Please follow the following pattern: *link REF-<number> is blocked by RE-<number>*. Link type can be one of the following: is blocked by, relates to, is duplicated by, is caused by."
      )
    }
  } else {
    bot.reply(
      message,
      "I tried to link two issues but I failed. :( I couldn't find the issue numbers in your message. Please follow the following pattern: *link REF-<number> is blocked by RE-<number>*"
    )
  }
};

module.exports = linkIssues;
