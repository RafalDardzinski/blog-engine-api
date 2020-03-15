// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const TestApplicationAssembler = require('./test-application-assembler');

// Mocks
class TestFactoryMock {
  setApplicationComponents() {}
}

class ApplicationComponentsMock {
  constructor() {
    this.id = Symbol('ApplicationComponentsMock');
  }
}

class ModuleMock {
  constructor() {
    this.id = Symbol('Module');
  }
}

class ApplicationInitializerMock {
  constructor() {
    this.databaseConnectionManagerFactory = new TestFactoryMock();
    this.applicationFactory = new TestFactoryMock();
    this.serverFactory = new TestFactoryMock();
  }

  initialize() {}
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`TestApplicationAssembler ${__dirname}`, () => {
  let applicationInitializer;

  /** @type {TestApplicationAssembler} */
  let unitUnderTest;

  beforeEach(() => {
    applicationInitializer = new ApplicationInitializerMock();
    unitUnderTest = new TestApplicationAssembler(applicationInitializer);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor(applicationInitializer)', () => {
    it('does not reveal applicationInitializer', () => {
      // Act + Assert
      const publicProps = Object.values(unitUnderTest);
      expect(publicProps).to.not.include(applicationInitializer);
    });
  });

  describe('TestApplicationAssembler#assemble(modules, applicationComponents)', () => {
    it('sets applicationComponents on databaseConnectionManagerFactory', () => {
      // Arrange
      const applicationComponents = new ApplicationComponentsMock();
      const { databaseConnectionManagerFactory } = applicationInitializer;
      sandbox.on(databaseConnectionManagerFactory, 'setApplicationComponents');

      // Act
      unitUnderTest.assemble({}, applicationComponents);

      // Assert
      expect(databaseConnectionManagerFactory.setApplicationComponents).to.have.been.called
        .with(applicationComponents);
    });

    it('sets applicationComponents on applicationFactory', () => {
      // Arrange
      const applicationComponents = new ApplicationComponentsMock();
      const { applicationFactory } = applicationInitializer;
      sandbox.on(applicationFactory, 'setApplicationComponents');

      // Act
      unitUnderTest.assemble({}, applicationComponents);

      // Assert
      expect(applicationFactory.setApplicationComponents).to.have.been.called
        .with(applicationComponents);
    });

    it('sets applicationComponents on serverFactory', () => {
      // Arrange
      const applicationComponents = new ApplicationComponentsMock();
      const { serverFactory } = applicationInitializer;
      sandbox.on(serverFactory, 'setApplicationComponents');

      // Act
      unitUnderTest.assemble({}, applicationComponents);

      // Assert
      expect(serverFactory.setApplicationComponents).to.have.been.called
        .with.exactly(applicationComponents);
    });

    it('initializes applicationInitializer with provided modules', () => {
      // Arrange
      const applicationComponents = new ApplicationComponentsMock();
      const modules = {
        m1: new ModuleMock(),
        m2: new ModuleMock(),
      };
      sandbox.on(applicationInitializer, 'initialize');

      // Act
      unitUnderTest.assemble(modules, applicationComponents);

      // Assert
      expect(applicationInitializer.initialize).to.have.been.called
        .with.exactly(modules);
    });
  });
});
