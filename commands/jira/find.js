const { URL } = require('url');
const config = require('../../config');

const envVariables = config['env-variables'];
const { jira } = config;
const i18n = config.locales;

function findIssue(bot, message) {
  const messagePromises = [];
  message.match.forEach((issueNumber) => {
    messagePromises.push(createMessage(issueNumber));
  });

  Promise.all(messagePromises).then((attachments) => {
    bot.replyInThread(message, { attachments });
  }).catch(() => {
    bot.replyInThread(
      message,
      i18n.t('jira.find.error.not_found'),
    );
  });
}

function createMessage(issueNumber) {
  return new Promise((resolve, reject) => {
    jira.issue.getIssue({ issueKey: issueNumber }, (error, issue) => {
      if (error || !issue) {
        console.error('ERROR: ', error); // eslint-disable-line no-console
        reject();
        return;
      }

      let color = envVariables('SLACK_COLOR_ONE');
      if (envVariables('SLACK_COLOR_REGEX') && issueNumber.match(envVariables('SLACK_COLOR_REGEX'))) {
        color = envVariables('SLACK_COLOR_TWO');
      }

      const issueUrl = new URL('browse', envVariables('JIRA_URL'));
      issueUrl.pathname = `${issueUrl.pathname}/${issueNumber}`;

      resolve({
        color,
        title: `${issueNumber} - ${issue.fields.summary}`,
        title_link: issueUrl.toString(),
        text: issue.fields.description,
        fields: [
          {
            title: 'Status',
            value: issue.fields.status.name,
            short: true,
          },
          {
            title: 'Assignee',
            value: issue.fields.assignee ? issue.fields.assignee.name : 'No one',
            short: true,
          },
        ],
      });
    });
  });
}

module.exports = findIssue;
