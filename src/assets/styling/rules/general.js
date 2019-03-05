module.exports = {
  'indentation': [2, {
    'baseIndentLevel': 1,
    'severity': 'error',
    'message': 'Please use 2 spaces for indentation.'
  }],
  'length-zero-no-unit': true,
  'max-empty-lines': 1,
  'no-empty-source': true,
  'no-eol-whitespace': true,
  'no-extra-semicolons': true,
  'no-invalid-double-slash-comments': true,
  'no-missing-end-of-source-newline': true,
  'number-no-trailing-zeros': true,
  'property-case': 'lower',
  'property-no-unknown': true,
  // ensure webpack autoprefixer is working before applying `property-no-vendor-prefix` rule.
  'rule-empty-line-before': [
    'always-multi-line',
    {
      except: ['first-nested'],
      ignore: ['after-comment']
    }
  ],
  'shorthand-property-no-redundant-values': true,
  'string-no-newline': true,
  'string-quotes': 'single',
  'unit-case': 'lower',
  'unit-no-unknown': [
    true,
    {
      ignoreUnits: ['/^x$/']
    }
  ],
  'value-list-comma-newline-after': 'never-multi-line',
  'value-list-comma-space-after': 'always-single-line',
  'value-list-comma-space-before': 'never',
  'value-list-max-empty-lines': 0
};