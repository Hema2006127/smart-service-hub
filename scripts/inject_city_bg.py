import os
import re

pages_dir = r'c:\Users\mahmi\Desktop\smart-service-hub\public\pages'

css_link = '<link rel="stylesheet" href="/shared/city-bg.css">'
js_link = '<script src="/shared/city-bg.js"></script>'

html_bg_pattern_login = re.compile(r'<!-- ANIMATED BACKGROUND -->.*?<canvas class="rain-canvas" id="rainCanvas"></canvas>\s*</div>', re.DOTALL)
css_bg_pattern_login = re.compile(r'/\* ── ANIMATED BACKGROUND ── \*/.*?(?=/\* ── MAIN CARD ── \*/)', re.DOTALL)

for filename in os.listdir(pages_dir):
    if not filename.endswith('.html') or filename == 'presentation.html':
        continue
    
    filepath = os.path.join(pages_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add CSS link
    if '<link rel="stylesheet" href="/shared/city-bg.css">' not in content:
        content = content.replace('<link rel="stylesheet" href="/shared/light.css">', 
                                  '<link rel="stylesheet" href="/shared/light.css">\n  ' + css_link)
        
        # If light.css not found, try before </head>
        if '<link rel="stylesheet" href="/shared/light.css">' not in content:
             content = content.replace('</head>', '  ' + css_link + '\n</head>')
             
    # Add JS link
    if '<script src="/shared/city-bg.js"></script>' not in content:
        content = content.replace('</body>', js_link + '\n</body>')

    # Remove existing backgrounds
    if filename == 'login.html':
        content = html_bg_pattern_login.sub('', content)
        content = css_bg_pattern_login.sub('/* ── ANIMATED BACKGROUND (Moved to city-bg.css) ── */\n    ', content)
        # remove rain script from login
        content = re.sub(r'// Rain effect.*?draw\(\);\n', '', content, flags=re.DOTALL)
    elif filename == 'customer.html':
        content = re.sub(r'<div class="bg"><div class="bg-orb"></div><div class="bg-orb"></div></div>', '', content)
        content = re.sub(r'/\* Animated background \*/.*?@keyframes orb{.*?}\n', '', content, flags=re.DOTALL)
    elif filename == 'display.html':
        content = re.sub(r'<div class="bg"><div class="bg-orb"></div><div class="bg-orb"></div></div>', '', content)
        content = re.sub(r'/\* Animated background \*/.*?@keyframes orb{.*?}\n', '', content, flags=re.DOTALL)
    elif filename in ['admin.html', 'manager.html', 'teller.html']:
        content = re.sub(r'<canvas id="bgCanvas"></canvas>\s*<div class="depth-layer"></div>\s*<div class="caustics"></div>\s*<div class="bio-orb bio-1"></div>\s*<div class="bio-orb bio-2"></div>\s*<div class="bio-orb bio-3"></div>', '', content)
        content = re.sub(r'<!-- Morphing blob -->.*?</svg>\s*</div>', '', content, flags=re.DOTALL)
        content = re.sub(r'/\* ══ OCEAN BG CANVAS ══ \*/.*?@keyframes bioFloat3{.*?}\n', '', content, flags=re.DOTALL)
        content = re.sub(r'/\* ══ MORPHING BLOB ══ \*/.*?@keyframes morphBlob{.*?}\n', '', content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Injected shared city-bg into all pages successfully!")
