import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function findAnyTaskWithDocs() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY environment variable is not set');
  }

  const client = new LinearClient({ apiKey });

  console.log('Searching for ANY task with attachments in the workspace...\n');

  // Search through all issues
  let found = 0;
  let checked = 0;

  // Fetch more recent tasks
  const issues = await client.issues({
    first: 50,
    orderBy: 'createdAt',
  });

  console.log(`Found ${issues.nodes.length} total issues. Checking for attachments...\n`);

  for (const issue of issues.nodes) {
    checked++;
    const attachments = await issue.attachments();

    if (attachments.nodes.length > 0) {
      found++;
      const state = await issue.state;
      const labels = await issue.labels();

      console.log(`\n✅ ${issue.identifier}: ${issue.title}`);
      console.log(`   Status: ${state?.name || 'Unknown'}`);
      console.log(`   Labels: ${labels.nodes.map(l => l.name).join(', ') || 'None'}`);
      console.log(`   Attachments (${attachments.nodes.length}):`);
      for (const attachment of attachments.nodes) {
        console.log(`   - "${attachment.title}"`);
        console.log(`     ${attachment.url}`);
      }

      if (found >= 3) {
        console.log(`\n... Found ${found} tasks with attachments. Stopping search.`);
        break;
      }
    }

    if (checked % 10 === 0) {
      console.log(`Checked ${checked} tasks so far...`);
    }
  }

  if (found === 0) {
    console.log(`\nNo tasks with attachments found in the ${checked} most recent tasks.`);
    console.log('You may need to manually attach a document to a Linear task for testing.');
  } else {
    console.log(`\n\nTotal found: ${found} task(s) with attachments`);
  }
}

findAnyTaskWithDocs().catch(console.error);
