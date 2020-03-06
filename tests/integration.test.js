require('dotenv').config();

const { frameworkFactory } = require('./framework');
const usersTests = require('./integration-tests/users');

async function Main() {
  const framework = await frameworkFactory.create({});

  describe(`${framework.applicationName} integration tests.`, async () => {
    usersTests.forEach(t => t.execute(framework));
  });

  run();
}

Main();
