module.exports = {
  map: false,
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9' // React doesn't support IE8 anyway
      ],
      stage: 0,
    },
    'cssnano': {}
  }
}
