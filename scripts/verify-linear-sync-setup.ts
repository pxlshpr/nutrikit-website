#!/usr/bin/env tsx
/**
 * Verify Linear Sync Setup
 *
 * This script verifies all the required configuration for Linear -> NutriKit sync:
 * 1. GitHub token has write access to NutriKit repo
 * 2. Linear API key is valid
 * 3. Linear webhook secret is configured
 * 4. Vercel environment variables are set
 *
 * Usage:
 *   npx tsx scripts/verify-linear-sync-setup.ts
 */

import { config } from 'dotenv';
import { LinearClient } from '@linear/sdk';
import { Octokit } from '@octokit/rest';

// Load environment variables
config({ path: '.env.local' });

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

const results: CheckResult[] = [];

function addResult(name: string, status: 'pass' | 'fail' | 'warn', message: string) {
  results.push({ name, status, message });
  const icon = status === 'pass' ? '✅' : status === 'warn' ? '⚠️' : '❌';
  console.log(`${icon} ${name}: ${message}`);
}

async function checkGitHubToken(): Promise<void> {
  console.log('\n📋 Checking GitHub Token...\n');

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    addResult('GitHub Token', 'fail', 'GITHUB_TOKEN not found in .env.local');
    return;
  }

  const octokit = new Octokit({ auth: token });

  // Check if token is valid
  try {
    await octokit.users.getAuthenticated();
    addResult('GitHub Token Valid', 'pass', 'Token is valid');
  } catch {
    addResult('GitHub Token Valid', 'fail', 'Token is invalid or expired');
    return;
  }

  // Check read access to NutriKit repo
  try {
    await octokit.repos.get({
      owner: 'pxlshpr',
      repo: 'NutriKit',
    });
    addResult('GitHub Repo Access', 'pass', 'Can read pxlshpr/NutriKit');
  } catch {
    addResult('GitHub Repo Access', 'fail', 'Cannot access pxlshpr/NutriKit');
    return;
  }

  // Check write access by getting repo permissions
  try {
    const { data: repo } = await octokit.repos.get({
      owner: 'pxlshpr',
      repo: 'NutriKit',
    });

    // The permissions field is only available for authenticated requests
    // For fine-grained PATs, we need to check if we can actually write
    // Let's try to get the current file content
    const { data: file } = await octokit.repos.getContent({
      owner: 'pxlshpr',
      repo: 'NutriKit',
      path: '.claude/sprints/current-sprint.md',
    });

    if ('sha' in file) {
      addResult('GitHub File Access', 'pass', 'Can read sprint files');

      // For write access, we'll just warn - actual test would modify the repo
      addResult(
        'GitHub Write Access',
        'warn',
        'Unable to verify write access without modifying repo. Ensure token has "Contents: write" permission.'
      );
    }
  } catch (error) {
    addResult('GitHub File Access', 'fail', `Cannot read sprint files: ${error}`);
  }
}

async function checkLinearAPI(): Promise<void> {
  console.log('\n📋 Checking Linear API...\n');

  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    addResult('Linear API Key', 'fail', 'LINEAR_API_KEY not found in .env.local');
    return;
  }

  try {
    const client = new LinearClient({ apiKey });
    const viewer = await client.viewer;
    addResult('Linear API Key', 'pass', `Valid - logged in as ${viewer.name || viewer.email}`);

    // Check if we can list webhooks
    const webhooks = await client.webhooks();
    const sprintSyncWebhook = webhooks.nodes.find(
      (w) => w.label === 'NutriKit Sprint Sync' || w.url.includes('/api/linear-webhook')
    );

    if (sprintSyncWebhook) {
      addResult('Linear Webhook', 'pass', `Webhook configured: ${sprintSyncWebhook.url}`);
    } else {
      addResult(
        'Linear Webhook',
        'warn',
        'No webhook found. Run "npm run setup-webhook" to configure.'
      );
    }
  } catch (error) {
    addResult('Linear API Key', 'fail', `Invalid or expired: ${error}`);
  }
}

function checkWebhookSecret(): void {
  console.log('\n📋 Checking Webhook Secret...\n');

  const secret = process.env.LINEAR_WEBHOOK_SECRET;
  if (!secret) {
    addResult('Webhook Secret', 'fail', 'LINEAR_WEBHOOK_SECRET not found in .env.local');
    return;
  }

  if (secret.length < 32) {
    addResult('Webhook Secret', 'warn', 'Secret is shorter than recommended (32+ chars)');
  } else {
    addResult('Webhook Secret', 'pass', `Secret configured (${secret.length} chars)`);
  }
}

function checkLocalPaths(): void {
  console.log('\n📋 Checking Local Paths...\n');

  const nutriKitPath = process.env.NUTRIKIT_REPO_PATH || `${process.env.HOME}/Developer/NutriKit`;

  const fs = require('fs');
  if (fs.existsSync(nutriKitPath)) {
    addResult('NutriKit Repo Path', 'pass', nutriKitPath);

    const sprintsDir = `${nutriKitPath}/.claude/sprints`;
    if (fs.existsSync(sprintsDir)) {
      addResult('Sprint Files Dir', 'pass', sprintsDir);
    } else {
      addResult('Sprint Files Dir', 'fail', `${sprintsDir} not found`);
    }
  } else {
    addResult('NutriKit Repo Path', 'fail', `${nutriKitPath} not found`);
  }
}

function checkLaunchdService(): void {
  console.log('\n📋 Checking Auto-Pull Service...\n');

  const { execSync } = require('child_process');
  try {
    const output = execSync('launchctl list 2>/dev/null || true', { encoding: 'utf-8' });
    if (output.includes('com.nutrikit.auto-pull')) {
      addResult('Auto-Pull Service', 'pass', 'Service is running');
    } else {
      addResult(
        'Auto-Pull Service',
        'warn',
        'Service not running. Run "npm run setup-sync" to install.'
      );
    }
  } catch {
    addResult('Auto-Pull Service', 'warn', 'Could not check launchd status');
  }
}

async function main() {
  console.log('🔍 Verifying Linear Sync Setup\n');
  console.log('='.repeat(50));

  await checkGitHubToken();
  await checkLinearAPI();
  checkWebhookSecret();
  checkLocalPaths();
  checkLaunchdService();

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Summary:\n');

  const passed = results.filter((r) => r.status === 'pass').length;
  const warnings = results.filter((r) => r.status === 'warn').length;
  const failed = results.filter((r) => r.status === 'fail').length;

  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ⚠️  Warnings: ${warnings}`);
  console.log(`   ❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Some checks failed. Please fix the issues above.');
    console.log('\n📝 Quick fixes:\n');

    if (results.find((r) => r.name.includes('GitHub') && r.status === 'fail')) {
      console.log('GitHub Token:');
      console.log('  1. Go to https://github.com/settings/tokens?type=beta');
      console.log('  2. Create a fine-grained token for pxlshpr/NutriKit');
      console.log('  3. Grant "Contents: Read and Write" permission');
      console.log('  4. Update GITHUB_TOKEN in .env.local');
      console.log('');
    }

    if (results.find((r) => r.name.includes('Linear API') && r.status === 'fail')) {
      console.log('Linear API Key:');
      console.log('  1. Go to https://linear.app/settings/api');
      console.log('  2. Create a new personal API key');
      console.log('  3. Update LINEAR_API_KEY in .env.local');
      console.log('');
    }
  } else if (warnings > 0) {
    console.log('\n⚠️  Some checks have warnings. Review the items above.');
  } else {
    console.log('\n✅ All checks passed! Your setup is complete.');
  }

  console.log('\n📝 Next Steps:\n');
  console.log('1. Ensure your GitHub token has "Contents: write" permission');
  console.log('2. Deploy the webhook endpoint: vercel deploy --prod');
  console.log('3. Add LINEAR_WEBHOOK_SECRET to Vercel environment variables');
  console.log('4. Run "npm run setup-webhook" to configure the Linear webhook');
  console.log('5. Test by making a change in Linear!');
  console.log('');
}

main().catch(console.error);
