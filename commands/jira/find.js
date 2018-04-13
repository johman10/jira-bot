const { URL } = require('url');
const config = require('../../config');
const { getBoardRegex } = require('../../modules/jira-regex');

const envVariables = config['env-variables'];
const { jira } = config;
const i18n = config.locales;

function findIssue(bot, message) {
  const messagePromises = [];
  message.match.forEach((issueKey) => {
    messagePromises.push(createMessage(issueKey));
  });

  Promise.all(messagePromises).then((attachments) => {
    bot.replyInThread(message, { attachments });
  }).catch(() => {
    bot.replyInThread(message, i18n.t('jira.find.error.not_found'));
  });
}

function getColor(issueKey) {
  const colorIndex = envVariables('JIRA_BOARD_KEYS').findIndex(boardKey => issueKey.match(getBoardRegex(boardKey)));
  return envVariables('SLACK_COLORS')[colorIndex];
}

function createMessage(issueKey) {
  return new Promise((resolve, reject) => {
    jira.issue.getIssue({ issueKey }, (error, issue) => {
      if (error || !issue) {
        console.error('ERROR: ', error); // eslint-disable-line no-console
        reject();
        return;
      }

      const color = getColor(issueKey);
      const issueUrl = new URL('browse', envVariables('JIRA_URL'));
      issueUrl.pathname = `${issueUrl.pathname}/${issueKey}`;

      resolve({
        color,
        title: `${issueKey} - ${issue.fields.summary}`,
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
