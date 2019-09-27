const EngineError = require('./base');

/**
 * Indicates that the abstract method hasn't been implemented.
 */
class MissingImplementationError extends EngineError {}

module.exports = MissingImplementationError;
