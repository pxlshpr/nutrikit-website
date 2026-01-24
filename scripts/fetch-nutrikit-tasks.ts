#!/usr/bin/env tsx
import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  throw new Error('LINEAR_API_KEY environment variable is not set');
}

const client = new LinearClient({ apiKey: LINEAR_API_KEY });

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

// Fetch specific task details
async function fetchTaskDetails(taskId: string) {
  try {
    const parts = taskId.split('-');
    if (parts.length !== 2) {
      console.error(`Invalid task ID format: ${taskId}`);
      return null;
    }

    const issues = await client.issues({
      filter: {
        number: { eq: parseInt(parts[1]) },
        team: { key: { eq: parts[0] } },
      },
      first: 1,
    });

    const issue = issues.nodes[0];
    if (!issue) {
      console.error(`Task ${taskId} not found`);
      return null;
    }

    const state = await issue.state;
    const labels = await issue.labels();

    return {
      identifier: issue.identifier,
      title: issue.title,
      description: issue.description || '',
      status: state?.name || 'Unknown',
      priority: issue.priority,
      priorityLabel: parsePriorityLabel(issue.priority),
      labels: labels.nodes.map(l => l.name),
      createdAt: issue.createdAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
      url: issue.url,
    };
  } catch (error) {
    console.error(`Failed to fetch ${taskId}:`, error);
    return null;
  }
}

// Fetch all NutriKit tasks
async function fetchAllNutriKitTasks() {
  try {
    console.log('Fetching all NutriKit tasks from Linear...\n');

    // Fetch all issues for the PXL team
    const allIssues = await client.issues({
      filter: {
        team: { key: { eq: 'PXL' } },
      },
      first: 250, // Adjust if you have more tasks
    });

    const tasksByStatus: Record<string, any[]> = {
      'Done': [],
      'Testing': [],
      'Running': [],
      'Prompt Ready': [],
      'Queue': [],
      'Todo': [],
      'Backlog': [],
    };

    console.log(`Found ${allIssues.nodes.length} total tasks\n`);

    for (const issue of allIssues.nodes) {
      const state = await issue.state;
      const status = state?.name || 'Unknown';

      const taskInfo = {
        identifier: issue.identifier,
        title: issue.title,
        status,
        priority: issue.priority,
        priorityLabel: parsePriorityLabel(issue.priority),
        updatedAt: issue.updatedAt.toISOString(),
        url: issue.url,
      };

      if (tasksByStatus[status]) {
        tasksByStatus[status].push(taskInfo);
      } else {
        if (!tasksByStatus['Other']) {
          tasksByStatus['Other'] = [];
        }
        tasksByStatus['Other'].push(taskInfo);
      }
    }

    // Sort tasks within each status by priority (1=Urgent first, then by number)
    for (const status in tasksByStatus) {
      tasksByStatus[status].sort((a, b) => {
        // First by priority (1=Urgent, 2=High, 3=Medium, 4=Low, 0=None)
        if (a.priority !== b.priority) {
          // Special handling: 0 (None) goes last
          if (a.priority === 0) return 1;
          if (b.priority === 0) return -1;
          return a.priority - b.priority;
        }
        // Then by task number (ascending)
        const aNum = parseInt(a.identifier.split('-')[1]);
        const bNum = parseInt(b.identifier.split('-')[1]);
        return aNum - bNum;
      });
    }

    return tasksByStatus;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length > 0 && args[0] !== '--all') {
    // Fetch specific tasks
    console.log('🔍 Fetching task details...\n');
    console.log('='.repeat(80));
    console.log('');

    for (const taskId of args) {
      const details = await fetchTaskDetails(taskId);
      if (details) {
        console.log(`\n📋 ${details.identifier}: ${details.title}`);
        console.log('─'.repeat(80));
        console.log(`Status: ${details.status}`);
        console.log(`Priority: ${details.priorityLabel} (${details.priority})`);
        console.log(`Labels: ${details.labels.join(', ') || 'None'}`);
        console.log(`URL: ${details.url}`);
        console.log(`\nDescription:`);
        console.log(details.description || '(No description)');
        console.log('');
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  } else {
    // Fetch all tasks and show distribution
    const tasksByStatus = await fetchAllNutriKitTasks();

    console.log('='.repeat(80));
    console.log('\n📊 NUTRIKIT TASK STATUS DISTRIBUTION\n');
    console.log('='.repeat(80));
    console.log('');

    const statuses = ['Done', 'Testing', 'Running', 'Prompt Ready', 'Queue', 'Todo', 'Backlog'];

    for (const status of statuses) {
      const tasks = tasksByStatus[status] || [];
      console.log(`\n${status.toUpperCase()} (${tasks.length} tasks)`);
      console.log('─'.repeat(80));

      if (tasks.length > 0) {
        for (const task of tasks) {
          console.log(`  ${task.identifier} - ${task.priorityLabel.padEnd(8)} - ${task.title}`);
        }
      } else {
        console.log('  (No tasks)');
      }
    }

    // Show other statuses if any
    if (tasksByStatus['Other'] && tasksByStatus['Other'].length > 0) {
      console.log(`\n\nOTHER STATUSES (${tasksByStatus['Other'].length} tasks)`);
      console.log('─'.repeat(80));
      for (const task of tasksByStatus['Other']) {
        console.log(`  ${task.identifier} - ${task.status.padEnd(15)} - ${task.priorityLabel.padEnd(8)} - ${task.title}`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('\n📈 SUMMARY\n');
    let total = 0;
    for (const status of statuses) {
      const count = (tasksByStatus[status] || []).length;
      total += count;
      console.log(`  ${status.padEnd(20)}: ${count}`);
    }
    if (tasksByStatus['Other']) {
      total += tasksByStatus['Other'].length;
      console.log(`  Other statuses       : ${tasksByStatus['Other'].length}`);
    }
    console.log(`\n  TOTAL                : ${total}`);
    console.log('');
  }
}

main().catch(console.error);
