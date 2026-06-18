import sys
z = open("src/i18n/zh.ts", "r", encoding="utf-8").read()
z = z.replace("thisWeek:", "week:")
z = z.replace("thisMonth:", "month:")
z = z.replace("week: \"本周\"", "thisWeek: \"本周\"\n    week: \"本周\"")
z = z.replace("month: \"本月\"", "thisMonth: \"本月\"\n    month: \"本月\"")
# Undo the first replacements
z = z.replace("week: \"本周\"\n    week: \"本周\"", "thisWeek: \"本周\"\n    week: \"本周\"")
z = z.replace("month: \"本月\"\n    month: \"本月\"", "thisMonth: \"本月\"\n    month: \"本月\"")
open("src/i18n/zh.ts", "w", encoding="utf-8").write(z)
print("zh done")

# Simpler approach for en.ts
e = open("src/i18n/en.ts", "r", encoding="utf-8").read()
e = e.replace('thisWeek: "This Week"', "thisWeek: \"This Week\"\n    week: \"Week\"")
e = e.replace('thisMonth: "This Month"', "thisMonth: \"This Month\"\n    month: \"Month\"")
open("src/i18n/en.ts", "w", encoding="utf-8").write(e)
print("en done")
