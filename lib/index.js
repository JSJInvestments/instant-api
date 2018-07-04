const auth = require('./auth');
const middleware = require('./middleware');
const routes = require('./routes');

module.exports = (config) => {
    return {
        auth: auth(config),
        middleware: middleware(config),
        routes: routes(config)
    };
};
