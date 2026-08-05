import type { Config } from 'tailwindcss'

/*
  Lux tokens, per luxfi/brand DESIGN.md §2.2 (dark surface) and the
  @luxfi/ui type vocabulary: Druk Wide headings, Inter body.
*/
export default {
  content: ['src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['DrukWide', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#000000',
          raised: '#1A1A1A',
        },
      },
    },
  },
} satisfies Config
