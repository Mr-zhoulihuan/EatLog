import sys
e = open("src/i18n/en.ts", "r", encoding="utf-8").read()
e = e.replace('This Week"', 'This Week",')
e = e.replace('This Month"', 'This Month",')
e = e.replace('This Week",,', 'This Week",')
e = e.replace('This Month",,', 'This Month",')
open("src/i18n/en.ts", "w", encoding="utf-8").write(e)
print("en fixed")
