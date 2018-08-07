const basicAuth = require('express-basic-auth');

const ensureAuthenticated = config => {
  return basicAuth({
    users: config.users,
  });
};

module.exports = config => {
  return ensureAuthenticated(config);
};
