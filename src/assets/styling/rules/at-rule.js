module.exports = {
  'at-rule-empty-line-before': [
    'always',
    {
      except: [
        'first-nested',
        'blockless-after-blockless'
      ],
      ignore: [
        'after-comment'
      ]
    }
  ],
  'at-rule-name-case': 'lower',
  'at-rule-name-space-after': 'always-single-line',
  'at-rule-semicolon-newline-after': 'always'
};