import * as dotenv from 'dotenv';
import * as path from 'path';
import { updateTaskDescription } from '../lib/linear-client';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const updates = [
  {
    id: 'PXL-730',
    description: `**What we're building:** 🍳

Right now, when you create a recipe in NutriKit—like "mom's lasagna" or "protein smoothie"—you can save it with all the ingredients and amounts. But there's a frustrating catch: once you've saved it, you can't see the list of ingredients anymore, and you definitely can't edit it if you made a mistake or want to adjust portions! 😅

This task is all about fixing that. We're making it so when you tap on a recipe you created, you'll see all the ingredients beautifully laid out with their amounts and calorie contributions. And even better—you'll be able to tap an "Edit" button and modify the recipe just like you would any other food. Need to swap out an ingredient? Adjust the serving size? Remove something you don't use anymore? You got it! ✨

Think of it like having a digital recipe card that you can pull out anytime to see what's in it, and a pencil to make changes whenever you need to. No more recreating recipes from scratch just because you need to tweak something! 📝

---

## Problem Statement

Recipes are not loading/displaying correctly in the FoodDetailsView, and there is currently no ability to edit recipes once they are created. This impacts users who have created recipes and need to modify them or view their ingredient details.

## Technical Context

The FoodDetailsView (\`/Users/pxlshpr/Developer/NutriKit/NutriKit/Views/FoodDetailsView.swift\`) currently has an \`ingredientsSection\` that conditionally displays when \`food.type == .recipe\` and when \`!food.childrenFoodItems.isEmpty\` (lines 262-273). The section is supposed to show recipe ingredients by iterating through \`food.childrenFoodItems\`, displaying each ingredient with its emoji, name, amount, and calorie information.

The Food model has a \`childrenFoodItems: [FoodItem]\` property that stores recipe ingredients. This is populated during food creation/editing but may not be loading correctly when displaying existing recipes in the details view.

## Tasks Required

### 1. Debug Recipe Loading Issue

* Investigate why \`food.childrenFoodItems\` is empty or not populating when viewing existing recipes
* Check data persistence layer to ensure recipe ingredients are being saved correctly to CloudKit/Core Data
* Verify the Food entity mapping includes proper handling of the \`childrenFoodItems\` relationship
* Add logging or breakpoints to trace where the recipe ingredients are being lost in the data flow
* Test with known recipe foods to confirm whether the issue is in saving, loading, or both

### 2. Implement Recipe Editing Functionality

* Add an "Edit" button to the FoodDetailsView toolbar when \`food.type == .recipe\`
* Create navigation to the FoodForm with editing mode enabled for recipes
* Ensure the FoodForm properly loads existing recipe ingredients into the editing interface
* Verify that editing a recipe updates both the recipe metadata and its \`childrenFoodItems\` correctly
* Ensure edited recipes save properly and the changes persist across app restarts
* Add proper validation to prevent breaking existing recipe data during edits

## Acceptance Criteria

- [ ] Existing recipes display their complete ingredient list in the FoodDetailsView
- [ ] Each ingredient shows: emoji, name, amount (with proper units), and calorie contribution
- [ ] An "Edit" button appears in the toolbar when viewing a recipe
- [ ] Tapping "Edit" opens the FoodForm in edit mode with all recipe data pre-populated
- [ ] Modifying recipe ingredients (add/remove/edit amounts) saves correctly
- [ ] After editing and saving, the FoodDetailsView reflects the updated recipe information
- [ ] Recipe edits persist across app restarts and sync properly via CloudKit

## Files to Review

* \`/Users/pxlshpr/Developer/NutriKit/NutriKit/Views/FoodDetailsView.swift\` - Main view displaying food details
* \`/Users/pxlshpr/Developer/NutriKit/Packages/FoodCore/Sources/FoodCore/Structs/Food/Food.swift\` - Food model definition
* \`/Users/pxlshpr/Developer/NutriKit/NutriKit/Refactor Inbox/FoodsUI/Screens/FoodForm/FoodForm.swift\` - Food editing interface
* \`/Users/pxlshpr/Developer/NutriKit/Packages/App/Sources/App/NSManagedObjects/FoodEntity.swift\` - Core Data entity
* \`/Users/pxlshpr/Developer/NutriKit/Packages/App/Sources/App/Extensions/CKRecord.swift\` - CloudKit persistence

## Additional Notes

The \`ingredientRow\` function in FoodDetailsView is already implemented to display ingredients nicely, so the UI layer is ready. The issue appears to be in the data loading/persistence layer. Recipe editing should follow the same patterns used for editing regular foods, but with special attention to the \`childrenFoodItems\` relationship.

Build instruction: Use -destination 'platform=iOS Simulator,name=iPhone 17 Pro' when building this project`
  },
  {
    id: 'PXL-831',
    description: `**What we're solving:** 🔍

Ever tried searching for "butter unsalted" but the app just can't find "butter without salt"? Or you search for "cream" and the app suggests "cream cheese" from your saved foods instead of plain old cream from the food database? Super annoying, right? 😤

This is all about making the food search engine way smarter. We're teaching it to understand that different words can mean the same thing—like how "unsalted," "without salt," and "no salt" all describe the same thing. We call these "synonyms" and once the app understands them, searching becomes so much more intuitive! 🧠

But here's the other clever part: right now, if you have "cream cheese" saved in your personal foods, the app thinks that's a better match for "cream" than actual cream from the USDA database—just because your personal foods have higher priority. That's like asking for water and getting watermelon instead! 🍉 We're fixing the matching system to be smarter about exact matches, so when you search for something specific, you get exactly what you asked for, not just whatever has the highest priority.

The end result? Searching for foods becomes effortless and accurate—the app finally understands what you mean, not just what you type! ✨

---

## Overview

Improve the food matching algorithm to handle descriptor synonyms and prioritize exact name matches over partial matches from higher-priority sources.

---

## Issue 1: Descriptor Synonym Matching

**Problem**: Currently "butter unsalted" doesn't match "butter without salt" because the matching algorithm doesn't recognize equivalent food descriptors.

**Solution**: Implement synonym groups for common food descriptors:

| Category | Synonyms |
| -- | -- |
| **Salt** | "unsalted" ↔ "without salt" ↔ "no salt" ↔ "salt free" |
| **Pasteurization** | "unpasteurized" ↔ "raw" |
| **Sugar** | "unsweetened" ↔ "no sugar" ↔ "sugar free" |
| **Fat** | "nonfat" ↔ "fat free" ↔ "skim" / "low fat" ↔ "reduced fat" ↔ "light" |
| **Cooking methods** | "grilled" ↔ "chargrilled" ↔ "bbq", etc. |

---

## Issue 2: Exact Match Prioritization

**Problem**: "200g cream" matches "Cheese, cream" from My Foods instead of "Cream" from USDA dataset.

**Current behavior**: The priority system (My Foods > Dataset > OFF) always prefers higher-priority sources regardless of match quality.

**Expected behavior**: Exact or near-exact name matches in lower-priority sources should beat partial matches in higher-priority sources.

**Example**: When searching "cream", "Cream" from USDA should rank higher than "Cheese, cream" from My Foods because "Cream" is an exact match.

---

## Technical Approach

1. **Add** \`descriptorSynonymGroups\` dictionary in \`FoodMatchingUtils.swift\`
   * Create a data structure mapping each synonym to its canonical form
   * Example: \`["unsalted": "no_salt", "without salt": "no_salt", "no salt": "no_salt", "salt free": "no_salt"]\`
2. **Create** \`normalizeDescriptor()\` function to map synonyms to canonical forms
   * Should handle compound descriptors (e.g., "unsalted low fat")
   * Case-insensitive matching
3. **Update** \`isStrongMatch()\` and \`relevanceScore()\` to use synonym matching
   * Normalize both query and candidate descriptors before comparison
   * Treat synonym-matched descriptors as equivalent for scoring purposes
4. **Modify** \`pickBestCandidate()\` to consider match quality across all sources before applying priority
   * Introduce a match quality threshold (e.g., exact match = 1.0, strong match = 0.9, partial = 0.5)
   * Only apply source priority as a tiebreaker when match quality is similar
   * Proposed logic: \`finalScore = matchQuality * 100 + sourcePriority\` (ensures quality dominates)

---

## Files to Modify

* \`NutriKit/Voice/FoodMatchingUtils.swift\` - Main implementation location
* \`NutriKit/Voice/TextLoggingModel.swift\` - May need updates if search flow changes affect the model layer

---

## Acceptance Criteria

- [ ] "butter unsalted" matches "butter without salt" with high confidence
- [ ] "unsweetened yogurt" matches "yogurt no sugar"
- [ ] Searching "cream" returns "Cream" from USDA over "Cheese, cream" from My Foods
- [ ] Searching "chicken" returns "Chicken" over "Chicken salad" when exact match exists
- [ ] Existing exact matches continue to work correctly (no regressions)
- [ ] Unit tests added for synonym normalization logic

---

## Related

Follow-up to PXL-826 (Voice/Text Logging food matching fix)

---

**Build instruction**: Use \`-destination 'platform=iOS Simulator,name=iPhone 17 Pro'\` when building this project.`
  }
];

async function main() {
  console.log('Updating tasks with detailed preambles...\n');

  for (const task of updates) {
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
