const chai = require('chai');
const { InvalidOperationError } = require('../error');
const DatabaseConfiguration = require('./database');

const { expect } = chai;

const createDatabaseConfiguration = key => new DatabaseConfiguration(key);

const createConfigMock = () => ({
  host: 'testhost',
  database: 'testdb',
  username: 'testuser',
  password: 'testpassword',
});

const createProcessEnvMock = (key = 'TEST', config = createConfigMock()) => {
  const env = {};
  env[`DB_${key}_HOST`] = config.host;
  env[`DB_${key}_DATABASE`] = config.database;
  env[`DB_${key}_USERNAME`] = config.username;
  env[`DB_${key}_PASSWORD`] = config.password;
  return env;
};

describe(`DatabaseConfiguration ${__dirname}/database`, () => {
  describe('DatabaseConfiguration#dbConfigKey', () => {
    const key = 'TEST';
    let databaseConfiguration;

    beforeEach(() => {
      databaseConfiguration = createDatabaseConfiguration(key);
    });

    it('returns key provided in constructor prefixed with "DB_"', () => {
      expect(databaseConfiguration.dbConfigKey).to.equal(`DB_${key}`);
    });

    it('cannot be reassigned', () => {
      const oldValue = databaseConfiguration.dbConfigKey;

      databaseConfiguration.dbConfigKey = 'somethingElse';

      expect(databaseConfiguration.dbConfigKey).to.equal(oldValue);
    });
  });

  describe('DatabaseConfiguration#host', () => {
    const key = 'TEST';
    let config;
    let oldEnv;
    let newEnv;
    let databaseConfiguration;

    beforeEach(() => {
      config = createConfigMock();
      oldEnv = Object.assign({}, process.env);
      newEnv = createProcessEnvMock(key, config);
      process.env = newEnv;
      databaseConfiguration = createDatabaseConfiguration(key);
    });

    afterEach(() => {
      process.env = oldEnv;
    });

    it('returns value that equals process.env[DB_{DatabaseConfiguration#dbConfigKey}_HOST]', () => {
      const expectedValue = process.env[`DB_${key}_HOST`];

      expect(databaseConfiguration.host).to.equal(expectedValue);
    });

    it('cannot be reassigned', () => {
      const oldValue = databaseConfiguration.host;

      databaseConfiguration.host = 'somethingElse';

      expect(databaseConfiguration.host).to.equal(oldValue);
    });
  });

  describe('DatabaseConfiguration#database', () => {
    const key = 'TEST';
    let config;
    let oldEnv;
    let newEnv;
    let databaseConfiguration;

    beforeEach(() => {
      config = createConfigMock();
      oldEnv = Object.assign({}, process.env);
      newEnv = createProcessEnvMock(key, config);
      process.env = newEnv;
      databaseConfiguration = createDatabaseConfiguration(key);
    });

    afterEach(() => {
      process.env = oldEnv;
    });

    it('returns value that equals process.env[DB_{DatabaseConfiguration#dbConfigKey}_DATABASE]', () => {
      const expectedValue = process.env[`DB_${key}_DATABASE`];

      expect(databaseConfiguration.database).to.equal(expectedValue);
    });

    it('cannot be reassigned', () => {
      const oldValue = databaseConfiguration.database;

      databaseConfiguration.database = 'somethingElse';

      expect(databaseConfiguration.database).to.equal(oldValue);
    });
  });

  describe('DatabaseConfiguration#username', () => {
    const key = 'TEST';
    let config;
    let oldEnv;
    let newEnv;
    let databaseConfiguration;

    beforeEach(() => {
      config = createConfigMock();
      oldEnv = Object.assign({}, process.env);
      newEnv = createProcessEnvMock(key, config);
      process.env = newEnv;
      databaseConfiguration = createDatabaseConfiguration(key);
    });

    afterEach(() => {
      process.env = oldEnv;
    });

    it('returns value that equals process.env[DB_{DatabaseConfiguration#dbConfigKey}_USERNAME]', () => {
      const expectedValue = process.env[`DB_${key}_USERNAME`];

      expect(databaseConfiguration.username).to.equal(expectedValue);
    });

    it('cannot be reassigned', () => {
      const oldValue = databaseConfiguration.username;

      databaseConfiguration.username = 'somethingElse';

      expect(databaseConfiguration.username).to.equal(oldValue);
    });
  });

  describe('DatabaseConfiguration#password', () => {
    const key = 'TEST';
    let config;
    let oldEnv;
    let newEnv;
    let databaseConfiguration;

    beforeEach(() => {
      config = createConfigMock();
      oldEnv = Object.assign({}, process.env);
      newEnv = createProcessEnvMock(key, config);
      process.env = newEnv;
      databaseConfiguration = createDatabaseConfiguration(key);
    });

    afterEach(() => {
      process.env = oldEnv;
    });

    it('returns value that equals process.env[DB_{DatabaseConfiguration#dbConfigKey}_PASSWORD]', () => {
      const expectedValue = process.env[`DB_${key}_PASSWORD`];

      expect(databaseConfiguration.password).to.equal(expectedValue);
    });

    it('cannot be reassigned', () => {
      const oldValue = databaseConfiguration.password;

      databaseConfiguration.password = 'somethingElse';

      expect(databaseConfiguration.password).to.equal(oldValue);
    });
  });

  describe('DatabaseConfiguration#getUri()', () => {
    const key = 'TEST';
    let config;
    let oldEnv;
    let databaseConfiguration;

    beforeEach(() => {
      config = createConfigMock();
      oldEnv = Object.assign({}, process.env);
      databaseConfiguration = createDatabaseConfiguration(key);
    });

    afterEach(() => {
      process.env = oldEnv;
    });

    it('returns "mongodb://{DatabaseConfiguration#username}:{DatabaseConfiguration#password}@{DatabaseConfiguration#host}/{DatabaseConfiguration#database}""', () => {
      process.env = createProcessEnvMock(key, config);
      const {
        username, password, host, database,
      } = databaseConfiguration;
      const expectedUri = `mongodb://${username}:${password}@${host}/${database}`;

      const result = databaseConfiguration.getUri();

      expect(result).to.equal(expectedUri);
    });

    describe('when DatabaseConfiguration#host is not defined', () => {
      it('throws InvalidOperationError', () => {
        config.host = undefined;
        process.env = createProcessEnvMock(key, config);

        const act = () => databaseConfiguration.getUri();

        expect(act).to.throw(InvalidOperationError);
      });
    });

    describe('when DatabaseConfiguration#database is not defined', () => {
      it('throws InvalidOperationError', () => {
        config.database = undefined;
        process.env = createProcessEnvMock(key, config);

        const act = () => databaseConfiguration.getUri();

        expect(act).to.throw(InvalidOperationError);
      });
    });

    describe('when DatabaseConfiguration#username is not defined', () => {
      it('throws InvalidOperationError', () => {
        config.username = undefined;
        process.env = createProcessEnvMock(key, config);

        const act = () => databaseConfiguration.getUri();

        expect(act).to.throw(InvalidOperationError);
      });
    });

    describe('when DatabaseConfiguration#password is not defined', () => {
      it('throws InvalidOperationError', () => {
        config.password = undefined;
        process.env = createProcessEnvMock(key, config);

        const act = () => databaseConfiguration.getUri();

        expect(act).to.throw(InvalidOperationError);
      });
    });

    describe('when both DatabaseConfiguration#username and DatabaseConfiguration#password are not defined', () => {
      it('returns "mongodb://{DatabaseConfiguration#host}/{DatabaseConfiguration#database}"', () => {
        config.username = undefined;
        config.password = undefined;
        process.env = createProcessEnvMock(key, config);
        const { host, database } = databaseConfiguration;
        const expectedUri = `mongodb://${host}/${database}`;

        const result = databaseConfiguration.getUri();
        expect(result).to.equal(expectedUri);
      });
    });
  });
});
