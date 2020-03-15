const UserEntity = require('./user-entity');

const Administrator = new UserEntity({
  username: 'administrator',
  password: 'dfgfhgjhhdscx!',
  email: 'valid-email@gmail.com',
  isActive: true,
});

module.exports = {
  Administrator,
};
