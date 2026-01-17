## MODIFIED Requirements

### Requirement: Weight Entry
The system SHALL allow users to record daily weight data including date, weight value, and optional notes, using the user's preferred weight unit.

#### Scenario: 创建体重记录（使用斤）
- **GIVEN** 应用已打开，用户选择的重量单位为"斤"
- **WHEN** 用户输入日期、体重值（例如 141 斤），并可选填写备注
- **THEN** 系统将体重转换为 kg 后保存到本地 JSON 文件
- **AND** 记录列表显示新增的记录（以斤显示）

#### Scenario: 创建体重记录（使用kg）
- **GIVEN** 应用已打开，用户选择的重量单位为"kg"
- **WHEN** 用户输入日期、体重值（例如 70.5 kg），并可选填写备注
- **THEN** 系统保存记录到本地 JSON 文件
- **AND** 记录列表显示新增的记录（以kg显示）

#### Scenario: 验证体重值（斤）
- **GIVEN** 用户选择的重量单位为"斤"
- **WHEN** 体重值超出合理范围（< 40斤 或 > 600斤）
- **THEN** 系统显示验证错误提示
- **AND** 不会保存无效记录

#### Scenario: 验证体重值（kg）
- **GIVEN** 用户选择的重量单位为"kg"
- **WHEN** 体重值超出合理范围（< 20kg 或 > 300kg）
- **THEN** 系统显示验证错误提示
- **AND** 不会保存无效记录

#### Scenario: 编辑现有记录
- **GIVEN** 用户选择一条已存在的体重记录
- **WHEN** 用户修改体重值或备注并保存
- **THEN** 系统更新本地 JSON 文件中的记录
- **AND** 记录列表反映更新后的内容
- **AND** 体重值以用户选择的单位显示

#### Scenario: 删除记录
- **GIVEN** 用户选择一条已存在的体重记录
- **WHEN** 用户确认删除操作
- **THEN** 系统从本地 JSON 文件中移除该记录
- **AND** 记录列表不再显示该记录
