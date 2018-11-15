const path = require('path')

const HTML = require('@mspg/transpile-pug')
const CSS = require('@mspg/transpile-stylus')
// const JS = require('@mspg/transpile-babel')

const year = new Date().getFullYear()

module.exports = {
  TRANSPILERS: {
    HTML,
    CSS,
    // JS,
  },
  year,
  WEB_ROOT: 'https://jaeh.github.io/portfolio/',
}
