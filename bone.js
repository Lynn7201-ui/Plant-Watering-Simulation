// ── State ──
let moisture  = 42;
let pumpSpeed = 0;
let autoMode  = true;
const CIRCUMFERENCE = 2 * Math.PI * 52; // 326.7

// ── Simulator tick (runs every 500 ms) ──
setInterval(() => {
  // moisture slowly drops (evaporation)
  if (pumpSpeed === 0) {
    moisture = Math.max(0, moisture - 0.25);
  }
  // pump raises moisture proportional to duty cycle
  if (pumpSpeed > 0) {
    moisture = Math.min(100, moisture + pumpSpeed * 0.045);
  }
  // auto-mode logic
  if (autoMode) {
    if (moisture < 30 && pumpSpeed === 0) {
      pumpSpeed = 70;
      log('Auto: moisture below 30%. Pump ON at 70%.', 'warn');
    }
    if (moisture >= 80 && pumpSpeed > 0) {
      pumpSpeed = 0;
      log('Auto: moisture reached 80%. Pump OFF.', 'ok');
    }
  }
  render();
}, 500);

// ── Render ──
function render() {
  const m = Math.round(moisture);
  const p = Math.round(pumpSpeed);

  // gauge ring
  const offset = CIRCUMFERENCE - (m / 100) * CIRCUMFERENCE;
  const fill = document.getElementById('gauge-fill');
  fill.style.strokeDashoffset = offset;
  fill.style.stroke = m < 30 ? '#c0392b' : m > 70 ? '#e9a800' : '#0b22cc';
  document.getElementById('gauge-pct').textContent = m + '%';

  // zone label
  const zoneEl = document.getElementById('gauge-zone');
  if (m < 30)      { zoneEl.textContent = 'Dry'; zoneEl.className = 'gauge-zone zone-dry'; }
  else if (m > 70) { zoneEl.textContent = 'Wet'; zoneEl.className = 'gauge-zone zone-wet'; }
  else             { zoneEl.textContent = 'OK';  zoneEl.className = 'gauge-zone zone-ok';  }

  // LEDs
  setLed('led-dry',  m < 30,              'red');
  setLed('led-ok',   m >= 30 && m <= 70,  'blue');
  setLed('led-wet',  m > 70,              'amber');
  setLed('led-pump', p > 0,               'green');

  // PWM bars and labels
  document.getElementById('pwm-label').textContent          = p + '%';
  document.getElementById('bar-moisture-label').textContent = m + '%';
  document.getElementById('bar-pump-label').textContent     = p + '%';
  document.getElementById('bar-moisture').style.width       = m + '%';
  document.getElementById('bar-pump').style.width           = p + '%';
  if (autoMode) document.getElementById('pwm-slider').value = p;

  // mode badge
  const badge = document.getElementById('mode-badge');
  badge.textContent = autoMode ? 'AUTO' : 'MANUAL';
  badge.className   = 'mode-badge ' + (autoMode ? 'mode-auto' : 'mode-manual');

  // slider enabled only in manual mode
  document.getElementById('pwm-slider').disabled = autoMode;
}

// ── Set LED on/off ──
function setLed(id, on, color) {
  const el = document.getElementById(id);
  el.className = 'led' + (on ? ' ' + color : '');
}


// ── PSW button handlers ──

// SW1 — Water now (manual mode only)
function psw1() {
  if (autoMode) {
    log('SW1: switch to MANUAL mode to control pump.', '');
    return;
  }
  pumpSpeed = pumpSpeed > 0 ? 0 : 70;
  document.getElementById('pwm-slider').value = pumpSpeed;
  log('SW1: pump ' + (pumpSpeed > 0 ? 'started at 70%.' : 'stopped.'), pumpSpeed > 0 ? 'ok' : '');
  render();
}

// SW2 — Toggle auto / manual mode
function psw2() {
  autoMode = !autoMode;
  if (autoMode) { pumpSpeed = 0; }
  log('SW2: mode → ' + (autoMode ? 'AUTO.' : 'MANUAL.'), 'ok');
  render();
}

// SW3 — Simulate drying (drop moisture by 25%)
function psw3() {
  moisture = Math.max(0, moisture - 25);
  log('SW3: simulated drying. Moisture now ' + Math.round(moisture) + '%.', 'warn');
  render();
}

// SW4 — Reset everything
function psw4() {
  moisture = 42;
  pumpSpeed = 0;
  autoMode = true;
  document.getElementById('pwm-slider').value = 0;
  document.getElementById('log').innerHTML =
    '<p><span class="log-time">00:00:00</span>System reset. Mode: <span class="log-ok">AUTO</span>. Moisture: 42%.</p>';
  render();
}

// ── PWM slider (manual mode only) ──
function onPwmChange(val) {
  if (autoMode) return;
  pumpSpeed = parseInt(val);
  log('PWM: pump duty cycle set to ' + pumpSpeed + '%.', pumpSpeed > 0 ? 'ok' : '');
  render();
}

// ── Initial render ──
render();
