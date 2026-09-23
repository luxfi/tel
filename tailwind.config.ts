import type { Config } from 'tailwindcss'

/*
  Lux tokens: the dark surface, and Zen for every word, as lux.exchange sets it.
  The paint the buttons and the wordmark read is in globals.css `:root`.

  The BRAND is Lux's — typefaces, the monochrome surface, the opacity ladder.
  The SCALE is the shared one: `@hanzo/design` publishes the type ramp and the
  spacing ramp, and `@hanzo/appearance` retunes both by writing two custom
  properties on <html> — `--type-scale` and `--density`. Wiring Tailwind's theme
  through those properties is what makes the whole site answer to them: every
  `text-sm` and every `p-6` already written resolves to a var, so a preference
  reaches ~5,000 lines of existing markup without one call site changing.

  This is deliberately the ONLY scale. Half a scale is worse than none — at
  compact density a `p-6` that shrinks beside a `px-3.5` that does not is a
  layout coming apart, so both ramps below cover every rung Tailwind ships.
*/

/** The type ramp's rungs, named the same here as in the token sheet. */
const TEXT = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'] as const

/** Tailwind's own 0.25rem ramp, every rung, so nothing falls outside the knob. */
const RUNGS = [
  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64,
  72, 80, 96,
]

export default {
  content: ['src/**/*.tsx'],
  theme: {
    /* Sizes and their leading come from the ramp as a pair, so a rung cannot be
       taken without the line height that was set against it. */
    fontSize: Object.fromEntries(TEXT.map((k) => [k, [`var(--text-${k})`, `var(--leading-${k})`]])) as Record<
      string,
      [string, string]
    >,
    spacing: {
      px: '1px',
      0: '0px',
      /* The knob, applied once to the rung rather than restated per value. The
         published `--space-*` ramp is this same product; expressing it as the
         multiplication keeps every Tailwind rung covered instead of only the
         fifteen the sheet happens to name. */
      ...Object.fromEntries(RUNGS.map((n) => [n, `calc(${n / 4}rem * var(--density, 1))`])),
      /* The one length that must NOT follow density: 44px is the floor a
         pointer-coarse target may render at, and a person who asked for a
         compact reading did not ask for targets they cannot hit. Unmultiplied,
         from the sheet, so the e2e's 44px assertion and this name are one fact. */
      tap: 'var(--tap-target)',
    },
    extend: {
      fontFamily: {
        sans: ['Zen', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      /* The exchange's three weights, under Tailwind's names: book 497 for what is
         read, 500 as it is, and medium 606 for what is pressed or named, which
         is also where `bold` lands. The exchange draws nothing heavier. */
      fontWeight: {
        normal: 'var(--zen-book-wght)',
        semibold: 'var(--zen-medium-wght)',
        bold: 'var(--zen-medium-wght)',
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
