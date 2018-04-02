const dotenv = require('dotenv');

const ENV = process.env.NODE_ENV || 'development';

if (ENV === 'development') dotenv.load();

const config = Object.assign(process.env, {
  DEVELOPMENT: ENV === 'development',
  PRODUCTION: ENV === 'production',
});

module.exports = (key) => {
  if (!key) return config;

  return config[key];
};
