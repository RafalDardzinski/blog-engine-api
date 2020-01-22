// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const Permission = require('./permission');

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`Permission ${__dirname}`, () => {
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new Permission();
  });

  describe('constructor(name, description)', () => {
    it('TODO: Add permissions UT.', () => {
      throw new Error('needs implementation')
    })
  });
});
