# Design: Weight Tracking Desktop Application

## Architecture Overview

应用采用 **Tauri + React** 架构，结合 Rust 后端和 React 前端，实现轻量级跨平台桌面应用。

```
┌─────────────────────────────────────────────────┐
│                   Frontend (React)               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│  │  UI 组件   │ │ 状态管理   │ │ 业务逻辑   │      │
│  └───────────┘ └───────────┘ └───────────┘      │
└─────────────────────────────────────────────────┘
                      ↓ Tauri IPC
┌─────────────────────────────────────────────────┐
│                   Backend (Rust)                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│  │ Command   │ │ 数据服务   │ │ 文件系统   │      │
│  │ Handlers  │ │           │ │ 操作       │      │
│  └───────────┘ └───────────┘ └───────────┘      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│              Local JSON File Storage             │
│         ~/.weightlogger/data.json                │
└─────────────────────────────────────────────────┘
```

## Technology Choices

### 框架选择：Tauri vs Electron

| 方面 | Tauri | Electron |
|------|-------|----------|
| 打包体积 | ~10 MB | ~150 MB |
| 内存占用 | ~50 MB | ~150-200 MB |
| 安全性 | Rust 内存安全 | 需要额外安全措施 |
| 学习曲线 | 需要 Rust 知识 | 纯 JS/TS |
| 生态 | 较新，快速增长 | 成熟，丰富 |

**决策：选择 Tauri**
- 个人使用场景，优先考虑轻量化和性能
- 简单的数据读写，Rust 开发成本可控
- 更小的安装包和运行时内存

### 前端框架：React

- 使用 React + TypeScript 构建类型安全的 UI
- 使用 React Hooks 进行状态管理
- 无需额外状态管理库（应用状态简单）

### 数据存储：JSON 文件

**优势：**
- 简单直观，用户可直接查看和编辑
- 无需数据库依赖
- 易于备份和迁移
- 适合个人使用场景

**权衡：**
- 不支持复杂查询（但应用无需）
- 大数据量性能下降（但个人数据量小）

## Data Model

```typescript
interface WeightRecord {
  id: string;          // UUID
  date: string;        // ISO 8601 date string
  weight: number;      // kg, 20-300
  note?: string;       // optional note
  createdAt: string;   // timestamp
}

interface UserProfile {
  height: number;      // cm
  gender?: 'male' | 'female';
}

interface Goal {
  targetWeight: number;    // kg
  targetDate?: string;     // ISO 8601 date string
  createdAt: string;
}

interface AppData {
  records: WeightRecord[];
  profile?: UserProfile;
  goal?: Goal;
  version: number;  // data format version
}
```

## Tauri Command API

```rust
// 数据读取
#[tauri::command]
async fn get_records() -> Result<Vec<WeightRecord>, String>

#[tauri::command]
async fn get_profile() -> Result<Option<UserProfile>, String>

#[tauri::command]
async fn get_goal() -> Result<Option<Goal>, String>

// 数据写入
#[tauri::command]
async fn save_record(record: WeightRecord) -> Result<(), String>

#[tauri::command]
async fn delete_record(id: String) -> Result<(), String>

#[tauri::command]
async fn update_profile(profile: UserProfile) -> Result<(), String>

#[tauri::command]
async fn update_goal(goal: Goal) -> Result<(), String>

// 导入导出
#[tauri::command]
async fn export_data(format: ExportFormat, path: String) -> Result<(), String>

#[tauri::command]
async fn import_data(path: String, strategy: ImportStrategy) -> Result<ImportResult, String>
```

## UI/UX Design System

### Design Style: 唯美简约少女风

应用采用 **Soft UI Evolution** 风格，结合柔和色彩和圆润设计，营造唯美简约少女风的视觉体验。

### Color Palette

| Role | Color Name | Hex | Usage |
|------|-----------|-----|-------|
| **Primary** | Soft Pink | `#FFB6C1` | 主要按钮、强调元素、品牌色 |
| **Secondary** | Sage Green | `#90EE90` | 次要元素、成功状态 |
| **Accent** | Gold | `#D4AF37` | 特殊高亮、庆祝动画 |
| **Background** | Cream | `#FFF8F0` | 浅色模式背景 |
| **Surface** | White Rose | `#FFF0F5` | 卡片、容器背景 |
| **Text Primary** | Deep Rose | `#8B475D` | 主要文字 |
| **Text Secondary** | Muted Plum | `#A87B94` | 次要文字 |
| **Border** | Pale Pink | `#FFD6E0` | 边框、分割线 |

### Typography

```typescript
// Tailwind Config
fontFamily: {
  heading: ['Varela Round', 'sans-serif'],
  body: ['Nunito Sans', 'sans-serif'],
}
```

**Font Pairing:** Varela Round (标题) + Nunito Sans (正文)
- 特点：圆润、友好、温暖
- 适用场景：柔和 UI、健康应用、女性向产品

**Google Fonts Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;500;600;700&family=Varela+Round&display=swap');
```

### Design Tokens

```typescript
// Spacing
spacing: {
  card: '1.5rem',      // 24px
  section: '2rem',     // 32px
  page: '3rem',        // 48px
}

// Border Radius
borderRadius: {
  sm: '0.5rem',        // 8px
  md: '0.75rem',       // 12px
  lg: '1rem',          // 16px
  xl: '1.5rem',        // 24px
  full: '9999px',
}

// Shadows (soft, minimal)
boxShadow: {
  soft: '0 4px 20px rgba(255, 182, 193, 0.15)',
  softLg: '0 8px 30px rgba(255, 182, 193, 0.2)',
}

// Transitions
transitionDuration: {
  default: '200ms',
}
```

### Component Styling Guidelines

#### Cards
```html
<div class="bg-rose-50/80 backdrop-blur-sm rounded-2xl shadow-soft p-6 cursor-pointer hover:shadow-softLg hover:-translate-y-1 transition-all duration-200">
  <!-- Content -->
</div>
```

#### Buttons
```html
<!-- Primary Button -->
<button class="bg-pink-300 hover:bg-pink-400 text-rose-900 font-medium rounded-xl px-6 py-3 transition-colors duration-200 cursor-pointer">
  保存
</button>

<!-- Secondary Button -->
<button class="bg-white/80 hover:bg-white border-2 border-pink-200 text-rose-700 rounded-xl px-6 py-3 transition-colors duration-200 cursor-pointer">
  取消
</button>
```

#### Form Inputs
```html
<input
  type="text"
  class="w-full bg-white/70 border-2 border-pink-200 focus:border-pink-400 rounded-xl px-4 py-3 text-rose-900 placeholder-rose-300 outline-none transition-colors duration-200"
  placeholder="输入体重..."
/>
```

### Light/Dark Mode

**Light Mode (Default):**
- 背景：Cream `#FFF8F0`
- 卡片：White Rose `#FFF0F5`
- 文字：Deep Rose `#8B475D`

**Dark Mode (Optional):**
- 背景：Deep Plum `#2D1F2E`
- 卡片：Dusted Plum `#3D2A3E`
- 文字：Pale Pink `#FFD6E0`

### UI Structure

```
App (主窗口)
├── Sidebar (侧边导航 - 圆润柔和风格)
│   ├── Logo & App Name
│   ├── Nav Items (图标 + 文字，圆角按钮)
│   │   ├── 📊 Dashboard
│   │   ├── 📝 Records
│   │   ├── 📈 Statistics
│   │   ├── 🎯 Goals
│   │   └── ⚙️ Settings
│   └── User Profile (底部)
└── MainContent
    ├── Header (页面标题 + 操作)
    └── Content Area
        ├── DashboardPage (卡片式概览)
        ├── RecordsPage (记录卡片列表)
        ├── StatisticsPage (图表 + 统计卡片)
        ├── GoalsPage (进度环 + 目标卡片)
        └── SettingsPage (设置选项卡片)
```

### Visual Effects

1. **Glassmorphism (轻量)**
   - 卡片使用 `backdrop-blur-sm` + 半透明背景
   - 仅在浅色模式使用，确保可读性

2. **Hover States**
   - 卡片悬停：轻微上浮 + 阴影增强
   - 按钮：颜色加深或透明度变化
   - 避免 scale 变换（防止布局偏移）

3. **Animations**
   - 页面切换：淡入淡出 (fade-in-out, 200ms)
   - 目标达成：彩带庆祝动画
   - 数据加载：柔和的骨架屏

4. **Icons**
   - 使用 Heroicons 或 Lucide 图标库
   - 统一使用 `w-6 h-6` 尺寸
   - 柔和粉色填充 `text-pink-400`

### Accessibility Checklist

- [ ] 文字对比度 ≥ 4.5:1
- [ ] 所有交互元素有 `cursor-pointer`
- [ ] 焦点状态可见 (`ring-2 ring-pink-400`)
- [ ] 支持键盘导航
- [ ] 提供 `prefers-reduced-motion` 媒体查询

## Error Handling Strategy

1. **前端错误边界**：捕获组件渲染错误
2. **API 错误处理**：统一的 Tauri invoke 错误处理
3. **数据验证**：前端 + 后端双重验证
4. **文件操作错误**：提供清晰的用户提示

## Future Considerations

### 可能的后续扩展
1. 云同步（但需要服务器，增加复杂度）
2. 多用户支持（但当前是个人使用）
3. 更多健康指标（BMI 已包含，可扩展体脂率等）

### 不在当前范围的考虑
1. 移动端版本（桌面应用优先）
2. 社交分享功能（个人使用，无需）
3. 数据分析功能（基础统计已足够）
