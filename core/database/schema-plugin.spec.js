// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const SchemaPlugin = require('./schema-plugin');

// Mocks
class SchemaMock {
  plugin() {}
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`SchemaPlugin ${__dirname}`, () => {
  class ConcreteSchemaPlugin extends SchemaPlugin {
    functionality() {}
  }

  let schema;
  /** @type {SchemaPlugin} */
  let unitUnderTest;

  beforeEach(() => {
    schema = new SchemaMock();
    unitUnderTest = new ConcreteSchemaPlugin();
  });

  describe('SchemaPlugin#plugToSchema(schema)', () => {
    it('applies plugin to provided schema', () => {
      // Arrange
      sandbox.on(schema, 'plugin');
      const boundFunctionality = () => null;
      unitUnderTest.functionality.bind = () => boundFunctionality;

      // Act
      unitUnderTest.plugToSchema(schema);

      // Assert
      expect(schema.plugin).to.have.been.called
        .with.exactly(boundFunctionality);
    });
  });
});
