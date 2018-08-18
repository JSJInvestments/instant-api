import auth from './auth';
import cors from './cors';
import firebase from './firebase';
import logging from './logging';
import routes from './routes';

export { default as Actions } from './classes/Actions';
export { default as Controller } from './classes/Controller';
export { default as FirestoreRepository } from './classes/FirestoreRepository';

const initialize = (config = {}) => {
  return {
    auth: auth(config.auth),
    cors: cors(config.cors),
    firebase: firebase(config.firebase),
    logging: logging(config.logging),
    routes: routes(config.routes),
  };
};

export { initialize };

export default initialize;
