const TestFramework = require('./framework');
const ApplicationComponents = require('./application-components');

/** @type {Map<Object, TestDataManagerFactory} */
const _testDataManagerFactory = new WeakMap();

/** @type {Map<Object, WebRequestFactory>} */
const _webRequestManagerFactory = new WeakMap();

/** @type {Map<Object, TestApplicationAssembler} */
const _testApplicationAssembler = new WeakMap();

class TestFrameworkFactory {
  /**
   * @param {TestDataManager} testDataManager Instance of TestDataManager.
   * @param {TestApplicationAssembler} testApplicationAssembler Instance of
   * TestApplicationAssembler.
   */
  constructor(testDataManagerFactory, webRequestManagerFactory, testApplicationAssembler) {
    _testDataManagerFactory.set(this, testDataManagerFactory);
    _webRequestManagerFactory.set(this, webRequestManagerFactory);
    _testApplicationAssembler.set(this, testApplicationAssembler);
  }

  /**
   * Creates a new instance of TestFramework.
   * @param {Object<string, ApplicationModule>} modules Modules to build application from.
   */
  async create(modules) {
    const applicationComponents = new ApplicationComponents();
    applicationComponents.setApplicationModules(modules);

    const testApplicationAssembler = _testApplicationAssembler.get(this);
    await testApplicationAssembler.assemble(modules, applicationComponents);

    const testDataManagerFactory = _testDataManagerFactory.get(this);
    const testDataManager = testDataManagerFactory.create();
    testDataManager.initialize(applicationComponents.databaseConnection);

    const webRequestManagerFactory = _webRequestManagerFactory.get(this);
    const webRequestManager = webRequestManagerFactory.create(applicationComponents.webApp);

    return new TestFramework(
      testDataManager,
      webRequestManager,
      applicationComponents.applicationName,
    );
  }
}

module.exports = TestFrameworkFactory;

/**
 * @typedef {import('./test-application/test-application-assembler')} TestApplicationAssembler
 * @typedef {import('./test-data/test-data-manager-factory')} TestDataManagerFactory
 * @typedef {import('./web/web-request-manager-factory')} WebRequestFactory
 * @typedef {import('../../core/application/application-module')} ApplicationModule
 */
