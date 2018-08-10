'use strict';

var loadAuthentication = function loadAuthentication(config) {
  var method = config.method || 'none';
  console.log('Using auth method: ' + method);
  if (method === 'none') {
    return function (req, res, next) {
      next();
    };
  }
  var instantAuth = require('./' + method); // eslint-disable-line global-require
  return instantAuth(config);
};

module.exports = function (config) {
  return function () {
    return loadAuthentication(config.auth);
  };
};