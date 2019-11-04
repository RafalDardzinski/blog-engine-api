// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const ApplicationBuilder = require('./builder');
const Application = require('./application');

// Mocks
class WebApplicationBuilder {
  build() {
    return {};
  }
}

class ModulesManager {
  initializeModules() {}
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`ApplicationBuilder ${__dirname}`, () => {
  let webApplicationBuilder;
  let modulesManager;
  let databaseConnectionManager;

  /** @type {ApplicationBuilder} */
  let unitUnderTest;

  beforeEach(() => {
    webApplicationBuilder = new WebApplicationBuilder();
    modulesManager = new ModulesManager();
    databaseConnectionManager = {};
    unitUnderTest = new ApplicationBuilder(webApplicationBuilder);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor(webApplicationBuilder)', () => {
    it('assigns webApplicationBuilder to ApplicationBuilder#webApplicationBuilder', () => {
      // Assert
      expect(unitUnderTest.webApplicationBuilder).to.equal(webApplicationBuilder);
    });
  });

  describe('ApplicationBuilder#buildWebApplication(modulesManager)', () => {
    it('builds webApplication using modulesManager', () => {
      // Arrange
      sandbox.on(webApplicationBuilder, 'build');

      // Act
      unitUnderTest.buildWebApplication(modulesManager);

      // Assert
      expect(webApplicationBuilder.build).to.have.been.called
        .with(modulesManager);
    });

    it('returns built web application', () => {
      // Arrange
      const webApplication = {};
      webApplicationBuilder.build = () => webApplication;

      // Act
      const result = unitUnderTest.buildWebApplication();

      // Assert
      expect(result).to.equal(webApplication);
    });
  });

  describe('ApplicationBuilder#build(modulesManager, databaseConnectionManager)', () => {
    it('initializes modules', () => {
      // Arrange
      sandbox.on(modulesManager, 'initializeModules');

      // Act
      unitUnderTest.build(modulesManager, databaseConnectionManager);

      // Assert
      expect(modulesManager.initializeModules).to.have.been.called
        .with(databaseConnectionManager);
    });

    it('builds webApplication', () => {
      // Arrange
      sandbox.on(unitUnderTest, 'buildWebApplication');

      // Act
      unitUnderTest.build(modulesManager, databaseConnectionManager);

      // Assert
      expect(unitUnderTest.buildWebApplication).to.have.been.called
        .with(modulesManager);
    });

    it('returns instance of Application', () => {
      // Act
      const result = unitUnderTest.build(modulesManager, databaseConnectionManager);

      // Assert
      expect(result).to.be.an.instanceOf(Application);
    });
  });
});
