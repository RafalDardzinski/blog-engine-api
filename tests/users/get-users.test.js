const { users } = require('../../core/modules');

const IntegrationTestSuite = require('../test-utilities/integration-test-suite');

class GetUsersTests extends IntegrationTestSuite {
  constructor() {
    super(users.controller, users.controller.getAllUsers);
  }

  tests(utilities) {
    it('returns 200 status code', async () => {
      await utilities.request().get(this.path).expect(200);
    });
  }
}

module.exports = new GetUsersTests();
