const config = {
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  modulePathIgnorePatterns: ['/dist/'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
}

export default config
