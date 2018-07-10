const winston = require('winston');

const initializeLogging = (config) => {
    let transports = [new winston.transports.Console({ format: winston.format.simple() })];

    if (process.env.NODE_ENV === 'production') {
        if (config.error && config.error.filename) {
            transports.push(new winston.transports.File({ filename: config.error.filename, level: 'error' }));
        }
        if (config.combined && config.combined.filename) {
            transports.push(new winston.transports.File({ filename: config.combined.filename }));
        }
    }

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports
    });

    return logger;
};

module.exports = (config) => {
    return () => {
        return initializeLogging(config.get('logging'));
    };
};