// Global imports
const chai = require('chai');
const spies = require('chai-spies');

// Local imports
const { Engine: { InvalidOperationError } } = require('../../../core/error');
const EntitiesInjector = require('./entities-injector');
const Entity = require('./entity');

// Mocks
class ConnectionMock {
  model() {}
}

class ModelMock {
  create() {
    return Promise.resolve();
  }

  deleteMany() {}
}

// Test suite setup
chai.use(spies);
const sandbox = chai.spy.sandbox();
const { expect } = chai;

describe(`EntitiesInjector ${__dirname}`, () => {
  /** @type { EntitiesInjector } */
  let unitUnderTest;

  beforeEach(() => {
    unitUnderTest = new EntitiesInjector();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('EntitiesInjector#inject(records, connection)', () => {
    it('creates records in database using corresponding models', async () => {
      // Arrange
      const model1Name = 'model1';
      const model2Name = 'model2';
      const model1 = new ModelMock();
      sandbox.on(model1, 'create');

      const model2 = new ModelMock();
      sandbox.on(model2, 'create');

      const connection = new ConnectionMock();
      connection.model = (name) => {
        if (name === model1Name) {
          return model1;
        } if (name === model2Name) {
          return model2;
        }

        return null;
      };

      const model1Record = new Entity(model1Name);
      const model2Record = new Entity(model2Name);
      const records = [model1Record, model2Record];

      // Act
      await unitUnderTest.inject(records, connection);

      // Assert
      expect(model1.create).to.have.been.called.with.exactly([model1Record]);
      expect(model2.create).to.have.been.called.with.exactly([model2Record]);
    });

    describe('when not every record is an instance of Entity class...', () => {
      it('throws InvalidOperationError', async () => {
        // Arrange
        const connection = new ConnectionMock();
        const records = [
          new Entity(),
          {},
        ];

        // Act
        const act = () => unitUnderTest.inject(records, connection);

        // Assert
        expect(act).to.throw(InvalidOperationError);
      });
    });

    describe('EntitiesInjector#cleanup()', () => {
      it('removes all previously injected data', async () => {
        // Arrange
        const model1Name = 'model1';
        const model2Name = 'model2';
        const model1 = new ModelMock();
        sandbox.on(model1, 'deleteMany');

        const model2 = new ModelMock();
        sandbox.on(model2, 'deleteMany');

        const connection = new ConnectionMock();
        connection.model = (name) => {
          if (name === model1Name) {
            return model1;
          } if (name === model2Name) {
            return model2;
          }

          return null;
        };

        const model1Record = new Entity(model1Name);
        const model2Record = new Entity(model2Name);
        const records = [model1Record, model2Record];

        await unitUnderTest.inject(records, connection);

        // Act
        await unitUnderTest.cleanup();

        // Assert
        expect(model1.deleteMany).to.have.been.called.with({});
        expect(model2.deleteMany).to.have.been.called.with({});
      });
    });
  });
});
