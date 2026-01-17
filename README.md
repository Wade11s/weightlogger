# Weight Logger 🌸

一款简单美观的跨平台体重追踪桌面应用，采用 Tauri + React 构建。

[![Build Desktop Apps](https://github.com/yourusername/weightlogger/actions/workflows/build.yml/badge.svg)](https://github.com/yourusername/weightlogger/actions/workflows/build.yml)

## 功能特性

- ✅ **体重记录** - 每日体重记录，支持备注
- 📊 **数据可视化** - 交互式体重趋势图表（Plotly.js）
- 📅 **日历视图** - 月历展示所有记录，点击查看详情
- 🎯 **目标追踪** - 设定目标体重，时间线可视化进度追踪
- 📈 **统计分析** - 7天/30天/全部时间范围筛选
- 💾 **数据导入导出** - 支持 JSON/CSV 格式
- 🔄 **备份恢复** - 完整数据备份和恢复
- 🌓 **主题切换** - 支持浅色/深色模式
- 💾 **本地存储** - 数据保存在本地，保护隐私
- 🚀 **跨平台** - 支持 macOS 和 Windows

## 技术栈

### 前端
- React 19 + TypeScript
- Vite
- Tailwind CSS（自定义玫瑰粉/鼠尾草绿配色）
- Plotly.js（交互式图表）
- Lucide Icons（图标库）

### 后端
- Tauri 2.2
- Rust

### CI/CD
- GitHub Actions（自动构建 macOS 和 Windows 安装包）

## 开发

### 环境要求

- Node.js 18+
- Rust 1.70+
- macOS 10.13+ / Windows 10+

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run tauri dev
```

### 构建

```bash
# 构建 Web 前端
npm run build

# 构建当前平台应用（macOS 或 Windows）
npm run tauri build

# 代码检查
npm run lint
```

#### 构建产物

**macOS**:
- 应用程序: `src-tauri/target/release/bundle/macos/Weight Logger.app`
- DMG 安装包: `src-tauri/target/release/bundle/dmg/Weight Logger_<version>_<arch>.dmg`

**Windows**（需在 Windows 系统或通过 GitHub Actions）:
- MSI 安装程序: `src-tauri/target/release/bundle/msi/Weight Logger_<version>_x64_en-US.msi`
- NSIS 安装程序: `src-tauri/target/release/bundle/nsis/Weight Logger_<version>_x64-setup.exe`
- 单独可执行文件: `src-tauri/target/release/weight-logger.exe`（需要 WebView2 运行时）

#### GitHub Actions 自动构建

推送代码到 GitHub 后，Actions 会自动构建 **macOS 和 Windows** 安装包：

```bash
git push origin main
```

构建完成后，在 GitHub Actions 页面下载对应平台的安装包：
- **macOS**: `macos-bundle` - DMG 安装包
- **Windows**:
  - `windows-bundle` - MSI 和 NSIS 安装程序
  - `windows-standalone` - 单独的可执行 .exe 文件（需要 WebView2 运行时）

## 项目结构

```
weightlogger/
├── src/                    # React 前端源码
│   ├── components/         # UI 组件
│   │   ├── CalendarView.tsx      # 月历视图
│   │   ├── TrendChart.tsx        # 趋势图表 (Plotly.js)
│   │   ├── GoalProgress.tsx      # 目标进度追踪
│   │   ├── StatisticsSummary.tsx # 统计摘要
│   │   ├── RecordForm.tsx        # 记录表单
│   │   └── ...
│   ├── contexts/           # React Context (主题)
│   ├── services/           # Tauri API 调用封装
│   ├── types/              # TypeScript 类型定义
│   └── utils/              # 工具函数 (BMI 计算)
├── src-tauri/              # Rust 后端源码
│   ├── src/
│   │   ├── lib.rs          # Tauri 命令实现
│   │   └── main.rs         # 应用入口
│   ├── icons/              # 应用图标
│   └── tauri.conf.json     # Tauri 配置
├── openspec/               # OpenSpec 规格文档
│   ├── specs/              # 当前功能规格
│   └── changes/archive/    # 已完成变更
├── docs/                   # 用户文档
└── .github/workflows/      # CI/CD 配置
```

## 功能截图

### 概览页面
- 当前体重和 BMI 显示
- 目标进度快速预览
- 快速记录体重

### 记录页面
- 月历视图展示所有记录
- 点击日期添加记录
- 点击记录编辑/删除

### 统计页面
- 交互式趋势图表
- 7天/30天/全部时间范围筛选
- 统计数据卡片

### 目标页面
- 时间线可视化进度
- 里程碑标记
- 预计达成时间
- 内联设置面板

## 数据格式

### 体重记录 (WeightRecord)

```typescript
{
  id: string;           // 唯一标识
  date: string;         // ISO 8601 日期
  weight: number;       // 体重 (kg)
  note?: string;        // 备注
  created_at: string;   // 创建时间
}
```

### CSV 导入格式

```csv
Date,Weight,Note
2024-01-15,70.5,早上空腹
```

## 数据存储位置

- **macOS**: `~/.weightlogger/data.json`
- **Windows**: `C:\Users\<用户名>\.weightlogger\data.json`

## 常见问题

**数据是否会上传到云端？**
不会。所有数据都存储在本地，保护您的隐私。

**如何备份数据？**
在"设置"页面点击"备份数据"按钮，会生成 JSON 备份文件。建议定期备份。

**如何导入其他应用的数据？**
支持 CSV 格式导入。格式为：`Date,Weight,Note`，日期格式为 `YYYY-MM-DD`。

**如何切换深色模式？**
点击右上角的主题切换按钮。

**安装包在哪里下载？**
推送代码到 GitHub 后，Actions 会自动构建 macOS 和 Windows 安装包，在仓库的 Actions 页面即可下载。Windows 有三种下载选项：
1. **MSI 安装程序** - 推荐用于大多数用户，标准安装向导
2. **NSIS 安装程序** - 另一种安装格式
3. **单独 .exe 文件** - 无需安装，直接运行（需要系统已安装 WebView2，Win10/11 通常已有）

## 文档

- [用户指南](docs/USER_GUIDE.md) - 详细的功能使用说明
- [Windows 构建指南](docs/WINDOWS_BUILD_GUIDE.md) - 如何在 Windows 上构建应用
- [E2E 测试场景](docs/E2E_TEST_SCENARIOS.md) - 端到端测试用例

## 贡献

欢迎贡献 Issue 和 Pull Request！

## 许可证

MIT License

## 致谢

- [Tauri](https://tauri.app/) - 跨平台桌面应用框架
- [Plotly.js](https://plotly.com/javascript/) - 交互式图表库
- [Lucide Icons](https://lucide.dev/) - 精美图标库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
