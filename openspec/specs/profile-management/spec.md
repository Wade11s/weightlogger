# profile-management Specification

## Purpose
TBD - created by archiving change add-weight-unit-selection. Update Purpose after archive.
## Requirements
### Requirement: Weight Unit Preference
The system SHALL allow users to select their preferred weight unit (kg or 斤) and persist this preference in their profile.

#### Scenario: 设置重量单位为斤
- **GIVEN** 用户打开设置页面
- **WHEN** 用户选择重量单位为"斤"
- **THEN** 系统保存该偏好到用户配置
- **AND** 所有体重显示和输入界面更新为使用斤

#### Scenario: 设置重量单位为kg
- **GIVEN** 用户打开设置页面
- **WHEN** 用户选择重量单位为"kg"
- **THEN** 系统保存该偏好到用户配置
- **AND** 所有体重显示和输入界面更新为使用kg

#### Scenario: 默认重量单位
- **GIVEN** 新用户首次使用应用
- **WHEN** 应用初始化
- **THEN** 系统默认使用"斤"作为重量单位

