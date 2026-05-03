import os

file_path = r'c:\Users\mahmi\Desktop\smart-service-hub\public\pages\presentation.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix common corruption patterns
replacements = {
    '?? Supabase': '🚀 Supabase',
    '?? API': '🔌 API',
    '?? Page': '📄 Page',
    '?? Login Logic': '🔐 Login Logic',
    '?? Take a': '🎫 Take a',
    '?? Pre-book': '📅 Pre-book',
    '?? Currency': '💰 Currency',
    '?? Response': '📤 Response',
    '?? Ticket': '🎫 Ticket',
    '?? SSE': '⚡ SSE',
    '?? Alert Sound': '🔔 Alert Sound',
    '?? Real-time': '⚡ Real-time',
    '?? Advanced': '⚙️ Advanced',
    '?? Staff': '👔 Staff',
    '?? Referred': '🔄 Referred',
    '?? Export': '📤 Export',
    '?? Audit Log': '📋 Audit Log',
    '?? Support': '💬 Support',
    '?? Unique': '🆔 Unique',
    '?? environment': '🌐 Environment',
    '?? ocean.css': '🎨 ocean.css',
    '?? Light Mode': '☀️ Light Mode',
    '?? Project Overview': '📊 Project Overview',
    '?? How Project Works': '🏗️ How Project Works',
    '??? Registered': '👥 Registered',
    '??? Token': '🎫 Token',
    '??? Large': '🖥️ Large',
    '??? Registered': '👥 Registered',
    '???': '✨',
    '? 3 ?????': '🔹 3 Types',
    '? Session Cookie 8 ?????': '🔹 Session Cookie 8 Hours',
    '? 5 Services': '🔹 5 Services',
    '? Each unit is independent': '🔹 Each unit is independent',
    '? Where to Store?': '📂 Where to Store?',
    '? Free Cloud Service': '🔹 Free Cloud Service',
    '? Connection via Library': '🔹 Connection via Library',
    '? Pool Fixed By SSL': '🔹 Pool Fixed By SSL',
    '? Connection Variables': '🔹 Connection Variables',
    '? Supports Thousands': '🔹 Supports Thousands',
    '? Entry Point': '🚪 Entry Point',
    '? middleware One Serves All': '🔹 Middleware One Serves All',
    '? Every Role Sees Only': '🔹 Every Role Sees Only',
    '? Every edit is logged': '🔹 Every edit is logged',
    '? workflow ?????In': '🔹 Workflow System',
    '? Execution Steps': '🔹 Execution Steps',
    '? Run Server': '🔹 Run Server',
    '? Install Packages': '🔹 Install Packages',
}

# Apply simple replacements
for old, new in replacements.items():
    content = content.replace(old, new)

# Fix Slide 2 (Team Slide) specifically
team_slide_old = """        <!-- -- SLIDE 2: TEAM -- -->
        <div class="slide" id="slide-2">س
            <div class="corners">
                <div class="corner-bl"></div>
                <div class="corner-tr"></div>
            </div>
            <div class="slide-num">02 / 32</div>
            <h2 class="anim"
                style="font-family:'Playfair Display',serif;font-size:34px;color:var(--gold);text-align:center;letter-spacing:2px">
                Project Team</h2>
            <div class="divider anim" style="width:260px;margin:12px auto 32px">
                <div class="divider-line"></div>
                <div class="divider-diamond"></div>
                <div class="divider-line"></div>
            </div>

            <div class="team-grid">
                <!-- Supervisor (Full Width / Top) -->
                <div class="team-card supervisor-card anim" style="animation-delay: 0.1s;">
                    <div class="team-avatar" style="border-color:var(--gold2); color:var(--gold2); box-shadow:0 0 15px rgba(29, 78, 216,0.2);">?</div>
                    <div class="team-name" style="font-size: 16px;">Basant Mohamed</div>
                    <div class="team-role" style="font-size: 12px; color:var(--gold2);">Supervisor ? Teaching Assistant</div>
                </div>

                <!-- Team Leader -->
                <div class="team-card team-leader anim" style="animation-delay: 0.2s;">
                    <div class="team-avatar">??</div>
                    <div class="team-name">Ibrahim Mohamed</div>
                    <div class="team-id">ID: 2006127</div>
                    <div class="team-role">Team Leader ? Backend</div>
                </div>

                <div class="team-card anim" style="animation-delay: 0.3s;">
                    <div class="team-avatar">??</div>
                    <div class="team-name">Reem Saleh Abdelwanees</div>
                    <div class="team-id">ID: 2006093</div>
                    <div class="team-role">Frontend Developer</div>
                </div>

                <div class="team-card anim" style="animation-delay: 0.4s;">
                    <div class="team-avatar">??</div>
                    <div class="team-name">Haneen Hossam Abdelaziz</div>
                    <div class="team-id">ID: 2006085</div>
                    <div class="team-role">UI/UX Designer</div>
                </div>

                <div class="team-card anim" style="animation-delay: 0.5s; grid-column: 1 / 3; justify-self: right; width: calc(50% - 8px); margin-right: -50%;">
                    <div class="team-avatar">???</div>
                    <div class="team-name">Mariam Wael Youssef</div>
                    <div class="team-id">ID: 2006090</div>
                    <div class="team-role">Database Engineer</div>
                </div>

                <div class="team-card anim" style="animation-delay: 0.6s; grid-column: 3 / 4; justify-self: left; width: 100%; margin-left: 50%;">
                    <div class="team-avatar">??</div>
                    <div class="team-name">Amira Helmy Said</div>
                    <div class="team-id">ID: 2006067</div>
                    <div class="team-role">Full Stack Developer</div>
                </div>
            </div>"""

team_slide_new = """        <!-- ══ SLIDE 2: TEAM ══ -->
        <div class="slide" id="slide-2">
            <div class="corners">
                <div class="corner-bl"></div>
                <div class="corner-tr"></div>
            </div>
            <div class="slide-num">02 / 32</div>
            
            <div class="badge anim">TEAM MEMBERS</div>
            <h2 class="anim" style="font-family:'Playfair Display',serif; font-size:42px; color:var(--gold); margin-top:15px; letter-spacing:2px">The Creative Minds</h2>
            <div class="divider anim" style="width:200px; margin:15px auto 40px">
                <div class="divider-line"></div>
                <div class="divider-diamond"></div>
                <div class="divider-line"></div>
            </div>

            <style>
                .team-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 25px;
                    max-width: 1000px;
                    width: 100%;
                }
                .team-card {
                    background: rgba(255,255,255,0.95);
                    border: 1px solid rgba(29,78,216,0.15);
                    border-radius: 20px;
                    padding: 25px;
                    text-align: center;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                }
                .team-card:hover {
                    border-color: var(--gold);
                    box-shadow: 0 15px 40px rgba(29,78,216,0.15);
                }
                .team-avatar {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: rgba(29,78,216,0.05);
                    border: 2px solid rgba(29,78,216,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 30px;
                    margin: 0 auto 15px;
                }
                .team-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 18px;
                    font-weight: 900;
                    color: var(--gold);
                    margin-bottom: 5px;
                }
                .team-role {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--foam2);
                    margin-bottom: 10px;
                }
                .team-id {
                    font-family: monospace;
                    font-size: 11px;
                    color: rgba(29,78,216,0.4);
                    background: rgba(29,78,216,0.05);
                    padding: 3px 10px;
                    border-radius: 10px;
                    display: inline-block;
                }
                .supervisor-card {
                    grid-column: 1 / 4;
                    max-width: 400px;
                    margin: 0 auto 10px;
                    border: 1px solid var(--gold);
                    background: rgba(29,78,216,0.02);
                }
            </style>

            <div class="team-grid">
                <!-- Supervisor -->
                <div class="team-card supervisor-card anim" style="animation-delay: 0.1s;">
                    <div class="team-avatar" style="border-color:var(--gold); color:var(--gold); background:rgba(201,168,76,0.05)">👩‍🏫</div>
                    <div class="team-name">Basant Mohamed</div>
                    <div class="team-role">Academic Supervisor · Teaching Assistant</div>
                </div>

                <!-- Team Leader -->
                <div class="team-card anim" style="animation-delay: 0.2s;">
                    <div class="team-avatar">👨‍💻</div>
                    <div class="team-name">Ibrahim Mohamed</div>
                    <div class="team-role">Project Lead & Backend Arch.</div>
                    <div class="team-id">ID: 2006127</div>
                </div>

                <div class="team-card anim" style="animation-delay: 0.3s;">
                    <div class="team-avatar">🎨</div>
                    <div class="team-name">Reem Saleh Abdelwanees</div>
                    <div class="team-role">Frontend Specialist</div>
                    <div class="team-id">ID: 2006093</div>
                </div>

                <div class="team-card anim" style="animation-delay: 0.4s;">
                    <div class="team-avatar">📱</div>
                    <div class="team-name">Haneen Hossam Abdelaziz</div>
                    <div class="team-role">Lead UI/UX Designer</div>
                    <div class="team-id">ID: 2006085</div>
                </div>

                <div class="team-card anim" style="animation-delay: 0.5s;">
                    <div class="team-avatar">🗄️</div>
                    <div class="team-name">Mariam Wael Youssef</div>
                    <div class="team-role">Database Architect</div>
                    <div class="team-id">ID: 2006090</div>
                </div>

                <div class="team-card anim" style="animation-delay: 0.6s;">
                    <div class="team-avatar">🚀</div>
                    <div class="team-name">Amira Helmy Said</div>
                    <div class="team-role">Full Stack Developer</div>
                    <div class="team-id">ID: 2006067</div>
                </div>
            </div>"""

content = content.replace(team_slide_old, team_slide_new)

# Fix Slide 4 Cards (Common tools)
content = content.replace('??</span> Node.js', '🟢</span> Node.js')
content = content.replace('??</span> Express.js', '🚂</span> Express.js')
content = content.replace('??</span> PostgreSQL', '🐘</span> PostgreSQL')
content = content.replace('??</span> Supabase', '🚀</span> Supabase')

# Save fixed content
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully fixed encoding issues and redesigned Slide 2.")
