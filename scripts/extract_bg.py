import re

with open(r'c:\Users\mahmi\Desktop\smart-service-hub\public\pages\login.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract CSS
css_match = re.search(r'/\* ── ANIMATED BACKGROUND ── \*/.*?(?=/\* ── MAIN CARD ── \*/)', text, re.DOTALL)
if css_match:
    with open(r'c:\Users\mahmi\Desktop\smart-service-hub\public\shared\city-bg.css', 'w', encoding='utf-8') as f:
        f.write(css_match.group(0))

# Extract HTML
html_match = re.search(r'<!-- ANIMATED BACKGROUND -->.*?<canvas class="rain-canvas" id="rainCanvas"></canvas>\s*</div>', text, re.DOTALL)

if html_match:
    html_content = html_match.group(0)
    js_code = f"""
const bgHtml = `{html_content}`;
document.addEventListener("DOMContentLoaded", () => {{
    document.body.insertAdjacentHTML('afterbegin', bgHtml);
    // Rain effect
    const rc = document.getElementById('rainCanvas');
    if(rc) {{
        const rx = rc.getContext('2d');
        let drops = [];
        function resize() {{
          rc.width = window.innerWidth;
          rc.height = window.innerHeight;
        }}
        window.addEventListener('resize', resize);
        resize();
        for(let i=0; i<150; i++) {{
          drops.push({{
            x: Math.random() * rc.width,
            y: Math.random() * rc.height,
            l: Math.random() * 20 + 10,
            v: Math.random() * 10 + 15
          }});
        }}
        function draw() {{
          rx.clearRect(0,0,rc.width,rc.height);
          rx.strokeStyle = 'rgba(201,168,76,0.3)';
          rx.lineWidth = 1;
          rx.beginPath();
          for(let i=0; i<drops.length; i++) {{
            let p = drops[i];
            rx.moveTo(p.x, p.y);
            rx.lineTo(p.x + p.l * 0.2, p.y + p.l);
            p.y += p.v;
            p.x += p.v * 0.2;
            if(p.y > rc.height) {{
              p.y = -20;
              p.x = Math.random() * rc.width;
            }}
          }}
          rx.stroke();
          requestAnimationFrame(draw);
        }}
        draw();
    }}
}});
"""
    with open(r'c:\Users\mahmi\Desktop\smart-service-hub\public\shared\city-bg.js', 'w', encoding='utf-8') as f:
        f.write(js_code)
print("Extracted BG successfully!")
