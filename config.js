module.exports = {
  PORT: process.env.PORT || 8080,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/remember-that',
  TEST_MONGODB_URI: process.env.TEST_MONGODB_URI || 'mongodb://localhost/remember-that-test',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};