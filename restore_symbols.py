import os

file_path = r'c:\Users\mahmi\Desktop\smart-service-hub\public\pages\presentation.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Restore critical symbols broken by emoji replacement
content = content.replace('css2🔹family', 'css2?family')
content = content.replace('css2??family', 'css2?family')
content = content.replace('session??.user', 'session?.user')
content = content.replace('session🔹.user', 'session?.user')
content = content.replace('req.session??', 'req.session?')
content = content.replace('req.session🔹', 'req.session?')

# Check for any other 🔹 or ??? in code blocks
# (We already fixed the main script block manually)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Syntactic symbols restored.")
