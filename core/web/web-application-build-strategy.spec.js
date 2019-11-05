// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const WebApplicationBuildStrategy = require('./web-application-build-strategy');

// Test suite setup
chai.use(spies);
const { expect } = chai;

describe(`WebApplicationBuildStrategy ${__dirname}`, () => {
  const middleware = () => null;
  const defaultMiddleware = [middleware];

  /** @type {WebApplicationBuildStrategy} */
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new WebApplicationBuildStrategy(defaultMiddleware);
  });

  describe('constructor(defaultMiddleware)', () => {
    it('assigns defaultMiddleware to WebApplicationBuildStrategy#defaultMiddleware', () => {
      // Assert
      expect(unitUnderTest.defaultMiddleware).to.equal(defaultMiddleware);
    });
  });

  describe('WebApplicationBuildStrategy#applyDefaultMiddleware(webApp)', () => {
    it('calls webApp.use(defaultMiddleware) for each WebApplicationBuildStrategy#defaultMiddleware', () => {
      // Arrange
      const middleware2 = () => null;
      unitUnderTest.defaultMiddleware.push(middleware2);
      const webAppMock = () => null;
      webAppMock.use = chai.spy(() => null);

      // Act
      unitUnderTest.applyDefaultMiddleware(webAppMock);

      // Assert
      unitUnderTest.defaultMiddleware.forEach((m) => {
        expect(webAppMock.use).to.have.been.called.with.exactly(m);
      });
    });
  });
});
