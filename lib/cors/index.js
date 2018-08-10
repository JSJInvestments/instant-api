const cors = require('cors');

module.exports = config => {
  return () => {
    return cors({
      origin: true,
    });
  };
};
