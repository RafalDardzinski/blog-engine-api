// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const { RandomStringGenerator } = require('../utilities');
const TestHttpServer = require('./test-http-server');


// Mocks
class ApplicationComponentsMock {
  setWebApp() {}
}

class WebAppMock {
  constructor() {
    this.randomIdentifier = null;
  }
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`TestHttpServer ${__dirname}`, () => {
  let applicationComponents;

  /** @type {TestHttpServer} */
  let unitUnderTest;

  beforeEach(async () => {
    applicationComponents = new ApplicationComponentsMock();
    unitUnderTest = new TestHttpServer(applicationComponents);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('contructor(applicationComponents)', () => {
    it('does not reveal applicationCompoenents', () => {
      // Act
      const publicProps = Object.values(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(applicationComponents);
    });
  });

  describe('TestHttpServer#start(webApp)', () => {
    it('sets web application on application compoenents', async () => {
      // Arrange
      const webApp = new WebAppMock();
      const randomIdentifier = await RandomStringGenerator.generate();
      webApp.randomIdentifier = randomIdentifier;
      sandbox.on(applicationComponents, 'setWebApp');

      // Act
      unitUnderTest.start(webApp);

      // Assert
      expect(applicationComponents.setWebApp).to.have.been.called.with.exactly(webApp);
    });
  });
});
