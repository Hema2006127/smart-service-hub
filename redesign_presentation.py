import re

file_path = r'c:\Users\mahmi\Desktop\smart-service-hub\public\pages\presentation.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# ── 1. Inject improved Google Fonts (add Inter) ──────────────────────────────
old_font = 'href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Tajawal:wght@400;700;900&display=swap"'
new_font = 'href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Tajawal:wght@400;700;900&family=Inter:wght@400;600;700;900&display=swap"'
content = content.replace(old_font, new_font)

# ── 2. Replace :root and base styles ─────────────────────────────────────────
old_root = ''':root {
            --bg: #ffffff;
            --bg2: #f8f9fa;
            --bg3: #f1f3f5;
            --gold: #1d4ed8;
            --gold2: #2563eb;
            --gold3: #3b82f6;
            --foam: #1e293b;
            --foam2: rgba(30, 41, 59, .7);
            --foam3: rgba(30, 41, 59, .28);
            --border: rgba(29, 78, 216, .2);
            --glow: 0 0 24px rgba(29, 78, 216, .4), 0 0 60px rgba(29, 78, 216, .12);
        }'''

new_root = ''':root {
            --bg: #f0f4ff;
            --bg2: #e8eeff;
            --bg3: #dde6ff;
            --blue: #1d4ed8;
            --blue2: #2563eb;
            --blue3: #3b82f6;
            --gold: #1d4ed8;
            --gold2: #2563eb;
            --gold3: #3b82f6;
            --accent: #0ea5e9;
            --foam: #0f172a;
            --foam2: rgba(15, 23, 42, .75);
            --foam3: rgba(15, 23, 42, .3);
            --border: rgba(29, 78, 216, .25);
            --glow: 0 0 30px rgba(29, 78, 216, .5), 0 0 80px rgba(29, 78, 216, .15);
            --card-bg: rgba(255,255,255,0.92);
            --glass: rgba(255,255,255,0.7);
        }'''
content = content.replace(old_root, new_root)

# ── 3. Replace slide base style to use better transition ─────────────────────
old_slide = '''        .slide {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px;
            opacity: 0;
            pointer-events: none;
            transition: opacity .7s ease, transform .7s ease;
            transform: translateX(60px);
            z-index: 2
        }

        .slide.active {
            opacity: 1;
            pointer-events: all;
            transform: translateX(0)
        }

        .slide.prev {
            opacity: 0;
            transform: translateX(-60px)
        }'''

new_slide = '''        .slide {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 80px 90px;
            opacity: 0;
            pointer-events: none;
            transition: opacity .65s cubic-bezier(.4,0,.2,1), transform .65s cubic-bezier(.4,0,.2,1);
            transform: translateX(80px) scale(.97);
            z-index: 2
        }

        .slide.active {
            opacity: 1;
            pointer-events: all;
            transform: translateX(0) scale(1)
        }

        .slide.prev {
            opacity: 0;
            transform: translateX(-80px) scale(.97)
        }'''
content = content.replace(old_slide, new_slide)

# ── 4. Replace .presentation background with better gradient ──────────────────
old_pres = '''        .presentation {
            width: 100%;
            height: 100vh;
            position: relative;
            background: url('../bank_services_bg_1777809772627.png') no-repeat center center;
            background-size: cover;
        }

        .presentation::after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(255, 255, 255, 0.85); /* Overlay to make text readable */
            z-index: 1;
            pointer-events: none;
        }'''

new_pres = '''        .presentation {
            width: 100%;
            height: 100vh;
            position: relative;
            background: linear-gradient(135deg, #f0f4ff 0%, #e8eeff 40%, #dde6ff 100%);
        }

        /* animated background particles */
        .presentation::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse 80% 60% at 10% 20%, rgba(29,78,216,.07) 0%, transparent 60%),
                radial-gradient(ellipse 60% 80% at 90% 80%, rgba(14,165,233,.07) 0%, transparent 60%),
                radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99,102,241,.04) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
        }'''
content = content.replace(old_pres, new_pres)

# ── 5. Upgrade nav bar ────────────────────────────────────────────────────────
old_nav = '''        /* Nav */
        .nav {
            position: fixed;
            bottom: 28px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            display: flex;
            align-items: center;
            gap: 16px;
            background: rgba(240, 244, 248, .9);
            border: 1px solid rgba(29, 78, 216, .2);
            border-radius: 50px;
            padding: 10px 24px;
            backdrop-filter: blur(20px)
        }

        .nav-btn {
            background: none;
            border: 1px solid rgba(29, 78, 216, .25);
            color: var(--gold);
            font-family: 'Tajawal', sans-serif;
            font-size: 13px;
            font-weight: 700;
            padding: 7px 20px;
            border-radius: 30px;
            cursor: pointer;
            transition: .25s;
            letter-spacing: 1px
        }

        .nav-btn:hover {
            background: rgba(29, 78, 216, .12);
            border-color: var(--gold)
        }'''

new_nav = '''        /* Nav */
        .nav {
            position: fixed;
            bottom: 28px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            display: flex;
            align-items: center;
            gap: 20px;
            background: rgba(255,255,255,.95);
            border: 1px solid rgba(29,78,216,.15);
            border-radius: 60px;
            padding: 10px 28px;
            backdrop-filter: blur(24px);
            box-shadow: 0 8px 32px rgba(29,78,216,.12), 0 2px 8px rgba(0,0,0,.06)
        }

        .nav-btn {
            background: none;
            border: 1.5px solid rgba(29,78,216,.3);
            color: var(--blue);
            font-family: 'Inter', 'Tajawal', sans-serif;
            font-size: 12px;
            font-weight: 700;
            padding: 8px 22px;
            border-radius: 30px;
            cursor: pointer;
            transition: all .2s ease;
            letter-spacing: .5px;
            display: flex;
            align-items: center;
            gap: 6px
        }

        .nav-btn:hover {
            background: var(--blue);
            color: #fff;
            border-color: var(--blue);
            box-shadow: 0 4px 16px rgba(29,78,216,.3)
        }

        .nav-btn:active { transform: scale(.95) }'''
content = content.replace(old_nav, new_nav)

# ── 6. Upgrade card style ─────────────────────────────────────────────────────
old_card = '''        /* Cards */
        .card {
            background: rgba(255, 255, 255, .8);
            border: 1px solid rgba(29, 78, 216, .18);
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(12px);
            position: relative;
            overflow: hidden;
            transition: .3s
        }

        .card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(29, 78, 216, .04), transparent 60%)
        }

        .card:hover {
            border-color: rgba(29, 78, 216, .35);
            transform: translateY(-3px);
            box-shadow: 0 12px 40px rgba(29, 78, 216, .08)
        }'''

new_card = '''        /* Cards */
        .card {
            background: rgba(255,255,255,.92);
            border: 1px solid rgba(29,78,216,.12);
            border-radius: 20px;
            padding: 24px;
            backdrop-filter: blur(16px);
            position: relative;
            overflow: hidden;
            transition: all .3s cubic-bezier(.4,0,.2,1);
            box-shadow: 0 4px 20px rgba(29,78,216,.06)
        }

        .card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(29,78,216,.05), transparent 60%);
            pointer-events: none
        }

        .card:hover {
            border-color: rgba(29,78,216,.4);
            transform: translateY(-5px) scale(1.01);
            box-shadow: 0 20px 50px rgba(29,78,216,.12)
        }'''
content = content.replace(old_card, new_card)

# ── 7. Add extra keyframe animations after existing ones ──────────────────────
old_keyframes_end = '''        .slide.active .anim {
            animation: fadeUp .6s ease both
        }'''

new_keyframes_end = '''        @keyframes slideIn {
            from { opacity:0; transform: translateY(30px) scale(.96) }
            to   { opacity:1; transform: none }
        }

        @keyframes popIn {
            0%   { opacity:0; transform: scale(.7) }
            70%  { transform: scale(1.05) }
            100% { opacity:1; transform: scale(1) }
        }

        @keyframes cardEntrance {
            from { opacity:0; transform: translateY(40px) rotateX(8deg) }
            to   { opacity:1; transform: none }
        }

        @keyframes pulseRing {
            0%   { box-shadow: 0 0 0 0 rgba(29,78,216,.4) }
            70%  { box-shadow: 0 0 0 14px rgba(29,78,216,0) }
            100% { box-shadow: 0 0 0 0 rgba(29,78,216,0) }
        }

        @keyframes typing {
            from { width:0 }
            to   { width:100% }
        }

        @keyframes rotateBorder {
            from { transform: rotate(0deg) }
            to   { transform: rotate(360deg) }
        }

        .slide.active .anim {
            animation: slideIn .65s cubic-bezier(.4,0,.2,1) both
        }'''
content = content.replace(old_keyframes_end, new_keyframes_end)

# ── 8. Replace Slide 2 (team slide) completely ────────────────────────────────
# Find the slide-2 block and replace it
slide2_start = '        <!-- ══ SLIDE 2: TEAM ══ -->'
slide2_end   = '        <!-- -- SLIDE 3:'

idx_start = content.find(slide2_start)
idx_end   = content.find(slide2_end, idx_start)

if idx_start == -1 or idx_end == -1:
    print("WARNING: Could not locate slide-2 boundaries!")
else:
    new_slide2 = '''        <!-- ══ SLIDE 2: TEAM ══ -->
        <div class="slide" id="slide-2">
            <div class="corners">
                <div class="corner-bl"></div>
                <div class="corner-tr"></div>
            </div>
            <div class="slide-num">02 / 32</div>

            <!-- Team slide specific styles -->
            <style>
                /* ── Team Slide Layout ── */
                #slide-2 { padding: 50px 60px 90px; }

                .team-section-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 40px;
                    font-weight: 900;
                    color: var(--blue);
                    letter-spacing: 2px;
                    text-align: center;
                    margin-top: 8px;
                    line-height: 1.1;
                }
                .team-section-sub {
                    font-family: 'Inter', sans-serif;
                    font-size: 13px;
                    color: var(--foam2);
                    letter-spacing: 5px;
                    text-transform: uppercase;
                    margin-top: 6px;
                    text-align: center;
                }

                /* Supervisor row */
                .supervisor-row {
                    display: flex;
                    justify-content: center;
                    margin: 28px 0 18px;
                }
                .supervisor-mega-card {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    background: linear-gradient(135deg, rgba(29,78,216,.08) 0%, rgba(255,255,255,.95) 100%);
                    border: 1.5px solid rgba(29,78,216,.35);
                    border-radius: 20px;
                    padding: 20px 36px;
                    box-shadow: 0 8px 30px rgba(29,78,216,.1);
                    max-width: 480px;
                    width: 100%;
                    animation: cardEntrance .7s .05s cubic-bezier(.4,0,.2,1) both;
                    transition: all .35s ease;
                }
                .supervisor-mega-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 40px rgba(29,78,216,.18);
                    border-color: rgba(29,78,216,.6);
                }
                .sup-avatar-wrap {
                    position: relative;
                    flex-shrink: 0;
                }
                .sup-avatar {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(29,78,216,.12), rgba(14,165,233,.08));
                    border: 2.5px solid rgba(29,78,216,.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 34px;
                    animation: pulseRing 2.5s infinite;
                }
                .sup-badge {
                    position: absolute;
                    bottom: -4px;
                    right: -4px;
                    background: var(--blue);
                    color: #fff;
                    font-size: 9px;
                    font-weight: 700;
                    font-family: 'Inter', sans-serif;
                    padding: 2px 7px;
                    border-radius: 20px;
                    letter-spacing: 0.5px;
                    border: 2px solid #fff;
                }
                .sup-info {}
                .sup-label {
                    font-family: 'Inter', sans-serif;
                    font-size: 10px;
                    font-weight: 700;
                    color: var(--blue2);
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                }
                .sup-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 22px;
                    font-weight: 900;
                    color: var(--foam);
                    line-height: 1.1;
                }
                .sup-role {
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                    color: var(--foam2);
                    margin-top: 4px;
                }

                /* Members grid */
                .members-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 14px;
                    max-width: 960px;
                    width: 100%;
                }

                .member-card {
                    background: rgba(255,255,255,.95);
                    border: 1.5px solid rgba(29,78,216,.1);
                    border-radius: 18px;
                    padding: 20px 14px 16px;
                    text-align: center;
                    transition: all .35s cubic-bezier(.4,0,.2,1);
                    position: relative;
                    overflow: hidden;
                    cursor: default;
                    animation: cardEntrance .65s both;
                    box-shadow: 0 4px 16px rgba(29,78,216,.06);
                }
                .member-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--blue), var(--accent));
                    border-radius: 18px 18px 0 0;
                    opacity: 0;
                    transition: opacity .3s;
                }
                .member-card:hover { border-color: rgba(29,78,216,.4); transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(29,78,216,.15); }
                .member-card:hover::before { opacity: 1; }

                .m-avatar-wrap { position: relative; margin: 0 auto 14px; width: 58px; height: 58px; }
                .m-avatar {
                    width: 58px; height: 58px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(29,78,216,.08), rgba(14,165,233,.06));
                    border: 2px solid rgba(29,78,216,.15);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 26px;
                    transition: all .3s;
                }
                .member-card:hover .m-avatar {
                    border-color: rgba(29,78,216,.5);
                    background: linear-gradient(135deg, rgba(29,78,216,.14), rgba(14,165,233,.1));
                    transform: scale(1.1);
                }
                .m-number {
                    position: absolute; top: -4px; right: -4px;
                    width: 20px; height: 20px;
                    background: var(--blue); color: #fff;
                    border-radius: 50%; font-size: 9px; font-weight: 900;
                    font-family: 'Inter', sans-serif;
                    display: flex; align-items: center; justify-content: center;
                    border: 2px solid #fff;
                }
                .m-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 13px; font-weight: 900;
                    color: var(--foam);
                    line-height: 1.25;
                    margin-bottom: 5px;
                }
                .m-role {
                    font-family: 'Inter', sans-serif;
                    font-size: 9.5px; font-weight: 600;
                    color: var(--blue2);
                    letter-spacing: .5px;
                    margin-bottom: 6px;
                }
                .m-id {
                    font-family: 'Courier New', monospace;
                    font-size: 9px; color: rgba(29,78,216,.4);
                    background: rgba(29,78,216,.06);
                    padding: 2px 8px; border-radius: 8px;
                    display: inline-block;
                }
            </style>

            <!-- Header -->
            <div class="badge anim">GROUP 10 · 2024</div>
            <div class="team-section-title anim">Meet The Team</div>
            <div class="team-section-sub anim">The People Behind Smart Service Hub</div>

            <!-- Supervisor -->
            <div class="supervisor-row anim">
                <div class="supervisor-mega-card">
                    <div class="sup-avatar-wrap">
                        <div class="sup-avatar">👩‍🏫</div>
                        <span class="sup-badge">SUPERVISOR</span>
                    </div>
                    <div class="sup-info">
                        <div class="sup-label">Academic Supervisor</div>
                        <div class="sup-name">Dr. Basant Mohamed</div>
                        <div class="sup-role">Teaching Assistant · Faculty of Computers & AI</div>
                    </div>
                </div>
            </div>

            <!-- Members -->
            <div class="members-grid">
                <div class="member-card" style="animation-delay:.15s">
                    <div class="m-avatar-wrap">
                        <div class="m-avatar">👨‍💻</div>
                        <span class="m-number">1</span>
                    </div>
                    <div class="m-name">Ibrahim Mohamed</div>
                    <div class="m-role">Project Lead &amp; Backend</div>
                    <div class="m-id">2006127</div>
                </div>
                <div class="member-card" style="animation-delay:.25s">
                    <div class="m-avatar-wrap">
                        <div class="m-avatar">🎨</div>
                        <span class="m-number">2</span>
                    </div>
                    <div class="m-name">Reem Saleh Abdelwanees</div>
                    <div class="m-role">Frontend Specialist</div>
                    <div class="m-id">2006093</div>
                </div>
                <div class="member-card" style="animation-delay:.35s">
                    <div class="m-avatar-wrap">
                        <div class="m-avatar">📱</div>
                        <span class="m-number">3</span>
                    </div>
                    <div class="m-name">Haneen Hossam Abdelaziz</div>
                    <div class="m-role">UI / UX Designer</div>
                    <div class="m-id">2006085</div>
                </div>
                <div class="member-card" style="animation-delay:.45s">
                    <div class="m-avatar-wrap">
                        <div class="m-avatar">🗄️</div>
                        <span class="m-number">4</span>
                    </div>
                    <div class="m-name">Mariam Wael Youssef</div>
                    <div class="m-role">Database Architect</div>
                    <div class="m-id">2006090</div>
                </div>
                <div class="member-card" style="animation-delay:.55s">
                    <div class="m-avatar-wrap">
                        <div class="m-avatar">🚀</div>
                        <span class="m-number">5</span>
                    </div>
                    <div class="m-name">Amira Helmy Said</div>
                    <div class="m-role">Full Stack Developer</div>
                    <div class="m-id">2006067</div>
                </div>
            </div>

            <!-- 3D Tilt effect -->
            <script>
                document.querySelectorAll('.member-card, .supervisor-mega-card').forEach(card => {
                    card.addEventListener('mousemove', e => {
                        const r = card.getBoundingClientRect();
                        const x = (e.clientX - r.left) / r.width  - .5;
                        const y = (e.clientY - r.top)  / r.height - .5;
                        card.style.transform = `perspective(900px) rotateX(${-y*10}deg) rotateY(${x*10}deg) translateY(-8px) scale(1.02)`;
                    });
                    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
                });
            </script>
        </div>
        <!-- -- SLIDE 3:'''

    content = content[:idx_start] + new_slide2 + content[idx_end + len('        <!-- -- SLIDE 3:'):]

# ── 9. Write back ─────────────────────────────────────────────────────────────
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Redesign applied successfully.")
