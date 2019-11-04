// TODO: add unit tests and documentation.
const assert = require('assert');
const { InvalidOperationError } = require('../error');

class Ensure {
  static isDefined(value, valueName, message) {
    try {
      assert.ok(value);
    } catch (e) {
      let errorMessage = valueName ? `${valueName} has to be defined!` : 'One of the required values is not defined!';
      if (message) {
        errorMessage += ` ${message}`;
      }
      throw new InvalidOperationError(errorMessage);
    }
  }
}

module.exports = Ensure;
