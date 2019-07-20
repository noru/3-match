const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig')

module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__test__/__mocks__/setup.js'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/js/*', '!**/js/types/**'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__test__/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__test__/__mocks__/styleMock.js',
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(lodash-es|noru-utils)/)'],
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
    },
  },
}
