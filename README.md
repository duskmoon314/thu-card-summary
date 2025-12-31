# Tsinghua Card Annual Report Extension

清华大学卡年度消费报告生成器 - 浏览器扩展版本

[![Build Extension](https://github.com/duskmoon314/thu-card-summary/actions/workflows/build.yml/badge.svg)](https://github.com/duskmoon314/thu-card-summary/actions/workflows/build.yml)

## ✨ 功能特点

- 🎯 一键生成 2025 年度消费报告
- 📊 10 张精美的数据可视化海报
- 🎨 自定义字体选择（使用系统字体）
- 💾 下载海报图片（PNG 格式）
- 🔒 数据安全：本地处理，不上传服务器
- 🌐 多浏览器支持：Chrome、Firefox、Edge

## 📥 安装

### 从 GitHub Releases 下载（推荐）

1. 前往 [Releases](https://github.com/duskmoon314/thu-card-summary/releases) 页面
2. 下载对应浏览器的 zip 文件：
   - Chrome: `thu-card-annual-report-x.x.x-chrome.zip`
   - Firefox: `thu-card-annual-report-x.x.x-firefox.zip`
   - Edge: `thu-card-annual-report-x.x.x-edge.zip`

### Chrome / Edge

1. 访问 `chrome://extensions/` (Chrome) 或 `edge://extensions/` (Edge)
2. 启用"开发者模式"
3. 将下载的 zip 文件直接拖拽到页面中即可安装

### Firefox

1. 访问 `about:debugging#/runtime/this-firefox`
2. 点击"临时载入附加组件"
3. 选择下载的 zip 文件

## 🚀 使用方法

1. **访问校园卡网站**
   - 打开 https://card.tsinghua.edu.cn/userselftrade
   - 确保已登录

2. **生成报告**
   - 点击右下角的"年度报告"浮动按钮
   - 输入 10 位学号
   - 等待数据处理完成
   - 浏览 10 张报告海报

3. **自定义和下载**
   - 使用字体选择器切换海报字体
   - 点击"下载当前图片"保存海报

## 🛠️ 开发

### 环境要求

- [Bun](https://bun.sh/) >= 1.0

### 安装依赖

```bash
bun install
```

### 开发模式

```bash
bun run dev           # Chrome
bun run dev:firefox   # Firefox
```

### 构建生产版本

```bash
# 构建单个浏览器
bun run build         # Chrome (默认)
bun run build -b firefox
bun run build -b edge

# 构建并打包 zip
bun wxt zip           # Chrome
bun wxt zip -b firefox
bun wxt zip -b edge
```

构建产物在 `.output/` 目录：
- `.output/chrome-mv3/` - Chrome 扩展
- `.output/firefox-mv2/` - Firefox 扩展
- `.output/edge-mv3/` - Edge 扩展
- `.output/*.zip` - 打包的 zip 文件

## 🏗️ 技术栈

- **框架**: [WXT](https://wxt.dev/) - 现代化 Web 扩展开发框架
- **UI**: React 19 + [Ant Design v6](https://ant.design/)
- **图表**: [Recharts](https://recharts.org/) - 数据可视化
- **字体**: [Local Font Access API](https://developer.mozilla.org/en-US/docs/Web/API/Local_Font_Access_API)
- **图片导出**: [modern-screenshot](https://github.com/qq15725/modern-screenshot)
- **加密**: crypto-js (AES-128-ECB)
- **构建**: Vite + TypeScript

## 📁 项目结构

```
/entrypoints
  /background.ts          # Service Worker: API 调用和数据处理
  /content.tsx            # Content Script: 注入浮动按钮和面板
  /popup                  # 扩展弹窗: 使用说明
/components
  /ReportPanel.tsx        # 主面板组件
  /ReportView.tsx         # 报告查看器（轮播 + 字体选择 + 下载）
  /report/posters.tsx     # 10 张海报组件
/lib
  /api.ts                 # API 客户端和 AES 解密
  /data-processing.ts     # 数据分析逻辑
  /image-export.ts        # 图片导出功能
  /types.ts               # TypeScript 类型定义
```

## 🎨 海报列表

1. **基础统计** - 总消费、总顿数、食堂数、档口数
2. **最爱地点** - 最常去的食堂和档口
3. **性价比** - 最贵和最便宜的食堂
4. **用餐习惯** - 早中晚餐时间分布
5. **春节第一顿** - 春节后第一次消费
6. **时间之最** - 最早和最晚的用餐时间
7. **最贵一顿** - 单次消费最高记录
8. **最丰富一顿** - 单次访问档口最多
9. **打卡天数** - 全年在食堂的天数
10. **成绩单** - 综合评分 + 消费分布饼图

## 🔧 CI/CD

项目使用 GitHub Actions 自动构建：

- **触发条件**: Push、PR、Tag、手动触发
- **构建产物**: Chrome、Firefox、Edge 三个浏览器的 zip 包
- **自动发布**: Push tag（如 `v1.0.0`）时自动创建 GitHub Release

查看构建产物：
- 每次构建的 artifacts: [Actions](https://github.com/duskmoon314/thu-card-summary/actions)
- 正式发布版本: [Releases](https://github.com/duskmoon314/thu-card-summary/releases)

## 📝 许可证

MIT

## 🙏 致谢

基于 2024 年的 [thu-food-report](https://github.com/duskmoon314/thu-food-report) Next.js 版本重构，升级为浏览器扩展以绕过 CORS 限制。
