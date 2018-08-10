'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initializeLogging = function initializeLogging(config) {
  var transports = [new _winston2.default.transports.Console({ format: _winston2.default.format.simple() })];

  if (process.env.NODE_ENV === 'production') {
    if (config.error && config.error.filename) {
      transports.push(new _winston2.default.transports.File({
        filename: config.error.filename,
        level: 'error'
      }));
    }
    if (config.combined && config.combined.filename) {
      transports.push(new _winston2.default.transports.File({ filename: config.combined.filename }));
    }
  }

  var logger = _winston2.default.createLogger({
    level: 'info',
    format: _winston2.default.format.json(),
    transports: transports
  });

  return logger;
};

exports.default = function (config) {
  return function () {
    return initializeLogging(config.logging);
  };
};