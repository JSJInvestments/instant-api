
const path = require('path');
const glob = require('glob');
const express = require('express');

const autoConfigure = (router, config) => {
    const files = glob.sync(`${config.path}/*.js`);
    if (!files) {
        console.error(`No API routes detected in ${config.path}`);
    } else {
        files.forEach((filePath) => {
            const relative = path.relative(config.path, filePath);
            const relativeNoExt = relative.slice(0, -3);
            const route = `/${relativeNoExt}`;
            const file = require(path.join(config.path, relativeNoExt));
            console.info(`Adding route ${route}`);
            router.use(route, file);
        });
    }
    return router;
};

module.exports = (config) => {
    return () => {
        var router = express.Router();

        // Auto-configure routes
        autoConfigure(router, config.get('routes'));

        return router;
    };
};
