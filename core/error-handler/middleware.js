// TODO: add env support
// TODO: expand the implementation
// TODO: add UT for handlers.
const { LoggerFactory } = require('../logger');

const DatabaseErrorHandler = require('./database-error-handler');
const BusinessLogicErrorHandler = require('./business-logic-error-handler');
const Response = require('./response');

// eslint-disable-next-line
function errorHandlerMiddleware(error, req, res, next) {
  /** @type {Response} */
  let response;
  if (DatabaseErrorHandler.canHandle(error)) {
    response = DatabaseErrorHandler.handle(error);
  } else if (BusinessLogicErrorHandler.canHandle(error)) {
    response = BusinessLogicErrorHandler.handle(error);
  }

  if (!response) {
    response = new Response(500, error.message, error);
  }

  const { httpCode, message } = response;
  const logger = LoggerFactory.create();
  logger.error(message);
  logger.error(error.stack);
  return res.status(httpCode).json({ message });
}

module.exports = errorHandlerMiddleware;
