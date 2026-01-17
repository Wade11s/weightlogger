# goal-tracking Specification

## Purpose
TBD - created by archiving change add-weight-tracker. Update Purpose after archive.
## Requirements
### Requirement: Goal Setting
The system SHALL allow users to set a target weight and optional target date.

#### Scenario: 设定目标体重
- **GIVEN** 用户打开目标设置界面
- **WHEN** 用户输入目标体重（例如 65kg）和目标日期
- **THEN** 系统保存目标信息到配置文件
- **AND** 显示目标确认提示

#### Scenario: 编辑目标
- **GIVEN** 用户已设定目标
- **WHEN** 用户修改目标体重或日期
- **THEN** 系统更新保存的目标信息
- **AND** 所有相关计算使用新目标

#### Scenario: 移除目标
- **GIVEN** 用户已设定目标
- **WHEN** 用户选择删除目标
- **THEN** 系统清除目标信息
- **AND** 应用不再显示进度追踪相关内容

### Requirement: Goal Progress Tracking
The system SHALL track and display progress toward the target weight with percentage and estimated completion date.

#### Scenario: 显示进度概览
- **GIVEN** 用户已设定目标体重
- **WHEN** 用户查看进度页面
- **THEN** 系统显示：当前体重、目标体重、剩余重量、达成百分比

#### Scenario: 计算预计达成日期
- **GIVEN** 用户有目标体重和历史记录
- **WHEN** 系统计算进度
- **THEN** 基于过去 7 天的平均变化率计算预计达成日期
- **AND** 显示预测日期或"未按趋势变化"提示

#### Scenario: 目标达成提醒
- **GIVEN** 用户当前体重已达到目标体重（±0.5kg 范围内）
- **WHEN** 用户打开应用
- **THEN** 系统显示祝贺消息
- **AND** 提供设定新目标的选项

### Requirement: Profile Management
The system SHALL allow users to manage personal profile information including height for BMI calculations.

#### Scenario: 设置身高
- **GIVEN** 用户首次使用应用
- **WHEN** 用户输入身高（cm）
- **THEN** 系统保存身高信息
- **AND** 用于 BMI 计算

#### Scenario: 更新身高
- **GIVEN** 用户已设置身高
- **WHEN** 用户修改身高值
- **THEN** 系统更新保存的身高
- **AND** 所有 BMI 计算使用新值

