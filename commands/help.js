const config = require('../config');

const i18n = config.locales;

function help(bot, message) {
  const reply = {
    text: i18n.t('help.text'),
    attachments: [
      {
        fallback: `${i18n.t('help.assign.title')} - ${i18n.t('help.assign.text')}`,
        title: i18n.t('help.assign.title'),
        text: i18n.t('help.assign.text'),
        mrkdwn_in: ['text'],
      },
      {
        fallback: `${i18n.t('help.link.title')} - ${i18n.t('help.link.text')}`,
        title: i18n.t('help.link.title'),
        text: i18n.t('help.link.text'),
        mrkdwn_in: ['text'],
      },
      {
        fallback: `${i18n.t('help.register.title')} - ${i18n.t('help.register.text')}`,
        title: i18n.t('help.register.title'),
        text: i18n.t('help.register.text'),
        mrkdwn_in: ['text'],
      },
      {
        fallback: `${i18n.t('help.whoami.title')} - ${i18n.t('help.whoami.text')}`,
        title: i18n.t('help.whoami.title'),
        text: i18n.t('help.whoami.text'),
        mrkdwn_in: ['text'],
      },
    ],
  };
  bot.replyInThread(message, reply);
}

module.exports = help;
