import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  throw new Error('LINEAR_API_KEY environment variable is not set');
}

const client = new LinearClient({ apiKey: LINEAR_API_KEY });

// Task mappings: taskId -> { emoji, laymanTitle, preamble }
const taskUpdates: Record<string, { emoji: string; laymanTitle: string; preamble: string }> = {
  // Sprint 48 - Already partially done, complete the rest
  'PXL-812': {
    emoji: '⏱️',
    laymanTitle: 'Fix the 30-second wait when using voice',
    preamble: 'When you log food by voice, there\'s an annoying 30-second delay. This fixes that so voice logging feels instant.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-825': {
    emoji: '🧠',
    laymanTitle: 'Smarter understanding of how you describe foods',
    preamble: 'Makes the app better at understanding what you mean when you say things like "a big apple" or "half a cup of rice".\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-835': {
    emoji: '🎯',
    laymanTitle: 'Show your frequently-used foods first',
    preamble: 'When searching for foods, the app will now show foods you\'ve logged before at the top of the list.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-837': {
    emoji: '🔧',
    laymanTitle: 'Better food matching and fewer brand duplicates',
    preamble: 'Fixes issues where the app picks the wrong version of a food or shows too many branded options.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-810': {
    emoji: '🎙️',
    laymanTitle: 'Complete voice logging feature',
    preamble: 'Finishes building the voice logging feature so you can log meals hands-free.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-814': {
    emoji: '⚖️',
    laymanTitle: 'Fix unit conversions for database foods',
    preamble: 'Corrects how the app converts between units (cups, grams, etc.) for foods from Open Food Facts and USDA.\n\n---\n\nTechnical details:\n\n'
  },

  // Sprint 49 - Sync & Data Consistency
  'PXL-764': {
    emoji: '💾',
    laymanTitle: 'Automatic backups of your data',
    preamble: 'Your food logs and data will be automatically backed up so you never lose your information.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-801': {
    emoji: '🔄',
    laymanTitle: 'Fix sync conflicts when multiple devices update',
    preamble: 'Prevents data conflicts when you\'re updating meals on multiple devices at the same time.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-808': {
    emoji: '📱',
    laymanTitle: 'Track sessions on device with cloud sync',
    preamble: 'Logs your app usage sessions locally on your device and syncs them to the cloud.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-709': {
    emoji: '📤',
    laymanTitle: 'Export and migrate your data',
    preamble: 'Gives you the ability to export all your data and migrate it if needed.\n\n---\n\nTechnical details:\n\n'
  },

  // Sprint 50 - Targets & Health Integration
  'PXL-723': {
    emoji: '🎯',
    laymanTitle: 'Auto-adjust targets using Apple Health',
    preamble: 'Your calorie and nutrient targets will automatically update based on your Apple Health activity data.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-724': {
    emoji: '🏃',
    laymanTitle: 'Import workouts from Apple Health',
    preamble: 'Automatically pulls in your workout and activity data from Apple Health to adjust your targets.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-725': {
    emoji: '🪄',
    laymanTitle: 'Fix setup wizard form issues',
    preamble: 'Fixes bugs in the setup wizard where your inputs weren\'t being saved correctly.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-722': {
    emoji: '🏷️',
    laymanTitle: 'Fix duplicate short names for foods',
    preamble: 'Ensures each food gets a unique short name so they\'re easier to tell apart.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-726': {
    emoji: '↕️',
    laymanTitle: 'Sort your meal items how you want',
    preamble: 'Adds options to sort the foods in your meals by name, calories, or the order you added them.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-737': {
    emoji: '📋',
    laymanTitle: 'Copy nutrient targets between days',
    preamble: 'Lets you copy your nutrient targets from one day to another instead of setting them up each time.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-761': {
    emoji: '🔍',
    laymanTitle: 'Reset scroll when adding search filters',
    preamble: 'When you add a filter to your search, the list scrolls back to the top so you can see all results.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-756': {
    emoji: '✏️',
    laymanTitle: 'Track which foods you\'ve customized',
    preamble: 'Adds a way to identify foods you\'ve edited so you know which ones have your custom changes.\n\n---\n\nTechnical details:\n\n'
  },

  // Sprint 51 - Recipe & Food Editing
  'PXL-822': {
    emoji: '🌍',
    laymanTitle: 'Live translation using Apple Translation',
    preamble: 'Translates food names and labels in real-time using Apple\'s built-in translation.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-821': {
    emoji: '🌎',
    laymanTitle: 'Full app in English and Spanish',
    preamble: 'Makes the entire app available in both English and Spanish languages.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-798': {
    emoji: '⚙️',
    laymanTitle: 'Manage your saved meal templates',
    preamble: 'Adds a screen where you can view, edit, and organize your saved meal presets.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-800': {
    emoji: '💾',
    laymanTitle: 'Save meals as reusable templates',
    preamble: 'Lets you save complete meals as templates so you can quickly log them again later.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-799': {
    emoji: '📁',
    laymanTitle: 'Organize meal templates into categories',
    preamble: 'Organize your saved meal templates with folders and categories for easy access.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-666': {
    emoji: '📏',
    laymanTitle: 'Fix scanner header spacing issue',
    preamble: 'Fixes a visual bug where the header and footer in the barcode scanner are the wrong height.\n\n---\n\nTechnical details:\n\n'
  },

  // Sprint 52 - UI Polish & Monetization
  'PXL-731': {
    emoji: '✨',
    laymanTitle: 'Remove watermarks from shared images (Premium)',
    preamble: 'Premium feature that removes the NutriKit watermark from meal images you share.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-732': {
    emoji: '📸',
    laymanTitle: 'Instagram-friendly meal images',
    preamble: 'Makes shared meal images more compact and optimized for Instagram stories and posts.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-708': {
    emoji: '💰',
    laymanTitle: 'Finalize pricing strategy',
    preamble: 'Research and finalize the pricing tiers for the app to be competitive in the market.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-804': {
    emoji: '⚡',
    laymanTitle: 'Fix flickering when copying meals',
    preamble: 'Stops multiple meals from briefly appearing on screen when you copy a meal to another day.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-813': {
    emoji: '➕',
    laymanTitle: 'Use native SwiftUI menu instead of custom',
    preamble: 'Replaces the custom plus menu with Apple\'s standard SwiftUI menu for better consistency.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-807': {
    emoji: '🎨',
    laymanTitle: 'Fix connector animation glitch',
    preamble: 'Fixes a visual glitch in the animation when you reset a slider.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-762': {
    emoji: '📝',
    laymanTitle: 'Set up Obsidian with MCP',
    preamble: 'Configure Obsidian note-taking app with Model Context Protocol for better integration.\n\n---\n\nTechnical details:\n\n'
  },
  'PXL-828': {
    emoji: '🎨',
    laymanTitle: 'Continue polishing the website',
    preamble: 'Ongoing improvements and polish to the NutriKit landing page design and content.\n\n---\n\nTechnical details:\n\n'
  },
};

async function updateTask(identifier: string, updates: { emoji: string; laymanTitle: string; preamble: string }) {
  try {
    console.log(`\n📝 Updating ${identifier}...`);

    // Fetch the task
    const parts = identifier.split('-');
    const issues = await client.issues({
      filter: {
        number: { eq: parseInt(parts[1]) },
        team: { key: { eq: parts[0] } },
      },
      first: 1,
    });

    const issue = issues.nodes[0];
    if (!issue) {
      console.log(`❌ Task ${identifier} not found`);
      return false;
    }

    // Get current description
    const currentDescription = issue.description || '';

    // Create new title with emoji
    const newTitle = `${updates.emoji} ${updates.laymanTitle}`;

    // Create new description with preamble + existing description
    const newDescription = `${updates.preamble}${currentDescription}`;

    console.log(`   Old title: ${issue.title}`);
    console.log(`   New title: ${newTitle}`);
    console.log(`   Added preamble: ${updates.preamble.substring(0, 50)}...`);

    // Update the task
    await issue.update({
      title: newTitle,
      description: newDescription,
    });

    console.log(`✅ Updated ${identifier}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to update ${identifier}:`, error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting task updates...\n');

  let successCount = 0;
  let failCount = 0;

  for (const [taskId, updates] of Object.entries(taskUpdates)) {
    const success = await updateTask(taskId, updates);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully updated: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
