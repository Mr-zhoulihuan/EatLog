import type { TextStyle, ViewStyle } from "react-native";
import type { ThemeColor, ThemeBackground } from "./stores/settingsStore";
import { THEME_COLORS } from "./stores/settingsStore";

export const colors = {
  primary: { 50: "#E8F5E9", 100: "#C8E6C9", 200: "#A5D6A7", 300: "#81C784", 400: "#66BB6A", 500: "#4CAF50", 600: "#43A047", 700: "#388E3C", 800: "#2E7D32", 900: "#1B5E20" },
  red: { 50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c" },
  orange: { 50: "#fff7ed", 100: "#ffedd5", 500: "#f97316", 600: "#ea580c", 700: "#c2410c" },
  yellow: { 50: "#fefce8", 100: "#fef9c3", 400: "#facc15", 500: "#eab308", 600: "#ca8a04", 700: "#a16207" },
  amber: { 50: "#fffbeb", 100: "#fef3c7", 400: "#fbbf24", 500: "#f59e0b" },
  green: { 50: "#f0fdf4", 100: "#dcfce7", 500: "#22c55e", 600: "#16a34a", 700: "#15803d" },
  blue: { 50: "#eff6ff", 100: "#dbeafe", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb" },
  purple: { 50: "#faf5ff", 100: "#f3e8ff", 200: "#e9d5ff" },
  gray: { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151", 800: "#1f2937", 900: "#111827" },
  white: "#ffffff",
  black: "#000000",
};

export const s = {
  flex1: { flex: 1 } as ViewStyle,
  row: { flexDirection: "row" as const },
  rowCenter: { flexDirection: "row" as const, alignItems: "center" as const },
  center: { alignItems: "center" as const, justifyContent: "center" as const },
  between: { justifyContent: "space-between" as const },
  wrap: { flexWrap: "wrap" as const },
  gap2: { gap: 8 },
  gap1: { gap: 4 },
  gap3: { gap: 12 },
  gap4: { gap: 16 },
  // Padding
  p4: { padding: 16 },
  p3: { padding: 12 },
  p5: { padding: 20 },
  px4: { paddingHorizontal: 16 },
  py4: { paddingVertical: 16 },
  py2: { paddingVertical: 8 },
  py3: { paddingVertical: 12 },
  px3: { paddingHorizontal: 12 },
  // Margin
  mx4: { marginHorizontal: 16 },
  mb2: { marginBottom: 8 },
  mb3: { marginBottom: 12 },
  mb1: { marginBottom: 4 },
  mb4: { marginBottom: 16 },
  mt1: { marginTop: 4 },
  mt2: { marginTop: 8 },
  mt3: { marginTop: 12 },
  mt4: { marginTop: 16 },
  // Border radius
  roundedLg: { borderRadius: 12 },
  roundedXl: { borderRadius: 16 },
  rounded2xl: { borderRadius: 20 },
  rounded3xl: { borderRadius: 24 },
  roundedFull: { borderRadius: 999 },
  roundedLgT: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  // Shadows
  shadowSm: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 } as ViewStyle,
  // Text styles
  textXs: { fontSize: 12, lineHeight: 16 } as TextStyle,
  textSm: { fontSize: 14, lineHeight: 20 } as TextStyle,
  textBase: { fontSize: 16, lineHeight: 24 } as TextStyle,
  textLg: { fontSize: 18, lineHeight: 28 } as TextStyle,
  textXl: { fontSize: 20, lineHeight: 28 } as TextStyle,
  text2xl: { fontSize: 24, lineHeight: 32 } as TextStyle,
  fontMedium: { fontWeight: "500" as const },
  fontSemibold: { fontWeight: "600" as const },
  fontBold: { fontWeight: "700" as const },
  // Common backgrounds
  bgWhite: { backgroundColor: "#ffffff" } as ViewStyle,
  bgGray50: { backgroundColor: "#f9fafb" } as ViewStyle,
  bgPrimary500: { backgroundColor: "#4CAF50" } as ViewStyle,
  bgRed500: { backgroundColor: "#ef4444" } as ViewStyle,
  // Text colors
  textGray900: { color: "#111827" } as TextStyle,
  textGray800: { color: "#1f2937" } as TextStyle,
  textGray700: { color: "#374151" } as TextStyle,
  textGray600: { color: "#4b5563" } as TextStyle,
  textGray500: { color: "#6b7280" } as TextStyle,
  textGray400: { color: "#9ca3af" } as TextStyle,
  textWhite: { color: "#ffffff" } as TextStyle,
  textRed600: { color: "#dc2626" } as TextStyle,
  textPrimary500: { color: "#4CAF50" } as TextStyle,
};

export function border(c: string) { return { borderWidth: 1, borderColor: c }; }
export function bg(c: string) { return { backgroundColor: c }; }
export function textColor(c: string) { return { color: c }; }
export function shadowMd(color: string) { return { shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 } as ViewStyle; }
export function shadowLg(color: string) { return { shadowColor: color, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 } as ViewStyle; }

export function card() {
  return { ...s.bgWhite, ...s.roundedXl, ...s.p4, ...s.mx4, ...s.shadowSm, borderWidth: 1, borderColor: colors.gray[50] };
}

export function chip(active: boolean, activeColor: string) {
  return {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: active ? activeColor : colors.gray[200],
    backgroundColor: active ? activeColor : "transparent",
  };
}

export function chipText(active: boolean, activeColor: string) {
  return {
    fontSize: 14,
    color: active ? "#ffffff" : colors.gray[600],
  };
}

export function pill(cnt: number, i: number) {
  return {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.gray[100],
    ...(i < cnt - 1 ? { marginRight: 6 } : {}),
  };
}

export function getThemeColors(themeColor: ThemeColor) {
  return THEME_COLORS[themeColor];
}

export function getThemeBg(themeBackground: ThemeBackground, opacity: number) {
  if (themeBackground === "dark") {
    const o = Math.round((opacity / 100) * 255).toString(16).padStart(2, "0");
    return { bg: `#111827${o}`, card: `#1f2937${o}`, text: "#f9fafb", textSecondary: "#d1d5db", border: "#374151" };
  }
  return { bg: "#f9fafb", card: "#ffffff", text: "#111827", textSecondary: "#6b7280", border: "#f3f4f6" };
}

export const DEFAULT_THEME = "green";
