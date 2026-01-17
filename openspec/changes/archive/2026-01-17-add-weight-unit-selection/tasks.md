## 1. Data Model Updates
- [x] 1.1 Add `WeightUnit` type to TypeScript types (`kg` | `jin`)
- [x] 1.2 Add `weightUnit` field to `UserProfile` interface with default value `'jin'`
- [x] 1.3 Add `weightUnit` field to Rust `UserProfile` struct with default value

## 2. Conversion Utilities
- [x] 2.1 Implement `kgToJin(weightKg: number): number` function
- [x] 2.2 Implement `jinToKg(weightJin: number): number` function
- [x] 2.3 Implement `formatWeight(weightKg: number, unit: WeightUnit): string` function
- [x] 2.4 Implement `getWeightLabel(unit: WeightUnit): string` function (returns 'kg' or '斤')

## 3. UI Components - Input Forms
- [x] 3.1 Update `RecordForm.tsx` - Display unit label based on profile setting, convert input to kg before saving
- [x] 3.2 Update `GoalSetting.tsx` - Display unit label based on profile setting, convert input to kg before saving
- [x] 3.3 Update weight validation to accept both kg (20-300) and 斤 (40-600) ranges

## 4. UI Components - Display
- [x] 4.1 Update `StatisticsSummary.tsx` - Display all weights in user's preferred unit
- [x] 4.2 Update `TrendChart.tsx` - Y-axis labels in user's preferred unit
- [x] 4.3 Update `GoalProgress.tsx` - Display target and current weight in user's preferred unit
- [x] 4.4 Update `CalendarView.tsx` - Display weight in user's preferred unit
- [x] 4.5 Update `App.tsx` Dashboard - Display current weight and change in user's preferred unit

## 5. Unit Selection UI
- [x] 5.1 Create `UnitSelector` component for choosing between kg and 斤
- [x] 5.2 Add unit selector to Settings page
- [x] 5.3 Update profile saving logic to include weight unit preference

## 6. State Management
- [x] 6.1 Pass current unit to all components that display weight
- [x] 6.2 Ensure weight conversion happens at display/input boundaries (not in data layer)

## 7. Validation
- [x] 7.1 Test weight entry in both kg and 斤 modes
- [x] 7.2 Test goal setting in both kg and 斤 modes
- [x] 7.3 Test charts display correctly with both units
- [x] 7.4 Test statistics calculation is correct (internal kg values unchanged)
- [x] 7.5 Test switching units updates all displays immediately
