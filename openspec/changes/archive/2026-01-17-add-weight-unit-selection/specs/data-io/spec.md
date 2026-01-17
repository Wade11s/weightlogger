## MODIFIED Requirements

### Requirement: Data Export
The system SHALL allow users to export weight data to JSON or CSV format files, with weights always stored in kg regardless of user's display preference.

#### Scenario: 导出为 JSON
- **GIVEN** 用户有体重记录
- **WHEN** 用户选择导出为 JSON 格式
- **THEN** 系统生成包含所有记录的 JSON 文件
- **AND** 体重值始终以 kg 为单位存储（不依赖用户显示偏好）
- **AND** 用户选择保存位置
- **AND** 导出成功后显示确认消息

#### Scenario: 导出为 CSV
- **GIVEN** 用户有体重记录
- **WHEN** 用户选择导出为 CSV 格式
- **THEN** 系统生成 CSV 文件，包含表头（日期、体重、备注）
- **AND** 体重列单位为 kg
- **AND** 每条记录为一行
- **AND** 用户选择保存位置

### Requirement: Data Import
The system SHALL allow users to import weight data from JSON or CSV files with validation and conflict resolution, treating all imported weights as kg.

#### Scenario: 导入 JSON 文件
- **GIVEN** 用户有一个有效的 JSON 数据文件
- **WHEN** 用户选择导入该文件
- **THEN** 系统解析并合并数据到现有记录
- **AND** 所有体重值视为 kg 单位
- **AND** 根据日期去重（保留最新输入的记录）
- **AND** 显示导入成功的记录数量

#### Scenario: 导入 CSV 文件
- **GIVEN** 用户有一个 CSV 文件，包含日期和体重列
- **WHEN** 用户选择导入该文件
- **THEN** 系统解析 CSV 并添加有效记录
- **AND** 体重值视为 kg 单位
- **AND** 跳过格式错误的行并记录错误数
- **AND** 显示导入摘要（成功/失败数量）
