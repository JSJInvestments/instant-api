import auth from './auth';
import cors from './cors';
import logging from './logging';
import routes from './routes';

export { default as Actions } from './classes/Actions';
export { default as Controller } from './classes/Controller';
export { default as FirebaseRepository } from './classes/FirebaseRepository';

const initialize = config => {
  return {
    auth: auth(config),
    cors: cors(config),
    logging: logging(config),
    routes: routes(config),
  };
};

export { initialize };

export default initialize;
