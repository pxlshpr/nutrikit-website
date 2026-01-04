import * as dotenv from 'dotenv';
import * as path from 'path';
import { fetchTaskDetails, updateTaskDescription } from '../lib/linear-client';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function main() {
  // Fetch current descriptions for the two restored tasks
  const task730 = await fetchTaskDetails('PXL-730');
  const task831 = await fetchTaskDetails('PXL-831');

  if (!task730 || !task831) {
    console.error('Failed to fetch tasks');
    return;
  }

  console.log('Current PXL-730 description:');
  console.log(task730.description);
  console.log('\n---\n');
  console.log('Current PXL-831 description:');
  console.log(task831.description);
}

main().catch(console.error);
