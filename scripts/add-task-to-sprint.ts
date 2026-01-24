import { Octokit } from '@octokit/rest';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function addTaskToSprint() {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }

  const octokit = new Octokit({ auth: githubToken });

  const owner = 'pxlshpr';
  const repo = 'NutriKit';
  const path = '.claude/sprints/current-sprint.md';

  console.log('Fetching current sprint file...\n');

  // Fetch the current file
  const { data: fileData } = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref: 'main',
  });

  if (!('content' in fileData)) {
    throw new Error('File content not found');
  }

  const content = Buffer.from(fileData.content, 'base64').toString('utf-8');

  console.log('Current sprint content preview:');
  console.log('='.repeat(80));
  console.log(content.substring(0, 500));
  console.log('='.repeat(80));
  console.log('\n');

  // Find the Selected Tasks table and add PXL-829
  const taskLine = '| PXL-829 | Implement automated daily Supabase backup system | Done | Medium |';

  if (content.includes('PXL-829')) {
    console.log('✅ PXL-829 is already in the current sprint');
    return;
  }

  // Find the line with the first task entry after the header
  const lines = content.split('\n');
  let insertIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('## Selected Tasks')) {
      // Find the table separator line
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].includes('---')) {
          insertIndex = j + 1;
          break;
        }
      }
      break;
    }
  }

  if (insertIndex === -1) {
    throw new Error('Could not find Selected Tasks table');
  }

  // Insert the new task
  lines.splice(insertIndex, 0, taskLine);
  const newContent = lines.join('\n');

  console.log('Adding PXL-829 to the sprint...\n');
  console.log('New task line:');
  console.log(taskLine);
  console.log('\n');

  // Update the file
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: 'Add PXL-829 to current sprint as completed task',
    content: Buffer.from(newContent).toString('base64'),
    sha: fileData.sha,
    branch: 'main',
  });

  console.log('✅ Successfully added PXL-829 to current sprint!');
  console.log('\nYou can now view the task at:');
  console.log('https://nutri-kit.vercel.app/sprint/task/PXL-829');
}

addTaskToSprint().catch(console.error);
