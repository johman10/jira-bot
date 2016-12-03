const config = require('../../config');
const envVariables = config['env-variables'];
const jira = config.jira;

function findIssue(bot, message) {
  var messagePromises = [];
  message.match.forEach((issueNumber) => {
    messagePromises.push(createMessage(issueNumber));
  })

  Promise.all(messagePromises).then((attachments) => {
    bot.reply(message, { attachments });
  }).catch(() => {
    bot.reply(
      message,
      "I thought I heard you talking about an issues just a second ago, but I was unable to find it on JIRA. I'm sorry. :(");
  })
}

function createMessage(issueNumber) {
  return new Promise((resolve, reject) => {
    jira.issue.getIssue({ issueKey: issueNumber }, function(error, issue) {
      if (error || !issue) {
        console.debug('ERROR: ', error)
        reject();
      }

      var attachments = [];
      resolve({
        color: issueNumber.match(envVariables('SLACK_COLOR_REGEX')) ? envVariables('SLACK_COLOR_ONE') : envVariables('SLACK_COLOR_TWO'),
        title: issueNumber + ' - ' + issue.fields.summary,
        title_link: envVariables('JIRA_ISSUE_URL') + issueNumber,
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
    });
  })
}

module.exports = findIssue;
