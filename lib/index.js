const middleware = require('./middleware');
const routes = require('./routes');

module.exports = (config) => {
    return {
        middleware: middleware(config),
        routes: routes(config)
    };
};
