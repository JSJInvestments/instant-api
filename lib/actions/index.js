const responder = config => {
  return (req, res) => {
    return promise => {
      promise.then(res.send('then')).catch(res.send('catch'));
    };
  };
};

module.exports = config => {
  const _config = config.actions || {};
  return {
    responder: responder(_config),
  };
};

// Alternative:

// module.exports = (config) => {
//     const respond = () => {
//
//     };

//     return {
//         respond
//     }
// };
