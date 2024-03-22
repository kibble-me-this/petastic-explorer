// ----------------------------------------------------------------------

export function remToPx(value) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

const primaryFont = 'Public Sans, sans-serif';
const secondaryFont = 'Urbanist, sans-serif';
const interFont = 'Inter, sans-serif';

// ----------------------------------------------------------------------

export const typography = {
  fontFamily: primaryFont,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 800,
    lineHeight: 'normal',
    fontSize: pxToRem(40),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontWeight: 700,
    lineHeight: 64 / 48,
    fontSize: pxToRem(32),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 24, md: 32, lg: 32 }),
  },
  h3: {
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(24),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
  },
  h4: {
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(24),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 12, md: 16, lg: 16 }),
  },
  h5: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
  },
  h6: {
    fontWeight: 600,
    lineHeight: 28 / 18,
    fontSize: pxToRem(17),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  caption2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(10),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 600,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'capitalize',
  },
  chat_body: {
    fontWeight: 400,
    lineHeight: '140%',
    fontSize: pxToRem(14),
    fontFamily: interFont,
    letterSpacing: '0.137px',
    ...responsiveFontSizes({ sm: 14, md: 14, lg: 14 }),
  },
  chat_author: {
    fontWeight: 700,
    lineHeight: '140%',
    fontSize: pxToRem(14),
    fontFamily: interFont,
    letterSpacing: '0.412px',
    textTransform: 'none',
    ...responsiveFontSizes({ sm: 14, md: 14, lg: 14 }),
  },
  chat_caption: {
    fontWeight: 700,
    lineHeight: '140%',
    fontSize: pxToRem(10),
    fontFamily: interFont,
    letterSpacing: '0.6px',
    ...responsiveFontSizes({ sm: 10, md: 10, lg: 10 }),
  },
};
