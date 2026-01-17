## ADDED Requirements

### Requirement: Weight Entry
The system SHALL allow users to record daily weight data including date, weight value, and optional notes.

#### Scenario: 创建体重记录
- **GIVEN** 应用已打开
- **WHEN** 用户输入日期、体重值（例如 70.5），并可选填写备注
- **THEN** 系统保存记录到本地 JSON 文件
- **AND** 记录列表显示新增的记录

#### Scenario: 验证体重值
- **GIVEN** 用户在体重输入框中输入内容
- **WHEN** 体重值超出合理范围（< 20kg 或 > 300kg）
- **THEN** 系统显示验证错误提示
- **AND** 不会保存无效记录

#### Scenario: 编辑现有记录
- **GIVEN** 用户选择一条已存在的体重记录
- **WHEN** 用户修改体重值或备注并保存
- **THEN** 系统更新本地 JSON 文件中的记录
- **AND** 记录列表反映更新后的内容

#### Scenario: 删除记录
- **GIVEN** 用户选择一条已存在的体重记录
- **WHEN** 用户确认删除操作
- **THEN** 系统从本地 JSON 文件中移除该记录
- **AND** 记录列表不再显示该记录

### Requirement: Data Persistence
The system SHALL persist weight data to a local JSON file for storage and retrieval.

#### Scenario: 自动保存数据
- **GIVEN** 用户添加或修改体重记录
- **WHEN** 操作完成
- **THEN** 系统自动将数据保存到用户主目录的 `.weightlogger/data.json` 文件
- **AND** 文件采用 JSON 格式，包含所有记录

#### Scenario: 应用启动时加载数据
- **GIVEN** 本地存在 `.weightlogger/data.json` 文件
- **WHEN** 应用启动
- **THEN** 系统自动加载并显示所有已保存的记录
- **AND** 用户可以立即查看历史数据

#### Scenario: 首次使用创建数据文件
- **GIVEN** 用户首次使用应用，本地不存在数据文件
- **WHEN** 应用启动
- **THEN** 系统在用户主目录创建 `.weightlogger` 文件夹
- **AND** 创建空的 `data.json` 文件

### Requirement: Record Listing
The system SHALL display all weight records in a list, sorted by date in descending order.

#### Scenario: 显示记录列表
- **GIVEN** 应用中有已保存的体重记录
- **WHEN** 用户打开应用
- **THEN** 系统显示所有记录，按日期从新到旧排序
- **AND** 每条记录显示日期、体重值和备注

#### Scenario: 列表滚动查看
- **GIVEN** 记录数量超过一屏显示数量
- **WHEN** 用户滚动列表
- **THEN** 系统流畅显示所有记录
- **AND** 支持滚动到任意位置
