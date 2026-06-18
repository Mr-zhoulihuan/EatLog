import sys
z = open("src/i18n/zh.ts", "r", encoding="utf-8").read()
z = z.replace("\u672c\u5468\"", "\u672c\u5468\",")
z = z.replace("\u672c\u6708\"", "\u672c\u6708\",")
# But need to only fix the comma-less ones, not create double commas
z = z.replace("\u672c\u5468\",,", "\u672c\u5468\",")
z = z.replace("\u672c\u6708\",,", "\u672c\u6708\",")
open("src/i18n/zh.ts", "w", encoding="utf-8").write(z)
print("fixed")
