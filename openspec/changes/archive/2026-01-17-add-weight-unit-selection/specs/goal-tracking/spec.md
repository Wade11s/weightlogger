## MODIFIED Requirements

### Requirement: Goal Setting
The system SHALL allow users to set a target weight and optional target date, using the user's preferred weight unit.

#### Scenario: 设定目标体重（斤）
- **GIVEN** 用户打开目标设置界面
- **AND** 用户选择的重量单位为"斤"
- **WHEN** 用户输入目标体重（例如 130 斤）和目标日期
- **THEN** 系统将目标体重转换为 kg 后保存到配置文件
- **AND** 显示目标确认提示（以斤显示）

#### Scenario: 设定目标体重（kg）
- **GIVEN** 用户打开目标设置界面
- **AND** 用户选择的重量单位为"kg"
- **WHEN** 用户输入目标体重（例如 65kg）和目标日期
- **THEN** 系统保存目标信息到配置文件
- **AND** 显示目标确认提示（以kg显示）

#### Scenario: 编辑目标
- **GIVEN** 用户已设定目标
- **WHEN** 用户修改目标体重或日期
- **THEN** 系统更新保存的目标信息
- **AND** 所有相关计算使用新目标
- **AND** 目标体重以用户选择的单位显示

#### Scenario: 移除目标
- **GIVEN** 用户已设定目标
- **WHEN** 用户选择删除目标
- **THEN** 系统清除目标信息
- **AND** 应用不再显示进度追踪相关内容

### Requirement: Goal Progress Tracking
The system SHALL track and display progress toward the target weight with percentage and estimated completion date, displaying weights in the user's preferred unit.

#### Scenario: 显示进度概览（kg）
- **GIVEN** 用户已设定目标体重
- **AND** 用户选择的重量单位为"kg"
- **WHEN** 用户查看进度页面
- **THEN** 系统显示：当前体重(kg)、目标体重(kg)、剩余重量(kg)、达成百分比

#### Scenario: 显示进度概览（斤）
- **GIVEN** 用户已设定目标体重
- **AND** 用户选择的重量单位为"斤"
- **WHEN** 用户查看进度页面
- **THEN** 系统显示：当前体重(斤)、目标体重(斤)、剩余重量(斤)、达成百分比

#### Scenario: 计算预计达成日期
- **GIVEN** 用户有目标体重和历史记录
- **WHEN** 系统计算进度
- **THEN** 基于过去 7 天的平均变化率计算预计达成日期
- **AND** 显示预测日期或"未按趋势变化"提示
- **AND** 计算内部始终使用kg

#### Scenario: 目标达成提醒
- **GIVEN** 用户当前体重已达到目标体重（±0.5kg 范围内）
- **WHEN** 用户打开应用
- **THEN** 系统显示祝贺消息
- **AND** 提供设定新目标的选项
