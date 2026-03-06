import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function findTasksWithAttachments() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY environment variable is not set');
  }

  const client = new LinearClient({ apiKey });

  // Fetch recent issues from the PXL team
  const issues = await client.issues({
    filter: {
      team: { key: { eq: 'PXL' } },
    },
    first: 100,
    orderBy: 'updatedAt',
  });

  console.log('Searching for tasks with attachments...\n');

  let found = 0;
  for (const issue of issues.nodes) {
    const attachments = await issue.attachments();
    const labels = await issue.labels();
    const labelNames = labels.nodes.map(l => l.name);

    // Check if task has sprint label or attachments
    const hasSprintLabel = labelNames.some(label => label.startsWith('sprint-'));

    if (attachments.nodes.length > 0) {
      found++;
      console.log(`\n${issue.identifier}: ${issue.title}`);
      console.log(`  Status: ${(await issue.state)?.name}`);
      console.log(`  Labels: ${labelNames.join(', ')}`);
      console.log(`  Sprint task: ${hasSprintLabel ? 'Yes' : 'No'}`);
      console.log(`  Attachments (${attachments.nodes.length}):`);

      for (const attachment of attachments.nodes) {
        console.log(`    - ${attachment.title}`);
        console.log(`      ${attachment.url}`);
      }

      if (found >= 5) break; // Limit to first 5 tasks with attachments
    }
  }

  if (found === 0) {
    console.log('No tasks with attachments found in recent issues.');
  } else {
    console.log(`\nFound ${found} task(s) with attachments.`);
  }
}

findTasksWithAttachments().catch(console.error);
