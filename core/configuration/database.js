const { InvalidOperationError } = require('../error');

const _key = new WeakMap();

/**
 * Contains information used for configuring connection with a database.
 */
class DatabaseConfiguration {
  /**
   * @param {string} key Key used to identify config related to particular database in .env file.
   */
  constructor(key) {
    _key.set(this, key);
  }

  /**
   * Database URI, value depends on information in .env file.
   * @returns {string} Database URI.
   * @throws {InvalidOperationError} Both HOST and DATABASE must be specified.
   * @throws {InvalidOperationError} USERNAME and PASSWORD must be defined both
   * or both must not be defined at all
   */
  getUri() {
    const {
      dbConfigKey, host, database, username, password,
    } = this;
    if (!host || !database) throw new InvalidOperationError(`Could not find HOST or DATABASE for ${dbConfigKey}. Please check the .env file.`);
    let uri = 'mongodb://';

    if (username || password) {
      if (!username) throw new InvalidOperationError(`Could not find USERNAME for ${dbConfigKey}`);
      if (!password) throw new InvalidOperationError(`Could not find PASSWORD for ${dbConfigKey}`);
      uri += `${username}:${password}@`;
    }

    uri += `${host}/${database}`;
    return uri;
  }

  /**
   * Key used to derive configuration from .env file.
   * @readonly
   * @returns {string}
   */
  get dbConfigKey() {
    const key = _key.get(this);
    return `DB_${key}`;
  }

  /**
   * Database host name.
   * @returns {string}
   * @readonly
   */
  get host() {
    return process.env[`${this.dbConfigKey}_HOST`];
  }

  /**
   * Database name.
   * @returns {string}
   * @readonly
   */
  get database() {
    return process.env[`${this.dbConfigKey}_DATABASE`];
  }

  /**
   * Username used for connecting to the database.
   * @returns {string}
   * @readonly
   */
  get username() {
    return process.env[`${this.dbConfigKey}_USERNAME`];
  }

  /**
   * Password used for connecting to the database.
   * @returns {string}
   * @readonly
   */
  get password() {
    return process.env[`${this.dbConfigKey}_PASSWORD`];
  }
}

module.exports = DatabaseConfiguration;