
const bgHtml = `<div class="mf-bg">

    <!-- Moon -->
    <div class="moon">
      <div class="moon-crater" style="width:8px;height:8px;top:10px;left:12px;opacity:0.4"></div>
      <div class="moon-crater" style="width:5px;height:5px;top:22px;left:28px;opacity:0.3"></div>
      <div class="moon-crater" style="width:6px;height:6px;top:30px;left:16px;opacity:0.35"></div>
    </div>

    <!-- Wanted poster -->
    <div class="wanted">
      <div class="wanted-title">WANTED</div>
      <div class="wanted-face">
        <svg width="40" height="36" viewBox="0 0 40 36">
          <ellipse cx="20" cy="14" rx="10" ry="12" fill="#8a6040"/>
          <ellipse cx="20" cy="10" rx="12" ry="6" fill="#5a3a20"/>
          <ellipse cx="16" cy="15" rx="2" ry="2.5" fill="#3a1a0a"/>
          <ellipse cx="24" cy="15" rx="2" ry="2.5" fill="#3a1a0a"/>
          <path d="M16 21 Q20 24 24 21" stroke="#5a3a20" stroke-width="1" fill="none"/>
          <rect x="10" y="12" width="4" height="2" rx="1" fill="#4a2a10" opacity="0.6"/>
          <rect x="26" y="12" width="4" height="2" rx="1" fill="#4a2a10" opacity="0.6"/>
          <rect x="14" y="26" width="12" height="10" rx="2" fill="#2a1a0a"/>
        </svg>
      </div>
      <div class="wanted-sub">DEAD OR ALIVE</div>
    </div>

    <!-- City skyline SVG -->
    <svg class="city-svg" viewBox="0 0 680 220" preserveAspectRatio="xMidYMax meet">
      <rect x="0" y="100" width="60" height="120" fill="#0a0a14"/>
      <rect x="20" y="80" width="30" height="20" fill="#0a0a14"/>
      <rect x="10" y="60" width="10" height="20" fill="#0a0a14"/>
      <rect x="55" y="70" width="80" height="150" fill="#0c0c18"/>
      <rect x="75" y="50" width="40" height="22" fill="#0c0c18"/>
      <rect x="90" y="35" width="10" height="18" fill="#0c0c18"/>
      <rect x="65" y="80" width="8" height="6" fill="#c9a84c" opacity="0.18"/>
      <rect x="80" y="80" width="8" height="6" fill="#c9a84c" opacity="0.22"/>
      <rect x="95" y="95" width="8" height="6" fill="#c9a84c" opacity="0.15"/>
      <rect x="110" y="80" width="8" height="6" fill="#c9a84c" opacity="0.2"/>
      <rect x="65" y="100" width="8" height="6" fill="#c9a84c" opacity="0.12"/>
      <rect x="95" y="115" width="8" height="6" fill="#c9a84c" opacity="0.18"/>
      <rect x="130" y="90" width="50" height="130" fill="#08080f"/>
      <rect x="145" y="55" width="20" height="38" fill="#08080f"/>
      <rect x="152" y="40" width="6" height="18" fill="#08080f"/>
      <rect x="135" y="100" width="8" height="6" fill="#c9a84c" opacity="0.14"/>
      <rect x="152" y="100" width="8" height="6" fill="#c9a84c" opacity="0.2"/>
      <rect x="135" y="120" width="8" height="6" fill="#c9a84c" opacity="0.1"/>
      <rect x="175" y="120" width="45" height="100" fill="#0a0a16"/>
      <rect x="185" y="100" width="25" height="22" fill="#0a0a16"/>
      <rect x="183" y="130" width="7" height="5" fill="#c9a84c" opacity="0.16"/>
      <rect x="198" y="130" width="7" height="5" fill="#c9a84c" opacity="0.12"/>
      <rect x="213" y="130" width="7" height="5" fill="#c9a84c" opacity="0.18"/>
      <rect x="270" y="40" width="70" height="180" fill="#0b0b18"/>
      <rect x="285" y="20" width="40" height="24" fill="#0b0b18"/>
      <rect x="300" y="5" width="10" height="18" fill="#0b0b18"/>
      <polygon points="290,20 300,5 310,20" fill="#0f0f1e"/>
      <rect x="275" y="55" width="10" height="7" fill="#c9a84c" opacity="0.22"/>
      <rect x="295" y="55" width="10" height="7" fill="#c9a84c" opacity="0.16"/>
      <rect x="315" y="55" width="10" height="7" fill="#c9a84c" opacity="0.2"/>
      <rect x="275" y="75" width="10" height="7" fill="#c9a84c" opacity="0.14"/>
      <rect x="295" y="75" width="10" height="7" fill="#c9a84c" opacity="0.26"/>
      <rect x="315" y="75" width="10" height="7" fill="#c9a84c" opacity="0.1"/>
      <rect x="275" y="95" width="10" height="7" fill="#c9a84c" opacity="0.18"/>
      <rect x="315" y="95" width="10" height="7" fill="#c9a84c" opacity="0.15"/>
      <rect x="335" y="80" width="55" height="140" fill="#090912"/>
      <rect x="350" y="60" width="25" height="22" fill="#090912"/>
      <rect x="340" y="88" width="8" height="6" fill="#c9a84c" opacity="0.13"/>
      <rect x="358" y="88" width="8" height="6" fill="#c9a84c" opacity="0.2"/>
      <rect x="374" y="88" width="8" height="6" fill="#c9a84c" opacity="0.15"/>
      <rect x="340" y="108" width="8" height="6" fill="#c9a84c" opacity="0.11"/>
      <rect x="374" y="108" width="8" height="6" fill="#c9a84c" opacity="0.19"/>
      <rect x="385" y="100" width="60" height="120" fill="#0a0a15"/>
      <rect x="395" y="75" width="40" height="27" fill="#0a0a15"/>
      <rect x="410" y="58" width="10" height="20" fill="#0a0a15"/>
      <rect x="390" y="108" width="8" height="6" fill="#c9a84c" opacity="0.17"/>
      <rect x="408" y="108" width="8" height="6" fill="#c9a84c" opacity="0.13"/>
      <rect x="426" y="108" width="8" height="6" fill="#c9a84c" opacity="0.21"/>
      <rect x="440" y="85" width="50" height="135" fill="#08080e"/>
      <rect x="452" y="65" width="26" height="22" fill="#08080e"/>
      <rect x="459" y="50" width="12" height="18" fill="#08080e"/>
      <rect x="445" y="94" width="8" height="6" fill="#c9a84c" opacity="0.14"/>
      <rect x="462" y="94" width="8" height="6" fill="#c9a84c" opacity="0.2"/>
      <rect x="445" y="114" width="8" height="6" fill="#c9a84c" opacity="0.16"/>
      <rect x="477" y="114" width="8" height="6" fill="#c9a84c" opacity="0.12"/>
      <rect x="485" y="110" width="45" height="110" fill="#0b0b16"/>
      <rect x="495" y="90" width="25" height="22" fill="#0b0b16"/>
      <rect x="489" y="118" width="7" height="5" fill="#c9a84c" opacity="0.15"/>
      <rect x="505" y="118" width="7" height="5" fill="#c9a84c" opacity="0.22"/>
      <rect x="519" y="118" width="7" height="5" fill="#c9a84c" opacity="0.13"/>
      <rect x="525" y="75" width="55" height="145" fill="#0a0a14"/>
      <rect x="538" y="50" width="30" height="28" fill="#0a0a14"/>
      <rect x="548" y="38" width="10" height="16" fill="#0a0a14"/>
      <rect x="530" y="85" width="8" height="6" fill="#c9a84c" opacity="0.2"/>
      <rect x="548" y="85" width="8" height="6" fill="#c9a84c" opacity="0.14"/>
      <rect x="565" y="85" width="8" height="6" fill="#c9a84c" opacity="0.18"/>
      <rect x="530" y="105" width="8" height="6" fill="#c9a84c" opacity="0.11"/>
      <rect x="565" y="105" width="8" height="6" fill="#c9a84c" opacity="0.16"/>
      <rect x="575" y="90" width="50" height="130" fill="#090910"/>
      <rect x="590" y="68" width="20" height="24" fill="#090910"/>
      <rect x="580" y="98" width="8" height="6" fill="#c9a84c" opacity="0.19"/>
      <rect x="600" y="98" width="8" height="6" fill="#c9a84c" opacity="0.13"/>
      <rect x="618" y="98" width="8" height="6" fill="#c9a84c" opacity="0.17"/>
      <rect x="620" y="110" width="60" height="110" fill="#0a0a13"/>
      <rect x="635" y="85" width="30" height="28" fill="#0a0a13"/>
      <rect x="0" y="215" width="680" height="5" fill="#0d0d1a"/>
      <rect x="0" y="210" width="680" height="12" fill="#080810"/>
    </svg>

    <!-- Rain canvas -->
    <canvas class="rain-canvas" id="rainCanvas"></canvas>

    <!-- Fog -->
    <div class="fog fog1"></div>
    <div class="fog fog2"></div>

    <!-- Lamp posts -->
    <div class="lamp-post lp-left">
      <div class="lp-arm" style="margin-right:14px;position:relative">
        <div class="lp-globe"></div>
        <div class="lp-cone"></div>
      </div>
      <div class="lp-pole"></div>
    </div>
    <div class="lamp-post lp-right">
      <div class="lp-arm" style="margin-left:14px;position:relative">
        <div class="lp-globe"></div>
        <div class="lp-cone"></div>
      </div>
      <div class="lp-pole"></div>
    </div>

    <!-- Smoke -->
    <div class="smoke-wrap sw1">
      <div class="smoke-puff" style="width:18px;height:18px;animation-delay:0s;left:0"></div>
      <div class="smoke-puff" style="width:14px;height:14px;animation-delay:1s;left:5px"></div>
      <div class="smoke-puff" style="width:20px;height:20px;animation-delay:2s;left:-3px"></div>
    </div>
    <div class="smoke-wrap sw2">
      <div class="smoke-puff" style="width:16px;height:16px;animation-delay:0.5s;left:0"></div>
      <div class="smoke-puff" style="width:22px;height:22px;animation-delay:1.5s;left:4px"></div>
    </div>

    <!-- Flying bats -->
    <div class="bat" style="animation-duration:14s;animation-delay:2s">
      <div class="bat-wing"></div><div style="display:inline-block;width:5px;height:4px;background:#2a2a4a;border-radius:50%"></div><div class="bat-wing"></div>
    </div>
    <div class="bat" style="animation-duration:19s;animation-delay:8s;top:24%">
      <div class="bat-wing" style="width:8px;height:3px"></div><div style="display:inline-block;width:4px;height:3px;background:#2a2a4a;border-radius:50%"></div><div class="bat-wing" style="width:8px;height:3px"></div>
    </div>

    <!-- Car -->
    <div class="car-wrap">
      <div class="car-body">
        <div class="car-roof"></div>
        <div class="car-wheel car-wl"></div>
        <div class="car-wheel car-wr"></div>
        <div class="car-headlight"></div>
      </div>
    </div>

  </div><!-- /mf-bg -->`;
document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML('afterbegin', bgHtml);

  // Rain effect
  const canvas = document.getElementById('rainCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let drops = [], W, H;
    function initRain() {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
      drops = [];
      const count = Math.floor(W / 5);
      for (let i = 0; i < count; i++) {
        drops.push({ x: Math.random() * W, y: Math.random() * H, len: Math.random() * 14 + 8, speed: Math.random() * 3 + 3, opacity: Math.random() * 0.25 + 0.08 });
      }
    }
    function drawRain() {
      ctx.clearRect(0, 0, W, H);
      drops.forEach(d => {
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.len * 0.15, d.y + d.len);
        ctx.strokeStyle = `rgba(140,160,200,${d.opacity})`; ctx.lineWidth = 0.6; ctx.stroke();
        d.y += d.speed; d.x -= d.speed * 0.15;
        if (d.y > H) { d.y = -d.len; d.x = Math.random() * W; }
        if (d.x < 0) d.x = W;
      });
      requestAnimationFrame(drawRain);
    }
    initRain(); drawRain();
    window.addEventListener('resize', initRain);
  }
});
