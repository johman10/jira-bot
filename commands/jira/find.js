const { URL } = require('url');
const config = require('../../config');
const { getBoardRegex } = require('../../modules/jira-regex');

const envVariables = config['env-variables'];
const { jira } = config;
const i18n = config.locales;

function findIssue(bot, message) {
  const replyPromises = [];
  message.match.forEach((issueKey) => {
    replyPromises.push(createReply(issueKey));
  });

  Promise.all(replyPromises).then((replyMessage) => {
    bot.replyInThread(message, { attachments: replyMessage });
  }).catch(() => {
    bot.replyInThread(message, i18n.t('jira.find.error.not_found'));
  });
}

function getColor(issueKey) {
  const colorIndex = envVariables('JIRA_BOARD_KEYS').findIndex(boardKey => issueKey.match(getBoardRegex(boardKey)));
  return envVariables('SLACK_COLORS')[colorIndex];
}

function createReply(issueKey) {
  return jira.issue.getIssue({ issueKey })
    .then((issue) => {
      const color = getColor(issueKey);
      const issueUrl = new URL('browse', envVariables('JIRA_URL'));
      issueUrl.pathname = `${issueUrl.pathname}/${issueKey}`;

      return {
        color,
        title: `${issueKey} - ${issue.fields.summary}`,
        title_link: issueUrl.toString(),
        text: issue.fields.description,
        fields: [
          {
            title: 'Status', // TODO: Remove hardcoded string
            value: issue.fields.status.name,
            short: true,
          },
          {
            title: 'Assignee', // TODO: Remove hardcoded string
            value: issue.fields.assignee ? issue.fields.assignee.name : 'No one', // TODO: Remove hardcoded string
            short: true,
          },
        ],
      };
    })
    .catch((error) => {
      console.error('ERROR: ', error); // eslint-disable-line no-console
    });
}

module.exports = findIssue;
