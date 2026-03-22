export const colors = {
  bg: '#141418',
  bgElevated: '#1C1C22',
  card: '#222228',
  cardHover: '#2A2A32',
  gold: '#D4A245',
  goldLight: '#EFC060',
  goldDim: 'rgba(212, 162, 69, 0.1)',
  goldBorder: 'rgba(212, 162, 69, 0.25)',
  text: '#F8F8FA',
  textSecondary: '#9090A0',
  textMuted: '#6A6A7A',
  border: '#33333D',
  borderLight: '#48485A',
  success: '#34D072',
  danger: '#F05252',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const fonts = {
  regular: { fontSize: 14, color: colors.text },
  small: { fontSize: 12, color: colors.textSecondary },
  body: { fontSize: 15, lineHeight: 22, color: colors.text },
  heading: { fontSize: 24, fontWeight: '800' as const, color: colors.text },
  subheading: { fontSize: 17, fontWeight: '700' as const, color: colors.text },
  caption: { fontSize: 11, fontWeight: '600' as const, color: colors.textMuted, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
};
