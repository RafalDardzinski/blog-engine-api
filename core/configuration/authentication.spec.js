// Global imports
const chai = require('chai');

// Local imports
const AuthenticationConfiguration = require('./authentication');

// Mocks
class EnvironmentMock {
  constructor() {
    this.AUTHENTICATION_ACCESS_LIFETIME = Symbol('AUTHENTICATION_ACCESS_LIFETIME');
    this.AUTHENTICATION_SESSION_LIFETIME = Symbol('AUTHENTICATION_SESSION_LIFETIME');
    this.AUTHENTICATION_ACCESS_SECRET = Symbol('AUTHENTICATION_ACCESS_SECRET');
    this.AUTHENTICATION_SESSION_SECRET = Symbol('AUTHENTICATION_SESSION_SECRET');
    this.AUTHENTICATION_ISSUER = Symbol('AUTHENTICATION_ISSUER');
  }
}

// Test suite setup
const { expect } = chai;

describe(`AuthenticationConfiguration ${__dirname}`, () => {
  const environment = process.env;

  /** @type {AuthenticationConfiguration} */
  let unitUnderTest;

  beforeEach(() => {
    process.env = new EnvironmentMock();
    unitUnderTest = new AuthenticationConfiguration();
  });

  afterEach(() => {
    process.env = environment;
  });

  describe('AuthenticationConfiguration#accessTokensLifetime', () => {
    it('returns value of AUTHENTICATION_ACCESS_LIFETIME environment variable', () => {
      // Act
      const result = unitUnderTest.accessTokensLifetime;

      // Assert
      expect(result).to.equal(process.env.AUTHENTICATION_ACCESS_LIFETIME);
    });

    it('cannot be reassigned', () => {
      // Arrange
      const oldValue = unitUnderTest.accessTokensLifetime;
      const newValue = Symbol('newValue');

      // Act
      unitUnderTest.accessTokensLifetime = newValue;

      // Assert
      expect(unitUnderTest.accessTokensLifetime).to.equal(oldValue);
    });
  });

  describe('AuthenticationConfiguration#refreshTokensLifetime', () => {
    it('returns value of AUTHENTICATION_SESSION_LIFETIME environment variable', () => {
      // Act
      const result = unitUnderTest.refreshTokensLifetime;

      // Assert
      expect(result).to.equal(process.env.AUTHENTICATION_SESSION_LIFETIME);
    });

    it('cannot be reassigned', () => {
      // Arrange
      const oldValue = unitUnderTest.refreshTokensLifetime;
      const newValue = Symbol('newValue');

      // Act
      unitUnderTest.refreshTokensLifetime = newValue;

      // Assert
      expect(unitUnderTest.refreshTokensLifetime).to.equal(oldValue);
    });
  });

  describe('AuthenticationConfiguration#accessTokensSecretBase', () => {
    it('returns value of AUTHENTICATION_ACCESS_SECRET environment variable', () => {
      // Act
      const result = unitUnderTest.accessTokensSecretBase;

      // Assert
      expect(result).to.equal(process.env.AUTHENTICATION_ACCESS_SECRET);
    });

    it('cannot be reassigned', () => {
      // Arrange
      const oldValue = unitUnderTest.accessTokensSecretBase;
      const newValue = Symbol('newValue');

      // Act
      unitUnderTest.accessTokensSecretBase = newValue;

      // Assert
      expect(unitUnderTest.accessTokensSecretBase).to.equal(oldValue);
    });
  });

  describe('AuthenticationConfiguration#refreshTokensSecretBase', () => {
    it('returns value of AUTHENTICATION_SESSION_SECRET environment variable', () => {
      // Act
      const result = unitUnderTest.refreshTokensSecretBase;

      // Assert
      expect(result).to.equal(process.env.AUTHENTICATION_SESSION_SECRET);
    });

    it('cannot be reassigned', () => {
      // Arrange
      const oldValue = unitUnderTest.refreshTokensSecretBase;
      const newValue = Symbol('newValue');

      // Act
      unitUnderTest.refreshTokensSecretBase = newValue;

      // Assert
      expect(unitUnderTest.refreshTokensSecretBase).to.equal(oldValue);
    });
  });

  describe('AuthenticationConfiguration#tokensIssuer', () => {
    it('returns value of AUTHENTICATION_ISSUER environment variable', () => {
      // Act
      const result = unitUnderTest.tokensIssuer;

      // Assert
      expect(result).to.equal(process.env.AUTHENTICATION_ISSUER);
    });

    it('cannot be reassigned', () => {
      // Arrange
      const oldValue = unitUnderTest.tokensIssuer;
      const newValue = Symbol('newValue');

      // Act
      unitUnderTest.tokensIssuer = newValue;

      // Assert
      expect(unitUnderTest.tokensIssuer).to.equal(oldValue);
    });
  });
});
