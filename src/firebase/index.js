import path from 'path';
import admin from 'firebase-admin';
// import auth from './auth';
import firestore from './firestore';
// import storage from './storage';

const initializeApp = config => {
  if (config.serviceAccountKey) {
    const serviceAccount = require(path.join(
      process.cwd(),
      config.serviceAccountKey
    ));
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return app;
  }
};

export default (config = {}) => {
  return () => {
    const app = initializeApp(config);
    if (app) {
      return {
        app,
        // auth: auth(config),
        db: firestore(config),
        // storage: storage(config),
      };
    }
  };
};
