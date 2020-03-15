const { randomBytes } = require('crypto');
const { promisify } = require('util');

const randomBytesPromisified = promisify(randomBytes);

class RandomStringGenerator {
  static async generate(stringLength = 10) {
    const bytes = await randomBytesPromisified(Math.floor(stringLength / 2));
    return bytes.toString('hex');
  }
}

module.exports = RandomStringGenerator;
