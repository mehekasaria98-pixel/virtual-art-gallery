import { createTheme, type MantineColorsTuple } from '@mantine/core';

/**
 * "Quiet gallery" design language.
 * Warm paper, ink-black type, a single oxblood accent and a serif display face.
 * The artwork is the colour; the interface stays out of the way.
 */

const oxblood: MantineColorsTuple = [
  '#fbeeee', '#f0d6d6', '#e2adad', '#d48282', '#c75d5d',
  '#bf4646', '#a93a3a', '#8f2f30', '#7a2628', '#641d1f',
];

const ink: MantineColorsTuple = [
  '#f7f4ef', '#ebe6de', '#d6cfc4', '#bdb3a5', '#9c9284',
  '#7b7266', '#5d564d', '#403b35', '#2b2824', '#1c1b19',
];

export const theme = createTheme({
  primaryColor: 'oxblood',
  primaryShade: { light: 7, dark: 4 },
  colors: { oxblood, ink },
  fontFamily: 'var(--font-sans), system-ui, -apple-system, "Segoe UI", sans-serif',
  headings: {
    fontFamily: 'var(--font-serif), Georgia, "Times New Roman", serif',
    fontWeight: '500',
    sizes: {
      h1: { fontSize: 'clamp(2rem, 4vw + 1rem, 3.5rem)', lineHeight: '1.1' },
      h2: { fontSize: 'clamp(1.5rem, 2vw + 1rem, 2.25rem)', lineHeight: '1.2' },
      h3: { fontSize: '1.375rem', lineHeight: '1.3' },
    },
  },
  defaultRadius: 'sm',
  cursorType: 'pointer',
  focusRing: 'auto',
  components: {
    Chip: { defaultProps: { size: 'sm', variant: 'outline' } },
    Tooltip: { defaultProps: { withArrow: true, openDelay: 250, multiline: true, maw: 260 } },
  },
});
