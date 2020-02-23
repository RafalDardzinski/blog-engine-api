const Entity = require('./entity');
const EntitiesInjector = require('./entities-injector');
const TestDataManager = require('./test-data-manager');

class TestDataManagerFactory {
  static create() {
    const entitiesInjector = new EntitiesInjector();
    return new TestDataManager(entitiesInjector);
  }
}

module.exports = {
  Entity,
  TestDataManagerFactory,
};
