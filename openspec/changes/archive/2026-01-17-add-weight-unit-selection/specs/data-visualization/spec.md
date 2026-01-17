## MODIFIED Requirements

### Requirement: Weight Trend Chart
The system SHALL provide an interactive line chart displaying weight trends over time, with weights displayed in the user's preferred unit.

#### Scenario: 显示体重趋势折线图（kg）
- **GIVEN** 用户有至少 2 条体重记录
- **AND** 用户选择的重量单位为"kg"
- **WHEN** 用户查看趋势图表
- **THEN** 系统显示折线图，X 轴为日期，Y 轴为体重值（kg）
- **AND** 图表数据按时间顺序排列

#### Scenario: 显示体重趋势折线图（斤）
- **GIVEN** 用户有至少 2 条体重记录
- **AND** 用户选择的重量单位为"斤"
- **WHEN** 用户查看趋势图表
- **THEN** 系统显示折线图，X 轴为日期，Y 轴为体重值（斤）
- **AND** 图表数据按时间顺序排列

#### Scenario: 空数据状态
- **GIVEN** 用户没有任何体重记录
- **WHEN** 用户查看趋势图表
- **THEN** 系统显示"暂无数据"提示
- **AND** 引导用户添加第一条记录

#### Scenario: 图表交互
- **GIVEN** 图表已显示
- **WHEN** 用户鼠标悬停在数据点上
- **THEN** 系统显示该点的详细信息（日期、体重值，使用用户选择的单位）

#### Scenario: 图表自动更新
- **GIVEN** 用户正在查看图表
- **WHEN** 用户添加新的体重记录
- **THEN** 图表自动刷新显示最新数据
- **AND** 无需手动刷新

### Requirement: Statistics Summary
The system SHALL display statistical summary information including current weight, weight change, and BMI, with weights displayed in the user's preferred unit.

#### Scenario: 显示基本统计（kg）
- **GIVEN** 用户有体重记录
- **AND** 用户选择的重量单位为"kg"
- **WHEN** 用户查看统计信息
- **THEN** 系统显示：当前体重(kg)、起始体重(kg)、体重变化(kg)、BMI

#### Scenario: 显示基本统计（斤）
- **GIVEN** 用户有体重记录
- **AND** 用户选择的重量单位为"斤"
- **WHEN** 用户查看统计信息
- **THEN** 系统显示：当前体重(斤)、起始体重(斤)、体重变化(斤)、BMI

#### Scenario: 显示时间范围统计
- **GIVEN** 用户选择最近 7 天
- **WHEN** 用户查看统计信息
- **THEN** 系统计算并显示该时间范围内的统计（平均体重、最大/最小体重、体重变化）
- **AND** 所有体重值使用用户选择的单位

#### Scenario: BMI 计算
- **GIVEN** 用户已设置身高信息
- **WHEN** 系统计算 BMI
- **THEN** BMI = 体重(kg) / 身高(m)²（内部始终使用kg计算）
- **AND** 显示对应的健康状态分类（偏瘦/正常/超重/肥胖）
