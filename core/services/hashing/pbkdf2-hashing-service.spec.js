// Global imports
const chai = require('chai');

// Local imports
const IHashingService = require('./hashing-service');
const Hash = require('./hash');
const Pbkdf2HashingService = require('./pbkdf2-hashing-service');

// Mocks
class HashingServiceConfigurationMock {
  constructor() {
    this.secret = 'secret';
    this.iterations = 100;
    this.hashLength = 20;
    this.algorithm = 'sha256';
    this.saltLength = 20;
  }
}

// Test suite setup
const { expect } = chai;

describe(`Pbkdf2HashingService ${__dirname}`, () => {
  let config;
  /** @type {Pbkdf2HashingService} */
  let unitUnderTest;

  beforeEach(() => {
    config = new HashingServiceConfigurationMock();
    unitUnderTest = new Pbkdf2HashingService(config);
  });

  it('implements IHashingService', () => {
    // Assert
    expect(unitUnderTest).to.be.an.instanceOf(IHashingService);
  });

  describe('constructor(config)', () => {
    it('does not expose config', () => {
      // Arrange + Act
      const publicPropertiesValues = Object.values(unitUnderTest);

      // Assert
      expect(publicPropertiesValues).to.not.include(config);
    });
  });

  describe('Pbkdf2HashingService#hash(text, salt)', () => {
    it('returns a hash', async () => {
      // Arrange
      const textToHash = 'text_to_hash';
      const salt = 'test_salt';

      // Act
      const hash = await unitUnderTest.hash(textToHash, salt);

      // Assert
      expect(hash).to.be.an.instanceOf(Hash, 'Hashing function result is not a hash');
    });

    it('returns hash value which byte length equals config.hashLength', async () => {
      // Arrange
      const textToHash = 'text_to_hash';
      const hashByteLength = config.hashLength;

      // Act
      const hash = await unitUnderTest.hash(textToHash);

      // Assert
      const hashStringLength = hashByteLength * 2;
      expect(hash.value).to.have.lengthOf(hashStringLength);
    });


    describe('when salt is not provided', () => {
      it('uses random salt', async () => {
        // Arrange
        const textToHash = 'text_to_hash';

        // Act
        const hash = await unitUnderTest.hash(textToHash);
        const hash2 = await unitUnderTest.hash(textToHash);

        // Assert
        expect(hash.salt).to.not.equal(hash2.salt, 'Used salt is not random.');
      });

      it('generates random salt with byte length that equals config.saltLength', async () => {
        // Arrange
        const textToHash = 'text_to_hash';
        const saltByteLength = config.saltLength;

        // Act
        const hash = await unitUnderTest.hash(textToHash);

        // Assert
        const saltStringLength = saltByteLength * 2;
        expect(hash.salt).to.have.lengthOf(saltStringLength);
      });
    });
  });

  describe('Pbkdf2HashingService#compare(text, hash)', () => {
    describe('when hashed text using hash.salt equals hash.value', () => {
      it('returns true', async () => {
        // Arrange
        const textToHash = 'text_to_hash';
        const hash = await unitUnderTest.hash(textToHash);

        // Act
        const result = await unitUnderTest.compare(textToHash, hash);

        // Assert
        expect(result).to.equal(true);
      });
    });

    describe('when hashed text using hash.salt does not equal hash.value', () => {
      it('returns false', async () => {
        // Arrange
        const textToHash = 'text_to_hash';
        const differentText = 'other_text';
        const hash = await unitUnderTest.hash(textToHash);

        // Act
        const result = await unitUnderTest.compare(differentText, hash);

        // Assert
        expect(result).to.equal(false);
      });
    });
  });
});
