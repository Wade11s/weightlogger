# Tasks: Add Weight Tracking Desktop Application

## Phase 1: 项目初始化

- [x] 1.1 初始化 Tauri + React 项目脚手架
- [x] 1.2 配置 TypeScript 和 ESLint
- [x] 1.3 设置项目目录结构（src/components, src/services, src/types, src/utils）
- [ ] 1.4 配置 macOS 和 Windows 构建环境

## Phase 2: 数据持久化（基础层）

- [x] 2.1 定义数据模型 TypeScript 接口（WeightRecord, UserProfile, Goal）
- [x] 2.2 创建 Rust 后端数据服务（JSON 文件读写）
- [x] 2.3 实现 Tauri Command API：获取、保存、删除记录
- [x] 2.4 创建数据文件初始化逻辑
- [ ] 2.5 编写数据服务单元测试

## Phase 3: 体重记录功能（weight-tracking）

- [x] 3.1 创建日历视图组件（CalendarView）
- [x] 3.2 创建添加/编辑记录表单组件（RecordForm）
- [x] 3.3 实现表单验证（体重范围 20-300kg）
- [x] 3.4 实现记录删除功能与确认对话框
- [x] 3.5 实现记录按日期排序逻辑
- [x] 3.6 实现月份导航和日期点击功能
- [ ] 3.7 编写组件测试

## Phase 4: 数据可视化（data-visualization）

- [x] 4.1 集成图表库（Recharts）
- [x] 4.2 创建体重趋势折线图组件（TrendChart）
- [x] 4.3 实现图表数据点交互提示
- [x] 4.4 创建统计摘要组件（StatisticsSummary）
- [x] 4.5 实现 BMI 计算逻辑和健康状态分类
- [x] 4.6 实现时间范围筛选（7天/30天/全部）

## Phase 5: 目标追踪（goal-tracking）

- [x] 5.1 创建目标设置组件（GoalSetting）
- [x] 5.2 创建个人资料设置组件（ProfileSetting）
- [x] 5.3 实现目标进度展示组件（GoalProgress）
- [x] 5.4 实现基于历史数据的预计达成日期计算
- [x] 5.5 实现目标达成祝贺提示

## Phase 6: 数据导入导出（data-io）

- [x] 6.1 实现 JSON 导出功能
- [x] 6.2 实现 CSV 导出功能
- [x] 6.3 实现 JSON 导入功能与去重逻辑
- [x] 6.4 实现 CSV 导入功能与错误处理
- [x] 6.5 实现导入冲突处理 UI（覆盖/保留/跳过）
- [x] 6.6 实现备份创建和恢复功能
- [x] 6.7 添加文件选择对话框

## Phase 7: 应用整合与完善

- [x] 7.1 创建主应用布局和导航（侧边栏 + 内容区）
- [x] 7.2 实现主题切换（浅色/深色模式）
- [x] 7.3 添加空状态页面和引导提示
- [x] 7.4 优化响应式布局
- [x] 7.5 禁止页面滚动
- [x] 7.6 实现数据自动保存提示

## Phase 8: 测试与发布准备

- [x] 8.1 端到端测试（E2E）关键用户流程
- [x] 8.2 macOS 应用构建和测试
- [ ] 8.3 Windows 应用构建和测试（需要在 Windows 系统上执行）
- [x] 8.4 性能优化（大量数据场景）
- [x] 8.5 创建应用图标和启动屏幕
- [x] 8.6 编写用户文档主题

## Dependencies

- Phase 2 必须在 Phase 3-6 之前完成（数据层基础）
- Phase 3 必须在 Phase 4 之前完成（需要数据才能可视化）
- Phase 5 可以与 Phase 4 并行开发
- Phase 6 必须在 Phase 2 之后，可以与其他功能并行

## Parallelizable Work

- Phase 4 和 Phase 5 可以并行开发
- Phase 6 的导入/导出功能可以并行开发
- UI 组件开发可以在后端 API 完成后并行进行
