const TestDataManager = require('./test-data-manager');

/**
 * Creates instances of TestDataManager.
 */
class TestDataManagerFactory {
  /**
   * @param {EntitiesInjector} entitiesInjector Instance of EntitiesInjector.
   */
  constructor(entitiesInjector) {
    this.entitiesInjector = entitiesInjector;
  }

  create() {
    return new TestDataManager(this.entitiesInjector);
  }
}

module.exports = TestDataManagerFactory;
/**
 * @typedef {import('./entities-injector')} EntitiesInjector
 */
