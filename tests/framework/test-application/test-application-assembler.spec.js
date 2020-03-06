// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const TestApplicationAssembler = require('./test-application-assembler');

// Mocks
class ApplicationInitializerMock {
  setApplicationComponents() {}
  initialize() {}
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`TestApplicationAssembler ${__dirname}`, () => {
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new TestApplicationAssembler();
  });

  describe('', () => {
    it('TODO: write UT')
  });
});
