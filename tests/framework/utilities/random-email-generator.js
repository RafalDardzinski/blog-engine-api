const RandomNumberGenerator = require('./random-number-generator');
const RandomStringGenerator = require('./random-string-generator');

const emailSuffixes = [
  'gmail.com',
  'wp.pl',
  'onet.pl',
  'yahoo.com',
  'buziaczek.net',
];

class RandomEmailGenerator {
  static async generate() {
    const prefixLength = RandomNumberGenerator.generate(5, 15);
    const prefix = await RandomStringGenerator.generate(prefixLength);

    const suffixIndex = RandomNumberGenerator.generate(0, emailSuffixes.length - 1);
    const suffix = emailSuffixes[suffixIndex];

    return `${prefix}@${suffix}`;
  }
}

module.exports = RandomEmailGenerator;
