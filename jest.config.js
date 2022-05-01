/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

function escapeRegex(str) {
  return str.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function pathsToModuleNameMapper(mapping, prefix = '<rootDir>') {
  const jestMap = {};
  for (const fromPath of Object.keys(mapping)) {
    let pattern;
    const toPaths = mapping[fromPath];
    if (toPaths.length === 0) {
      console.warn('emptyMap');
      continue;
    }

    // split with '*'
    const segments = fromPath.split(/\*/g);
    if (segments.length === 1) {
      const paths = toPaths.map(target => {
        const enrichedPrefix =
          prefix !== '' && !prefix.endsWith('/') ? `${prefix}/` : prefix;

        return `${enrichedPrefix}${target}`;
      });
      pattern = `^${escapeRegex(fromPath)}$`;
      jestMap[pattern] = paths.length === 1 ? paths[0] : paths;
    } else if (segments.length === 2) {
      const paths = toPaths.map(target => {
        const enrichedTarget =
          target.startsWith('./') && prefix !== ''
            ? target.substring(target.indexOf('/') + 1)
            : target;
        const enrichedPrefix =
          prefix !== '' && !prefix.endsWith('/') ? `${prefix}/` : prefix;

        return `${enrichedPrefix}${enrichedTarget.replace(/\*/g, '$1')}`;
      });
      pattern = `^${escapeRegex(segments[0])}(.*)${escapeRegex(
        segments[1],
      )}$`;
      jestMap[pattern] = paths.length === 1 ? paths[0] : paths;
    } else {
      console.warn('NotMappingMultiStarPath');
    }
  }

  return jestMap;
}

// #region Make a library
/** @type {import('typescript').CompilerOptions} */
const { compilerOptions } = require('./tsconfig.json');
// #endregion

module.exports = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended/all'],
};
