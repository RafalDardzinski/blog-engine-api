// Global imports
const chai = require('chai');

// Local imports
const WebApplicationComponents = require('./web-application-components');
const Controller = require('./controller');
const { InvalidOperationError } = require('../error');

// Test suite setup
const { expect } = chai;

describe(`WebApplicationComponents ${__dirname}`, () => {
  const controllers = [];
  const errorHandler = () => null;
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new WebApplicationComponents(controllers, errorHandler);
  });

  describe('constructor(controllers, errorHandler)', () => {
    it('assigns controllers to WebApplicationComponents#controllers', () => {
      // Assert
      expect(unitUnderTest.controllers).to.equal(controllers);
    });

    it('assigns errorHandler to WebApplicationComponents#controllers#errorHandler', () => {
      expect(unitUnderTest.errorHandler).to.equal(errorHandler);
    });
  });

  describe('WebApplicationComponents#validateSelf()', () => {
    describe('when WebApplicationComponents#controllers is not an array...', () => {
      it('throws InvalidOperationError', () => {
        // Arrange
        unitUnderTest.controllers = {};

        // Act
        const act = () => unitUnderTest.validateSelf();

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });

    describe('when WebApplicationComponents#controllers contains element that is not an instance of Controller class', () => {
      it('thows InvalidOperationError', () => {
        // Arrange
        const validController = new Controller('/test');
        const invalidController = {};
        unitUnderTest.controllers = [validController, invalidController];

        // Act
        const act = () => unitUnderTest.validateSelf();

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });

    describe('when WebApplicationComponents#errorHandler is falsy...', () => {
      it('does not throw any error', () => {
        // Arrange
        const validController = new Controller('/test');
        unitUnderTest.controllers = [validController];
        unitUnderTest.errorHandler = undefined;

        // Act
        const act = () => unitUnderTest.validateSelf();

        // Assert
        expect(act).to.not.throw();
      });
    });

    describe('when WebApplicationComponents#errorHandler is defined and not a function', () => {
      it('throws InvalidOperationError', () => {
        // Arrange
        const invalidTypes = [{}, 'test', 55, false, null];
        const validType = () => null;
        const act = () => unitUnderTest.validateSelf();

        // Act + Assert
        invalidTypes.forEach((t) => {
          unitUnderTest.errorHandler = t;
          expect(act, `Error was not thrown when errorHandler was '${typeof t}'`).to.throw(InvalidOperationError);
        });
        unitUnderTest.errorHandler = validType;
        expect(act, `Error was thrown when errorHandler was ${typeof validType}`).to.not.throw();
      });
    });
  });
});
