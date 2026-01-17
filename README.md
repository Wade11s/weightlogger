# Weight Logger 🌸

一款简单美观的跨平台体重追踪桌面应用，采用 Tauri + React 构建。

## 功能特性

- ✅ **体重记录** - 每日体重记录，支持备注
- 📊 **数据可视化** - 美观的体重趋势图表
- 🎯 **目标追踪** - 设定目标体重，追踪进度
- 💾 **数据导入导出** - 支持 JSON/CSV 格式
- 🔄 **备份恢复** - 完整数据备份和恢复
- 🌓 **主题切换** - 支持浅色/深色模式
- 💾 **本地存储** - 数据保存在本地，保护隐私

## 技术栈

### 前端
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Recharts (图表)

### 后端
- Tauri 2.2
- Rust

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

# 构建 macOS 应用
npm run tauri build

# 代码检查
npm run lint
```

## 项目结构

```
weightlogger/
├── src/                    # React 前端源码
│   ├── components/         # UI 组件
│   ├── contexts/           # React Context
│   ├── services/           # API 调用
│   ├── types/              # TypeScript 类型
│   └── utils/              # 工具函数
├── src-tauri/              # Rust 后端源码
│   ├── src/                # Rust 源码
│   └── icons/              # 应用图标
├── openspec/               # OpenSpec 规格文档
└── docs/                   # 用户文档
```

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

## 贡献

欢迎贡献 Issue 和 Pull Request！

## 许可证

MIT License

## 致谢

- [Tauri](https://tauri.app/) - 跨平台桌面应用框架
- [Recharts](https://recharts.org/) - 图表库
- [Lucide Icons](https://lucide.dev/) - 图标库
