# Change: Add Weight Unit Selection (kg/斤)

## Why
Currently, the app only displays and accepts weight in kilograms (kg). In China, many users prefer to use 斤 (jin) as their weight unit. Adding unit selection will make the app more accessible to Chinese users.

## What Changes
- Add a global weight unit preference setting (kg or 斤)
- Display all weight values in the user's preferred unit throughout the app
- Accept weight input in the user's preferred unit
- Store weights internally in kg for consistency
- Set default unit to 斤 for new users
- Use standard conversion: 1 斤 = 0.5 kg

## Impact
- Affected specs:
  - `weight-tracking` - Weight entry and display need to support unit conversion
  - `data-visualization` - Charts and statistics need to display in selected unit
  - `goal-tracking` - Goal setting and progress display need to support units
  - `profile-management` - New setting for weight unit preference
  - `data-io` - Export may include unit information

- Affected code:
  - `src/types/index.ts` - Add `WeightUnit` type and unit preference to UserProfile
  - `src/utils/helpers.ts` - Add conversion functions (kgToJin, jinToKg, formatWeight)
  - `src/components/RecordForm.tsx` - Input field label and display based on selected unit
  - `src/components/StatisticsSummary.tsx` - Display weights in selected unit
  - `src/components/TrendChart.tsx` - Chart axis in selected unit
  - `src/components/GoalProgress.tsx` - Goal display in selected unit
  - `src/components/GoalSetting.tsx` - Input field for target weight
  - `src-tauri/src/lib.rs` - Backend continues storing weights in kg (no change needed for data)
