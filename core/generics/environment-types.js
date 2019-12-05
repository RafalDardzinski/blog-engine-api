/**
 * List of types of environment the app can run in.
 * @enum {String}
 */
const ENVIRONMENT_TYPES = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test',
};

Object.freeze(ENVIRONMENT_TYPES);
module.exports = ENVIRONMENT_TYPES;
