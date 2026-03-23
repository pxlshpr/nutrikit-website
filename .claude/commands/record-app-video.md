Record a screen capture video of the NutriKit iOS app running in the simulator.

The user will describe what the app should do in the video (e.g., "scroll through the home screen in dark mode", "show the scanner screen", "navigate to settings"). Use $ARGUMENTS as the description.

## Prerequisites

- The NutriKit app must be built. If not recently built, build it first:
  ```
  xcodebuild -project ~/Developer/NutriKit/NutriKit.xcodeproj \
    -scheme NutriKit \
    -destination "platform=iOS Simulator,id=$UDID" build
  ```
- The app binary lives at: `~/Library/Developer/Xcode/DerivedData/NutriKit-esflmhpgvfxpwjbdifmzvkhjdcnm/Build/Products/Debug-iphonesimulator/NutriKit.app`

## Configuration

- **Simulator UDID** (iPhone 17 Pro Max): `31CAEC7B-E014-4096-96D0-DE335A114AEB`
- **App bundle ID**: `com.ahmdrghb.NutriKit`
- **Resolution**: 1320 x 2868 (portrait)
- **Output location**: `~/Desktop/` on pxlhome, then SCP to `pxlbook:~/Downloads/nutrikit-videos/`

## Recording Procedure

### 1. Fresh simulator

```bash
UDID="31CAEC7B-E014-4096-96D0-DE335A114AEB"
xcrun simctl shutdown $UDID 2>/dev/null
xcrun simctl erase $UDID
xcrun simctl boot $UDID && sleep 3
```

### 2. Set appearance

Ask the user if they want light or dark mode if not specified, then:
```bash
xcrun simctl ui $UDID appearance dark   # or light
```

### 3. Install app

```bash
xcrun simctl install $UDID \
  ~/Library/Developer/Xcode/DerivedData/NutriKit-esflmhpgvfxpwjbdifmzvkhjdcnm/Build/Products/Debug-iphonesimulator/NutriKit.app
```

### 4. Burn launches to dismiss system notifications

The iOS simulator shows an "Apple Intelligence" notification banner on every fresh app launch. It must be dismissed by launching the app multiple times before recording.

**IMPORTANT: Always use 3 burn launches.** Light mode sometimes needs all 3.

```bash
for i in 1 2 3; do
  xcrun simctl launch $UDID com.ahmdrghb.NutriKit -SCREENSHOT_MODE
  sleep 20
  xcrun simctl terminate $UDID com.ahmdrghb.NutriKit
  sleep 1
done
```

### 5. Launch the app for recording

Use `-SCREENSHOT_MODE` to skip onboarding, suppress iCloud alerts, seed sample data, and configure display settings.

Use `-SCREENSHOT_SCROLL` additionally if the video involves the built-in auto-scroll (scrolls home screen down, swipes nutrient header, scrolls back up — ~14s total).

```bash
xcrun simctl launch $UDID com.ahmdrghb.NutriKit -SCREENSHOT_MODE [-SCREENSHOT_SCROLL]
sleep 2
```

### 6. Clean status bar

```bash
xcrun simctl status_bar $UDID override \
  --time "9:41" --batteryLevel 100 --batteryState charged \
  --cellularBars 4 --wifiBars 3 --operatorName ""
```

### 7. Record

```bash
xcrun simctl io $UDID recordVideo --codec h264 --force ~/Desktop/nutrikit-recording.mov &
RECORD_PID=$!
sleep <duration>   # Adjust based on what needs to be captured
kill -INT $RECORD_PID && wait $RECORD_PID 2>/dev/null
sleep 2
```

### 8. Verify — ALWAYS check the video before delivering

Extract and visually inspect the first frame, last frame, and a frame at 12s:

```bash
ffmpeg -i ~/Desktop/nutrikit-recording.mov -vframes 1 -f image2 -y /tmp/verify-first.png 2>/dev/null
ffmpeg -sseof -0.5 -i ~/Desktop/nutrikit-recording.mov -vframes 1 -update 1 -y /tmp/verify-last.png 2>/dev/null
ffmpeg -i ~/Desktop/nutrikit-recording.mov -ss 12 -vframes 1 -f image2 -y /tmp/verify-12s.png 2>/dev/null
```

Use the Read tool to view each frame. Check for:
- **No "iCloud Account Signed Out" dialog** — if present, the CloudKit monitor fix may not be compiled in. Do a clean build.
- **No "Ready for Apple Intelligence" notification banner** — if present, do more burn launches.
- **No onboarding screen** — should show the home screen with seeded data.
- **First and last frames match** (for looping videos) — scroll position, header state, visible meals should be identical (only the timeline clock will differ).

If any check fails, fix the issue and re-record. Do NOT deliver a video without verifying.

### 9. Transfer to pxlbook

```bash
ssh pxlbook "mkdir -p ~/Downloads/nutrikit-videos"
scp ~/Desktop/nutrikit-recording.mov pxlbook:~/Downloads/nutrikit-videos/
```

## Available Launch Flags

| Flag | Effect |
|------|--------|
| `-SCREENSHOT_MODE` | Skips onboarding, suppresses iCloud alert, disables CloudKit monitor, seeds 3 meals with targets, sets display prefs (small emojis, detailed food names, macro bars, search button) |
| `-SCREENSHOT_SCROLL` | After 4s, auto-scrolls down → swipes nutrient header → scrolls back up. Uses CADisplayLink at 150pt/sec with ease-in-out. Snaps back to exact starting position for seamless loops. |

## Custom Interactions

If the user wants something beyond the built-in scroll (e.g., navigating to a specific screen, tapping buttons), you may need to add new auto-actions in the app code:

- **Auto-scroll**: `DayViewController.swift` → `performAutoScroll()` — modify for different scroll behavior
- **Seed data**: `ScreenshotSeeder.swift` — modify meals, targets, display settings
- **New screens**: Add new ProcessInfo argument checks in the relevant view controller

## Key Files

| File | Purpose |
|------|---------|
| `NutriKitApp.swift` | `isScreenshotMode` flag, onboarding/iCloud/CloudKit bypasses |
| `Previews/ScreenshotSeeder.swift` | Seeds meals, targets, UserDefaults display prefs |
| `Refactor Inbox/UIKit/DayViewController.swift` | Auto-scroll + nutrient header swipe |
| `Packages/App/.../CloudKitAccountMonitor.swift` | Disables CKAccountChanged listener |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| iCloud alert appears | Clean build (`xcodebuild clean build`), ensure CloudKitAccountMonitor has screenshot guard |
| Apple Intelligence notification | Add more burn launches (3 minimum) |
| Scroll starts at wrong position | Don't force contentOffset — let app settle for 4s |
| Scroll stutters | Lower scroll speed (currently 150pt/s), close other apps on pxlhome |
| First/last frames don't match for loop | The snap-back uses `setContentOffset(exactStartOffset, animated: true)` after scroll-up |
| Video captures wrong simulator | Don't use XCUITest (it clones the sim). Use in-app flags instead. |

## Reference

Full documentation: `/Users/pxlshpr/obsidian/DevOps/Reference/nutrikit-screenshot-workflow.md`
