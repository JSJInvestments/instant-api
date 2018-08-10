'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDirectories = function getDirectories(srcpath) {
  return _fs2.default.readdirSync(srcpath).map(function (file) {
    return _path2.default.join(srcpath, file);
  }).filter(function (path) {
    return _fs2.default.statSync(path).isDirectory();
  });
};

var configureVersions = function configureVersions(router, config) {
  var versionPaths = getDirectories(config.base); //fs.readdirSync(config.base)
  versionPaths.forEach(function (filePath) {
    var version = _path2.default.relative(config.base, filePath);
    configureRoutes(router, _path2.default.join(filePath, config.dir), version);
  });
};

var configureRoutes = function configureRoutes(router, routesPath, prefix) {
  var files = _glob2.default.sync(routesPath + '/*.js');
  if (!files || files.length === 0) {
    console.error('No API routes detected in ' + routesPath);
  } else {
    files.forEach(function (filePath) {
      var basename = _path2.default.basename(filePath, '.js');
      var route = prefix ? '/' + prefix + '/' + basename : '/' + basename;
      var file = require(_path2.default.join(routesPath, basename));
      console.info('Adding route ' + route);
      router.use(route, file);
    });
  }
};

var autoConfigureRoutes = function autoConfigureRoutes(router, config) {
  // Routes path provided
  if (config.path) {
    configureRoutes(router, config.path);
  }
  // Versioned routes
  else {
      configureVersions(router, config);
    }
  return router;
};

exports.default = function (config) {
  return function () {
    var router = _express2.default.Router();
    // Auto-configure routes
    autoConfigureRoutes(router, config.routes);
    return router;
  };
};