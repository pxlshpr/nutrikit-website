import { LinearClient } from '@linear/sdk';
import fs from 'fs';

interface Task {
  identifier: string;
  title: string;
  status: string;
  priority: number;
  priorityLabel: string;
  url: string;
}

const priorityLabels: Record<number, string> = {
  0: 'No priority',
  1: 'Urgent',
  2: 'High',
  3: 'Medium',
  4: 'Low',
};

async function fetchNutriKitTasks() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY environment variable is not set');
  }

  const client = new LinearClient({ apiKey });
  const projectId = '2bfaa32e-0c8d-45b4-8191-1ae286a913ad';

  console.log('Fetching NutriKit tasks from Linear...\n');

  // Fetch all tasks for the NutriKit project
  const issues = await client.issues({
    filter: {
      project: {
        id: { eq: projectId },
      },
    },
    first: 250,
  });

  const tasks: Task[] = [];

  for (const issue of issues.nodes) {
    const state = await issue.state;
    tasks.push({
      identifier: issue.identifier,
      title: issue.title,
      status: state?.name || 'Unknown',
      priority: issue.priority,
      priorityLabel: priorityLabels[issue.priority] || 'Medium',
      url: issue.url,
    });
  }

  // Group by status
  const testing = tasks.filter(t => t.status === 'Testing');
  const promptReady = tasks.filter(t => t.status === 'Prompt Ready');
  const queue = tasks.filter(t => t.status === 'Queue');
  const todo = tasks.filter(t => t.status === 'Todo');
  const backlog = tasks.filter(t => t.status === 'Backlog');
  const running = tasks.filter(t => t.status === 'Running');
  const done = tasks.filter(t => t.status === 'Done');
  const canceled = tasks.filter(t => t.status === 'Canceled');

  // Sort by priority
  const sortByPriority = (a: Task, b: Task) => a.priority - b.priority;

  // Print results
  console.log('================================================================================');
  console.log('NUTRIKIT TASKS BY STATUS');
  console.log('================================================================================');
  console.log();

  console.log('TESTING STATUS (Ready to move to Block 1):');
  console.log('--------------------------------------------------------------------------------');
  if (testing.length === 0) {
    console.log('  No tasks in Testing');
  } else {
    testing.sort(sortByPriority).forEach(t => {
      console.log(`  ${t.identifier} | ${t.priorityLabel.padEnd(10)} | ${t.title}`);
    });
  }
  console.log();

  console.log('RUNNING STATUS (Currently active):');
  console.log('--------------------------------------------------------------------------------');
  if (running.length === 0) {
    console.log('  No tasks in Running');
  } else {
    running.sort(sortByPriority).forEach(t => {
      console.log(`  ${t.identifier} | ${t.priorityLabel.padEnd(10)} | ${t.title}`);
    });
  }
  console.log();

  console.log('READY FOR WORK (Prompt Ready, Queue, Todo, Backlog):');
  console.log('--------------------------------------------------------------------------------');

  const readyTasks = [...promptReady, ...queue, ...todo, ...backlog].sort(sortByPriority);

  if (readyTasks.length === 0) {
    console.log('  No tasks ready for work');
  } else {
    const byPriority = {
      'Urgent': readyTasks.filter(t => t.priority === 1),
      'High': readyTasks.filter(t => t.priority === 2),
      'Medium': readyTasks.filter(t => t.priority === 3),
      'Low': readyTasks.filter(t => t.priority === 4),
    };

    for (const [priority, taskList] of Object.entries(byPriority)) {
      if (taskList.length > 0) {
        console.log(`\n  ${priority} Priority (${taskList.length} tasks):`);
        taskList.forEach(t => {
          console.log(`    ${t.identifier} | ${t.status.padEnd(12)} | ${t.title}`);
        });
      }
    }
  }
  console.log();

  console.log('================================================================================');
  console.log('SUMMARY:');
  console.log('--------------------------------------------------------------------------------');
  console.log(`  Testing:      ${testing.length.toString().padStart(3)} tasks`);
  console.log(`  Running:      ${running.length.toString().padStart(3)} tasks`);
  console.log(`  Prompt Ready: ${promptReady.length.toString().padStart(3)} tasks`);
  console.log(`  Queue:        ${queue.length.toString().padStart(3)} tasks`);
  console.log(`  Todo:         ${todo.length.toString().padStart(3)} tasks`);
  console.log(`  Backlog:      ${backlog.length.toString().padStart(3)} tasks`);
  console.log(`  Done:         ${done.length.toString().padStart(3)} tasks`);
  console.log(`  Canceled:     ${canceled.length.toString().padStart(3)} tasks`);
  console.log(`  ------------------------------`);
  console.log(`  Total:        ${tasks.length.toString().padStart(3)} tasks`);
  console.log('================================================================================');
  console.log();

  // Export JSON
  const output = {
    testing: testing.sort(sortByPriority),
    running: running.sort(sortByPriority),
    ready: {
      promptReady: promptReady.sort(sortByPriority),
      queue: queue.sort(sortByPriority),
      todo: todo.sort(sortByPriority),
      backlog: backlog.sort(sortByPriority),
    },
    summary: {
      testing: testing.length,
      running: running.length,
      promptReady: promptReady.length,
      queue: queue.length,
      todo: todo.length,
      backlog: backlog.length,
      done: done.length,
      canceled: canceled.length,
      total: tasks.length,
    },
  };

  const outputPath = '/Users/pxlshpr/Developer/NutriKit/linear-tasks.json';
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Task data exported to: ${outputPath}`);
}

fetchNutriKitTasks().catch(console.error);
