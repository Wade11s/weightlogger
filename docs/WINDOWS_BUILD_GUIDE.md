# Windows 构建指南

本文档介绍如何在 Windows 系统上构建 Weight Logger 应用。

## 环境要求

### 必需软件

1. **Node.js** (18+ 或 20+)
   - 下载: https://nodejs.org/
   - 验证: `node --version`

2. **Rust** (1.70+)
   - 下载: https://www.rust-lang.org/tools/install
   - 安装: `rustup.exe`
   - 验证: `cargo --version`

3. **Visual Studio C++ Build Tools**
   - 下载: https://visualstudio.microsoft.com/downloads/
   - 安装 "Desktop development with C++" 工作负载

4. **WebView2 Runtime**
   - Windows 10/11 通常已预装
   - 如需安装: https://developer.microsoft.com/en-us/microsoft-edge/webview2/

## 构建步骤

### 1. 克隆项目

```powershell
git clone <repository-url>
cd weightlogger
```

### 2. 安装依赖

```powershell
npm install
```

### 3. 开发模式运行

```powershell
npm run tauri dev
```

### 4. 构建生产版本

```powershell
npm run tauri build
```

构建完成后，应用程序将在以下位置：
- **应用**: `src-tauri\target\release\Weight Logger.exe`
- **安装程序**: `src-tauri\target\release\bundle\msi\Weight Logger_0.1.0_x64_en-US.msi`

## 构建输出说明

### 目录结构

```
src-tauri/target/release/bundle/
├── msi/                           # MSI 安装程序
│   └── Weight Logger_0.1.0_x64_en-US.msi
├── nsis/                          # NSIS 安装程序（如果配置）
│   └── Weight Logger_0.1.0_x64-setup.exe
└── wob/                           # 便携版（如果配置）
```

### MSI 安装程序

MSI 安装程序提供：
- 标准的 Windows 安装向导
- 自动创建桌面快捷方式
- 添加到"开始"菜单
- 注册表项（用于卸载）

安装步骤：
1. 双击 `.msi` 文件
2. 按照安装向导操作
3. 选择安装位置（默认：`C:\Users\<用户名>\AppData\Local\Programs\Weight Logger`）
4. 完成安装

## 常见问题

### 问题 1: WebView2 未找到

**错误信息**: `Error: WebView2 not found`

**解决方案**:
```powershell
# 从 Microsoft 下载并安装 WebView2 Runtime
# https://developer.microsoft.com/en-us/microsoft-edge/webview2/
```

### 问题 2: C++ 编译错误

**错误信息**: `error: link.exe not found`

**解决方案**:
1. 安装 Visual Studio Build Tools
2. 确保安装了 "Desktop development with C++" 工作负载
3. 重启终端

### 问题 3: OpenSSL 错误

**错误信息**: `error: failed to run custom build command for 'openssl-sys'`

**解决方案**:
```powershell
# 安装 OpenSSL (使用 vcpkg)
vcpkg install openssl:x64-windows-static
```

或设置环境变量：
```powershell
$env:OPENSSL_DIR = "C:\Program Files\OpenSSL-Win64"
$env:OPENSSL_LIB_DIR = "C:\Program Files\OpenSSL-Win64\lib"
$env:OPENSSL_INCLUDE_DIR = "C:\Program Files\OpenSSL-Win64\include"
```

### 问题 4: 构建速度慢

**解决方案**:
```powershell
# 使用 Rust 的 nightly 版本进行增量编译
rustup default nightly

# 或使用更多并行编译任务
set CARGO_BUILD_JOBS=8
npm run tauri build
```

## 打包选项

### 修改 Tauri 配置

编辑 `src-tauri/tauri.conf.json`:

```json
{
  "bundle": {
    "targets": ["msi", "nsis"],
    "icon": ["icons/icon.ico"],
    "copyright": "Copyright © 2024",
    "fileAssociations": [
      {
        "ext": "json",
        "name": "Weight Logger Data"
      }
    ]
  }
}
```

### 代码签名（发布用）

要发布到公开渠道，需要对应用进行代码签名：

1. 获取代码签名证书
2. 配置 `tauri.conf.json`:

```json
{
  "bundle": {
    "windows": {
      "certificateThumbprint": "YOUR_CERT_THUMBPRINT",
      "digestAlgorithm": "sha256"
    }
  }
}
```

3. 构建：
```powershell
npm run tauri build -- --sign
```

## 发布检查清单

- [ ] 在 Windows 10 和 Windows 11 上测试
- [ ] 验证所有功能正常
- [ ] 检查应用图标正确显示
- [ ] 验证安装程序正常工作
- [ ] 测试卸载流程
- [ ] 进行病毒扫描
- [ ] 代码签名（如需发布）

## 自动化构建

### GitHub Actions 配置

创建 `.github/workflows/build-windows.yml`:

```yaml
name: Build Windows

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: windows-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable

      - name: Install dependencies
        run: npm install

      - name: Build application
        run: npm run tauri build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: windows-bundle
          path: src-tauri/target/release/bundle/msi/*.msi
```

## 构建验证

构建完成后，运行以下验证：

```powershell
# 1. 验证应用可执行
.\src-tauri\target\release\Weight Logger.exe

# 2. 验证 MSI 安装
msiexec /i "src-tauri\target\release\bundle\msi\Weight Logger_0.1.0_x64_en-US.msi" /passive

# 3. 检查应用签名（如已签名）
Get-AuthenticodeSignature "Weight Logger.exe" | Format-List *
```

## 参考资料

- [Tauri Windows 构建文档](https://tauri.app/v1/guides/building/windows)
- [Windows 10 SDK](https://developer.microsoft.com/windows/downloads/windows-sdk/)
- [Microsoft WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
