# Video Workflow Documentation

Complete guide for recording, compressing, and integrating videos into NutriKit website.

## Overview

The video optimization system includes:
- **OptimizedVideo component** - Smart video player with lazy loading, theme detection, and user opt-in
- **Compression script** - Automated FFmpeg pipeline generating WebM (VP9) and MP4 (H.264) formats
- **Persistent preferences** - localStorage tracking of user autoplay opt-in

## Recording Guidelines

### Specifications
- **Resolution**: 1080x1920 or higher (portrait for iPhone mockups)
- **Frame rate**: 24fps minimum (60fps recommended for smooth motion)
- **Duration**: Keep under 10 seconds for web (ideal: 3-6 seconds for feature demos)
- **Format**: MOV or MP4 (use your phone or screen recording)
- **Audio**: Remove before compression (web videos don't need audio)

### File Naming Convention
```
{feature-name}-{theme}-original.mov
```

Examples:
- `scanner-light-original.mov`
- `scanner-dark-original.mov`
- `hero-light-original.mov`
- `voice-dark-original.mov`

**Note:** The `-original` suffix is required - it tells the compression script which files to process.

## Compression Pipeline

### Prerequisites
FFmpeg must be installed:
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Step 1: Place Source Files
```
public/videos/
├── scanner-light-original.mov       (24MB)
├── scanner-dark-original.mov        (optional)
└── scanner-light.mp4                (existing)
```

### Step 2: Run Compression
```bash
npm run compress-videos
```

This generates:
```
public/videos/
├── scanner-light.webm               (~800KB-1.2MB)
├── scanner-light.mp4                (~1.5MB-2MB)
├── scanner-dark.webm                (if source exists)
└── scanner-dark.mp4                 (if source exists)
```

### Step 3: Verify Output
- [ ] All output files created in `/public/videos/`
- [ ] WebM size < 1.2MB (size reduction > 70%)
- [ ] MP4 size < 2MB
- [ ] Visual quality acceptable (no obvious compression artifacts)

### FFmpeg Settings Explained

#### WebM (VP9) - Primary Format
```bash
ffmpeg -i input.mov \
  -c:v libvpx-vp9        # VP9 codec (50% smaller than H.264)
  -crf 32                 # Quality (0=best, 63=worst; 32=good balance)
  -b:v 0                  # Variable bitrate (better quality)
  -deadline good          # Balanced speed/quality
  -cpu-used 2             # CPU effort (0=slowest/best, 5=fastest)
  -row-mt 1               # Multi-threaded row encoding
  -tile-columns 2         # Parallelization
  -g 240                  # Keyframe interval (10 seconds at 24fps)
  -pix_fmt yuv420p        # Chroma subsampling (web standard)
  -an                     # Remove audio
  output.webm
```

**Why VP9?**
- 50-70% smaller than H.264 at same quality
- Now supported by 95%+ of browsers
- Essential for reducing mobile bandwidth usage

#### MP4 (H.264) - Fallback
```bash
ffmpeg -i input.mov \
  -c:v libx264           # H.264 codec (compatibility)
  -preset slow           # Better quality (slower encoding)
  -crf 24                # Quality (higher = smaller file)
  -profile:v main        # Profile (compatibility)
  -level 4.0             # Level (compatibility)
  -movflags +faststart   # Progressive download (start playing before fully loaded)
  -pix_fmt yuv420p       # Chroma subsampling
  -an                    # Remove audio
  output.mp4
```

**Why MP4 fallback?**
- Fallback for Safari < 14.1 (rare but important)
- Ensures 100% browser compatibility
- Also supports Firefox, Chrome, etc.

## Integration

### Using OptimizedVideo Component

```tsx
import { OptimizedVideo } from "@/components/OptimizedVideo";

export function ScannerSection() {
  return (
    <div className="relative w-full h-screen">
      <OptimizedVideo
        name="scanner"              // Matches: scanner-light.webm, scanner-dark.mp4
        alt="NutriKit scanner demo"  // Accessibility description
        priority={false}             // Skip lazy loading if true (for hero)
        autoplay={false}             // Try to autoplay on load
      />
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | - | Video name (matches filename prefix) |
| `alt` | string | - | Accessibility description |
| `className` | string | "" | Additional Tailwind classes |
| `priority` | boolean | false | Skip lazy loading (set true for hero video) |
| `autoplay` | boolean | false | Try to autoplay on page load |

### Component Features

**Automatic:**
- ✅ Lazy loading (only loads when scrolled into view)
- ✅ Theme detection (light/dark video automatically)
- ✅ Data saver detection (skips video if enabled)
- ✅ Format negotiation (WebM → MP4 fallback)
- ✅ Persistent preferences (remembers if user clicked play)

**User Interaction:**
- ✅ Play button overlay on first load
- ✅ Click to play (or Enter/Space if focused)
- ✅ Auto-plays on subsequent visits (after opting in once)
- ✅ Respects `prefers-reduced-data` media query

**Fallbacks:**
- ✅ Poster image if video won't load
- ✅ Error state with retry button
- ✅ Loading spinner while fetching

## File Sizes & Performance

### Example: Scanner Video
```
Original source:  scanner-light-original.mov  (24.0 MB)
                                             ↓
WebM (VP9):       scanner-light.webm         (0.8 MB)  ← 96.7% reduction
MP4 (H.264):      scanner-light.mp4          (1.4 MB)  ← 94.2% reduction

Total per video:  ~2.2 MB (for both formats)
Typical per user: ~0.8 MB WebM (90% of users) + ~1.4 MB MP4 (10% of users) ≈ 0.95 MB average
```

### Bandwidth Savings
- Original: 4.4 MB MP4 only
- Optimized: ~0.95 MB average per user (78% reduction!)
- Lazy loading: Only loads when scrolled to
- Theme optimization: Only one theme video loads

## Adding a New Video

### 1. Record and Save
```
1. Record video on iPhone or screen recorder
2. Save as MOV format
3. Place in: public/videos/scanner-light-original.mov
```

### 2. Compress
```bash
npm run compress-videos
```

### 3. Verify
```bash
ls -lh public/videos/scanner-*
# Expected output:
# -rw-r--r--  0.8M scanner-light.webm
# -rw-r--r--  1.4M scanner-light.mp4
```

### 4. Integrate
```tsx
// In your component:
<OptimizedVideo
  name="scanner"
  alt="Scanner feature demo"
/>
```

### 5. Test
- [ ] Light mode: see light video
- [ ] Dark mode: see dark video
- [ ] Mobile: smooth playback
- [ ] 4G throttle: video loads progressively
- [ ] Data saver on: play button only

## Troubleshooting

### Video doesn't load
**Check:**
- [ ] File exists at `/public/videos/{name}-{theme}.webm` and `.mp4`
- [ ] File names match exactly (including theme)
- [ ] Browser DevTools > Network tab shows requests
- [ ] MIME types configured (should be automatic)

**Solution:**
```bash
# Verify files exist
ls -lh public/videos/scanner-*

# Rebuild and restart dev server
npm run build
npm run dev
```

### Audio appears in video
**Solution:**
The compression script removes audio automatically (`-an` flag). If audio appears:
1. Edit the source file to remove audio before compression
2. Re-run `npm run compress-videos`

### Compression takes forever
**Cause:** WebM encoding is computationally expensive

**Solution:**
- Reduce `-cpu-used` (default 2, range 0-5) → faster but lower quality
- Increase `-crf` (default 32, range 0-63) → smaller but lower quality
- Or just wait—VP9 is worth it!

### File size larger than expected
**Cause:** CRF values might be too low (higher quality)

**Solution:**
Adjust in `scripts/compress-videos.ts`:
```typescript
// WebM: increase CRF (default 32)
-crf 35          // Smaller, slightly lower quality

// MP4: increase CRF (default 24)
-crf 28          // Smaller, slightly lower quality
```

### Safari shows black screen
**Cause:** WebM not supported, MP4 fallback failed

**Check:**
- [ ] MP4 file exists and plays locally
- [ ] Browser cache cleared
- [ ] Try different Safari version

**Debug:**
```javascript
// In browser console:
const video = document.querySelector('video');
video.load();
video.play().catch(e => console.log('Play error:', e));
```

## Quality Verification

### Visual Quality Checklist
- [ ] No visible compression artifacts (blocky edges)
- [ ] Smooth motion (not jerky or stuttering)
- [ ] Colors accurate (not washed out or over-saturated)
- [ ] Text readable (if any text overlays)

### Browser Testing
- [ ] Chrome/Edge: ✓ WebM loads
- [ ] Firefox: ✓ WebM loads
- [ ] Safari 14.1+: ✓ WebM OR MP4 fallback
- [ ] Safari <14: ✓ MP4 loads
- [ ] Mobile Chrome: ✓ Plays inline
- [ ] Mobile Safari: ✓ Plays inline

### Network Testing
- [ ] 4G (25 Mbps): Smooth playback
- [ ] 3G (5 Mbps): Progressive loading, no stutter
- [ ] Slow 3G (400 kbps): Might buffer, but loads

## Future Optimization: Poster Images

Consider optimizing poster images (PNG → WebP) in future iteration:
```typescript
// In compress-videos.ts, after video compression:
const posterFormats = [
  { input: 'scanner-light.png', output: 'scanner-light.webp' },
  { input: 'scanner-dark.png', output: 'scanner-dark.webp' }
];
```

## Batch Processing: All 10 Videos

Once you have all source videos ready:

```bash
# Record all videos first, naming them:
# hero-light-original.mov
# hero-dark-original.mov
# scanner-light-original.mov (already have)
# scanner-dark-original.mov
# voice-light-original.mov
# voice-dark-original.mov
# goals-light-original.mov
# goals-dark-original.mov
# health-light-original.mov
# health-dark-original.mov

# Then run once:
npm run compress-videos

# This processes all 10 videos automatically!
```

## Notes

- **Keep originals:** Never delete `*-original.mov` files (they're your source)
- **Git ignore:** Add `*.webm` and `*.mp4` to `.gitignore` if using large videos
- **Versioning:** If you re-record a video, run compression again—it overwrites with same filename
- **A/B testing:** If you want to test different compression settings, keep the original and regenerate
- **Attribution:** Compression script credits FFmpeg for making this possible

## Support

For questions or issues:
1. Check the Troubleshooting section above
2. Review FFmpeg documentation: https://ffmpeg.org/documentation.html
3. Test video locally first before pushing to production
