// Global imports
const chai = require('chai');
const spies = require('chai-spies');
const { Schema } = require('mongoose');

// Local imports
const SchemaBuilder = require('./schema-builder');

// Mocks
class SchemaObjectMock {
  constructor() {
    this.name = {
      type: String,
    };

    this.age = {
      type: Number,
    };
  }
}

class PluginMock {
  plugToSchema() {}
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`SchemaBuilder ${__dirname}`, () => {
  let schemaObject;
  /** @type {SchemaBuilder} */
  let unitUnderTest;

  beforeEach(() => {
    schemaObject = new SchemaObjectMock();
    unitUnderTest = new SchemaBuilder();
  });

  describe('SchemaBuilder#create(schemaObj, schemaOptions)', () => {
    it('sets up new instance of MongooseSchema', () => {
      // Act
      unitUnderTest.create(schemaObject);

      // Assert
      const result = unitUnderTest.build();
      expect(result).to.be.instanceOf(Schema);
    });

    it('sets up a schema with proper paths', () => {
      // Arrange
      const schemaObjectPaths = Object.keys(schemaObject);

      // Act
      unitUnderTest.create(schemaObject);

      // Assert
      const result = unitUnderTest.build();
      const resultPaths = Object.keys(result.paths);
      expect(resultPaths).to.include.members(schemaObjectPaths);
    });

    describe('when called with schemaOptions...', () => {
      it('applies options to a schema', () => {
        // Arrange
        const schemaOptions = {
          _id: false,
          versionKey: 'test',
        };

        // Act
        unitUnderTest.create(schemaObject, schemaOptions);

        // Assert
        const resultOptions = unitUnderTest.build().options;
        expect(resultOptions).to.own.include(schemaOptions);
      });
    });
  });

  describe('SchemaBuilder#addPlugin(plugin)', () => {
    it('applies plugin into createdSchema', () => {
      // Arrange
      const plugin = new PluginMock();
      sandbox.on(plugin, 'plugToSchema');
      unitUnderTest.create(schemaObject);
      const schema = unitUnderTest.build();

      // Act
      unitUnderTest.addPlugin(plugin);

      // Assert
      expect(plugin.plugToSchema).to.have.been.called
        .with.exactly(schema);

      // Cleanup
      sandbox.restore();
    });
  });
});
