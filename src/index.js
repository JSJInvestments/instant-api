import auth from './auth';
import cors from './cors';
import logging from './logging';
import routes from './routes';

export default config => {
  return {
    auth: auth(config),
    cors: cors(config),
    logging: logging(config),
    routes: routes(config),
  };
};
