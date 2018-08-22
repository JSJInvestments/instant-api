import session from 'express-session';

export default (config = {}) => {
  return () => {
    return session(config);
  };
};
