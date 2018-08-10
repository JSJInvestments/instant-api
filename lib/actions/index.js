const responder = config => {
  return (req, res) => {
    return promise => {
      promise.then(res.send('then')).catch(res.send('catch'));
    };
  };
};

module.exports = config => {
  return {
    responder: responder(config.actions),
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
