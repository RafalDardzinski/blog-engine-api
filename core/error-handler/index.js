const MiddlewareFactory = require('./middleware-factory');
const BusinessLogicErrorHandler = require('./business-logic-error-handler');
const DatabaseErrorHandler = require('./database-error-handler');
const ErrorHandlerRouter = require('./error-handler-router');

module.exports = {
  MiddlewareFactory,
  ErrorHandlerRouter,
  errorHandlers: {
    BusinessLogicErrorHandler: new BusinessLogicErrorHandler(),
    DatabaseErrorHandler: new DatabaseErrorHandler(),
  },
};
