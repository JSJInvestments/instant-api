import session from 'cookie-session';

export default (config = {}) => {
  return () => {
    return session(config);
  };
};
