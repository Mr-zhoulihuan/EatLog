
import re, sys

# Fix tw.ts
with open("src/tw.ts", "r", encoding="utf-8") as f:
    c = f.read()

if "gap3:" not in c:
    c = c.replace(
        '  gap1: { gap: 4 },\n  // Padding',
        '  gap1: { gap: 4 },\n  gap3: { gap: 12 },\n  gap4: { gap: 16 },\n  // Padding'
    )
    c = c.replace(
        '  p4: { padding: 16 },\n  px4: { paddingHorizontal: 16 }',
        '  p4: { padding: 16 },\n  p3: { padding: 12 },\n  p5: { padding: 20 },\n  px4: { paddingHorizontal: 16 }'
    )
    c = c.replace(
        '  mb3: { marginBottom: 12 },\n  mt1: { marginTop: 4 }',
        '  mb3: { marginBottom: 12 },\n  mb1: { marginBottom: 4 },\n  mb4: { marginBottom: 16 },\n  mt1: { marginTop: 4 }'
    )
    c = c.replace(
        '  roundedXl: { borderRadius: 16 },\n  roundedFull',
        '  roundedXl: { borderRadius: 16 },\n  rounded2xl: { borderRadius: 20 },\n  rounded3xl: { borderRadius: 24 },\n  roundedFull'
    )

if "shadowMd" not in c:
    c = c.replace(
        "export function textColor(c: string) { return { color: c }; }",
        "export function textColor(c: string) { return { color: c }; }\nexport function shadowMd(color: string) { return { shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 } as ViewStyle; }\nexport function shadowLg(color: string) { return { shadowColor: color, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 } as ViewStyle; }"
    )

with open("src/tw.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("tw.ts done")
