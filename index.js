require('dotenv').config();
const Botkit = require('botkit');
var JiraClient = require('jira-connector');
const production = process.env.PRODUCTION == 'true'

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

// give the bot something to listen for.
controller.hears([new RegExp(process.env.JIRA_ISSUE_REGEX, 'g')], ['ambient', 'direct_message'], function(bot, message) {
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
          color: issueNumber.match(process.env.SLACK_COLOR_REGEX) > -1 ? process.env.SLACK_COLOR_ONE : process.env.SLACK_COLOR_TWO,
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
