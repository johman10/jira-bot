const Botkit = require('botkit');
var JiraClient = require('jira-connector');
const production = process.env.PRODUCTION == 'true'

if (!production)
  require('dotenv').config();

var jira = new JiraClient( {
    host: process.env.JIRA_HOST,
    basic_auth: {
        username: process.env.JIRA_USERNAME,
        password: process.env.JIRA_PASSWORD
    }
});

var controller = Botkit.slackbot({
  debug: !production,
  log: !production
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_BOT_TOKEN,
}).startRTM();

controller.hears("^link", ['direct_mention', 'direct_message'], function(bot, message) {
  var issueNumbers = message.text.match(new RegExp(process.env.JIRA_ISSUE_REGEX, 'gi'));
  if (issueNumbers && issueNumbers.length == 2) {
    var outwardIssue = issueNumbers[0];
    var inwardIssue = issueNumbers[1];
    // TODO: improve those matches to include more syntaxes
    // TODO: make the different link types dynamically by loading them on server start through the jira.issueLinkType functions
    var linkType = message.text.match(/is blocked by|relates to|is duplicated by|is caused by/i)
    if (linkType) {
      // TODO: probably move this to another place
      var linkMap = [
        {
          name: 'Blocks',
          type: 'is blocked by'
        },
        {
          name: 'Duplicate',
          type: 'is duplicated by'
        },
        {
          name: 'Problem/Incident',
          type: 'is caused by'
        },
        {
          name: 'Relates',
          type: 'relates to'
        }
      ]
      var linkName = linkMap.find((link) => { return link.type == linkType[0] }).name;
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
          console.log('error: ' + error)
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
});

// give the bot something to listen for.
controller.hears(new RegExp(process.env.JIRA_ISSUE_REGEX, 'gi'), ['ambient', 'direct_message'], function(bot, message) {
  var messagePromises = [];
  message.match.forEach((issueNumber) => {
    messagePromises.push(createMessage(issueNumber));
  })

  Promise.all(messagePromises).then((attachments) => {
    bot.reply(message, { attachments });
  })
});

function createMessage(issueNumber) {
  return new Promise((resolve, reject) => {
    jira.issue.getIssue({ issueKey: issueNumber }, function(error, issue) {
      if (error) {
        console.log('error: ' + error)
        resolve();
      }

      var attachments = [];

      if (issue) {
        resolve({
          color: issueNumber.match(process.env.SLACK_COLOR_REGEX) ? process.env.SLACK_COLOR_ONE : process.env.SLACK_COLOR_TWO,
          title: issueNumber + ' - ' + issue.fields.summary,
          title_link: process.env.JIRA_ISSUE_URL + issueNumber,
          text: issue.fields.description,
          fields: [
            {
              title: "Status",
              value: issue.fields.status.name,
              short: true
            },
            {
              title: "Assignee",
              value: issue.fields.assignee ? issue.fields.assignee.name : 'No one',
              short: true
            }
          ],
        });
      }
    });
  })
}


