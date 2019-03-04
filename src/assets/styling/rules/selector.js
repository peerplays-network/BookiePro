/* eslint-disable */
/*
  Classname Selectors
  .class-selector {
    // properties
  }

  .parent-class__with-child-class--and-modifier {
    // properties
  }
  ID Selectors
  Although we discourage the use of IDs as selectors,
  if absolutely necessary they should be declared using the same pattern as classnames.

  # id-selector {
    // properties
  }

  Nested Selectors
  Selectors should not be nested more than three levels deep!

  .parent {
    .child {
      .gran-child {
        // thats enough
        &::before {
          // pseudo elements don't count towards nesting depth
        }
      }
    }
  }
*/
module.exports = {
  'selector-attribute-brackets-space-inside': 'never',
  'selector-attribute-operator-space-after': 'never',
  'selector-attribute-operator-space-before': 'never',
  'selector-class-pattern': '^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:\\[.+\\])?$',
  'selector-id-pattern': '^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:\\[.+\\])?$',
  'selector-combinator-space-after': 'always',
  'selector-combinator-space-before': 'always',
  'selector-descendant-combinator-no-non-space': true,
  'selector-list-comma-space-before': 'never',
  'selector-max-empty-lines': 0,
  'selector-max-compound-selectors': 3,
  'selector-max-specificity': '1,3,2',
  'selector-pseudo-class-case': 'lower',
  'selector-pseudo-class-no-unknown': true,
  'selector-pseudo-class-parentheses-space-inside': 'never',
  'selector-pseudo-element-case': 'lower',
  'selector-pseudo-element-colon-notation': 'double',
  'selector-pseudo-element-no-unknown': true,
  'selector-type-case': 'lower',
  'selector-type-no-unknown': true
};