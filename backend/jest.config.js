// jest.config.js
module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  verbose: true,
  // garante que o Jest procure apenas em __tests__/*.test.js
  testMatch: ['**/__tests__/**/*.test.js'],
  // permite importar módulos via caminhos relativos ao rootDir
  moduleDirectories: ['node_modules', '<rootDir>'],
};
