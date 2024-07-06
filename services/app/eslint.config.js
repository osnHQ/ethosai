// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt(
  antfu(
    {
      unocss: true,
      formatters: true,
      rules: {
        'vue/html-indent': 'off', // Disable HTML indentation rule
        'vue/block-order': 'off', // Disable block order rule
        'unocss/order': 'off', // Disable UnoCSS utilities order rule
        'no-trailing-spaces': 'off', // Disable trailing spaces rule
        'eol-last': 'off', // Disable newline at end of file rule
        'no-unused-expressions': 'off', // Disable no-unused-expressions rule
        'quotes': 'off', // Disable quotes rule
      },
    },
  ),
)
