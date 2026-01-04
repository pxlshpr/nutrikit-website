import * as dotenv from 'dotenv';
import * as path from 'path';
import { updateTaskDescription } from '../lib/linear-client';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const tasks = [
  {
    id: 'PXL-831',
    description: `making the food search smarter so it understands different names for the same food 🔍

**Technical:** Smarter food search that understands synonyms`
  },
  {
    id: 'PXL-730',
    description: `letting you see and customize all your saved recipes 🍳

**Technical:** View and edit your recipes`
  },
  {
    id: 'PXL-826',
    description: `teaching voice logging to understand what you're saying and find the right foods automatically 🎤

**Technical:** Voice logging finds the right foods now`
  },
  {
    id: 'PXL-720',
    description: `fixing the bug where calorie numbers get cut off when they're too big 🔢

**Technical:** Fix calorie display cutting off large numbers`
  },
  {
    id: 'PXL-742',
    description: `making sure meal checkboxes stay checked/unchecked correctly when things update in the background 🔄

**Technical:** Keep meal checkboxes in sync during background updates`
  },
  {
    id: 'PXL-682',
    description: `ensuring your calorie totals match perfectly on your iphone, ipad, and mac 📊

**Technical:** Consistent calorie totals across all your devices`
  },
  {
    id: 'PXL-791',
    description: `making it so when you edit a food, the changes apply everywhere you've logged it ✏️

**Technical:** Editing a food updates it everywhere you've used it`
  },
  {
    id: 'PXL-805',
    description: `stopping the app from crashing when the "now" time indicator shows up 🕐

**Technical:** Fix crashes when the "Now" indicator is visible`
  }
];

async function main() {
  console.log('Updating Linear task descriptions...\n');

  for (const task of tasks) {
    console.log(`Updating ${task.id}...`);
    const success = await updateTaskDescription(task.id, task.description);
    if (success) {
      console.log(`✓ ${task.id} updated`);
    } else {
      console.log(`✗ ${task.id} failed`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
