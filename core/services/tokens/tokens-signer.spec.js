// Global imports
const chai = require('chai');
const jwt = require('jsonwebtoken');

// Local imports
const SecretGenerationStrategy = require('./secret-generation-strategy');
const TokensSignerConfiguration = require('./tokens-signer-configuration');
const TokensSigner = require('./tokens-signer');

// Mocks
class TokensSignerConfigurationMock extends TokensSignerConfiguration {
}

class SecretGenerationStrategyMock extends SecretGenerationStrategy {
  generateSecret(secretBase, salt) {
    return `${secretBase}${salt}`;
  }
}

// Test suite setup
const { expect } = chai;

describe(`TokensSigner ${__dirname}`, () => {
  const secretBase = 'this-is-secret-base';
  const salt = 'this-is-secret-salt';
  const saltedSecret = `${secretBase}---${salt}`;

  let tokensSignerConfiguration;
  let secretGenerationStrategy;

  /** @type {TokensSigner} */
  let unitUnderTest;

  beforeEach(() => {
    tokensSignerConfiguration = new TokensSignerConfigurationMock(458, 'testIssuer', 'testSubject', 'testAudience');
    secretGenerationStrategy = new SecretGenerationStrategyMock(saltedSecret);
    unitUnderTest = new TokensSigner(
      tokensSignerConfiguration,
      secretBase,
      secretGenerationStrategy,
    );
  });

  describe('constructor(tokensSignerConfiguration, secretBase, secretGenerationStrategy)', () => {
    it('does not expose tokensSignerConfiguration', () => {
      // Act
      const objectValues = Object.values(unitUnderTest);

      // Assert
      expect(objectValues).to.not.include(tokensSignerConfiguration);
    });

    it('does not expose secretBase', () => {
      // Act
      const objectValues = Object.values(unitUnderTest);

      // Assert
      expect(objectValues).to.not.include(secretBase);
    });

    it('does not expose secretGenerationStrategy', () => {
      // Act
      const objectValues = Object.values(unitUnderTest);

      // Assert
      expect(objectValues).to.not.include(secretGenerationStrategy);
    });

    describe('throws an error when...', () => {
      it('tokensSignerConfiguration is not defined', () => {
        // Act
        const act = () => new TokensSigner(undefined, secretBase, secretGenerationStrategy);

        // Assert
        expect(act).to.throw();
      });

      it('tokensSignerConfiguration is not an instance of TokensSignerConfiguration', () => {
        // Arrange
        const invalidTokensSignerConfiguration = {};

        // Act
        const act = () => new TokensSigner(
          invalidTokensSignerConfiguration,
          secretBase,
          secretGenerationStrategy,
        );

        // Assert
        expect(act).to.throw();
      });

      it('secretBase is not a string', () => {
        // Arrange
        const invalidArguments = {
          secretObj: {},
          secretNumber: 45,
          secretBool: true,
          secretSymbol: Symbol('test'),
        };

        Object.values(invalidArguments).forEach((invalidArgument) => {
          // Act
          const act = () => new TokensSigner(
            tokensSignerConfiguration,
            invalidArgument,
            secretGenerationStrategy,
          );

          // Assert
          expect(act, `Error was not thrown when argument of type ${typeof invalidArgument} was passed as secretBase.`)
            .to.throw();
        });
      });

      it('secretBase is shorter than 8 characters', () => {
        // Arrange
        const tooShortSecret = 'short..';

        // Act
        const act = () => new TokensSigner(
          tokensSignerConfiguration,
          tooShortSecret,
          secretGenerationStrategy,
        );

        // Assert
        expect(act).to.throw();
      });

      it('secretGenerationStrategy is not defined', () => {
        // Act
        const act = () => new TokensSigner(tokensSignerConfiguration, secretBase, undefined);

        // Assert
        expect(act).to.throw();
      });

      it('secretGenerationStrategy is not an instance of SecretGenerationStrategy', () => {
        // Arrange
        const invalidSecretGenerationStrategy = {};

        // Act
        const act = () => new TokensSigner(
          tokensSignerConfiguration,
          secretBase,
          invalidSecretGenerationStrategy,
        );

        // Assert
        expect(act).to.throw();
      });
    });
  });

  describe('TokensSigner#sign(payload, salt)', () => {
    it('returns a valid JSON Web Token', async () => {
      // Arrange
      const payload = { testKey: 'testValue' };
      const testSecretSalt = 'testSecretSalt';

      // Act
      const result = await unitUnderTest.sign(payload, testSecretSalt);

      // Assert
      const decodedPayload = jwt.decode(result);
      expect(decodedPayload).to.own.include(payload);
    });

    it('signs token using provided secretGenerationStrategy', async () => {
      // Arrange
      const payload = { testKey: 'testValue' };
      const testSecretSalt = 'testSecretSalt';
      const secretGeneratedByStrategy = secretGenerationStrategy
        .generateSecret(secretBase, testSecretSalt);

      // Act
      const result = await unitUnderTest.sign(payload, testSecretSalt);

      // Assert
      const tokenVerificationAction = () => jwt.verify(result, secretGeneratedByStrategy);
      expect(tokenVerificationAction).to.not.throw();
    });

    it('adds issuer to created token\'s payload', async () => {
      // Arrange
      const payload = { testKey: 'testValue' };
      const testSecretSalt = 'testSecretSalt';

      // Act
      const result = await unitUnderTest.sign(payload, testSecretSalt);

      // Assert
      const decodedPayload = jwt.decode(result);
      expect(decodedPayload.iss).to.equal(tokensSignerConfiguration.issuer);
    });

    it('adds expiry datetime to created token\'s payload', async () => {
      // Arrange
      const payload = { testKey: 'testValue' };
      const testSecretSalt = 'testSecretSalt';
      const currentDateTimeInSeconds = Math.floor(Date.now() / 1000);
      const tokensValidityPeriod = tokensSignerConfiguration.validityPeriod;
      const expectedExpiryDateTime = currentDateTimeInSeconds + tokensValidityPeriod;

      // Act
      const result = await unitUnderTest.sign(payload, testSecretSalt);

      // Assert
      const decodedPayload = jwt.decode(result);
      expect(decodedPayload.exp).to.be.closeTo(expectedExpiryDateTime, 1);
    });

    it('adds subject to created token\'s payload', async () => {
      // Arrange
      const payload = { testKey: 'testValue' };
      const testSecretSalt = 'testSecretSalt';
      const tokensSubject = tokensSignerConfiguration.subject;

      // Act
      const result = await unitUnderTest.sign(payload, testSecretSalt);

      // Assert
      const decodedPayload = jwt.decode(result);
      expect(decodedPayload.sub).to.equal(tokensSubject);
    });

    describe('when subject is not defined in configuration...', () => {
      it('does not add subject to payload', async () => {
        // Arrange
        const payload = { testKey: 'testValue' };
        const testSecretSalt = 'testSecretSalt';
        const tokensSignerConfigurationWithoutSubject = new TokensSignerConfiguration(
          458, 'testIssuer', undefined, 'testAudience',
        );
        unitUnderTest = new TokensSigner(
          tokensSignerConfigurationWithoutSubject,
          secretBase,
          secretGenerationStrategy,
        );

        // Act
        const result = await unitUnderTest.sign(payload, testSecretSalt);

        // Assert
        const decodedPayload = jwt.decode(result);
        expect(decodedPayload).to.be.an('object')
          .that.does.not.have.property('sub');
      });
    });

    describe('when audience is not defined in configuration...', () => {
      it('does not add audience to payload', async () => {
        // Arrange
        const payload = { testKey: 'testValue' };
        const testSecretSalt = 'testSecretSalt';
        const tokensSignerConfigurationWithoutSubject = new TokensSignerConfiguration(
          458, 'testIssuer', 'testSubject',
        );
        unitUnderTest = new TokensSigner(
          tokensSignerConfigurationWithoutSubject,
          secretBase,
          secretGenerationStrategy,
        );

        // Act
        const result = await unitUnderTest.sign(payload, testSecretSalt);

        // Assert
        const decodedPayload = jwt.decode(result);
        expect(decodedPayload).to.be.an('object')
          .that.does.not.have.property('aud');
      });
    });
  });
});
