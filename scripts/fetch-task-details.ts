import * as dotenv from 'dotenv';
import * as path from 'path';
import { fetchTaskDetails } from '../lib/linear-client';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const taskIds = [
  'PXL-831', 'PXL-730', 'PXL-826', 'PXL-720',
  'PXL-742', 'PXL-682', 'PXL-791', 'PXL-805'
];

async function main() {
  for (const id of taskIds) {
    const task = await fetchTaskDetails(id);
    if (task) {
      console.log(`\n=== ${id}: ${task.title} ===`);
      console.log('Description:', task.description || '(no description)');
    }
  }
}

main().catch(console.error);
