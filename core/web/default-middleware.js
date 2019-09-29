const morgan = require('morgan');
const bodyParser = require('body-parser');

/**
 * Default middleware to inject to server request handler.
 * @param {Logger} logger Logger adapter.
 */
const defaultMiddleware = logger => [
  morgan('dev', {
    stream: logger.stream,
  }),
  bodyParser.json(),
];

module.exports = defaultMiddleware;
/**
 * @typedef {import('../logger/logger')} Logger
 */
