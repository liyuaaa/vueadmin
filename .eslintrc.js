module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    "no-tabs": "off",
    "space-before-function-paren": 0,
    "eqeqeq": 'off'
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
