// Global imports
const chai = require('chai');

// Local imports
const HashingServiceConfiguration = require('./hashing');

class EnvironmentVariablesMock {
  constructor() {
    this.HASH_SECRET = 'testSecret';
    this.HASH_ITERATIONS = 10000;
    this.HASH_HASH_LENGTH = 64;
    this.HASH_ALGORITHM = 'sha256';
    this.HASH_SALT_LENGTH = 69;
  }
}

// Test suite setup
const { expect } = chai;

describe.only(`HashingServiceConfiguration ${__dirname}`, () => {
  let oldEnvVariables;

  /** @type {HashingServiceConfiguration} */
  let unitUnderTest;

  beforeEach(() => {
    oldEnvVariables = process.env;
    process.env = new EnvironmentVariablesMock();
    unitUnderTest = new HashingServiceConfiguration();
  });

  afterEach(() => {
    process.env = oldEnvVariables;
  });

  describe('HashingServiceConfiguration#secret', () => {
    it('returns value of HASH_SECRET env variable', () => {
      // Assert
      expect(unitUnderTest.secret).to.equal(process.env.HASH_SECRET);
    });

    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.secret;

      // Act
      unitUnderTest.secret = `${oldValue}-modified`;

      // Assert
      expect(unitUnderTest.secret).to.equal(oldValue);
    });
  });

  describe('HashingServiceConfiguration#iterations', () => {
    it('returns value of HASH_ITERATIONS env variable', () => {
      // Assert
      expect(unitUnderTest.iterations).to.equal(process.env.HASH_ITERATIONS);
    });

    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.iterations;

      // Act
      unitUnderTest.iterations = `${oldValue}-modified`;

      // Assert
      expect(unitUnderTest.iterations).to.equal(oldValue);
    });

    describe('throws an error when configured value...', () => {
      it('is less than 10000', () => {
        // Arrange
        process.env.HASH_ITERATIONS = 9999;

        // Act
        const act = () => unitUnderTest.iterations;

        // Assert
        expect(act).to.throw();
      });

      it('is undefined', () => {
        // Arrange
        process.env.HASH_ITERATIONS = undefined;

        // Act
        const act = () => unitUnderTest.iterations;

        // Assert
        expect(act).to.throw();
      });

      it('is not a number', () => {
        // Arrange
        process.env.HASH_ITERATIONS = 'testValue';

        // Act
        const act = () => unitUnderTest.iterations;

        // Assert
        expect(act).to.throw();
      });
    });
  });

  describe('HashingServiceConfiguration#hashLength', () => {
    it('returns value of HASH_HASH_LENGTH env variable', () => {
      expect(unitUnderTest.hashLength).to.equal(process.env.HASH_HASH_LENGTH);
    });

    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.hashLength;

      // Act
      unitUnderTest.hashLength = `${oldValue}-modified`;

      // Assert
      expect(unitUnderTest.hashLength).to.equal(oldValue);
    });

    describe('throws an error when configured value...', () => {
      it('is less than 64', () => {
        // Arrange
        process.env.HASH_HASH_LENGTH = 63;

        // Act
        const act = () => unitUnderTest.hashLength;

        // Assert
        expect(act).to.throw();
      });

      it('is undefined', () => {
        // Arrange
        process.env.HASH_HASH_LENGTH = undefined;

        // Act
        const act = () => unitUnderTest.hashLength;

        // Assert
        expect(act).to.throw();
      });

      it('is not a number', () => {
        // Arrange
        process.env.HASH_HASH_LENGTH = 'testValue';

        // Act
        const act = () => unitUnderTest.hashLength;

        // Assert
        expect(act).to.throw();
      });
    });
  });

  describe('HashingServiceConfiguration#algorithm', () => {
    it('returns value of HASH_ALGORITHM env variable', () => {
      // Assert
      expect(unitUnderTest.algorithm).to.equal(process.env.HASH_ALGORITHM);
    });

    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.algorithm;

      // Act
      unitUnderTest.algorithm = `${oldValue}-modified`;

      // Assert
      expect(unitUnderTest.algorithm).to.equal(oldValue);
    });

    describe('throws an error when configured value...', () => {
      it('is undefined', () => {
        // Arrange
        process.env.HASH_ALGORITHM = undefined;

        // Act
        const act = () => unitUnderTest.algorithm;

        // Assert
        expect(act).to.throw();
      });
      it('is not a name of supportedAlgorithm', () => {
        // Arrange
        process.env.HASH_ALGORITHM = 'sha256-test';

        // Act
        const act = () => unitUnderTest.algorithm;

        // Assert
        expect(act).to.throw();
      });
    });
  });

  describe('HashingServiceConfiguration#saltLength', () => {
    it('returns value of HASH_SALT_LENGTH env variable', () => {
      // Assert
      expect(unitUnderTest.saltLength).to.equal(process.env.HASH_SALT_LENGTH);
    });

    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.saltLength;

      // Act
      unitUnderTest.saltLength = `${oldValue}-modified`;

      // Assert
      expect(unitUnderTest.saltLength).to.equal(oldValue);
    });

    describe('throws an error when configured value...', () => {
      it('is less than 64', () => {
        // Arrange
        process.env.HASH_SALT_LENGTH = 63;

        // Act
        const act = () => unitUnderTest.saltLength;

        // Assert
        expect(act).to.throw();
      });

      it('is undefined', () => {
        // Arrange
        process.env.HASH_SALT_LENGTH = undefined;

        // Act
        const act = () => unitUnderTest.saltLength;

        // Assert
        expect(act).to.throw();
      });

      it('is not a number', () => {
        // Arrange
        process.env.HASH_SALT_LENGTH = 'testValue';

        // Act
        const act = () => unitUnderTest.saltLength;

        // Assert
        expect(act).to.throw();
      });
    });
  });
});
