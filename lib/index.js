'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _cors = require('./cors');

var _cors2 = _interopRequireDefault(_cors);

var _logging = require('./logging');

var _logging2 = _interopRequireDefault(_logging);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
  return {
    auth: (0, _auth2.default)(config),
    cors: (0, _cors2.default)(config),
    logging: (0, _logging2.default)(config),
    routes: (0, _routes2.default)(config)
  };
};