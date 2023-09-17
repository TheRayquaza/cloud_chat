/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
// process.env
const dotenv = require('dotenv');
dotenv.config({path: '.env'});

export default {
  bail: 0,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleDirectories: ["node_modules"],
  testMatch: ["**/test/**/test*"],
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose : true
};
