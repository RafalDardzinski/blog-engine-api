const utilities = require('./utilities');

/** @type {Map<Object, TestDataManager>} */
const _testDataManager = new WeakMap();

/** @type {Map<Object, ApplicationComponents>} */
const _webRequestManager = new WeakMap();

/** @type {Map<Object, String>} */
const _testedApplicationName = new WeakMap();

/**
 * Provides functionalities that simplify integration tests.
 */
class TestFramework {
  /**
   * @param {TestDataManager} testDataManager Instance of TestDataManager.
   * @param {ApplicationComponents} applicationComponents Instance of ApplicationComponents.
   */
  constructor(testDataManager, webRequestManager, testedApplicationName) {
    _testDataManager.set(this, testDataManager);
    _webRequestManager.set(this, webRequestManager);
    _testedApplicationName.set(this, testedApplicationName);
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
  get web() {
    return _webRequestManager.get(this);
  }

  /**
   * Tools useful for creating fake primitive-type data.
   */
  get utilities() {
    return utilities;
  }

  get applicationName() {
    return _testedApplicationName.get(this);
  }
}

module.exports = TestFramework;
/**
 * @typedef {import('./test-data/test-data-manager')} TestDataManager
 * @typedef {import('./application-components')} ApplicationComponents
 */
