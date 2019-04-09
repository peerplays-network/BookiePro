# Rules

> Many of the rules that are enforced are taken from [AORetail](https://github.com/AORetail/css).

## Formatting

- Use spaces for indentation, do not use tabs.
- For selectors:
  - Use kebab-case.
  - BEM syntax is allowed.
  - Never use camelCase for class selectors.
  - Avoid using IDs as selectors.
- If possible, add classes to elements.
  - Try not to target specific elements e.g. `a`, `p`, `li` etc.
- Specifics:
  - Insert a space before the opening brace ` {` in rule declarations.
  - Closing braces `}` of rule declarations should be on a new line.
  - When declaring properties, put a space after but not before the `: ` character.
  - Insert blank lines between rule declarations.
  - Single quotes are to be used instead of double.
  - Font weight notation must be numeric.
    - no normal (400), bold (700), bolder, lighter.
  - no double slash comments as they can cause erratic behaviour
    - use `/* */` commenting

## Property Declaration Order

Properties are ordered both by groups and in a certain order within each group.

See below for a comprehensive list. Any properties not listed should be declared at the bottom.

<details><summary> OPEN TO SEE DECLARATION ORDER EXAMPLE </summary>

```scss
.class-selector {
  // mixins and extensions
  @include function(arg);
  @extend %placeholder;

  // content
  content: '';

  // display
  display: block | flex | grid | inline | inline-block | inline-flex | inline-grid | table | table-cell;

  // flex properties
  flex-flow: column wrap;
  flex-direction: column;
  flex-wrap: wrap;
  flex: 1 0 auto;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;

  // grid properties
  grid: 200px auto / 1fr auto 1fr;
  grid-template:
    [row1-start] 'header header header' 24px [row1-end]
    [row2-start] 'footer footer footer' 24px [row2-end]
    / auto 48px auto;
  grid-template-columns: 48px 48px 48px 48px;
  grid-template-rows: auto;
  grid-template-areas:
    'header header header header'
    'sidebar main main main'
    'footer footer footer footer';
  grid-gap: 48px;
  grid-column-gap: 48px;
  grid-row-gap: 48px;
  grid-auto-columns: 64px;
  grid-auto-rows: 64px;
  grid-auto-flow: column;
  grid-area: 1 / col4-start / last-line / 6;
  grid-column: 3 / span 2;
  grid-column-start: 2;
  grid-column-end: five;
  grid-row: third-line / 4;
  grid-row-start: row1-start;
  grid-row-end: 3;

  // flex and grid parents
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;

  // flex and grid children
  justify-self: center;
  align-self: center;
  place-self: center;
  order: 1;

  // position
  position: absolute | fixed | relative | static | sticky;
  top: 50%;
  right: 50%;
  bottom: 50%;
  left: 50%;
  z-index: 1;

  // alignment
  transform: translate(-50% -50%);
  vertical-align: middle;

  // float properties
  float: left | right | none;
  clear: left | right | both | none;

  // box-sizing
  box-sizing: border-box;

  // width
  width: 1000px;
  min-width: 50%;
  max-width: 100%;

  // height
  height: 1000px;
  min-height: 50%;
  max-height: 100%;

  // margin
  margin: 8px 16px 24px 32px;
  margin-top: 8px;
  margin-right: 16px;
  margin-bottom: 24px;
  margin-left: 32px;

  // padding
  padding: 8px 16px 24px 32px;
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 24px;
  padding-left: 32px;

  // border properties
  border: 1px solid #7fba23;
  border-top: 1px solid #7fba23;
  border-right: 1px solid #7fba23;
  border-bottom: 1px solid #7fba23;
  border-left: 1px solid #7fba23;
  border-radius: 4px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;

  // typography
  font: 16px/1.5 sans-serif 400 italic;
  line-height: 1.5; // no units
  font-family: sans-serif;
  font-weight: 400;
  font-style: italic;
  font-size: 16px;
  color: #7fba23;

  // test manipulation
  direction: ltr;
  text-align: center;
  text-transform: lowercase;
  text-decoration: underline;

  // word wrap
  word-break: break-word;
  word-wrap: break-word;

  // background
  background: url('../img/nicholas-cage.jpg') no-repeat bottom right #7fba23;
  background-color: #7fba23;
  background-image: url('../img/nicholas-cage.jpg');
  background-image: image-set(url('../img/nicholas-cage.jpg') 1x, url('../img/nicholas-cage_2x.jpg') 2x);
  background-position: top left;
  background-repeat: no-repeat;
  background-size: cover;
  object-fit: cover;

  // box shadow
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.5);

  // list style
  list-style: lower-roman outside url(../img/shape.png);
  list-style-type: lower-roman;
  list-style-position: outside;
  list-style-image: url(../img/shape.png);

  // transition and animation
  transition: color 1s ease-in-out;
  animation: 3s ease-in 1s 2 reverse both paused slidein;

  // opacity and visibility
  opacity: 0.5;
  visibility: visible;

  // overflow
  overflow: auto;
  overflow-x: auto;
  overflow-y: auto;

  // mouse properties
  cursor: pointer;
  pointer-events: none;

  // psuedo selectors
  &:hover {
    // properties
  }

  &:focus {
    // properties
  }

  &:active {
    // properties
  }

  &:visited {
    // properties
  }

  &:valid {
    // properties
  }

  &:invalid {
    // properties
  }

  &:checked {
    // properties
  }

  &:first-child {
    // properties
  }

  &:first-of-type {
    // properties
  }

  &:last-child {
    // properties
  }

  &:last-of-type {
    // properties
  }

  &:nth-child(4n+1) {
    // properties
  }

  &:nth-of-type(4n+1) {
    // properties
  }

  // psuedo elements
  &::before {
    // properties
  }

  &::after {
    // properties
  }

  // children
  .class-selector__child {
    // properties
  }
}
```
</details>

## Nested Selectors

**Selectors should not be nested more than three levels deep!**

```scss
.parent {
  .child {
    .gran-child {
      // thats enough ;)

      &::before {
        // pseudo elements don't count towards nesting depth
      }
    }
  }
}
```

## @Extends

Placeholders should be extended before any property declarations.

```scss
.class-selector {
  @extend %header-main;

  color: #7fba23;
}
```

## Property rules

- Hex colours should be at least 6 digits long and use lowercase letters.

<details><summary>Open to see whitelisted units of measurement.</summary>

*animation*: `s`

*background-image | background*: `px`, `x`, or `%`

*border | border-width*: `px`

*font-size | font*: `px`

*margin | padding. (shorthand)*: `px`, `vh`, or `vw`

*margin-top, margin-right, margin-bottom, margin-left*: `px`

*padding-top, padding-right, padding-bottom, padding-left*: `px`

*width | height*: `px`, `%`, `vw`, or `vh`

</details>