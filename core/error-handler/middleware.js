// TODO: add env support
// TODO: expand the implementation
const { LoggerFactory } = require('../logger');

// eslint-disable-next-line
function errorHandlerMiddleware(error, req, res, next) {
  const { message, httpCode } = error;
  if (typeof httpCode === 'number') {
    return res.status(httpCode).json({ message });
  }

  const logger = LoggerFactory.create();
  logger.error(message);
  logger.error(error.stack);
  return res.status(500).json({ message });
}

module.exports = errorHandlerMiddleware;
