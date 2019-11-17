// TODO: Add UT and review documentation.

const { Error: MongooseError } = require('mongoose');
const Response = require('./response');

/**
 * Handles errors related to database engine.
 */
class DatabaseErrorHandler {
  /**
   * Checks whether the error can be handled by the class.
   * @param {Error} error Error object.
   * @returns {Boolean}
   */
  static canHandle(error) {
    return error instanceof MongooseError || error.name === 'MongoError'; // TODO: check with documentation.
  }

  static handle(error) {
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
  static handleValidationError(error) {
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
  static handleUniqueIndexError(error) {
    let message = 'Validation failed!';
    Object.keys(error.keyValue).forEach((prop) => {
      message += ` Provided ${prop} already exists!`;
    });
    return new Response(400, message, error);
  }
}

module.exports = DatabaseErrorHandler;
