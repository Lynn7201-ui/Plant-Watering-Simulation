## Project Goal

Monitor soil moisture levels and automatically control a water pump to keep a plant healthy


---

## File Structure

| File | Purpose |
|------|---------|
| `skin.html` | Main webpage structure and layout |
| `blood.css` | Interface styling |
| `bone.js` | Simulation logic and event handlers |

---

## Simulator Features

| Feature | Channels | How It Is Used |
|---------|----------|----------------|
| LED | 4 channels | CH1 Red = Dry · CH2 Green = OK · CH3 Amber = Wet · CH4 Blue = Pump active |
| PSW | 4 switches | SW1 Water  · SW2 Mode · SW3 Dry · SW4 Reset |
| PWM | 1 channel | Controls pump duty cycle (0–100%) — speed of moisture rise |

---

## File Descriptions

### `skin.html`
Defines all visible elements on screen using a **2-column CSS grid layout**. Contains 5 sections:
- Moisture gauge (SVG ring)
- LED indicators
- PSW push buttons
- PWM control panel
- Event log

Links `blood.css` in the `<head>` and `bone.js` at the bottom of `<body>`.

---

### `blood.css`
All colors are written as plain hex values (e.g. `#52b788`) — no CSS custom properties — so the file works correctly inside the course simulator environment without being overridden.

Handles:
- Grid layout
- Card panels
- LED glow effects (`box-shadow`)
- Custom range slider appearance

---

### `bone.js`
Contains all application logic:

| Element | Description |
|---------|-------------|
| **State variables** | `moisture`, `pumpSpeed`, `autoMode` |
| **`setInterval` tick (500 ms)** | Simulates evaporation and pump effect; runs auto-mode logic |
| **`render()`** | Updates every DOM element (gauge ring, LEDs, bars, labels, badge) |
| **`setLed(id, on, color)`** | Helper to toggle LED classes |
| **`addLog(msg, type)`** | Appends a timestamped entry to the event log |
| **`psw1()` – `psw4()`** | PSW button handlers |
| **`onPwmChange(val)`** | PWM slider handler (manual mode only) |

---

##  How It Works

The simulator runs a **tick every 500 ms** using `setInterval`:

1. If the pump is **off** , moisture drops by `0.25%` (evaporation)
2. If the pump is **on** , moisture rises by `pumpSpeed × 0.045`
3. **AUTO mode** , pump turns ON automatically when moisture `< 30%`, turns OFF at `80%`
4. **MANUAL mode** , user controls the pump via the SW1 button and PWM slider

---

## PSW Button Reference

| Button | Label | Action |
|--------|-------|--------|
| SW1 | Water | Toggle pump on/off *(Manual mode only)* |
| SW2 | Mode | Switch between AUTO and MANUAL |
| SW3 | Dry | Drop moisture by 25% *(for demo)* |
| SW4 | Reset | Restore moisture to 42%, AUTO mode, clear log |

---

##  Program Demo

1. Open `skin.html` in a browser — system starts in **AUTO mode**, moisture at **42%**
2. Press **SW3** to simulate drying — moisture drops below 30%
3. Watch the system **auto-activate the pump** — LED changes from green → red → green
4. Pump **auto-stops** when moisture reaches **80%**
5. Press **SW2** to switch to **MANUAL mode**
6. Drag the **PWM slider** to manually set pump speed
7. Press **SW1** to toggle the pump on/off manually
8. Press **SW4** to **reset** everything for the next demo run

---

