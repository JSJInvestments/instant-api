'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressBasicAuth = require('express-basic-auth');

var _expressBasicAuth2 = _interopRequireDefault(_expressBasicAuth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ensureAuthenticated = function ensureAuthenticated(config) {
  return (0, _expressBasicAuth2.default)({
    users: config.users
  });
};

exports.default = function (config) {
  return ensureAuthenticated(config);
};