const HTML = require('@mspg/transpile-posthtml')
const CSS = require('@mspg/transpile-stylus')
const JS = require('@mspg/transpile-babel')

const year = new Date().getFullYear()

module.exports = {
  TRANSPILERS: {
    HTML,
    CSS,
    JS,
  },
  year,
}
