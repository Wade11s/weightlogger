## ADDED Requirements

### Requirement: Data Export
The system SHALL allow users to export weight data to JSON or CSV format files.

#### Scenario: 导出为 JSON
- **GIVEN** 用户有体重记录
- **WHEN** 用户选择导出为 JSON 格式
- **THEN** 系统生成包含所有记录的 JSON 文件
- **AND** 用户选择保存位置
- **AND** 导出成功后显示确认消息

#### Scenario: 导出为 CSV
- **GIVEN** 用户有体重记录
- **WHEN** 用户选择导出为 CSV 格式
- **THEN** 系统生成 CSV 文件，包含表头（日期、体重、备注）
- **AND** 每条记录为一行
- **AND** 用户选择保存位置

#### Scenario: 空数据导出
- **GIVEN** 用户没有任何记录
- **WHEN** 用户尝试导出数据
- **THEN** 系统显示"暂无数据可导出"提示
- **AND** 不生成文件

### Requirement: Data Import
The system SHALL allow users to import weight data from JSON or CSV files with validation and conflict resolution.

#### Scenario: 导入 JSON 文件
- **GIVEN** 用户有一个有效的 JSON 数据文件
- **WHEN** 用户选择导入该文件
- **THEN** 系统解析并合并数据到现有记录
- **AND** 根据日期去重（保留最新输入的记录）
- **AND** 显示导入成功的记录数量

#### Scenario: 导入 CSV 文件
- **GIVEN** 用户有一个 CSV 文件，包含日期和体重列
- **WHEN** 用户选择导入该文件
- **THEN** 系统解析 CSV 并添加有效记录
- **AND** 跳过格式错误的行并记录错误数
- **AND** 显示导入摘要（成功/失败数量）

#### Scenario: 导入数据验证
- **GIVEN** 用户选择导入一个文件
- **WHEN** 文件格式不正确或数据无效
- **THEN** 系统显示具体错误信息
- **AND** 不修改任何现有数据
- **AND** 提供示例文件格式参考

#### Scenario: 导入冲突处理
- **GIVEN** 用户导入的数据与现有记录有相同日期
- **WHEN** 检测到冲突
- **THEN** 系统询问用户：覆盖/保留两者/跳过
- **AND** 根据用户选择执行相应操作

### Requirement: Data Backup
The system SHALL allow users to create full data backups and restore from backup files with confirmation.

#### Scenario: 手动备份
- **GIVEN** 用户有体重记录
- **WHEN** 用户选择创建备份
- **THEN** 系统创建包含所有数据的备份文件
- **AND** 文件名包含时间戳
- **AND** 用户选择保存位置

#### Scenario: 恢复备份
- **GIVEN** 用户有一个备份文件
- **WHEN** 用户选择恢复备份
- **THEN** 系统警告将覆盖当前数据
- **AND** 用户确认后替换所有数据
- **AND** 显示恢复成功确认
