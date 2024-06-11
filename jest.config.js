// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/test/*.test.(ts|tsx|js)'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
    collectCoverageFrom: ["./src/**", "!./src/data/**/**.ts", "!./src/libs/yaml.ts","!./src/types/**.d.ts"],
    "collectCoverage": true,
    "coverageReporters": ["html", "text","json","lcov"],
    "coverageDirectory": "coverage"
  };
  