# Change: Add Weight Tracking Desktop Application

## Why
用户需要一款跨平台桌面应用来记录和追踪每日体重变化，支持数据可视化、目标设定和数据导入导出功能，用于个人健康管理。

## What Changes
- **BREAKING** 初始化全新的 Tauri + React 桌面应用项目
- 添加体重记录功能（日期 + 体重值 + 备注）
- 添加本地 JSON 文件数据持久化
- 添加体重趋势图表可视化
- 添加目标体重设定与进度追踪
- 添加数据导入/导出功能（JSON/CSV）
- 支持 macOS 和 Windows 平台

## Impact
- Affected specs: 新增 `weight-tracking`, `data-visualization`, `goal-tracking`, `data-io` 四个能力规格
- Affected code: 全新项目结构，包括 Tauri 后端（Rust）和 React 前端
- External dependencies: Tauri, React, Chart.js 或类似图表库
