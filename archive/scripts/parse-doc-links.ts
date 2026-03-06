import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function parseDocLinks() {
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
    console.log('Task not found');
    return;
  }

  const description = issue.description || '';

  console.log('Full description:');
  console.log('=================');
  console.log(description);
  console.log('\n=================\n');

  // Try different regex patterns
  const patterns = [
    /https:\/\/linear\.app\/[^\/]+\/document\/[^)\s]+/g,
    /\[([^\]]+)\]\((https:\/\/linear\.app\/[^\/]+\/document\/[^)]+)\)/g,
  ];

  for (let i = 0; i < patterns.length; i++) {
    console.log(`\nPattern ${i + 1} matches:`);
    const matches = [...description.matchAll(patterns[i])];
    console.log(`Found ${matches.length} matches`);

    for (const match of matches) {
      console.log(`  Full match: ${match[0]}`);
      if (match[1]) console.log(`  Link text: ${match[1]}`);
      if (match[2]) console.log(`  URL: ${match[2]}`);
    }
  }
}

parseDocLinks().catch(console.error);
