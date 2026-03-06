import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function checkTask() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY environment variable is not set');
  }

  const client = new LinearClient({ apiKey });

  const issues = await client.issues({
    filter: {
      number: { eq: 829 },
      team: { key: { eq: 'PXL' } },
    },
    first: 1,
  });

  const issue = issues.nodes[0];
  if (!issue) {
    console.log('Task PXL-829 not found');
    return;
  }

  const state = await issue.state;
  const attachments = await issue.attachments();
  const labels = await issue.labels();

  console.log('PXL-829 Details:');
  console.log('================');
  console.log(`Title: ${issue.title}`);
  console.log(`Status: ${state?.name}`);
  console.log(`Priority: ${issue.priority}`);
  console.log(`Labels: ${labels.nodes.map(l => l.name).join(', ') || 'None'}`);
  console.log(`\nDescription:`);
  console.log(issue.description || 'No description');
  console.log(`\nAttachments: ${attachments.nodes.length}`);

  if (attachments.nodes.length > 0) {
    for (const attachment of attachments.nodes) {
      console.log(`  - ${attachment.title}`);
      console.log(`    ${attachment.url}`);
    }
  }

  console.log(`\nLinear URL: ${issue.url}`);
  console.log('\nTo add a document:');
  console.log('1. Open the task in Linear (URL above)');
  console.log('2. Click the "+" or attach button');
  console.log('3. Upload or link a document');
}

checkTask().catch(console.error);
