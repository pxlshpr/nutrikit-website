#!/usr/bin/env tsx
/**
 * Setup Linear Webhook
 *
 * This script creates a webhook in Linear that sends issue updates
 * to our API endpoint. Run this once to set up automatic syncing.
 *
 * Usage:
 *   npx tsx scripts/setup-linear-webhook.ts
 *
 * Prerequisites:
 *   - LINEAR_API_KEY set in .env.local
 *   - LINEAR_WEBHOOK_SECRET set in .env.local
 */

import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';
import * as readline from 'readline';

// Load environment variables
config({ path: '.env.local' });

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_WEBHOOK_SECRET = process.env.LINEAR_WEBHOOK_SECRET;

if (!LINEAR_API_KEY) {
  console.error('❌ LINEAR_API_KEY not found in .env.local');
  process.exit(1);
}

if (!LINEAR_WEBHOOK_SECRET) {
  console.error('❌ LINEAR_WEBHOOK_SECRET not found in .env.local');
  process.exit(1);
}

const client = new LinearClient({ apiKey: LINEAR_API_KEY });

interface Webhook {
  id: string;
  label?: string;
  url: string;
  enabled: boolean;
  resourceTypes: string[];
}

async function promptForUrl(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log('\n📍 Enter your webhook URL:');
    console.log('   - For production: https://your-domain.vercel.app/api/linear-webhook');
    console.log('   - For local dev with ngrok: https://xxxx.ngrok.io/api/linear-webhook');
    console.log('');
    rl.question('Webhook URL: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function listWebhooks(): Promise<Webhook[]> {
  const webhooks = await client.webhooks();
  return webhooks.nodes.map((w) => ({
    id: w.id,
    label: w.label || undefined,
    url: w.url,
    enabled: w.enabled,
    resourceTypes: w.resourceTypes,
  }));
}

async function createWebhook(url: string): Promise<void> {
  console.log('\n🔧 Creating webhook...');

  const webhookPayload = await client.createWebhook({
    url,
    resourceTypes: ['Issue'],
    label: 'NutriKit Sprint Sync',
    secret: LINEAR_WEBHOOK_SECRET,
    allPublicTeams: true,
  });

  if (webhookPayload.success) {
    const webhook = await webhookPayload.webhook;
    console.log('\n✅ Webhook created successfully!');
    console.log(`   ID: ${webhook?.id}`);
    console.log(`   URL: ${url}`);
    console.log(`   Resource Types: Issue`);
    console.log(`   Secret: ${LINEAR_WEBHOOK_SECRET?.substring(0, 8)}...`);
  } else {
    console.error('\n❌ Failed to create webhook');
  }
}

async function deleteWebhook(webhookId: string): Promise<void> {
  const payload = await client.deleteWebhook(webhookId);
  if (payload.success) {
    console.log(`✅ Deleted webhook ${webhookId}`);
  } else {
    console.error(`❌ Failed to delete webhook ${webhookId}`);
  }
}

async function main() {
  console.log('🚀 Linear Webhook Setup\n');
  console.log('=' .repeat(50));

  // List existing webhooks
  console.log('\n📋 Existing webhooks:');
  const existingWebhooks = await listWebhooks();

  if (existingWebhooks.length === 0) {
    console.log('   (none)');
  } else {
    for (const webhook of existingWebhooks) {
      console.log(`\n   ID: ${webhook.id}`);
      console.log(`   Label: ${webhook.label || '(no label)'}`);
      console.log(`   URL: ${webhook.url}`);
      console.log(`   Enabled: ${webhook.enabled}`);
      console.log(`   Types: ${webhook.resourceTypes.join(', ')}`);
    }
  }

  // Check if we already have a sprint sync webhook
  const existingSyncWebhook = existingWebhooks.find(
    (w) => w.label === 'NutriKit Sprint Sync' || w.url.includes('/api/linear-webhook')
  );

  if (existingSyncWebhook) {
    console.log('\n⚠️  Found existing sprint sync webhook.');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question('Replace it? (y/n): ', resolve);
    });
    rl.close();

    if (answer.toLowerCase() === 'y') {
      await deleteWebhook(existingSyncWebhook.id);
    } else {
      console.log('\n✨ Keeping existing webhook. Done!');
      return;
    }
  }

  // Get webhook URL
  const webhookUrl = await promptForUrl();

  if (!webhookUrl) {
    console.error('\n❌ No URL provided');
    process.exit(1);
  }

  // Validate URL
  try {
    new URL(webhookUrl);
  } catch {
    console.error('\n❌ Invalid URL format');
    process.exit(1);
  }

  // Create the webhook
  await createWebhook(webhookUrl);

  console.log('\n' + '=' .repeat(50));
  console.log('\n✨ Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Make sure your webhook endpoint is accessible');
  console.log('2. Add LINEAR_WEBHOOK_SECRET to your Vercel environment variables');
  console.log('3. Deploy your changes to Vercel');
  console.log('4. Test by making a change in Linear');
  console.log('');
}

main().catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
