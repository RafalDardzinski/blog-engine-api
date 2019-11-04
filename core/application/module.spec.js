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

  describe('ApplicationModule#isInitialized', () => {
    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.isInitialized;

      // Act
      unitUnderTest.isInitialized = 'test';

      // Assert
      expect(unitUnderTest.isInitialized).equals(oldValue);
    });

    describe('when repository is initialized...', () => {
      it('returns true', () => {
        // Arrange
        repository.isInitialized = true;

        // Act
        const result = unitUnderTest.isInitialized;

        // Assert
        expect(result).to.equal(true);
      });
    });

    describe('when repository is not initialized...', () => {
      it('returns false', () => {
        // Arrange
        repository.isInitialized = false;

        // Act
        const result = unitUnderTest.isInitialized;

        // Assert
        expect(result).to.equal(false);
      });
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
