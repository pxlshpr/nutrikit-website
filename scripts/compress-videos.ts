import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

/**
 * Video compression pipeline using FFmpeg
 * Generates WebM (VP9) and MP4 (H.264) versions for maximum compatibility
 */

interface VideoConfig {
  sourceFile: string;
  outputName: string;
  theme: "light" | "dark";
}

const videosDir = path.join(process.cwd(), "public", "videos");
const sourcesDir = path.join(videosDir, "sources");

// Create directories if they don't exist
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

function getFileSize(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function compressVideo(sourceFile: string): boolean {
  const baseName = path.basename(sourceFile, path.extname(sourceFile));
  // Remove "-original" suffix if present to get the proper name-theme combination
  const nameWithTheme = baseName.replace("-original", "");
  // Split on the last dash to separate name from theme
  const lastDashIndex = nameWithTheme.lastIndexOf("-");
  const name = nameWithTheme.substring(0, lastDashIndex);
  const theme = nameWithTheme.substring(lastDashIndex + 1);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Compressing: ${baseName}`);
  console.log(`Theme: ${theme}`);
  console.log(`${'='.repeat(60)}`);

  const sourceSize = getFileSize(sourceFile);
  console.log(`📁 Source size: ${formatFileSize(sourceSize)}`);

  if (sourceSize === 0) {
    console.error(`❌ Source file not found or is empty: ${sourceFile}`);
    return false;
  }

  // Check that we won't overwrite the source file
  const webmCheck = path.join(videosDir, `${nameWithTheme}.webm`);
  const mp4Check = path.join(videosDir, `${nameWithTheme}.mp4`);
  if (sourceFile === webmCheck || sourceFile === mp4Check) {
    console.error(`❌ Output would overwrite source file. Skipping.`);
    return false;
  }

  try {
    // WebM (VP9) - Primary format
    const webmOutput = path.join(videosDir, `${nameWithTheme}.webm`);
    console.log(`\n🎬 Creating WebM (VP9)...`);

    const webmCommand = [
      `ffmpeg -i "${sourceFile}"`,
      `-c:v libvpx-vp9`,
      `-crf 32`,
      `-b:v 0`,
      `-deadline good`,
      `-cpu-used 2`,
      `-row-mt 1`,
      `-tile-columns 2`,
      `-g 240`,
      `-pix_fmt yuv420p`,
      `-an`,
      `-y`,
      `"${webmOutput}"`
    ].join(" ");

    execSync(webmCommand, { stdio: "inherit" });

    const webmSize = getFileSize(webmOutput);
    const webmReduction = sourceSize > 0
      ? Math.round((1 - webmSize / sourceSize) * 100)
      : 0;
    console.log(`✅ WebM created: ${formatFileSize(webmSize)} (${webmReduction}% smaller)`);

    // MP4 (H.264) - Fallback
    const mp4Output = path.join(videosDir, `${nameWithTheme}.mp4`);
    console.log(`\n🎬 Creating MP4 (H.264)...`);

    const mp4Command = [
      `ffmpeg -i "${sourceFile}"`,
      `-c:v libx264`,
      `-preset slow`,
      `-crf 24`,
      `-profile:v main`,
      `-level 4.0`,
      `-movflags +faststart`,
      `-pix_fmt yuv420p`,
      `-an`,
      `-y`,
      `"${mp4Output}"`
    ].join(" ");

    execSync(mp4Command, { stdio: "inherit" });

    const mp4Size = getFileSize(mp4Output);
    const mp4Reduction = sourceSize > 0
      ? Math.round((1 - mp4Size / sourceSize) * 100)
      : 0;
    console.log(`✅ MP4 created: ${formatFileSize(mp4Size)} (${mp4Reduction}% smaller)`);

    // Summary
    const totalCompressed = webmSize + mp4Size;
    const totalReduction = sourceSize > 0
      ? Math.round((1 - totalCompressed / (sourceSize * 2)) * 100)
      : 0;

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Summary:`);
    console.log(`  Original:     ${formatFileSize(sourceSize)}`);
    console.log(`  WebM:         ${formatFileSize(webmSize)}`);
    console.log(`  MP4:          ${formatFileSize(mp4Size)}`);
    console.log(`  Total:        ${formatFileSize(totalCompressed)} (${totalReduction}% smaller)`);
    console.log(`${'─'.repeat(60)}`);

    return true;

  } catch (error) {
    console.error(`❌ Error compressing ${baseName}:`, error);
    return false;
  }
}

// Main execution
function main() {
  console.log("\n🎥 NutriKit Video Compression Pipeline");
  console.log(`${'='.repeat(60)}`);

  // Check if FFmpeg is installed
  try {
    execSync("ffmpeg -version", { stdio: "pipe" });
  } catch {
    console.error("❌ FFmpeg is not installed. Please install it first:");
    console.error("   Mac: brew install ffmpeg");
    console.error("   Linux: sudo apt-get install ffmpeg");
    console.error("   Windows: Download from https://ffmpeg.org/download.html");
    process.exit(1);
  }

  // Auto-discover all .mov files in the videos directory
  let sourceVideos: string[] = [];

  if (fs.existsSync(videosDir)) {
    const allFiles = fs.readdirSync(videosDir);
    sourceVideos = allFiles
      .filter(file => file.toLowerCase().endsWith('.mov'))
      .map(file => path.join(videosDir, file))
      .sort(); // Sort alphabetically for consistent processing order
  }

  if (sourceVideos.length === 0) {
    console.log(`⚠️  No .mov files found in ${videosDir}`);
    console.log(`📍 Place your source videos (e.g., scanner-light.mov) in this directory and run again.`);
    console.log(`${'='.repeat(60)}\n`);
    return;
  }

  console.log(`📹 Found ${sourceVideos.length} source video(s):`);
  sourceVideos.forEach(file => {
    console.log(`   - ${path.basename(file)}`);
  });

  let processedCount = 0;
  let skippedCount = 0;

  for (const sourceFile of sourceVideos) {
    const result = compressVideo(sourceFile);
    if (result) {
      processedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Compression complete!`);
  console.log(`   Processed: ${processedCount} video(s)`);
  if (skippedCount > 0) {
    console.log(`   Skipped:   ${skippedCount} video(s)`);
  }
  console.log(`📍 Output location: ${videosDir}`);
  console.log(`${'='.repeat(60)}\n`);
}

main();
