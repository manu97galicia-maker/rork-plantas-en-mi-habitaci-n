export const Colors = {
  // Primary brand colors - Botanical sage green
  primary: "#7A9E7E",
  primaryDark: "#5B7F5F",
  primaryLight: "#E8F0E9",

  // Accent greens
  accent: "#9CAF88",
  accentSecondary: "#B5C4A8",
  accentTertiary: "#D4DEC9",

  // Nature palette
  sage: "#9CAF88",
  moss: "#6B8F6F",
  forest: "#3D5A40",
  mint: "#C8D9C5",

  // Neutral darks
  charcoal: "#1C2024",
  charcoalLight: "#2A2F35",
  charcoalMuted: "#3D434A",

  // Neutral lights
  softWhite: "#F8FAF9",
  cream: "#F0F4F1",
  warmGray: "#E5EAE6",
  background: "#F8FAF9",

  // Semantic dark/light
  dark: "#1C2024",
  darkSecondary: "#2A2F35",
  darkTertiary: "#3D434A",

  light: "#FFFFFF",
  lightSecondary: "#F8FAF9",
  lightTertiary: "#F0F4F1",

  // Text hierarchy
  text: {
    primary: "#1C2024",
    secondary: "#5A6169",
    tertiary: "#8A9199",
    inverse: "#FFFFFF",
    muted: "#B0B5BA",
  },

  // Gradients
  gradient: {
    primary: ["#7A9E7E", "#5B7F5F"] as [string, string],
    secondary: ["#9CAF88", "#7D9469"] as [string, string],
    nature: ["#8DAA8F", "#6B8F6F"] as [string, string],
    forest: ["#3D5A40", "#2C4430"] as [string, string],
    sage: ["#9CAF88", "#7D9469"] as [string, string],
    card: ["rgba(255,255,255,0.98)", "rgba(248,250,249,0.95)"] as [string, string],
    premium: ["#1C2024", "#2A2F35"] as [string, string],
    softLight: ["#F8FAF9", "#F0F4F1"] as [string, string],
    water: ["#7A9E7E", "#5B7F5F"] as [string, string],
    waterSuccess: ["#6B8F6F", "#5B7F5F"] as [string, string],
  },

  // Status colors - harmonized with botanical theme
  status: {
    success: "#6B8F6F",
    successLight: "#E8F0E9",
    warning: "#C4A35A",
    warningLight: "#F7F3E8",
    warningDark: "#9A7F3D",
    error: "#B85C5C",
    errorLight: "#F5EBEB",
    errorDark: "#8B4545",
    info: "#5B8FA8",
    infoLight: "#E8F2F6",
  },

  // Action colors - aligned with brand
  action: {
    water: "#7A9E7E",
    waterActive: "#6B8F6F",
    delete: "#B85C5C",
    deleteLight: "#F5EBEB",
    history: "#5B8FA8",
    historyLight: "#E8F2F6",
  },

  // Alert/Banner colors - warm botanical tones
  alert: {
    warningBg: "#F9F5EC",
    warningBorder: "#E8DFC4",
    warningIconBg: "#F3EDD8",
    warningText: "#8B7340",
  },

  // Shadow system
  shadow: {
    light: "rgba(28, 32, 36, 0.04)",
    medium: "rgba(28, 32, 36, 0.08)",
    dark: "rgba(28, 32, 36, 0.14)",
    primary: "rgba(122, 158, 126, 0.25)",
  },

  // Oxysafe theme - onboarding palette
  oxysafe: {
    sage: "#9CAF88",
    softWhite: "#F8FAF9",
    charcoal: "#1C2024",
    warmSage: "#A8BA96",
    deepSage: "#7D9469",
    mist: "#E8EDE5",
    glow: "#B8D4A8",
  },

  // Category/Album colors - botanical spectrum
  category: {
    spaces: "#C4A35A",
    spacesLight: "#F9F5EC",
    scans: "#5B8FA8",
    scansLight: "#E8F2F6",
    plants: "#6B8F6F",
    plantsLight: "#E8F0E9",
  },

  // Overlay colors
  overlay: {
    dark: "rgba(28, 32, 36, 0.6)",
    darker: "rgba(28, 32, 36, 0.85)",
    light: "rgba(255, 255, 255, 0.9)",
    primary: "rgba(107, 143, 111, 0.85)",
  },
};

export default Colors;
