// Global imports
const jwt = require('jsonwebtoken');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// Local imports
const JsonWebTokenService = require('./jwt-service');

// Mocks
class TokenPayload {
  constructor() {
    this.prop1 = 'test1';
    this.prop2 = 'test2';
  }
}

// Test suite setup
chai.use(chaiAsPromised);
const { expect } = chai;

describe(`JsonWebTokenService ${__dirname}`, () => {
  const testSecret = 'testSecret';
  const signOptions = {
    expiresIn: 500,
    audience: 'testAudience',
  };
  const unitUnderTest = JsonWebTokenService;
  let tokenPayload;

  beforeEach(() => {
    tokenPayload = { ...new TokenPayload() };
  });

  describe('JsonWebTokenService.sign(token, secret, options)', () => {
    it('correctly generates JSON Web Token', async () => {
      // Arrange
      const signedJwt = jwt.sign(tokenPayload, testSecret, signOptions);

      // Act
      const result = await unitUnderTest.sign(tokenPayload, testSecret, signOptions);

      // Assert
      expect(result).to.equal(signedJwt);
    });
  });

  describe('JsonWebTokenService.verify(token, secret, options)', () => {
    it('correctly returns token\'s payload when token is valid', async () => {
      // Arrange
      const signedJwt = jwt.sign(tokenPayload, testSecret, signOptions);
      const signedJwtPayload = jwt.verify(signedJwt, testSecret, signOptions);

      // Act
      const result = await unitUnderTest.verify(signedJwt, testSecret, signOptions);

      // Assert
      expect(result).to.deep.equal(signedJwtPayload);
    });

    describe('when token is not valid', () => {
      it('throws an error', (done) => {
        // Arrange
        const signedJwt = jwt.sign(tokenPayload, testSecret, signOptions);
        const incorrectSecret = `${testSecret}-incorrect`;

        // Act
        const act = unitUnderTest.verify(signedJwt, incorrectSecret, signOptions);

        // Assert
        expect(act).to.be.rejected.and.notify(done);
      });
    });
  });

  describe('JsonWebTokenService.decode(token, options)', () => {
    it('returns token\'s payload', () => {
      // Arrange
      const signedJwt = jwt.sign(tokenPayload, testSecret, signOptions);
      const properlyDecodedPayload = jwt.decode(signedJwt);

      // Act
      const result = JsonWebTokenService.decode(signedJwt);

      // Assert
      expect(result).to.deep.equal(properlyDecodedPayload);
    });
  });
});
