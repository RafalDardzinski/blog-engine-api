const Entity = require('./entity');
const InitializableEntity = require('./initializable-entity');
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
  InitializableEntity,
  TestDataManagerFactory,
};
