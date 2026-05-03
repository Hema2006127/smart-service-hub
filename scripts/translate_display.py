import re
import json

with open(r'c:\Users\mahmi\Desktop\smart-service-hub\arabic_strings_display.json', 'r', encoding='utf-8') as f:
    arabic_strings = json.load(f)

translations = {
    "قائمة الانتظار": "Queue List",
    "صباحاً حتى": "AM to",
    "شاشة عرض الطابور": "Queue Display Screen",
    "اختر الفرع": "Choose Branch",
    "نسعى دائماً لتقديم أفضل خدمة ممكنة": "We always strive to provide the best possible service",
    "الطابور فارغ": "Queue is empty",
    "شكراً لثقتكم": "Thank you for your trust",
    "مرحباً بكم في البنك الذكي": "Welcome to Smart Bank",
    "يُخدم الآن": "Serving Now",
    "شاشة العرض": "Display Screen",
    "البنك الذكي": "Smart Bank",
    "أولوية": "Priority",
    "مساءً": "PM",
    "في انتظار العملاء": "Waiting for customers",
    "وقت الدوام": "Working hours"
}

with open(r'c:\Users\mahmi\Desktop\smart-service-hub\public\pages\display.html', 'r', encoding='utf-8') as f:
    html = f.read()

for ar, en in sorted(translations.items(), key=lambda x: len(x[0]), reverse=True):
    html = html.replace(ar, en)

# Change html tag
html = html.replace('<html lang="ar" dir="rtl">', '<html lang="en" dir="ltr">')

# Also in display.html, the time locale is 'ar-EG', let's change it to 'en-US'
html = html.replace("'ar-EG'", "'en-US'")

with open(r'c:\Users\mahmi\Desktop\smart-service-hub\public\pages\display.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Translated display.html successfully!")
