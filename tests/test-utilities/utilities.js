const supertest = require('supertest');
const ApplicationComponents = require('./application-components');

const _testApplicationAssembler = new WeakMap();
const _testDataInjector = new WeakMap();
const _isInitialized = new WeakMap();
const _applicationComponents = new WeakMap();

class Utilities {
  constructor(testApplicationAssembler, testDataInjector) {
    _testApplicationAssembler.set(this, testApplicationAssembler);
    _testDataInjector.set(this, testDataInjector);
  }

  async initialize(modules) {
    const isInitialized = _isInitialized.get(this);
    if (isInitialized) {
      throw new Error('Test utilities are already initialized.');
    }

    const applicationComponents = new ApplicationComponents();
    _applicationComponents.set(this, applicationComponents);
    applicationComponents.setApplicationModules(modules);

    const testApplicationAssembler = _testApplicationAssembler.get(this);
    await testApplicationAssembler.assemble(modules, applicationComponents);
    _isInitialized.set(this, true);
  }

  injectTestData(testData) {
    const testDataInjector = _testDataInjector.get(this);
    return testDataInjector.injectTestData(testData);
  }

  revertTestData() {
    const testDataInjector = _testDataInjector.get(this);
    return testDataInjector.revert();
  }

  request() {
    const { webApp } = _applicationComponents.get(this);
    return supertest(webApp);
  }
}

module.exports = Utilities;
