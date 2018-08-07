const res = require('./res');

module.exports = config => {
  return {
    res: res(config),
  };
};
