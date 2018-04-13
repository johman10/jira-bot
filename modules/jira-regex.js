const config = require('../config');

const envVariables = config['env-variables'];

function getBoardRegexString(boardKey) {
  return `(${boardKey}\-([0-9]{1,}))`; // eslint-disable-line no-useless-escape
}

exports.getIssueRegexString = function getIssueRegexString() {
  return envVariables('JIRA_BOARD_KEYS').map(getBoardRegexString).join('|');
};

exports.getBoardRegex = function getBoardRegex(boardKey, flags = 'ig') {
  return new RegExp(getBoardRegexString(boardKey), flags);
};

exports.getIssueRegex = function getIssueRegex(flags = 'ig') {
  return new RegExp(exports.getIssueRegexString(), flags);
};
