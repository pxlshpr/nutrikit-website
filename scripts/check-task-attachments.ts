import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function checkTaskAttachments() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY environment variable is not set');
  }

  const client = new LinearClient({ apiKey });

  // Check a specific set of tasks from the sprints
  const taskIds = [
    'PXL-812', 'PXL-825', 'PXL-835', 'PXL-837', 'PXL-810',
    'PXL-814', 'PXL-764', 'PXL-801', 'PXL-808', 'PXL-709',
    'PXL-723', 'PXL-724', 'PXL-725', 'PXL-722', 'PXL-726',
  ];

  console.log('Checking tasks for attachments...\n');

  for (const identifier of taskIds) {
    const parts = identifier.split('-');
    const issues = await client.issues({
      filter: {
        number: { eq: parseInt(parts[1]) },
        team: { key: { eq: parts[0] } },
      },
      first: 1,
    });

    const issue = issues.nodes[0];
    if (!issue) {
      console.log(`${identifier}: Not found`);
      continue;
    }

    const attachments = await issue.attachments();
    if (attachments.nodes.length > 0) {
      console.log(`\n✅ ${identifier}: ${issue.title}`);
      console.log(`   Attachments (${attachments.nodes.length}):`);
      for (const attachment of attachments.nodes) {
        console.log(`   - ${attachment.title}`);
        console.log(`     ${attachment.url}`);
      }
    } else {
      console.log(`${identifier}: No attachments`);
    }
  }
}

checkTaskAttachments().catch(console.error);
