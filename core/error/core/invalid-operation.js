const EngineError = require('./base');

/**
 * Indicates that operation cannot be performed in current context.
 */
class InvalidOperationError extends EngineError {}

module.exports = InvalidOperationError;
