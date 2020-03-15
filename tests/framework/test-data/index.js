const Entity = require('./entity');
const InitializableEntity = require('./initializable-entity');
const EntitiesInjector = require('./entities-injector');
const TestDataManagerFactory = require('./test-data-manager-factory');

const entitiesInjector = new EntitiesInjector();
const testDataManagerFactory = new TestDataManagerFactory(entitiesInjector);

module.exports = {
  Entity,
  InitializableEntity,
  testDataManagerFactory,
};
