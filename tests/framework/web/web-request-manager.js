const supertest = require('supertest');

/**
 * @type {Map<Object, SuperTestAgent>}
 */
const _agent = new WeakMap();

class WebRequestManager {
  constructor(webApp) {
    _agent.set(this, supertest.agent(webApp));
  }

  /**
   * Begin web request.
   */
  request() {
    return _agent.get(this);
  }
}

module.exports = WebRequestManager;
/**
 * @typedef {import('supertest').SuperTest} SuperTestAgent
 */
