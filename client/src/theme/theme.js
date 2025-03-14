// Theme configuration for the application
// This file centralizes all styling constants

const colors = {
  primary: {
    main: "#1E40AF", // Deep blue
    light: "#3B82F6", // Lighter blue
    dark: "#1E3A8A", // Darker blue
    contrast: "#FFFFFF", // White text on primary colors
  },
  secondary: {
    main: "#22C55E", // Green
    light: "#4ADE80", // Lighter green
    dark: "#16A34A", // Darker green
    contrast: "#FFFFFF", // White text on secondary colors
  },
  warning: {
    main: "#F59E0B", // Amber
    light: "#FBBF24", // Lighter amber
    dark: "#D97706", // Darker amber
    contrast: "#000000", // Black text on warning colors
  },
  danger: {
    main: "#EF4444", // Red
    light: "#F87171", // Lighter red
    dark: "#DC2626", // Darker red
    contrast: "#FFFFFF", // White text on danger colors
  },
  neutral: {
    white: "#FFFFFF",
    gray100: "#F3F4F6",
    gray200: "#E5E7EB",
    gray300: "#D1D5DB",
    gray400: "#9CA3AF",
    gray500: "#6B7280",
    gray600: "#4B5563",
    gray700: "#374151",
    gray800: "#1F2937",
    gray900: "#111827",
    black: "#000000",
  },
  background: {
    main: "#F9FAFB", // Light gray
    paper: "#FFFFFF", // White
    dark: "#111827", // Near black
  },
  text: {
    primary: "#111827", // Near black
    secondary: "#4B5563", // Medium gray
    disabled: "#9CA3AF", // Lighter gray
    light: "#FFFFFF", // White
  },
};

const fontSizes = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
};

const fontWeight = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

const spacing = {
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
};

const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  base: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
};

const boxShadow = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  none: "none",
};

// Button styling
const buttons = {
  primary: {
    backgroundColor: colors.primary.main,
    color: colors.primary.contrast,
    hoverBackgroundColor: colors.primary.dark,
    padding: `${spacing["3"]} ${spacing["6"]}`,
    borderRadius: borderRadius.md,
    fontWeight: fontWeight.medium,
    transition: "all 0.2s ease-in-out",
  },
  secondary: {
    backgroundColor: colors.secondary.main,
    color: colors.secondary.contrast,
    hoverBackgroundColor: colors.secondary.dark,
    padding: `${spacing["3"]} ${spacing["6"]}`,
    borderRadius: borderRadius.md,
    fontWeight: fontWeight.medium,
    transition: "all 0.2s ease-in-out",
  },
  outline: {
    backgroundColor: "transparent",
    color: colors.primary.main,
    borderColor: colors.primary.main,
    borderWidth: "1px",
    borderStyle: "solid",
    padding: `${spacing["3"]} ${spacing["6"]}`,
    borderRadius: borderRadius.md,
    fontWeight: fontWeight.medium,
    transition: "all 0.2s ease-in-out",
    hoverBackgroundColor: colors.primary.light,
    hoverColor: colors.primary.contrast,
  },
  text: {
    backgroundColor: "transparent",
    color: colors.primary.main,
    padding: `${spacing["3"]} ${spacing["6"]}`,
    borderRadius: borderRadius.md,
    fontWeight: fontWeight.medium,
    transition: "all 0.2s ease-in-out",
    hoverBackgroundColor: colors.neutral.gray100,
  },
  danger: {
    backgroundColor: colors.danger.main,
    color: colors.danger.contrast,
    hoverBackgroundColor: colors.danger.dark,
    padding: `${spacing["3"]} ${spacing["6"]}`,
    borderRadius: borderRadius.md,
    fontWeight: fontWeight.medium,
    transition: "all 0.2s ease-in-out",
  },
  disabled: {
    backgroundColor: colors.neutral.gray300,
    color: colors.neutral.gray600,
    padding: `${spacing["3"]} ${spacing["6"]}`,
    borderRadius: borderRadius.md,
    fontWeight: fontWeight.medium,
    cursor: "not-allowed",
  },
};

// Input styling
const inputs = {
  default: {
    padding: spacing["4"],
    backgroundColor: colors.background.paper,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.neutral.gray300,
    borderRadius: borderRadius.md,
    color: colors.text.primary,
    fontSize: fontSizes.base,
    transition: "all 0.2s ease-in-out",
    focusBorderColor: colors.primary.main,
    focusOutline: "none",
    focusBoxShadow: `0 0 0 3px ${colors.primary.light}33`,
    placeholderColor: colors.neutral.gray400,
  },
  error: {
    borderColor: colors.danger.main,
    focusBorderColor: colors.danger.main,
    focusBoxShadow: `0 0 0 3px ${colors.danger.light}33`,
  },
};

// Card styling
const cards = {
  default: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    boxShadow: boxShadow.md,
    padding: spacing["6"],
    transition: "all 0.2s ease-in-out",
  },
  hover: {
    boxShadow: boxShadow.lg,
  },
  flat: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.neutral.gray200}`,
    padding: spacing["6"],
  },
};

const typography = {
  h1: {
    fontSize: fontSizes["5xl"],
    fontWeight: fontWeight.bold,
    lineHeight: 1.2,
    color: colors.text.primary,
  },
  h2: {
    fontSize: fontSizes["4xl"],
    fontWeight: fontWeight.bold,
    lineHeight: 1.2,
    color: colors.text.primary,
  },
  h3: {
    fontSize: fontSizes["3xl"],
    fontWeight: fontWeight.semibold,
    lineHeight: 1.2,
    color: colors.text.primary,
  },
  h4: {
    fontSize: fontSizes["2xl"],
    fontWeight: fontWeight.semibold,
    lineHeight: 1.2,
    color: colors.text.primary,
  },
  h5: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: 1.2,
    color: colors.text.primary,
  },
  h6: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: 1.2,
    color: colors.text.primary,
  },
  subtitle1: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeight.medium,
    lineHeight: 1.5,
    color: colors.text.secondary,
  },
  subtitle2: {
    fontSize: fontSizes.base,
    fontWeight: fontWeight.medium,
    lineHeight: 1.5,
    color: colors.text.secondary,
  },
  body1: {
    fontSize: fontSizes.base,
    fontWeight: fontWeight.normal,
    lineHeight: 1.5,
    color: colors.text.primary,
  },
  body2: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeight.normal,
    lineHeight: 1.5,
    color: colors.text.primary,
  },
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeight.normal,
    lineHeight: 1.5,
    color: colors.text.secondary,
  },
};

const theme = {
  colors,
  fontSizes,
  fontWeight,
  spacing,
  borderRadius,
  boxShadow,
  buttons,
  inputs,
  cards,
  typography,
};

export default theme;
