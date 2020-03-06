const TestFramework = require('./framework');
const ApplicationComponents = require('./application-components');

/** @type {Map<Object, TestDataManager} */
const _testDataManager = new WeakMap();

/** @type {Map<Object, TestApplicationAssembler} */
const _testApplicationAssembler = new WeakMap();

class TestFrameworkFactory {
  /**
   * @param {TestDataManager} testDataManager Instance of TestDataManager.
   * @param {TestApplicationAssembler} testApplicationAssembler Instance of
   * TestApplicationAssembler.
   */
  constructor(testDataManager, testApplicationAssembler) {
    _testDataManager.set(this, testDataManager);
    _testApplicationAssembler.set(this, testApplicationAssembler);
  }

  /**
   * Creates a new instance of TestFramework.
   * @param {Object<string, ApplicationModule>} modules Modules to build application from.
   */
  async create(modules) {
    const testApplicationAssembler = _testApplicationAssembler.get(this);
    const testDataManager = _testDataManager.get(this);

    const applicationComponents = new ApplicationComponents();
    applicationComponents.setApplicationModules(modules);
    await testApplicationAssembler.assemble(modules, applicationComponents);
    testDataManager.initialize(applicationComponents.databaseConnection);
    return new TestFramework(testDataManager, applicationComponents);
  }
}

module.exports = TestFrameworkFactory;

/**
 * @typedef {import('./test-application/test-application-assembler')} TestApplicationAssembler
 * @typedef {import('./test-data/test-data-manager')} TestDataManager
 * @typedef {import('../../core/application/application-module')} ApplicationModule
 */
