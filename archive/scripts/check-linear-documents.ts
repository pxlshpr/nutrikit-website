import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function checkDocuments() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY environment variable is not set');
  }

  const client = new LinearClient({ apiKey });

  console.log('Checking PXL-829 for Linear documents...\n');

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

  // Check for relations/documents
  // The Linear SDK should have a way to access related documents
  console.log('Checking available fields on issue:');
  console.log('Has documentContent:', 'documentContent' in issue);
  console.log('Has documents:', 'documents' in issue);
  console.log('Has relations:', 'relations' in issue);

  // Try to get relations
  try {
    const relations = await issue.relations();
    console.log(`\nRelations found: ${relations.nodes.length}`);

    for (const relation of relations.nodes) {
      console.log(`\nRelation type: ${relation.type}`);

      // Check if it's related to a document
      const relatedIssue = await relation.relatedIssue;
      if (relatedIssue) {
        console.log(`  Related issue: ${relatedIssue.identifier} - ${relatedIssue.title}`);
      }
    }
  } catch (e) {
    console.log('Could not fetch relations:', e);
  }

  // Try to fetch the document directly by ID
  console.log('\n\nTrying to fetch document by ID...');
  try {
    const doc = await client.document('341c924bf3a1');
    console.log('Document found!');
    console.log(`  Title: ${doc.title}`);
    console.log(`  URL: ${doc.url}`);
    console.log(`  Slug: ${doc.slug}`);
    console.log(`  Created: ${doc.createdAt}`);
    console.log(`  Updated: ${doc.updatedAt}`);

    // Check for content
    if ('content' in doc) {
      console.log(`  Has content: Yes`);
    }
  } catch (e) {
    console.log('Could not fetch document:', e);
  }

  // Check all documents in the workspace
  console.log('\n\nFetching all documents in workspace...');
  try {
    const documents = await client.documents();
    console.log(`Found ${documents.nodes.length} documents`);

    for (const doc of documents.nodes.slice(0, 5)) {
      console.log(`\n  - ${doc.title}`);
      console.log(`    ID: ${doc.id}`);
      console.log(`    URL: ${doc.url}`);
      console.log(`    Slug: ${doc.slug || 'No slug'}`);
    }
  } catch (e) {
    console.log('Could not fetch documents:', e);
  }
}

checkDocuments().catch(console.error);
