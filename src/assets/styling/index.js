module.exports = {
  plugins: ['stylelint-order'],
  rules: Object.assign({}, ...[
    './rules/at-rule',
    './rules/block',
    './rules/color',
    './rules/declaration',
    './rules/font',
    './rules/function',
    './rules/general',
    './rules/media',
    './rules/order',
    './rules/selector'
  ].map(require))
};