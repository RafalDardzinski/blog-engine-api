// Global imports
const chai = require('chai');

// Local imports
const TokensSignerConfiguration = require('./tokens-signer-configuration');

// Test suite setup
const { expect } = chai;

describe(`TokensSignerConfiguration ${__dirname}`, () => {
  let validityPeriod;
  let issuer;
  let subject;
  let secretBase;

  /** @type {TokensSignerConfiguration} */
  let unitUnderTest;

  beforeEach(() => {
    validityPeriod = 61;
    issuer = 'testIssuer';
    subject = 'testSubject';
    secretBase = 'testSecretBase';
    unitUnderTest = new TokensSignerConfiguration(validityPeriod, secretBase, issuer, subject);
  });

  describe('constructor(validityPeriod, secretBase, issuer, subject)', () => {
    it('assigns validityPeriod to TokensSignerConfiguration#validityPeriod', () => {
      // Arrange
      const testValidityPeriod = validityPeriod + 60;

      // Act
      const result = new TokensSignerConfiguration(testValidityPeriod, secretBase, issuer, subject);

      // Assert
      expect(result.validityPeriod).to.equal(testValidityPeriod);
    });

    it('assigns secretBase to TokensSignerConfiguration#secretBase', () => {
      // Arrange
      const testSecretBase = `${secretBase}-different`;

      // Act
      const result = new TokensSignerConfiguration(validityPeriod, testSecretBase, issuer, subject);

      // Assert
      expect(result.secretBase).to.equal(testSecretBase);
    });

    it('assigns issuer to TokensSignerConfiguration#issuer', () => {
      // Arrange
      const testIssuer = `${issuer}-different`;

      // Act
      const result = new TokensSignerConfiguration(validityPeriod, secretBase, testIssuer, subject);

      // Assert
      expect(result.issuer).to.equal(testIssuer);
    });

    it('assigns subject to TokensSignerConfiguration#subject', () => {
      // Arrange
      const testSubject = `${subject}-different`;

      // Act
      const result = new TokensSignerConfiguration(validityPeriod, secretBase, issuer, testSubject);

      // Assert
      expect(result.subject).to.equal(testSubject);
    });

    describe('throws an error when...', () => {
      it('validityPeriod is not defined', () => {
        // Act
        const act = () => new TokensSignerConfiguration(undefined, secretBase, issuer, subject);

        // Assert
        expect(act).to.throw();
      });

      it('validityPeriod is not a number', () => {
        // Act
        const act = () => new TokensSignerConfiguration('lorem', secretBase, issuer, subject);

        // Assert
        expect(act).to.throw();
      });

      it('validityPeriod is not greater than 60', () => {
        // Act
        const act = () => new TokensSignerConfiguration(60, secretBase, issuer, subject);

        // Assert
        expect(act).to.throw();
      });

      it('secretBase is not defined', () => {
        // Act
        const act = () => new TokensSignerConfiguration(validityPeriod, undefined, issuer, subject);

        // Assert
        expect(act).to.throw();
      });

      it('secretBase is not a string', () => {
        // Act
        const act = () => new TokensSignerConfiguration(validityPeriod, 45, issuer, subject);

        // Assert
        expect(act).to.throw();
      });

      it('secretBase is shorter than 8 characters', () => {
        // Act
        const act = () => new TokensSignerConfiguration(validityPeriod, '1234567', issuer, subject);

        // Assert
        expect(act).to.throw();
      });

      it('issuer is not defined', () => {
        // Act
        const act = () => new TokensSignerConfiguration(
          validityPeriod, secretBase, undefined, subject,
        );

        // Assert
        expect(act).to.throw();
      });

      it('issuer is not a string', () => {
        // Act
        const act = () => new TokensSignerConfiguration(
          validityPeriod, secretBase, 21, subject,
        );

        // Assert
        expect(act).to.throw();
      });

      it('issuer is shorter than 1 character', () => {
        // Act
        const act = () => new TokensSignerConfiguration(
          validityPeriod, secretBase, '', subject,
        );

        // Assert
        expect(act).to.throw();
      });
    });
  });

  describe('TokensSignerConfiguration#validityPeriod', () => {
    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.validityPeriod;
      const newValue = unitUnderTest.validityPeriod + 456;

      // Act
      unitUnderTest.validityPeriod = newValue;

      // Assert
      expect(unitUnderTest.validityPeriod).to.equal(oldValue);
    });
  });

  describe('TokensSignerConfiguration#issuer', () => {
    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.issuer;
      const newValue = `${unitUnderTest.issuer}-different`;

      // Act
      unitUnderTest.issuer = newValue;

      // Assert
      expect(unitUnderTest.issuer).to.equal(oldValue);
    });
  });

  describe('TokensSignerConfiguration#subject', () => {
    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.subject;
      const newValue = `${unitUnderTest.subject}-different`;

      // Act
      unitUnderTest.subject = newValue;

      // Assert
      expect(unitUnderTest.subject).to.equal(oldValue);
    });
  });

  describe('TokensSignerConfiguration#secretBase', () => {
    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.secretBase;
      const newValue = `${unitUnderTest.secretBase}-different`;

      // Act
      unitUnderTest.secretBase = newValue;

      // Assert
      expect(unitUnderTest.secretBase).to.equal(oldValue);
    });
  });
});
