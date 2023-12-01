const COLORS_LOOKUP = {
  black: 0,
  brown: 1,
  red: 2,
  orange: 3,
  yellow: 4,
  green: 5,
  blue: 6,
  violet: 7,
  grey: 8,
  white: 9,
};

export const colorCode = (color: keyof typeof COLORS_LOOKUP): number => {
  return COLORS_LOOKUP[color];
};

export const COLORS = Object.keys(COLORS_LOOKUP);

colorCode("black");
