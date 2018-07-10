const HttpStatusCodes = require('http-status-codes');
const CircularJSON = require('circular-json');

const handleResponse = (config) => {
    return (res, fn) => {
        // fn.then((response) => {
        //     if (!response) { return res.status(HttpStatusCodes.NOT_FOUND).send(); }
        //     return res.status(HttpStatusCodes.OK).send(response.data);
        // }).catch((err) => res.send(CircularJSON.stringify(err)));
        fn.then(() => res.send('success')).catch(() => res.send('error'))
    }
}

module.exports = (config) => {
    const thenRespond = (res, response) => {
        if (!response) { return res.status(HttpStatusCodes.NOT_FOUND).send(); }
        return res.status(HttpStatusCodes.OK).send(response.data);

    };

    const catchResponse = (res, response) => {
        if (!response) { return res.status(HttpStatusCodes.NOT_FOUND).send(); }
        return res.status(HttpStatusCodes.OK).send(response.data);

    };

    return {
        handleResponse: handleResponse(config),
        thenRespond,
        catchResponse
    }
};
