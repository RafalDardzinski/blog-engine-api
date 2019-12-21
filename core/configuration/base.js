// TODO: implement this in other configuration classes.

/**
 * Provides utilities to get values from environment variables.
 * @abstract
 */
class Configuration {
  /**
   * @param {String} prefix Prefix used to define variable area.
   */
  constructor(prefix) {
    this.prefix = prefix;
  }

  /**
   * Gets environment variable value.
   * @param {String} variableName Name of a variable to get.
   */
  getValue(variableName) {
    const fullName = `${this.prefix}_${variableName}`;
    return process.env[fullName];
  }
}

module.exports = Configuration;
