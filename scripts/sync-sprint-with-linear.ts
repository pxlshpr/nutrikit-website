#!/usr/bin/env tsx
import { LinearClient } from '@linear/sdk';
import { promises as fs } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const NUTRIKIT_REPO_PATH = process.env.NUTRIKIT_REPO_PATH || join(process.env.HOME!, 'Developer', 'NutriKit');
const SPRINTS_DIR = join(NUTRIKIT_REPO_PATH, '.claude', 'sprints');

if (!LINEAR_API_KEY) {
  throw new Error('LINEAR_API_KEY environment variable is not set');
}

const client = new LinearClient({ apiKey: LINEAR_API_KEY });

// Types
interface TaskStatus {
  id: string;
  identifier: string;
  status: string;
  priority: string;
  completedAt?: string;
  updatedAt: string;
}

interface SprintSyncResult {
  currentSprintUpdates: {
    tasksUpdated: number;
    statusChanges: Array<{ id: string; oldStatus: string; newStatus: string }>;
    completedCount: number;
  };
  plannedSprintsUpdates: {
    tasksVerified: number;
    tasksAdded: number;
    tasksRemoved: number;
  };
}

// Parse status to match markdown format
function parseStatusForMarkdown(linearStatus: string): string {
  const statusMap: Record<string, string> = {
    'Backlog': 'Backlog',
    'Todo': 'Todo',
    'Queue': 'Queue',
    'Prompt Ready': 'Ready',
    'Ready': 'Ready',
    'Running': 'Running',
    'Testing': 'Testing',
    'Done': 'Done',
    'Canceled': 'Canceled',
    'Cancelled': 'Canceled',
  };
  return statusMap[linearStatus] || linearStatus;
}

// Parse priority number to label
function parsePriorityLabel(priority: number): string {
  const priorityMap: Record<number, string> = {
    0: 'None',
    1: 'Urgent',
    2: 'High',
    3: 'Medium',
    4: 'Low',
  };
  return priorityMap[priority] || 'Medium';
}

// Fetch task status from Linear
async function fetchTaskStatus(taskId: string): Promise<TaskStatus | null> {
  try {
    const parts = taskId.split('-');
    if (parts.length !== 2) return null;

    const issues = await client.issues({
      filter: {
        number: { eq: parseInt(parts[1]) },
        team: { key: { eq: parts[0] } },
      },
      first: 1,
    });

    const issue = issues.nodes[0];
    if (!issue) return null;

    const state = await issue.state;
    return {
      id: issue.id,
      identifier: issue.identifier,
      status: state?.name || 'Unknown',
      priority: parsePriorityLabel(issue.priority),
      completedAt: issue.completedAt?.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error(`Failed to fetch status for ${taskId}:`, error);
    return null;
  }
}

// Extract task IDs from markdown table
function extractTaskIds(markdown: string): string[] {
  const taskIds: string[] = [];
  const lines = markdown.split('\n');
  let inTasksTable = false;

  for (const line of lines) {
    if (line.includes('## Selected Tasks')) {
      inTasksTable = true;
      continue;
    }

    if (inTasksTable && line.startsWith('|') && !line.includes('---')) {
      const match = line.match(/\|\s*(PXL-\d+)\s*\|/);
      if (match) {
        taskIds.push(match[1]);
      }
    } else if (inTasksTable && line.startsWith('##')) {
      break;
    }
  }

  return taskIds;
}

// Update task status in markdown
function updateTaskStatusInMarkdown(markdown: string, taskId: string, newStatus: string, newPriority: string): string {
  const lines = markdown.split('\n');
  let inTasksTable = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('## Selected Tasks')) {
      inTasksTable = true;
      continue;
    }

    if (inTasksTable && lines[i].startsWith('|') && lines[i].includes(taskId)) {
      const cells = lines[i].split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 4) {
        cells[2] = newStatus;
        cells[3] = newPriority;
        lines[i] = '| ' + cells.join(' | ') + ' |';
      }
      break;
    } else if (inTasksTable && lines[i].startsWith('##')) {
      break;
    }
  }

  return lines.join('\n');
}

// Update tasks completed count
function updateTasksCompletedCount(markdown: string, count: number): string {
  const lines = markdown.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('| Tasks Completed |')) {
      lines[i] = `| Tasks Completed | ${count} |`;
      break;
    }
  }

  return lines.join('\n');
}

// Update sprint status if complete
function updateSprintStatus(markdown: string, status: 'ACTIVE' | 'COMPLETED' | 'PLANNED'): string {
  const lines = markdown.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('> **Status**:')) {
      lines[i] = `> **Status**: ${status}`;
      break;
    }
  }

  return lines.join('\n');
}

// Main sync function
async function syncCurrentSprint(): Promise<SprintSyncResult['currentSprintUpdates']> {
  console.log('📥 Syncing current block with Linear...\n');

  // Read current block file
  const currentSprintPath = join(SPRINTS_DIR, 'current-sprint.md');
  let markdown = await fs.readFile(currentSprintPath, 'utf-8');

  // Extract task IDs
  const taskIds = extractTaskIds(markdown);
  console.log(`Found ${taskIds.length} tasks in current block\n`);

  // Fetch statuses from Linear
  const statusChanges: Array<{ id: string; oldStatus: string; newStatus: string }> = [];
  let completedCount = 0;
  let tasksUpdated = 0;

  for (const taskId of taskIds) {
    console.log(`Fetching status for ${taskId}...`);
    const status = await fetchTaskStatus(taskId);

    if (!status) {
      console.log(`  ⚠️  Not found in Linear\n`);
      continue;
    }

    const markdownStatus = parseStatusForMarkdown(status.status);

    // Extract current status from markdown
    const currentStatusMatch = markdown.match(new RegExp(`\\|\\s*${taskId}\\s*\\|[^|]+\\|\\s*([^|]+)\\s*\\|`));
    const currentStatus = currentStatusMatch?.[1]?.trim() || 'Unknown';

    if (currentStatus !== markdownStatus) {
      console.log(`  📝 ${currentStatus} -> ${markdownStatus}`);
      statusChanges.push({ id: taskId, oldStatus: currentStatus, newStatus: markdownStatus });
      markdown = updateTaskStatusInMarkdown(markdown, taskId, markdownStatus, status.priority);
      tasksUpdated++;
    } else {
      console.log(`  ✓ ${markdownStatus} (no change)`);
    }

    if (markdownStatus === 'Done') {
      completedCount++;
    }

    console.log('');

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Update completed count
  markdown = updateTasksCompletedCount(markdown, completedCount);

  // Update status to COMPLETED if all tasks are done or canceled
  const allTasksDone = taskIds.every(id => {
    const match = markdown.match(new RegExp(`\\|\\s*${id}\\s*\\|[^|]+\\|\\s*([^|]+)\\s*\\|`));
    const status = match?.[1]?.trim();
    return status === 'Done' || status === 'Canceled';
  });

  if (allTasksDone && taskIds.length > 0) {
    markdown = updateSprintStatus(markdown, 'COMPLETED');
    console.log('🎉 Block marked as COMPLETED\n');
  }

  // Write updated markdown
  await fs.writeFile(currentSprintPath, markdown, 'utf-8');

  return {
    tasksUpdated,
    statusChanges,
    completedCount,
  };
}

// Verify planned blocks
async function syncPlannedSprints(): Promise<SprintSyncResult['plannedSprintsUpdates']> {
  console.log('📋 Verifying planned blocks...\n');

  // For now, just verify the tasks exist in Linear
  const plannedSprintsPath = join(SPRINTS_DIR, 'planned-sprints.md');
  const markdown = await fs.readFile(plannedSprintsPath, 'utf-8');

  // Extract all task IDs from planned blocks
  const taskMatches = markdown.matchAll(/\|\s*(PXL-\d+)\s*\|/g);
  const taskIds = Array.from(taskMatches).map(m => m[1]);

  console.log(`Found ${taskIds.length} tasks in planned blocks`);
  console.log('Verifying they exist in Linear...\n');

  let verified = 0;
  for (const taskId of taskIds) {
    const status = await fetchTaskStatus(taskId);
    if (status) {
      verified++;
    } else {
      console.log(`⚠️  ${taskId} not found in Linear`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n✓ Verified ${verified}/${taskIds.length} tasks\n`);

  return {
    tasksVerified: verified,
    tasksAdded: 0,
    tasksRemoved: 0,
  };
}

// Main execution
async function main() {
  console.log('🚀 Starting block sync with Linear\n');
  console.log('=' .repeat(60));
  console.log('');

  const result: SprintSyncResult = {
    currentSprintUpdates: {
      tasksUpdated: 0,
      statusChanges: [],
      completedCount: 0,
    },
    plannedSprintsUpdates: {
      tasksVerified: 0,
      tasksAdded: 0,
      tasksRemoved: 0,
    },
  };

  try {
    // Sync current block
    result.currentSprintUpdates = await syncCurrentSprint();

    // Sync planned blocks
    result.plannedSprintsUpdates = await syncPlannedSprints();

    // Print summary
    console.log('=' .repeat(60));
    console.log('\n✅ Block Sync Complete\n');
    console.log(`Current Block:`);
    console.log(`  - ${result.currentSprintUpdates.tasksUpdated} tasks updated`);
    console.log(`  - ${result.currentSprintUpdates.completedCount} tasks completed`);

    if (result.currentSprintUpdates.statusChanges.length > 0) {
      console.log(`\n  Status Changes:`);
      for (const change of result.currentSprintUpdates.statusChanges) {
        console.log(`    ${change.id}: ${change.oldStatus} → ${change.newStatus}`);
      }
    }

    console.log(`\nPlanned Blocks:`);
    console.log(`  - ${result.plannedSprintsUpdates.tasksVerified} tasks verified`);

    console.log(`\n📅 Last sync: ${new Date().toLocaleString()}`);
    console.log('');
  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);
