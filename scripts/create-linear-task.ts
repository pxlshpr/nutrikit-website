import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function createTask() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY environment variable is not set');
  }

  const client = new LinearClient({ apiKey });

  // Get the PXL team
  const teams = await client.teams({
    filter: { key: { eq: 'PXL' } },
  });

  const team = teams.nodes[0];
  if (!team) {
    throw new Error('PXL team not found');
  }

  console.log('Creating Linear task...\n');

  const title = '📄 Create Linear document viewer and sync agent for website';

  const description = `## Summary

Build a comprehensive Linear-to-Website sync system that automatically pulls Linear documents and renders them natively on the website, eliminating the need to redirect users to Linear.

## Features to Implement

### 1. Document Viewer Page (\`/sprint/document/[id]\`)
- Create a new page that renders Linear document contents within the website
- Support markdown rendering (documents are stored as markdown in Linear)
- Match the existing task detail page styling
- Include metadata: title, created date, updated date
- Add breadcrumb navigation back to the task
- Link task detail pages to this viewer instead of Linear URLs

### 2. Linear Sync Agent
- Build an agent/CLI tool that syncs Linear content to the website
- Pull all documents referenced in task descriptions
- Store document content locally or in a database
- Support incremental updates (only sync changed documents)
- Handle authentication with Linear API
- Log sync operations and errors

### 3. Document Storage Strategy
Options to consider:
- **Option A**: Store in Git alongside sprint files
- **Option B**: Use Vercel KV or database
- **Option C**: Fetch on-demand with caching

### 4. Automation
- Run sync agent on deploy/build time
- Option to manually trigger sync via CLI
- Consider webhook integration for real-time updates

## Benefits

- ✅ Keep users on the website (better UX)
- ✅ Consistent styling and navigation
- ✅ Faster page loads (no external redirects)
- ✅ Offline-capable documentation
- ✅ SEO benefits (content indexed on our domain)
- ✅ Full control over document presentation

## Technical Considerations

- Linear documents are stored as Markdown with ProseMirror JSON
- Need to handle document versioning/updates
- Consider rate limiting for Linear API
- Ensure proper error handling for missing documents
- Add loading states and error pages

## Related Tasks

This builds on the existing Linear integration work (PXL-838, document parsing in task details).`;

  const issuePayload = await client.createIssue({
    teamId: team.id,
    title,
    description,
    priority: 2, // High
  });

  const issue = await issuePayload.issue;
  if (!issue) {
    throw new Error('Failed to create issue');
  }

  console.log('✅ Task created successfully!\n');
  console.log(`ID: ${issue.identifier}`);
  console.log(`Title: ${title}`);
  console.log(`URL: ${issue.url}`);
  console.log(`\nYou can view it at: ${issue.url}`);
}

createTask().catch(console.error);
