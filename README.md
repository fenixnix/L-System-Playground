# L-System Playground

一个基于 Web 的 L-System 可视化项目，支持 2D 和 3D 分形图形生成。

## 功能特性

- 🌿 实时预览 L-System 分形图形
- 🎨 支持 2D 和 3D 渲染模式
- 📝 可编辑的 L-System 规则（公理、规则、角度等）
- 🎯 内置经典预设（树、蕨类植物、希尔伯特曲线等）
- 🔄 动态调整迭代次数和线条长度

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **3D 渲染**: Three.js
- **UI**: 自定义组件

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 部署到 GitHub Pages

项目已配置 GitHub Actions，推送到 main 分支后会自动部署。

## L-System 基础

L-System（Lindenmayer System）是一种形式文法，用于模拟植物生长和分形图形。

### 基本参数

- **Axiom（公理）**: 初始字符串
- **Rules（规则）**: 字符替换规则
- **Angle（角度）**: 旋转角度
- **Iterations（迭代次数）**: 递归深度

### 绘图指令

- `F`: 向前绘制
- `+`: 向右旋转
- `-`: 向左旋转
- `[`: 保存当前状态
- `]`: 恢复之前状态

## 许可证

MIT License
