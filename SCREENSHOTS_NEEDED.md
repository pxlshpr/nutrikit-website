# NutriKit Website - Screenshots & Videos Needed

All media should be saved to: `/public/screenshots/` and `/public/videos/`

## Screenshot Requirements

All screenshots should be taken on iPhone 17 Pro Max (or latest simulator) at native resolution.
Take both **light mode** and **dark mode** versions of each.

---

### 1. Hero Section
**Files:** `hero-dark.png`, `hero-light.png`

**What to capture:**
- Main app view showing the daily nutrition summary
- Calorie ring/progress visible
- Macro breakdown (protein, carbs, fat)
- Clean, welcoming first impression of the app

---

### 2. Scanner Section (Fastest Label Scanner)
**Files:** `scanner-dark.png`, `scanner-light.png`
**Videos:** `scanner-dark.mp4`, `scanner-light.mp4` (recommended)

**What to capture:**
- Camera view scanning a nutrition label
- Show the app recognizing a **two-column label** (this is a key differentiator)
- Scanning animation/progress if possible
- Result showing parsed nutrition data

**Key messaging:**
- Handles two-column labels that competitors can't
- Instant recognition, no waiting
- Works with any nutrition label format

---

### 3. Voice/Text Logging Section
**Files:** `voice-dark.png`, `voice-light.png`
**Videos:** `voice-dark.mp4`, `voice-light.mp4` (recommended)

**What to capture:**
- Voice input UI or text input field
- Example: "two eggs and a slice of toast with butter"
- Show the parsed result with nutrition breakdown
- Natural language understanding in action

**Key messaging:**
- Speak naturally, no specific format required
- Faster than photo AI recognition (which requires waiting)
- Text input also available for quick logging

---

### 4. Dynamic Goals Section
**Files:** `goals-dark.png`, `goals-light.png`

**What to capture:**
- Goals/settings screen showing dynamic goal configuration
- Protein goal based on body weight (e.g., "1.6g per kg body weight")
- Caloric goal based on metabolic rate
- The calculation breakdown if visible
- Shows intelligence behind the goal setting

**Key messaging:**
- Protein goals that scale with your body weight
- Caloric goals based on your actual metabolic rate
- Goals that adapt as your body changes

---

### 5. Health Integration Section
**Files:** `health-dark.png`, `health-light.png`

**What to capture:**
- Apple Health connection/sync screen
- OR data flowing between NutriKit and Health app
- Shows weight, activity, or other health metrics being used
- Deep integration visualization

**Key messaging:**
- Reads from Apple Health (weight, activity level)
- Writes nutrition data back to Health
- Complete health ecosystem integration

---

## Video Requirements

Videos provide a much better experience for demonstrating features. Use screen recording on device.

**Format:** MP4, H.264 codec
**Resolution:** Native device resolution
**Duration:** 5-15 seconds each
**Settings:** Autoplay, muted, loop (handled by website code)

### Videos to create:

| Video | Files | What to show |
|-------|-------|--------------|
| **Main App Overview** | `main-dark.mp4`, `main-light.mp4` | Quick montage: scan a label → voice log a meal → glance at daily summary with goals → show the seamless workflow |
| **Chunes Overview** | `chunes-dark.mp4`, `chunes-light.mp4` | Showcase Chunes' key features (amalgamation similar to main app) |
| Scanner Demo | `scanner-dark.mp4`, `scanner-light.mp4` | Point camera at label, watch it scan and recognize, show result |
| Voice Demo | `voice-dark.mp4`, `voice-light.mp4` | Tap voice button, speak "two eggs and a slice of toast with butter", show parsed result |
| Goals Demo | `goals-dark.mp4`, `goals-light.mp4` | Scroll through goals settings, show dynamic calculations |
| Health Demo | `health-dark.mp4`, `health-light.mp4` | Show Health app integration, data syncing |

### Overview Videos (Featured at top)

**Main App Overview** (`main-dark.mp4`, `main-light.mp4`)
- **Duration:** 10-15 seconds
- **What to show:** A seamless workflow montage showcasing the app's power:
  1. Quick scanner demo - point at label, instant recognition
  2. Transition to voice logging - speak naturally, meal logged
  3. Pan to daily summary - show calorie ring, macros, goals progress
  4. Maybe quick Health integration visual
- **Vibe:** Fast-paced, satisfying, shows WHY someone would use this
- **Key:** Make it feel effortless and quick

**Chunes Overview** (`chunes-dark.mp4`, `chunes-light.mp4`)
- **Duration:** 10-15 seconds
- **What to show:** Feature-rich montage of Chunes' key capabilities:
  - [To be determined based on Chunes' main features]
  - Similar pacing and production quality to main app video
- **Vibe:** Professional, feature-focused, shows what makes Chunes special

---

### Video Conversion Command

Convert MOV screen recordings to optimized MP4:

```bash
ffmpeg -i input.mov -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 128k output.mp4
```

For smaller file size (may reduce quality slightly):
```bash
ffmpeg -i input.mov -c:v libx264 -preset slow -crf 26 -c:a aac -b:a 96k output.mp4
```

---

## Current Screenshots/Videos Available

- `app-dark.png` - General app screenshot (dark)
- `app-light.png` - General app screenshot (light)
- `hero-dark.png` - Hero section (dark)
- `hero-light.png` - Hero section (light)
- `scanner-light.mp4` - Scanner video (light mode) - 4.4MB

## Still Needed

### Priority (Overview Videos - Featured)
- [ ] main-dark.mp4 / main-light.mp4 (Main app overview montage)
- [ ] chunes-dark.mp4 / chunes-light.mp4 (Chunes overview montage)

### Feature Videos
- [ ] scanner-dark.png / scanner-light.png (static fallbacks)
- [ ] scanner-dark.mp4 (dark mode video)
- [ ] voice-dark.png / voice-light.png
- [ ] voice-dark.mp4 / voice-light.mp4
- [ ] goals-dark.png / goals-light.png
- [ ] goals-dark.mp4 / goals-light.mp4 (optional)
- [ ] health-dark.png / health-light.png
- [ ] health-dark.mp4 / health-light.mp4 (optional)

---

## Feature Highlights to Emphasize

### vs Competitors (like FoodNoms):

1. **Scanner Speed & Accuracy**
   - Handles two-column nutrition labels
   - Instant recognition (no waiting)

2. **Voice/Text Logging**
   - Natural language input
   - Faster than AI photo recognition
   - No need to photograph every meal

3. **Dynamic Goals**
   - Protein per body weight (not just static grams)
   - Caloric goals based on metabolic rate
   - Goals that adapt to your changing body

4. **Deep Health Integration**
   - Full Apple Health ecosystem integration
   - Reads AND writes health data
   - Complete nutrition tracking solution
