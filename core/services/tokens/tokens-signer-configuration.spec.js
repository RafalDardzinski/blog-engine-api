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
  let audience;

  /** @type {TokensSignerConfiguration} */
  let unitUnderTest;

  beforeEach(() => {
    validityPeriod = 61;
    issuer = 'testIssuer';
    subject = 'testSubject';
    audience = 'testAudience';
    unitUnderTest = new TokensSignerConfiguration(validityPeriod, issuer, subject, audience);
  });

  describe('constructor(validityPeriod, issuer, subject, audience)', () => {
    it('assigns validityPeriod to TokensSignerConfiguration#validityPeriod', () => {
      // Arrange
      const testValidityPeriod = validityPeriod + 60;

      // Act
      const result = new TokensSignerConfiguration(testValidityPeriod, issuer, subject, audience);

      // Assert
      expect(result.validityPeriod).to.equal(testValidityPeriod);
    });

    it('assigns issuer to TokensSignerConfiguration#issuer', () => {
      // Arrange
      const testIssuer = `${issuer}-different`;

      // Act
      const result = new TokensSignerConfiguration(validityPeriod, testIssuer, subject, audience);

      // Assert
      expect(result.issuer).to.equal(testIssuer);
    });

    it('assigns subject to TokensSignerConfiguration#subject', () => {
      // Arrange
      const testSubject = `${subject}-different`;

      // Act
      const result = new TokensSignerConfiguration(validityPeriod, issuer, testSubject, audience);

      // Assert
      expect(result.subject).to.equal(testSubject);
    });

    it('assigns audience to TokensSignerConfiguration#audience', () => {
      // Arrange
      const testAudience = `${audience}-different`;

      // Act
      const result = new TokensSignerConfiguration(validityPeriod, issuer, subject, testAudience);

      // Assert
      expect(result.audience).to.equal(testAudience);
    });

    describe('throws an error when...', () => {
      it('validityPeriod is not defined', () => {
        // Act
        const act = () => new TokensSignerConfiguration(undefined, issuer, subject, audience);

        // Assert
        expect(act).to.throw();
      });

      it('validityPeriod is not a number', () => {
        // Act
        const act = () => new TokensSignerConfiguration('lorem', issuer, subject, audience);

        // Assert
        expect(act).to.throw();
      });
      it('validityPeriod is not greater than 60', () => {
        // Act
        const act = () => new TokensSignerConfiguration(60, issuer, subject, audience);

        // Assert
        expect(act).to.throw();
      });
      it('issuer is not defined', () => {
        // Act
        const act = () => new TokensSignerConfiguration(
          validityPeriod, undefined, subject, audience,
        );

        // Assert
        expect(act).to.throw();
      });

      it('issuer is not a string', () => {
        // Act
        const act = () => new TokensSignerConfiguration(
          validityPeriod, 21, subject, audience,
        );

        // Assert
        expect(act).to.throw();
      });

      it('issuer is shorter than 1 character', () => {
        // Act
        const act = () => new TokensSignerConfiguration(
          validityPeriod, '', subject, audience,
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

  describe('TokensSignerConfiguration#audience', () => {
    it('is readonly', () => {
      // Arrange
      const oldValue = unitUnderTest.audience;
      const newValue = `${unitUnderTest.audience}-different`;

      // Act
      unitUnderTest.audience = newValue;

      // Assert
      expect(unitUnderTest.audience).to.equal(oldValue);
    });
  });
});
