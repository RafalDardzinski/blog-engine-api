const { Error: MongooseError } = require('mongoose');

const Response = require('./response');
const IErrorHandler = require('./error-handler');

/**
 * Handles errors related to database engine.
 * @implements {IErrorHandler}
 */
class DatabaseErrorHandler extends IErrorHandler {
  /**
   * Informs if provided error can be handled by this class.
   * @param {Error} error Error object.
   * @returns {Boolean}
   */
  canHandle(error) {
    return error instanceof MongooseError || error.name === 'MongoError'; // TODO: check with documentation.
  }

  /**
   * Handles the provided error.
   * @param {Error} error Instance of error object.
   * @returns {Response} Http response to the provided error.
   */
  handle(error) {
    // TODO: Add more general handling of built-in Mongo driver errors e.g. MongoTimeoutError
    switch (true) {
      case error instanceof MongooseError.ValidationError:
        return this.handleValidationError(error);

      case error.code === 11000:
        return this.handleUniqueIndexError(error);

      default:
        return null;
    }
  }

  /**
   * Handles validation errors.
   * @param {MongooseError.ValidationError} error Cast error thrown by mongoose.
   * @returns {Response} Http response.
   */
  handleValidationError(error) {
    // TODO: expand this implementation.
    let message = 'Validation failed!';
    Object.values(error.errors).forEach((e) => {
      if (e instanceof MongooseError) {
        message += ` ${e.message}`;
      }
    });
    return new Response(400, message, error);
  }

  /**
   * Handles E11000 error.
   * @param {MongooseError} error Instance of E11000 error.
   */
  handleUniqueIndexError(error) {
    let message = 'Validation failed!';
    Object.keys(error.keyValue).forEach((prop) => {
      message += ` Provided ${prop} already exists!`;
    });
    return new Response(400, message, error);
  }
}

module.exports = DatabaseErrorHandler;
