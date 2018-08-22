module.exports = (config = {}) => {
  const type = config.type || 'express';
  console.log(`Using session type: ${type}`);
  const session = require(`./${type}`).default; // eslint-disable-line global-require
  return session(config.options);
};
