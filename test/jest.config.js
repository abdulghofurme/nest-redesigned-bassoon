const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('../tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../', // Ensures Jest uses the root directory
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '.e2e-spec.ts$',
};
