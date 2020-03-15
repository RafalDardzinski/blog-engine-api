const winston = require('winston');
require('winston-mongodb');

// TODO: Add documentation.
module.exports = (databaseConfiguration) => {
  const isTestEnvironment = process.env.NODE_ENV === 'test';

  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: 'debug',
        format: winston.format.simple(),
        timestamp: true,
      }),
    ],
    format: winston.format.colorize(),
  });

  if (databaseConfiguration) {
    logger.add(new winston.transports.MongoDB({
      db: databaseConfiguration.getUri(),
      collection: 'Logs',
      level: 'info',
    }));
  }

  logger.silent = isTestEnvironment;
  return logger;
};
