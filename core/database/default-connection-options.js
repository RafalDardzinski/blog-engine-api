/**
 * Default options used when connecting to the database.
 */
const defaultOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

Object.freeze(defaultOptions);

module.exports = defaultOptions;
