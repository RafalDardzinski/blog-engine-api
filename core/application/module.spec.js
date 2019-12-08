// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const ApplicationModule = require('./module');

// Mocks
class RepositoryMock {
  registerConnection() {}
}

class ServiceMock {}

class ControllerMock {}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`ApplicationModule ${__dirname}`, () => {
  let repository;
  let service;
  let controller;

  /** @type {ApplicationModule} */
  let unitUnderTest;

  beforeEach(() => {
    repository = new RepositoryMock();
    service = new ServiceMock();
    controller = new ControllerMock();
    unitUnderTest = new ApplicationModule(repository, service, controller);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor(repository, service, controller)', () => {
    it('does not reveal repository', () => {
      // Act
      const publicProps = Object.keys(unitUnderTest);

      // Assert
      expect(publicProps).to.not.include(repository);
    });
  });

  describe('ApplicationModule#service', () => {
    it('returns service', () => {
      expect(unitUnderTest.service).to.equal(service);
    });

    it('cannot be reassigned', () => {
      // Arrange
      const newService = {};

      // Act
      unitUnderTest.service = newService;

      // Assert
      expect(unitUnderTest.service).to.equal(service);
    });
  });

  describe('ApplicationModule#controller', () => {
    it('returns controller', () => {
      expect(unitUnderTest.controller).to.equal(controller);
    });

    it('cannot be reassigned', () => {
      // Arrange
      const newController = {};

      // Act
      unitUnderTest.controller = newController;

      // Assert
      expect(unitUnderTest.controller).to.equal(controller);
    });
  });

  describe('ApplicationModule#repository', () => {
    it('returns repository', () => {
      expect(unitUnderTest.repository).to.equal(repository);
    });

    it('cannot be reassigned', () => {
      // Arrange
      const newRepository = {};

      // Act
      unitUnderTest.repository = newRepository;

      // Assert
      expect(unitUnderTest.repository).to.equal(repository);
    });
  });

  describe('ApplicationModule#initializeRepository(dbConnectionManager)', () => {
    it('registers connection on repository', () => {
      // Arrange
      sandbox.on(repository, 'registerConnection');
      const dbConnectionManager = {};

      // Act
      unitUnderTest.initializeRepository(dbConnectionManager);

      // Assert
      expect(repository.registerConnection).to.have.been.called
        .with(dbConnectionManager);
    });
  });
});
