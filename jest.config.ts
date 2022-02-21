import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  clearMocks: true,
  testEnvironment: 'node',
  testMatch: [
    '**/lib/tests/**/*.test.js',
  ]
};
export default config;