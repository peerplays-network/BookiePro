module.exports = {
  'declaration-bang-space-after': 'never',
  'declaration-bang-space-before': 'always',
  'declaration-block-no-duplicate-properties': [
    true,
    {
      ignore: ['consecutive-duplicates-with-different-values']
    }
  ],
  'declaration-block-no-shorthand-property-overrides': true,
  'declaration-block-semicolon-newline-after': 'always',
  'declaration-block-semicolon-space-before': 'never',
  'declaration-block-single-line-max-declarations': 1,
  'declaration-block-trailing-semicolon': 'always',
  'declaration-colon-newline-after': 'always-multi-line',
  'declaration-colon-space-before': 'never',
  'declaration-empty-line-before': [
    'always',
    {
      except: ['after-declaration', 'first-nested'],
      ignore: ['after-comment']
    }
  ],
  'declaration-no-important': true,
  'declaration-property-unit-whitelist': {
    'line-height': [],
    'background-image': ['px', 'x', '%'],
    'background': ['px', 'x', '%'],
    'width': ['px', '%', 'vw', 'vh'],
    'height': ['px', '%', 'vw', 'vh'],
    'font-size': ['px'],
    'font': ['px'],
    '/^animation/': ['s'],
  }
};