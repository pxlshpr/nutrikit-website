import * as dotenv from 'dotenv';
import * as path from 'path';
import { updateTaskDescription } from '../lib/linear-client';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const updates = [
  {
    id: 'PXL-730',
    description: `**What we're building:**

Right now, when you create a recipe in NutriKit, you can save it with all the ingredients and amounts. However, once saved, you can't view the ingredient list anymore, and there's no way to edit the recipe if you need to make changes. This task fixes both issues by making recipes display their complete ingredient breakdown when you tap on them, and adding an edit button so you can modify recipes just like any other food in your database.

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
    description: `**What we're solving:**

The food search engine currently has trouble understanding that different words can mean the same thing. For example, searching for "butter unsalted" won't find "butter without salt" even though they describe the same food. Additionally, the search prioritizes your personal foods over the main database regardless of match quality, so searching for "cream" might suggest "cream cheese" from your saved foods instead of plain cream from the USDA database. This task teaches the search system to recognize synonym descriptors and prioritize exact matches over partial ones.

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
  },
  {
    id: 'PXL-826',
    description: `**What we're solving:**

When you use voice or text logging to quickly log your meals, the app should understand common foods like "butter" and "blueberries" and match them correctly. Currently, there's an issue where the search algorithm returns incorrect matches—for example, typing "butter" matches "butterfish" instead of actual butter, and "blueberries" doesn't find anything even though blueberries exist in the database. This task fixes the food matching system to prioritize exact and near-exact text matches over purely semantic matches, ensuring you get the right food every time.

---

## Bug Summary

The voice and text logging feature has critical food matching issues where common, everyday foods are not being matched correctly. The semantic search/embedding system appears to be returning semantically similar but incorrect matches, while overlooking exact or near-exact text matches.

## Reproduction Steps

### Issue 1: Incorrect Match for "butter"

1. Open voice or text logging
2. Say or type "1 tablespoon of butter"
3. **Expected**: Matches "Butter" or "Butter, salted" or similar butter entry
4. **Actual**: Matches "Butterfish, raw" - completely wrong food item

### Issue 2: No Match for "blueberries"

1. Open voice or text logging
2. Say or type "1 cup of blueberries"
3. **Expected**: Matches "Blueberries, Raw" which exists in the database
4. **Actual**: No match found for "Blueberry"

## Technical Analysis

This appears to be a search/matching algorithm issue with the following potential root causes:

### Likely Causes to Investigate

1. **Embedding Quality Issues**
   * The embeddings may not be properly weighting exact or near-exact text matches
   * "Butterfish" may be semantically closer to "butter" in the embedding space than actual "butter"
   * Singular/plural variations ("Blueberry" vs "Blueberries") may not be handled
2. **Search Algorithm Issues**
   * The matching algorithm may rely too heavily on semantic similarity without a text-matching boost
   * No fuzzy matching or stemming for singular/plural forms
   * Missing a "prefer exact match" or "prefer substring match" heuristic
3. **Data Issues**
   * Verify that "Butter" and "Blueberries, Raw" exist in the database with proper embeddings
   * Check if embeddings were generated correctly for these common foods

### Suggested Investigation Areas

* Review the food matching/search implementation in the voice logging flow
* Check how embeddings are generated and stored
* Investigate adding a hybrid search approach:
  * Text/fuzzy matching for exact/near-exact matches
  * Semantic search as a fallback
  * Boost scores for exact substring matches
* Consider implementing stemming or lemmatization for word variations

## Impact

**High** - This bug affects core functionality of voice logging, which is a primary feature for quick food entry. Users cannot reliably log common foods like "butter" and "blueberries", which significantly degrades the user experience and makes the voice feature unreliable.

## Acceptance Criteria

- [ ] "1 tablespoon of butter" correctly matches a butter food entry (not butterfish)
- [ ] "1 cup of blueberries" correctly matches "Blueberries, Raw" or equivalent
- [ ] Singular/plural variations of food names should match appropriately
- [ ] Exact or near-exact text matches should be prioritized over purely semantic matches
- [ ] Add unit tests for common food matching scenarios

## Files to Investigate

Based on the codebase structure, likely relevant files:

* \`NutriKit/Voice/TextLoggingScreen.swift\`
* \`NutriKit/Voice/VoiceLoggingScreen.swift\`
* Any food search/matching services in \`Packages/App/Sources/App/\`

---

Build instruction: Use -destination 'platform=iOS Simulator,name=iPhone 17 Pro' when building this project`
  },
  {
    id: 'PXL-720',
    description: `**What we're fixing:**

In the energy maintenance settings, there's a text field where you enter your daily calorie target. The problem is that this field can only display three digits, so any value above 999 gets cut off. This means if your maintenance calories are 1500 or 2000, you can't see or enter the full number. This task removes that digit limit so the field can properly display and accept any reasonable calorie value up to 9999.

---

## Description

Fix a display bug in the energy maintenance adjustment sheet where text fields containing energy values are incorrectly truncated or limited to three digits. This prevents users from properly viewing or entering energy values that exceed 999 (e.g., 1000, 1500, 2000 kcal).

## Technical Context

* Location: Energy maintenance adjustment sheet in the maintenance settings flow
* Issue: Text fields for energy values have a digit limit constraint that caps values at three digits
* Expected behavior: Text fields should display and accept energy values of any reasonable size (typically up to 9999 kcal for maintenance energy calculations)

## Acceptance Criteria

- [ ] Energy value text fields in the maintenance adjustment sheet can display values greater than 999
- [ ] Users can input energy values with 4+ digits without truncation
- [ ] All energy value text fields in the sheet are updated consistently
- [ ] No visual layout issues occur when displaying larger numbers
- [ ] Verify the fix works across different device sizes and orientations

## Technical Implementation Notes

* Check for any \`UITextField\` or \`SwiftUI TextField\` constraints limiting character count or digit display
* Review number formatters that may be truncating values
* Ensure the underlying data model supports full-range energy values
* Consider adjusting text field width if needed to accommodate larger numbers

Build instruction: Use -destination 'platform=iOS Simulator,name=iPhone 17 Pro' when building this project`
  },
  {
    id: 'PXL-742',
    description: `**What we're fixing:**

When you check off meals throughout the day, the app syncs your data in the background with the cloud. During this sync process, two visual issues can occur: first, the nutrient totals at the top of the screen don't always update to reflect what you've just checked off, and second, the chevron arrows next to meal headers can get out of sync with whether the meal is expanded or collapsed. This task ensures that all UI elements stay properly synchronized even when background syncing is happening.

---

## Overview

We have two related issues that occur when checking items on/off in logging mode while a sync is happening. These manifest as UI state getting out of sync with the underlying data model.

---

## Issue 1: Nutrient amounts in expandable header not updating after sync ✅ PARTIALLY FIXED

**Problem:**
When toggling logged states during a sync, the nutrient totals in the expandable day header at the top don't recalculate to match what's currently checked off when sync completes.

**Fix Applied:**

* Added \`updateCircleState()\` call in \`DayViewController.updateVisibleCellsAnimated()\` at line 1405 to ensure logged state checkmarks update after sync
* The expandable header already has proper logic to show consumed values via \`day.consumedValue(for:)\` when in log mode

**Files Modified:**

* \`/Users/pxlshpr/Developer/NutriKit/DayViewController.swift:1404-1407\` - Added updateCircleState() call

---

## Issue 2: Meal header chevrons getting out of sync ⚠️ NEEDS DIAGNOSIS

**Problem:**
The collapse/expand chevrons on meal headers can get out of sync with the actual collapse state, especially during rapid tapping.

**Symptoms:**

* Takes 3 taps to actually turn the chevron
* Chevron never turns with expand/collapse toggles
* Chevron points wrong direction after rapid tapping

**Attempted Fixes (Reverted):**

1. Tried updating chevron rotation in \`updateValues()\` - caused chevron to always revert to pointing down
2. Tried debounced self-check after rapid tapping - still exhibited wrong behavior

**Current State:**
Reverted to simple original approach and added comprehensive diagnostic logging to identify the root cause.

**Diagnostic Logging Added in** \`MealHeaderTableViewCell.swift\`:

* 📍 CONFIGURE logs (lines 559-564) - initial state setup
* 🔄 UPDATE_VALUES logs (lines 663-684) - state comparison during updates
* ⚠️ STATE MISMATCH DETECTED logs - when cell detects desync
* Existing tap/toggle logs already in place

**Files Modified:**

* \`/Users/pxlshpr/Developer/NutriKit/MealHeaderTableViewCell.swift:559-564, 663-684\` - Added diagnostic logging

**Related Code Locations:**

* Chevron tap handler: \`MealHeaderTableViewCell.swift:1544\`
* Collapse state logic: \`MealHeaderTableViewCell.swift:659-684\`
* Configure chevron: \`MealHeaderTableViewCell.swift:548-564\`

---

## Next Steps for Issue 2

1. **Test rapid tapping** on meal headers while monitoring logs:

   \`\`\`bash
   log stream --predicate 'message CONTAINS "[MealHeader]"' --level debug
   \`\`\`
2. **Analyze logs** to identify where chevron state gets out of sync
3. **Determine root cause** - likely one of:
   * Timing issue (animation vs state update)
   * State management problem (cell reuse or model updates)
   * Table reload interference (cell getting reconfigured mid-animation)
4. **Implement targeted fix** based on diagnostic findings

---

## Technical Context

**Component:** Meal logging diary view with expandable/collapsible meal sections
**Framework:** UIKit (UITableView with custom cells)
**State Management:** Day model with meal items, CloudKit sync in background
**Animation:** Chevron rotation animations tied to expand/collapse state

**Why This Matters:**
This affects the core logging functionality where users check off meals throughout the day. UI state desyncs during CloudKit sync operations create confusion and poor UX, especially for users actively logging while syncing.

---

## Acceptance Criteria

- [ ] Nutrient totals in expandable header update correctly after sync completes (Issue 1)
- [ ] Chevron rotation matches actual expand/collapse state of meal headers (Issue 2)
- [ ] Rapid tapping on meal headers doesn't cause chevron state desync (Issue 2)
- [ ] All diagnostic logs removed or converted to appropriate log level after fix
- [ ] No regressions in meal header expand/collapse behavior

---

Build instruction: Use -destination 'platform=iOS Simulator,name=iPhone 17 Pro' when building this project`
  },
  {
    id: 'PXL-682',
    description: `**What we're fixing:**

After your meals sync between your iPhone, iPad, and Mac, the total calories for the day should be exactly the same on all devices. Currently, different devices can show different calorie totals for the same day—sometimes varying by several calories—and the numbers can even change when you swipe between days without making any edits. This task identifies why the day-level calorie calculation is inconsistent and ensures all devices show the same stable total after syncing.

---

## Problem

After syncing meals and meal items between devices, the day's total energy value is inconsistent and unstable:

* **Different values on different devices**: One device shows 7752 kcal, another shows 7759 kcal for the same day
* **Values changing without user action**: Swiping the day back and forth caused the value to change: 7752 → 7758 → 7759 → 7754
* **Only affects energy**: Macros and micros appear to be consistent across devices
* **Meal-level totals are correct**: The nutrient bar in the meal headers shows the same values on both devices

## Observations

### What's Consistent

* Individual meal energy values match between devices
* Macro totals (protein, carbs, fat) are stable
* Micro nutrient totals are stable
* The issue only affects the day-level energy total

### What's Inconsistent

* Day-level total energy calculation
* Value changes spontaneously when:
  * Swiping between days
  * Waiting a few moments
  * No user edits being made

## Hypotheses

### 1. Rounding/Precision Issues

The energy total might be calculated differently in different places:

* Summing meal energy values (already rounded)
* Recalculating from macros (protein × 4 + carbs × 4 + fat × 9)
* Different rounding strategies causing drift

### 2. Sync/State Management Race Condition

* Background calculations updating while UI is refreshing
* CoreData context conflicts between sync and UI layer
* Cached values not being invalidated properly after sync

### 3. Macro-to-Energy Conversion Inconsistency

* Some foods might store pre-calculated energy values
* Others calculate energy from macros on-the-fly
* Differences in which approach is used in different contexts

### 4. Incomplete Sync State

* Some meal items might not be fully synced/hydrated
* Related food data might be missing temporarily
* Calculations might be running with incomplete data

## Technical Context

**Relevant Files to Investigate:**

* Day energy calculation logic
* Meal item energy aggregation
* Sync merge logic for meals/items
* CoreData relationship loading (faulting issues?)

**Questions to Answer:**

1. Where is day-level energy calculated? Multiple places?
2. Is it stored or always calculated on-demand?
3. How do we ensure all meal items are loaded when calculating?
4. Are there any background recalculations that could cause UI updates?

## Expected Behavior

* Day-level energy total should be **identical** on all devices after sync completes
* Value should be **stable** and not change unless user edits data
* Calculation should be **deterministic** regardless of when/where it runs
* Should match the sum of individual meal energy values shown in headers

## Acceptance Criteria

- [ ] Both devices show identical energy totals after sync (within 1 kcal tolerance for rounding)
- [ ] Energy value remains stable when swiping between days
- [ ] Energy value doesn't change spontaneously without user action
- [ ] Day total matches sum of meal header values exactly
- [ ] Root cause identified and documented
- [ ] Fix verified across multiple sync scenarios

## Impact

**Severity**: High - This affects the core accuracy of the app's primary metric
**User Trust**: Users rely on these numbers for tracking; inconsistency erodes confidence
**Data Integrity**: Suggests potential broader issues with sync or calculation logic`
  },
  {
    id: 'PXL-791',
    description: `**What we're building:**

When you edit a food or recipe you've created, the changes should automatically apply to all the times you've logged that food in the past. This task implements a confirmation dialog that shows you how many past entries will be updated, then applies the changes throughout your food log. The benefit is that if you correct nutritional information or adjust a recipe, all your historical data stays accurate without manual updates.

---

## Requirement

When a user edits a recipe or food item through the Foods view, the app should automatically update all previous instances of that food item without prompting the user. This provides a cleaner UX by defaulting to the most common use case (updating all instances) while still giving the user visibility into the scope of changes.

## Acceptance Criteria

1. When editing a food/recipe in the Foods view, present a confirmation dialog that:
   * Clearly displays how many past uses of this food item will be updated
   * Shows the food name and what is being changed
   * Offers two clear options: "Make Change" or "Cancel"
   * Does NOT ask "update all instances?" - the default is always to update all
2. On confirmation, the app should:
   * Either duplicate the food and re-attach to the meal, OR
   * Delete the old food and add the new one
   * Whichever approach is more congruent with the existing sync strategy (review CloudKit sync logic to determine best approach)
3. After making the change:
   * The food detail view must reflect the updated values immediately
   * Verify that all past instances across all meals have been updated correctly
   * Ensure sync properly propagates changes to CloudKit
4. Edge cases to handle:
   * Food with only one past use (verify update works)
   * Food with many past uses (ensure performance is acceptable)
   * Editing while offline (verify sync queue handles this)
   * Concurrent edits (sync strategy should prevent conflicts)

## Technical Context

* Foods are managed through the Foods view and Food Detail view
* The app uses CloudKit for data sync across devices
* When editing foods, the app must decide between duplicating or replacing
* Previous instances need to be tracked and updated in tandem
* Current sync strategy should be reviewed to determine the optimal update approach

## Implementation Notes

* Review the current CloudKit sync strategy to understand how food updates are handled
* Determine whether duplication or deletion+addition is more consistent with existing patterns
* Ensure the confirmation dialog provides clear feedback on scope of changes
* Verify that all related meals/entries are properly updated after the change
* Consider performance implications when updating foods with many historical uses
* Make sure preview generation doesn't fail after food updates

Build instruction: Use -destination 'platform=iOS Simulator,name=iPhone 17 Pro' when building this project`
  },
  {
    id: 'PXL-805',
    description: `**What we're fixing:**

The app has a "Now" indicator that shows you the current time in your daily food log. When this indicator is visible, certain actions like deleting a meal item can cause the app to crash. The crash happens because the code doesn't properly account for the extra section that the "Now" indicator occupies in the table view. This task audits all the places where meal sections are referenced and ensures they correctly handle the offset created by the timing summary section.

---

## Problem

We fixed a crash in \`deleteItem(_:)\` where the code was using \`sortedMeals.firstIndex\` directly as a table section index, but this doesn't account for the timing summary section that can be inserted at a dynamic position.

When the timing summary ("NOW" indicator) is shown **on TODAY only**, it occupies a section in the table view, which shifts all meal section indices. The code has helper methods:

* \`mealIndex(forSection:)\` - converts table section to sortedMeals array index
* \`sectionIndex(forMealIndex:)\` - converts sortedMeals array index to table section

**Note:** The timing summary only shows on TODAY. On other days, \`timingSummarySectionIndex\` is nil, so the helper methods return indices unchanged. The fix is safe for both cases.

## Locations to audit (DayViewController.swift)

| Line | Current Code | Issue |
| -- | -- | -- |
| 460 | \`sortedMeals.firstIndex\` as section | May need \`sectionIndex(forMealIndex:)\` |
| 1680 | \`sortedMeals[indexPath.section]\` | Should use \`mealIndex(forSection:)\` |
| 1728 | \`sortedMeals[indexPath.section]\` | Should use \`mealIndex(forSection:)\` |
| 2464 | \`sortedMeals.firstIndex\` as sectionIndex | May need \`sectionIndex(forMealIndex:)\` |
| 4003 | \`sortedMeals.firstIndex\` as sectionIndex | Need to separate mealIndex/sectionIndex |
| 4093 | \`sortedMeals[indexPath.section]\` | Should use \`mealIndex(forSection:)\` |
| 4141 | \`sortedMeals[indexPath.section]\` | Should use \`mealIndex(forSection:)\` |

## Pattern to fix

* When accessing \`sortedMeals\` array → use meal index (via \`mealIndex(forSection:)\` if you have a section)
* When creating \`IndexPath\` for table view → use section index (via \`sectionIndex(forMealIndex:)\` if you have a meal index)

## Already fixed

* \`deleteItem(_:)\` at line 3934 - now properly separates mealIndex and sectionIndex

## Acceptance Criteria

- [ ] Each location audited and fixed if needed
- [ ] Test delete item on TODAY with NOW cell visible
- [ ] Test delete item on other days (no NOW cell)
- [ ] No crashes when timing summary moves between meals

## File

\`/Users/pxlshpr/Developer/NutriKit/NutriKit/Refactor Inbox/UIKit/DayViewController.swift\``
  }
];

async function main() {
  console.log('Updating all 6 tasks with preambles...\n');

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
