// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const InitializableEntity = require('./initializable-entity');

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`InitializableEntity ${__dirname}`, () => {
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new InitializableEntity();
  });

  describe('TODO: add UT', () => {
    
  });
});
