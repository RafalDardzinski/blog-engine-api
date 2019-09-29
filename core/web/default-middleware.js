const morgan = require('morgan');
const bodyParser = require('body-parser');

/**
 * TODO: Configure morgan to use regular logger.
 * TODO: TODO: Add additional middleware.
 */
module.exports = () => [
  morgan('dev'),
  bodyParser.json(),
];
