const { users: { controller } } = require('../../../core/modules');
const { Users } = require('../../test-data');
const { Types: { IntegrationTestSuite } } = require('../../framework');

class GetUsersTests extends IntegrationTestSuite {
  constructor() {
    super(controller, controller.getAllUsers);
  }

  /**
   * Contains set of integration tests.
   * @param {Object} framework Instance of initialized framework.
   */
  tests(framework) {
    before(async () => {
      /** @type {TestFramework} */
      await Users.Administrator.initialize();
      await framework.data.injectTestData([
        Users.Administrator,
      ]);
    });

    it('returns 200 status code', async () => {
      await framework.webRequest.get(this.path).expect(200);
    });

    after(async () => {
      await framework.data.removeInjectedTestData();
    });
  }
}

module.exports = new GetUsersTests();
/**
 * @typedef {import('../../framework/framework')} TestFramework
 */
