import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function findBackupTasks() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY environment variable is not set');
  }

  const client = new LinearClient({ apiKey });

  console.log('Searching for tasks with "backup", "sync", "data", or recent updates...\n');

  // Search for tasks with backup/sync/data keywords
  const searchTerms = ['backup', 'sync', 'data', 'export', 'migration'];

  for (const term of searchTerms) {
    console.log(`\n=== Searching for "${term}" ===`);

    const issues = await client.issues({
      filter: {
        team: { key: { eq: 'PXL' } },
        title: { containsIgnoreCase: term },
      },
      first: 10,
    });

    for (const issue of issues.nodes) {
      const attachments = await issue.attachments();
      const state = await issue.state;

      console.log(`\n${issue.identifier}: ${issue.title}`);
      console.log(`  Status: ${state?.name}`);
      console.log(`  Attachments: ${attachments.nodes.length}`);

      if (attachments.nodes.length > 0) {
        console.log(`  ✅ HAS ATTACHMENTS:`);
        for (const attachment of attachments.nodes) {
          console.log(`     - "${attachment.title}"`);
          console.log(`       ${attachment.url}`);
        }
      }
    }
  }

  // Also check recently updated tasks
  console.log(`\n\n=== Checking 100 most recently updated tasks ===`);
  const recentIssues = await client.issues({
    filter: {
      team: { key: { eq: 'PXL' } },
    },
    first: 100,
    orderBy: 'updatedAt',
  });

  let foundCount = 0;
  for (const issue of recentIssues.nodes) {
    const attachments = await issue.attachments();

    if (attachments.nodes.length > 0) {
      foundCount++;
      const state = await issue.state;
      const labels = await issue.labels();

      console.log(`\n✅ ${issue.identifier}: ${issue.title}`);
      console.log(`   Status: ${state?.name}`);
      console.log(`   Labels: ${labels.nodes.map(l => l.name).join(', ') || 'None'}`);
      console.log(`   Created: ${issue.createdAt.toISOString().split('T')[0]}`);
      console.log(`   Attachments (${attachments.nodes.length}):`);
      for (const attachment of attachments.nodes) {
        console.log(`      - "${attachment.title}"`);
        console.log(`        ${attachment.url}`);
      }

      if (foundCount >= 5) break;
    }
  }

  if (foundCount === 0) {
    console.log('\nNo tasks found with attachments in the most recent 100 tasks.');
  }
}

findBackupTasks().catch(console.error);
