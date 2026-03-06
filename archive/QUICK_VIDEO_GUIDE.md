# 🎬 Quick Video Guide

## Adding Videos - 3 Simple Steps

### Step 1: Place Video
```bash
# Put your .mov file in public/videos/
# Name it: {feature}-{theme}.mov

# Examples:
public/videos/hero-light.mov
public/videos/hero-dark.mov
public/videos/voice-light.mov
public/videos/goals-dark.mov
```

### Step 2: Run Compression
```bash
npm run compress-videos
```

### Step 3: Use in Component
```tsx
<OptimizedVideo
  name="hero"        // Matches: hero-light.webm, hero-dark.mp4
  alt="Hero demo"
  priority={true}    // Optional: true for above-fold
/>
```

---

## File Naming

**Format:** `{feature}-{theme}.mov`

### Required Parts:
- **feature**: Short name (e.g., `hero`, `scanner`, `voice`)
- **theme**: Either `light` or `dark`
- **extension**: `.mov` (or `.MOV`)

### Examples:
```
✅ scanner-light.mov
✅ hero-dark.mov
✅ voice-light.mov
✅ goals-dark.MOV

❌ scanner.mov          (missing theme)
❌ light-scanner.mov    (wrong order)
❌ scanner_light.mov    (use dash, not underscore)
```

---

## What You Need

### Videos You'll Need:
```
✅ scanner-light.mov   (done)
✅ scanner-dark.mov    (done)

Still needed:
⏳ hero-light.mov
⏳ hero-dark.mov
⏳ voice-light.mov
⏳ voice-dark.mov
⏳ goals-light.mov
⏳ goals-dark.mov
⏳ health-light.mov
⏳ health-dark.mov
```

---

## Recording Tips

### Resolution
- **Minimum:** 1080x1920 (portrait for iPhone mockups)
- **Recommended:** Native device resolution
- **Format:** MOV or MP4

### Duration
- **Ideal:** 3-6 seconds per video
- **Maximum:** 10 seconds
- **Loop:** Record something that loops smoothly

### Quality
- **Frame rate:** 24fps minimum, 60fps recommended
- **Audio:** Not needed (will be removed during compression)

---

## Compression Details

### What the Script Does:
```
Input:  scanner-light.mov (76 MB)
         ↓
Output: scanner-light.webm (9.8 MB)  87% smaller ✅
        scanner-light.mp4  (8.1 MB)  89% smaller ✅
```

### Formats Created:
- **WebM (VP9):** Modern, smaller, better quality
- **MP4 (H.264):** Fallback for older browsers

### Settings:
- **WebM:** CRF 32, good quality/size balance
- **MP4:** CRF 24, slow preset for better compression
- **Audio:** Removed automatically
- **Optimization:** Progressive download enabled

---

## Integration

### Current Status:

**Using OptimizedVideo:**
```tsx
// Scanner section (page.tsx line 416)
<FeatureSection
  id="feature-scanner"
  mediaName="scanner"
  optimizedMedia={true}  // ✅ Using optimized video
/>
```

**Still using old AppMedia:**
```tsx
// Hero section (page.tsx line 324)
<AppMedia name="hero" />  // ⏳ Not optimized yet

// Voice section (page.tsx line 432)
<AppMedia name="voice" />  // ⏳ Not optimized yet

// Goals section (page.tsx line 449)
<AppMedia name="goals" />  // ⏳ Not optimized yet

// Health section (page.tsx line 466)
<AppMedia name="health" />  // ⏳ Not optimized yet
```

### To Update:
Change `optimizedMedia={true}` in each FeatureSection after adding videos.

---

## Troubleshooting

### "FFmpeg not found"
```bash
# Install FFmpeg:
brew install ffmpeg
```

### "No .mov files found"
- Check file is in `public/videos/`
- Check file extension is `.mov` or `.MOV`
- Check filename follows `{name}-{theme}.mov` format

### "Output files too large"
- Increase CRF values in `scripts/compress-videos.ts`
- WebM: Change `-crf 32` to `-crf 35` (smaller)
- MP4: Change `-crf 24` to `-crf 28` (smaller)

### "Video quality is poor"
- Decrease CRF values (better quality, larger file)
- WebM: `-crf 28` or `-crf 30`
- MP4: `-crf 20` or `-crf 22`

---

## Full Example Workflow

```bash
# 1. Record your video on iPhone/Mac
# 2. Transfer to your Mac

# 3. Copy to project
cp ~/Downloads/my-video.mov public/videos/hero-light.mov

# 4. Run compression
npm run compress-videos

# 5. Verify output
ls -lh public/videos/hero-*

# Expected output:
# hero-light.mov   (source - large)
# hero-light.webm  (compressed)
# hero-light.mp4   (compressed)

# 6. Update component (if not already using OptimizedVideo)
# Edit app/page.tsx to add optimizedMedia={true}

# 7. Test locally
npm run dev
# Visit http://localhost:3001
# Scroll to hero section
# Video should play!

# 8. Commit and push
git add public/videos/hero-light.webm public/videos/hero-light.mp4
git commit -m "Add hero light theme video"
git push
```

---

## Quick Commands

```bash
# List all videos
ls -lh public/videos/

# Compress all .mov files
npm run compress-videos

# Check compressed sizes
ls -lh public/videos/*.webm public/videos/*.mp4

# Test locally
npm run dev

# Build for production
npm run build
```

---

## Summary

**To add a video:**
1. Drop `.mov` in `public/videos/` with correct name
2. Run `npm run compress-videos`
3. Done! Video is ready to use

**No manual compression needed!**
**No complex commands!**
**Just drop and run!** 🚀
