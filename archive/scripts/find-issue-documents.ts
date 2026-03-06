import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function findIssueDocuments() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY environment variable is not set');
  }

  const client = new LinearClient({ apiKey });

  console.log('Finding documents linked to PXL-829...\n');

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

  console.log(`Task: ${issue.identifier} - ${issue.title}\n`);

  // Try different ways to get documents
  console.log('Method 1: Check if issue has documents() method');
  try {
    // @ts-ignore - trying to call documents
    if (typeof issue.documents === 'function') {
      const docs = await issue.documents();
      console.log(`  Found ${docs.nodes.length} documents`);
      for (const doc of docs.nodes) {
        console.log(`  - ${doc.title}`);
        console.log(`    ${doc.url}`);
      }
    } else {
      console.log('  documents is not a function');
    }
  } catch (e: any) {
    console.log(`  Error: ${e.message}`);
  }

  // Method 2: Parse the description for Linear document links
  console.log('\nMethod 2: Parse description for document links');
  const description = issue.description || '';
  const documentLinkPattern = /https:\/\/linear\.app\/[^\/]+\/document\/[^-]+-([a-f0-9]+)/g;
  const matches = [...description.matchAll(documentLinkPattern)];

  console.log(`  Found ${matches.length} document links in description`);

  for (const match of matches) {
    const fullUrl = match[0];
    const docId = match[1];

    console.log(`\n  Found document link: ${fullUrl}`);
    console.log(`  Document ID: ${docId}`);

    // Try to fetch the document
    try {
      const doc = await client.document(docId);
      console.log(`  ✅ Document fetched successfully!`);
      console.log(`     Title: ${doc.title}`);
      console.log(`     URL: ${doc.url}`);
      console.log(`     Created: ${doc.createdAt.toISOString().split('T')[0]}`);
      console.log(`     Updated: ${doc.updatedAt.toISOString().split('T')[0]}`);
    } catch (e: any) {
      console.log(`  ❌ Could not fetch document: ${e.message}`);
    }
  }

  // Method 3: Check all workspace documents for mentions of this issue
  console.log('\nMethod 3: Search documents for references to this issue');
  try {
    const allDocs = await client.documents({ first: 50 });

    for (const doc of allDocs.nodes) {
      // Check if document content mentions this issue
      const content = doc.content || '';
      const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

      if (contentStr.includes(issue.identifier) || contentStr.includes(issue.id)) {
        console.log(`  ✅ Found reference in: ${doc.title}`);
        console.log(`     ${doc.url}`);
      }
    }
  } catch (e: any) {
    console.log(`  Error: ${e.message}`);
  }
}

findIssueDocuments().catch(console.error);
