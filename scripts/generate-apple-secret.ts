/**
 * Generate Apple Sign In Client Secret
 *
 * Usage:
 *   npx tsx scripts/generate-apple-secret.ts
 *
 * Before running, set these environment variables or edit the values below:
 *   - APPLE_TEAM_ID: Your Apple Developer Team ID
 *   - APPLE_KEY_ID: The Key ID from the key you created
 *   - APPLE_CLIENT_ID: Your Services ID (e.g., "app.getnutrikit.web")
 *   - APPLE_PRIVATE_KEY_PATH: Path to your .p8 file
 */

import * as fs from 'fs';
import * as crypto from 'crypto';

// Configuration - fill these in or use environment variables
const TEAM_ID = process.env.APPLE_TEAM_ID || 'YOUR_TEAM_ID';
const KEY_ID = process.env.APPLE_KEY_ID || 'YOUR_KEY_ID';
const CLIENT_ID = process.env.APPLE_CLIENT_ID || 'app.getnutrikit.web';
const PRIVATE_KEY_PATH = process.env.APPLE_PRIVATE_KEY_PATH || './AuthKey_XXXXXXXX.p8';

// JWT valid for 6 months (maximum allowed by Apple)
const EXPIRY_MONTHS = 6;

function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateAppleClientSecret(): string {
  // Read the private key
  let privateKey: string;
  try {
    privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
  } catch (error) {
    console.error(`\nError: Could not read private key file at: ${PRIVATE_KEY_PATH}`);
    console.error('\nMake sure you have:');
    console.error('1. Downloaded the .p8 file from Apple Developer Portal');
    console.error('2. Set APPLE_PRIVATE_KEY_PATH to the correct path');
    console.error('\nExample: APPLE_PRIVATE_KEY_PATH=./AuthKey_ABC123.p8 npx tsx scripts/generate-apple-secret.ts');
    process.exit(1);
  }

  const now = Math.floor(Date.now() / 1000);
  const expiry = now + (EXPIRY_MONTHS * 30 * 24 * 60 * 60); // ~6 months

  // JWT Header
  const header = {
    alg: 'ES256',
    kid: KEY_ID,
    typ: 'JWT'
  };

  // JWT Payload
  const payload = {
    iss: TEAM_ID,
    iat: now,
    exp: expiry,
    aud: 'https://appleid.apple.com',
    sub: CLIENT_ID
  };

  // Encode header and payload
  const headerEncoded = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const payloadEncoded = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const signatureInput = `${headerEncoded}.${payloadEncoded}`;

  // Sign with ES256 (ECDSA using P-256 and SHA-256)
  const sign = crypto.createSign('SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(privateKey);

  // Convert DER signature to raw format (r || s)
  // DER format: 0x30 [total-length] 0x02 [r-length] [r] 0x02 [s-length] [s]
  const derToRaw = (derSig: Buffer): Buffer => {
    let offset = 2; // Skip 0x30 and length byte

    // Read r
    if (derSig[offset] !== 0x02) throw new Error('Invalid DER signature');
    offset++;
    const rLength = derSig[offset];
    offset++;
    let r = derSig.slice(offset, offset + rLength);
    offset += rLength;

    // Read s
    if (derSig[offset] !== 0x02) throw new Error('Invalid DER signature');
    offset++;
    const sLength = derSig[offset];
    offset++;
    let s = derSig.slice(offset, offset + sLength);

    // Remove leading zeros and pad to 32 bytes
    if (r.length > 32) r = r.slice(r.length - 32);
    if (s.length > 32) s = s.slice(s.length - 32);

    const rawSig = Buffer.alloc(64);
    r.copy(rawSig, 32 - r.length);
    s.copy(rawSig, 64 - s.length);

    return rawSig;
  };

  const rawSignature = derToRaw(signature);
  const signatureEncoded = base64UrlEncode(rawSignature);

  return `${signatureInput}.${signatureEncoded}`;
}

// Main
console.log('\n🍎 Apple Sign In Client Secret Generator\n');
console.log('Configuration:');
console.log(`  Team ID:     ${TEAM_ID}`);
console.log(`  Key ID:      ${KEY_ID}`);
console.log(`  Client ID:   ${CLIENT_ID}`);
console.log(`  Key Path:    ${PRIVATE_KEY_PATH}`);
console.log(`  Valid for:   ${EXPIRY_MONTHS} months`);

if (TEAM_ID === 'YOUR_TEAM_ID' || KEY_ID === 'YOUR_KEY_ID') {
  console.error('\n❌ Error: Please set your APPLE_TEAM_ID and APPLE_KEY_ID');
  console.error('\nExample usage:');
  console.error('  APPLE_TEAM_ID=ABC123 APPLE_KEY_ID=XYZ789 APPLE_PRIVATE_KEY_PATH=./AuthKey.p8 npx tsx scripts/generate-apple-secret.ts');
  process.exit(1);
}

try {
  const clientSecret = generateAppleClientSecret();

  console.log('\n✅ Client Secret Generated Successfully!\n');
  console.log('Add this to your .env.local:\n');
  console.log('─'.repeat(60));
  console.log(`APPLE_CLIENT_SECRET="${clientSecret}"`);
  console.log('─'.repeat(60));

  const expiryDate = new Date(Date.now() + EXPIRY_MONTHS * 30 * 24 * 60 * 60 * 1000);
  console.log(`\n⚠️  This secret expires on: ${expiryDate.toLocaleDateString()}`);
  console.log('   You will need to regenerate it before then.\n');
} catch (error) {
  console.error('\n❌ Error generating client secret:', error);
  process.exit(1);
}
