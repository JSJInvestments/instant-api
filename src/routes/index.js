import fs from 'fs';
import path from 'path';
import glob from 'glob';
import express from 'express';

const getDirectories = srcpath => {
  return fs
    .readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
};

const configureVersions = (router, config) => {
  const versionPaths = getDirectories(config.base); //fs.readdirSync(config.base)
  versionPaths.forEach(filePath => {
    const version = path.relative(config.base, filePath);
    configureRoutes(router, path.join(filePath, config.dir), version);
  });
};

const configureRoutes = (router, routesPath, prefix) => {
  const files = glob.sync(`${routesPath}/*.js`);
  if (!files || files.length === 0) {
    console.error(`No API routes detected in ${routesPath}`);
  } else {
    files.forEach(filePath => {
      const basename = path.basename(filePath, '.js');
      const route = prefix ? `/${prefix}/${basename}` : `/${basename}`;
      const file = require(path.join(routesPath, basename));
      console.info(`Adding route ${route}`);
      router.use(route, file);
    });
  }
};

const autoConfigureRoutes = (router, config) => {
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

export default config => {
  return () => {
    const router = express.Router();
    // Auto-configure routes
    autoConfigureRoutes(router, config.routes);
    return router;
  };
};