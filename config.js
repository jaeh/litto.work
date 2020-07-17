import html from '@mspg/transpile-posthtml'
import css from '@mspg/transpile-stylus'
import js from '@mspg/transpile-babel'

const year = new Date().getFullYear()

export default {
  TRANSPILERS: {
    html,
    css,
    js,
  },

  WEB_ROOT: '/litto.work/',

  year,
}
