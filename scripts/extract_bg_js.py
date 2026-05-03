import re

with open(r'c:\Users\mahmi\Desktop\smart-service-hub\old_login.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract the <div class="mf-bg">...</div><!-- /mf-bg --> block
match = re.search(r'(<div class="mf-bg">.*?</div><!-- /mf-bg -->)', text, re.DOTALL)

if match:
    bg_html = match.group(1)
    
    # We must escape backticks and $ for JS template literal
    bg_html_escaped = bg_html.replace('`', '\\`').replace('$', '\\$')
    
    js_code = f"""
const bgHtml = `{bg_html_escaped}`;
document.addEventListener("DOMContentLoaded", () => {{
    document.body.insertAdjacentHTML('afterbegin', bgHtml);
    
    // Rain effect
    const canvas = document.getElementById('rainCanvas');
    if(canvas) {{
        const ctx = canvas.getContext('2d');
        let drops = [], W, H;
        function initRain() {{
            W = canvas.offsetWidth; H = canvas.offsetHeight;
            canvas.width = W; canvas.height = H;
            drops = [];
            const count = Math.floor(W / 5);
            for (let i = 0; i < count; i++) {{
              drops.push({{ x: Math.random() * W, y: Math.random() * H, len: Math.random() * 14 + 8, speed: Math.random() * 3 + 3, opacity: Math.random() * 0.25 + 0.08 }});
            }}
        }}
        function drawRain() {{
            ctx.clearRect(0, 0, W, H);
            drops.forEach(d => {{
              ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.len * 0.15, d.y + d.len);
              ctx.strokeStyle = `rgba(140,160,200,${{d.opacity}})`; ctx.lineWidth = 0.6; ctx.stroke();
              d.y += d.speed; d.x -= d.speed * 0.15;
              if (d.y > H) {{ d.y = -d.len; d.x = Math.random() * W; }}
              if (d.x < 0) d.x = W;
            }});
            requestAnimationFrame(drawRain);
        }}
        initRain(); drawRain();
        window.addEventListener('resize', initRain);
    }}
}});
"""
    with open(r'c:\Users\mahmi\Desktop\smart-service-hub\public\shared\city-bg.js', 'w', encoding='utf-8') as f:
        f.write(js_code)
    print("city-bg.js generated successfully!")
else:
    print("Could not find mf-bg block!")
