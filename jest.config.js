export default {
  preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
  testMatch: ['**/tests/**/*.spec.js', '**/__tests__/**/*.spec.js'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest',
  },
}
