#!/usr/bin/env tsx

import { LinearClient } from '@linear/sdk';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local file
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const TASK_IDS = [
  'PXL-862', // Complete energy balance calorie target calculations
  'PXL-865', // Track search performance data
  'PXL-826', // Voice logging quality improvements (parsing & matching)
  'PXL-860', // Switch between voice and text in same view
  'PXL-831', // Smarter food search that understands synonyms
  'PXL-737', // Copy nutrient targets between days
  'PXL-666', // Fix scanner header spacing issue
];

const LABEL_NAME = 'block-1-circe';
const LABEL_COLOR = '#A063FF';
const TARGET_STATUS = 'Done';

async function updateTasks() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY environment variable is not set');
  }

  const client = new LinearClient({ apiKey });
  const projectId = '2bfaa32e-0c8d-45b4-8191-1ae286a913ad';

  console.log('Starting Linear task updates...\n');

  // Step 1: Find or create the label
  console.log(`Step 1: Checking for label "${LABEL_NAME}"...`);

  const teams = await client.teams();
  const team = teams.nodes[0]; // Assuming first team

  if (!team) {
    throw new Error('No team found');
  }

  const labels = await team.labels();
  let targetLabel = labels.nodes.find(label => label.name === LABEL_NAME);

  if (!targetLabel) {
    console.log(`  Label "${LABEL_NAME}" not found. Creating...`);
    const labelPayload = await client.createIssueLabel({
      name: LABEL_NAME,
      color: LABEL_COLOR,
      teamId: team.id,
    });
    targetLabel = await labelPayload.issueLabel;
    if (targetLabel) {
      console.log(`  ✓ Created label "${LABEL_NAME}" with color ${LABEL_COLOR}`);
    }
  } else {
    console.log(`  ✓ Label "${LABEL_NAME}" already exists`);
  }

  if (!targetLabel) {
    throw new Error('Failed to create or find label');
  }

  // Step 2: Find the "Done" status
  console.log(`\nStep 2: Finding "${TARGET_STATUS}" status...`);
  const states = await team.states();
  const doneState = states.nodes.find(state => state.name === TARGET_STATUS);

  if (!doneState) {
    throw new Error(`Status "${TARGET_STATUS}" not found`);
  }
  console.log(`  ✓ Found "${TARGET_STATUS}" status`);

  // Step 3: Fetch all project tasks first
  console.log('\nStep 3: Fetching all project tasks...');
  const allIssues = await client.issues({
    filter: {
      project: { id: { eq: projectId } },
    },
    first: 250,
  });

  console.log(`  Found ${allIssues.nodes.length} total issues in project\n`);

  // Step 4: Update each task
  console.log('Step 4: Updating tasks...\n');
  const results = [];

  for (const taskId of TASK_IDS) {
    try {
      console.log(`  Processing ${taskId}...`);

      // Find the issue by identifier
      const issue = allIssues.nodes.find(i => i.identifier === taskId);

      if (!issue) {
        console.log(`    ✗ Issue ${taskId} not found`);
        results.push({ taskId, success: false, error: 'Not found' });
        continue;
      }

      // Get current labels
      const currentLabels = await issue.labels();
      const currentLabelIds = currentLabels.nodes.map(label => label.id);

      // Add the new label if not already present
      const hasLabel = currentLabels.nodes.some(label => label.name === LABEL_NAME);
      const updatedLabelIds = hasLabel
        ? currentLabelIds
        : [...currentLabelIds, targetLabel.id];

      // Update the issue
      await client.updateIssue(issue.id, {
        stateId: doneState.id,
        labelIds: updatedLabelIds,
      });

      console.log(`    ✓ Updated ${taskId}: ${issue.title}`);
      console.log(`      - Status: ${TARGET_STATUS}`);
      console.log(`      - Label: ${LABEL_NAME} ${hasLabel ? '(already had)' : '(added)'}`);

      results.push({
        taskId,
        success: true,
        title: issue.title,
        labelAdded: !hasLabel
      });
    } catch (error) {
      console.log(`    ✗ Failed to update ${taskId}: ${error}`);
      results.push({ taskId, success: false, error: String(error) });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\nSuccessfully updated: ${successful.length}/${TASK_IDS.length} tasks`);

  if (successful.length > 0) {
    console.log('\nSuccessful updates:');
    successful.forEach(r => {
      console.log(`  ✓ ${r.taskId}: ${r.title}`);
    });
  }

  if (failed.length > 0) {
    console.log('\nFailed updates:');
    failed.forEach(r => {
      console.log(`  ✗ ${r.taskId}: ${r.error}`);
    });
  }

  console.log('\n' + '='.repeat(80));
}

updateTasks().catch(console.error);
