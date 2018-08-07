const actions = require('./actions');
const auth = require('./auth');
const logging = require('./logging');
const middleware = require('./middleware');
const routes = require('./routes');
const utils = require('./utils');

module.exports = config => {
  return {
    actions: actions(config),
    auth: auth(config),
    logging: logging(config),
    middleware: middleware(config),
    routes: routes(config),
    utils: utils(config),
  };
};
