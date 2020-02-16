const { utilities } = require('./test-utilities');

describe('Blog engine integration tests.', () => {
  before(async () => {
    await utilities.initialize({});
  });

  /* eslint-disable */
  require('./users').forEach(t => t.execute(utilities));  
  /* eslint-enable */

  after(() => {

  });
});
