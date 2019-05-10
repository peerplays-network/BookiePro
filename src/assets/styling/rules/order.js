module.exports = {
  'order/order': [{
    type: 'at-rule',
    name: 'extend'
  },
  'declarations',
  {
    type: 'at-rule',
    name: 'media'
  }
  ],
  'order/properties-order': [
    [{
      order: 'strict',
      properties: [
        'content'
      ]
    },
    {
      order: 'strict',
      properties: [
        'display'
      ]
    },
    {
      order: 'strict',
      properties: [
        'flex-flow',
        'flex-direction',
        'flex-wrap',
        'flex',
        'flex-grow',
        'flex-shrink',
        'flex-basis'
      ]
    },
    {
      order: 'strict',
      properties: [
        'grid',
        'grid-template',
        'grid-template-columns',
        'grid-template-rows',
        'grid-template-areas',
        'grid-gap',
        'grid-column-gap',
        'grid-row-gap',
        'grid-auto-columns',
        'grid-auto-rows',
        'grid-auto-flow',
        'grid-area',
        'grid-column',
        'grid-column-start',
        'grid-column-end',
        'grid-row',
        'grid-row-start',
        'grid-row-end'
      ]
    },
    {
      order: 'strict',
      properties: [
        'justify-content',
        'justify-items',
        'align-content',
        'align-items'
      ]
    },
    {
      order: 'strict',
      properties: [
        'justify-self',
        'align-self',
        'place-self',
        'order'
      ]
    },
    {
      order: 'strict',
      properties: [
        'position',
        'top',
        'right',
        'bottom',
        'left',
        'z-index'
      ]
    },
    {
      order: 'strict',
      properties: [
        'transform',
        'vertical-align'
      ]
    },
    {
      order: 'strict',
      properties: [
        'float',
        'clear'
      ]
    },
    {
      order: 'strict',
      properties: [
        'box-sizing'
      ]
    },
    {
      order: 'strict',
      properties: [
        'width',
        'min-width',
        'max-width'
      ]
    },
    {
      order: 'strict',
      properties: [
        'height',
        'min-height',
        'max-height'
      ]
    },
    {
      order: 'strict',
      properties: [
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left'
      ]
    },
    {
      order: 'strict',
      properties: [
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left'
      ]
    },
    {
      order: 'strict',
      properties: [
        'border',
        'border-top',
        'border-right',
        'border-bottom',
        'border-left',
        'border-radius',
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-right-radius',
        'border-bottom-left-radius'
      ]
    },
    {
      order: 'strict',
      properties: [
        'font',
        'line-height',
        'font-family',
        'font-weight',
        'font-style',
        'font-size',
        'color'
      ]
    },
    {
      order: 'strict',
      properties: [
        'direction',
        'text-align',
        'text-transform',
        'text-decoration'
      ]
    },
    {
      order: 'strict',
      properties: [
        'word-break',
        'word-wrap'
      ]
    },
    {
      order: 'strict',
      properties: [
        'background',
        'background-color',
        'background-image',
        'background-position',
        'background-repeat',
        'background-size',
        'object-fit'
      ]
    },
    {
      order: 'strict',
      properties: [
        'box-shadow'
      ]
    },
    {
      order: 'strict',
      properties: [
        'list-style',
        'list-style-type',
        'list-style-position',
        'list-style-image'
      ]
    },
    {
      order: 'strict',
      properties: [
        'transition',
        'animation'
      ]
    },
    {
      order: 'strict',
      properties: [
        'opacity',
        'visibility'
      ]
    },
    {
      order: 'strict',
      properties: [
        'overflow',
        'overflow-x',
        'overflow-y'
      ]
    },
    {
      order: 'strict',
      properties: [
        'cursor',
        'pointer-events'
      ]
    }
    ],
    {
      unspecified: 'bottom'
    }
  ]
};