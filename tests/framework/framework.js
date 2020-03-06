const supertest = require('supertest');

const utilities = require('./utilities');

/**
 * @type {Map<Object, TestDataManager>}
 */
const _testDataManager = new WeakMap();

/**
 * @type {Map<Object, ApplicationComponents>}
 */
const _applicationComponents = new WeakMap();

/**
 * Provides functionalities that simplify integration tests.
 */
class TestFramework {
  /**
   * @param {TestDataManager} testDataManager Instance of TestDataManager.
   * @param {ApplicationComponents} applicationComponents Instance of ApplicationComponents.
   */
  constructor(testDataManager, applicationComponents) {
    _testDataManager.set(this, testDataManager);
    _applicationComponents.set(this, applicationComponents);
  }

  /**
   * Perform operations on test data.
   * @returns {TestDataManager}
   */
  get data() {
    return _testDataManager.get(this);
  }

  /**
   * Perform operations on built web application.
   */
  get webRequest() {
    const { webApp } = _applicationComponents.get(this);
    return supertest(webApp);
  }

  /**
   * Tools useful for creating fake primitive-type data.
   */
  get utilities() {
    return utilities;
  }

  get applicationName() {
    const { applicationName } = _applicationComponents.get(this);
    return applicationName;
  }
}

module.exports = TestFramework;
/**
 * @typedef {import('./test-data/test-data-manager')} TestDataManager
 * @typedef {import('./application-components')} ApplicationComponents
 */
