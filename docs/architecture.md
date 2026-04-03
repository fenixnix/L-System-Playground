# L-System Playground 技术框架设计

## 1. 项目概述

**L-System Playground** 是一个交互式的 L 系统可视化平台，支持：
- ✅ 自定义 L 系统参数配置（公理、规则、角度、迭代次数）
- ✅ **2D 可视化渲染**（Canvas 2D）
- ✅ **3D 可视化渲染**（WebGL / Three.js）
- ✅ 预置经典 L 系统示例库
- ✅ 实时预览与参数调节
- ✅ 导出功能（PNG / SVG / JSON）

---

## 2. 技术栈选型

### 前端技术栈

| 层级 | 技术选型 | 理由 |
|------|---------|------|
| **框架** | React 18 + TypeScript | 类型安全、组件化、生态成熟 |
| **构建工具** | Vite | 快速HMR、原生ESM支持 |
| **2D渲染** | HTML5 Canvas API | 轻量、高性能2D绘图 |
| **3D渲染** | Three.js | 成熟WebGL封装、丰富几何体支持 |
| **状态管理** | Zustand | 轻量、简洁的React状态管理 |
| **UI组件库** | Ant Design / Arco Design | 企业级UI组件 |
| **代码编辑器** | Monaco Editor (VS Code引擎) | L系统表达式高亮编辑 |
| **样式方案** | CSS Modules + Tailwind CSS | 模块化 + 工具类 |

### 项目结构

```
l-system-playground/
├── docs/                          # 文档
│   ├── l-system-guide.md          # L系统技术指南
│   └── architecture.md            # 架构设计（本文件）
├── src/
│   ├── core/                      # 核心引擎层
│   │   ├── LSystem.ts             # L系统定义类型
│   │   ├── Generator.ts           # 字符串重写生成器
│   │   ├── Interpreter.ts         # 图形解释器基类
│   │   ├── Turtle2D.ts            # 2D海龟解释器
│   │   └── Turtle3D.ts            # 3D海龟解释器
│   ├── renderer/                  # 渲染层
│   │   ├── Renderer2D.ts          # Canvas 2D渲染器
│   │   ├── Renderer3D.ts          # Three.js 3D渲染器
│   │   ├── CameraController.ts    # 相机控制
│   │   └── Exporter.ts            # 导出工具
│   ├── presets/                   # 预置示例库
│   │   ├── index.ts               # 示例注册表
│   │   ├── classic2d.ts           # 经典2D示例
│   │   └── classic3d.ts           # 经典3D示例
│   ├── components/                # UI组件
│   │   ├── EditorPanel.tsx        # 编辑面板
│   │   ├── Canvas2DView.tsx       # 2D画布视图
│   │   ├── Canvas3DView.tsx       # 3D画布视图
│   │   ├── ControlPanel.tsx       # 参数控制面板
│   │   ├── PresetSelector.tsx     # 示例选择器
│   │   ├── StatusBar.tsx          # 状态栏
│   │   └── Toolbar.tsx            # 工具栏
│   ├── stores/                    # 状态管理
│   │   ├── useLSystemStore.ts     # L系统状态
│   │   └── useUIStore.ts          # UI状态
│   ├── types/                     # 类型定义
│   │   ├── lsystem.ts             # L系统相关类型
│   │   └── renderer.ts            # 渲染相关类型
│   ├── utils/                     # 工具函数
│   │   ├── math.ts                # 数学工具
│   │   └── geometry.ts            # 几何计算
│   ├── App.tsx                    # 应用入口
│   ├── main.tsx                   # 渲染入口
│   └── styles/                    # 全局样式
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

---

## 3. 核心架构设计

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │Editor    │  │Control   │  │Preset    │  │ View Switcher│ │
│  │Panel     │  │Panel     │  │Selector  │  │ (2D/3D)      │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘ │
│       └─────────────┼─────────────┼───────────────┘         │
│                     ▼             ▼                          │
│              ┌──────────────────────────┐                   │
│              │    State Store (Zustand)  │                   │
│              └────────────┬─────────────┘                   │
└───────────────────────────┼─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Core Engine Layer                       │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │ LSystem Model   │    │        Generator                 │ │
│  │ - axiom         │───▶│ - rewrite() → string            │ │
│  │ - rules         │    │ - estimateLength()              │ │
│  │ - iterations    │    │ - parallelGenerate() (可选)      │ │
│  │ - angle(s)      │    └──────────────┬──────────────────┘ │
│  │ - step length   │                   ▼                   │
│  └─────────────────┘    ┌─────────────────────────────────┐ │
│                         │      Interpreter Layer          │ │
│                         │  ┌───────────┐ ┌──────────────┐ │ │
│                         │  │Turtle2D   │ │Turtle3D       │ │ │
│                         │  │- state:   │ │- position     │ │ │
│                         │  │ (x,y,θ)   │ │- heading vec  │ │ │
│                         │  │- stack[]  │ │- up/left vec  │ │ │
│                         │  └─────┬─────┘ └──────┬───────┘ │ │
│                         └───────┼──────────────┼──────────┘ │
└─────────────────────────────────┼──────────────┼───────────┘
                                  ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Render Layer                            │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │    Renderer2D (Canvas)   │  │   Renderer3D (Three.js)  │ │
│  │  - drawLine()            │  │  - LineSegments          │ │
│  │  - drawPath()            │  │  - TubeGeometry (粗线)   │ │
│  │  - applyTransform()      │  │  - OrbitControls        │ │
│  │  - exportToSVG/PNG()     │  │  - exportToGLTF/PNG()   │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 数据流设计

```
用户输入参数
     │
     ▼
┌─────────────┐     验证      ┌─────────────┐
│  UI Input   │ ────────────▶ │ State Store │
└─────────────┘               └──────┬──────┘
                                     │
                              触发重新生成
                                     │
                                     ▼
                             ┌──────────────┐
                             │  Generator   │
                             │  .generate() │
                             └──────┬───────┘
                                    │
                           返回生成的字符串
                                    │
                    ┌───────────────┼───────────────┐
                    ▼                               ▼
            ┌───────────────┐               ┌───────────────┐
            │ Turtle2D      │               │ Turtle3D      │
            │ .interpret()  │               │ .interpret()  │
            └───────┬───────┘               └───────┬───────┘
                    ▼                               ▼
            ┌───────────────┐               ┌───────────────┐
            │ DrawCommands  │               │ DrawCommands  │
            │ (line segments│               │ (3D vertices) │
            │  path data)   │               │               │
            └───────┬───────┘               └───────┬───────┘
                    ▼                               ▼
            ┌───────────────┐               ┌───────────────┐
            │ Renderer2D    │               │ Renderer3D    │
            │ Canvas draw   │               │ Three.js      │
            └───────────────┘               └───────────────┘
```

---

## 4. 核心数据模型设计

### 4.1 L系统配置接口

```typescript
interface LSystemConfig {
  name: string;
  description?: string;

  // 基础配置
  axiom: string;                    // 公理/初始字符串
  rules: Record<string, string>;    // 产生式规则 { 'F': 'F+F-F-F+F' }
  iterations: number;               // 迭代次数

  // 2D参数
  angle2D: number;                  // 2D旋转角度（度数）
  stepLength: number;               // 步长
  startingAngle?: number;           // 初始角度

  // 3D参数
  angleYaw?: number;                // Yaw角 (+/-)
  anglePitch?: number;              // Pitch角 (&/^)
  angleRoll?: number;               // Roll角 (/|\)

  // 高级选项
  isStochastic?: boolean;           // 是否随机L系统
  stochasticRules?: StochasticRule[]; // 概率规则集
  ignoreChars?: string;             // 忽略的字符集合

  // 渲染选项
  lineColor?: string;               // 线条颜色
  lineWidth?: number;               // 线条宽度
  backgroundColor?: string;         // 背景色
}
```

### 4.2 随机规则接口

```typescript
interface StochasticRule {
  symbol: string;
  replacements: {
    result: string;
    probability: number;            // 0-1, 总和应为1
  }[];
}
```

### 4.3 绘制命令接口

```typescript
// 2D绘制命令
interface DrawCommand2D {
  type: 'move' | 'line' | 'push' | 'pop';
  from?: { x: number; y: number };
  to?: { x: number; y: number };
}

// 3D绘制命令
interface DrawCommand3D {
  type: 'move' | 'line' | 'push' | 'pop';
  from?: Vector3;
  to?: Vector3;
}

// 海龟状态
interface TurtleState2D {
  x: number;
  y: number;
  angle: number;
}

interface TurtleState3D {
  position: Vector3;
  heading: Vector3;    // 前方向量
  up: Vector3;         // 上方向量
  left: Vector3;       // 左方向量
}
```

---

## 5. 核心模块详细设计

### 5.1 Generator（字符串生成器）

职责：根据L系统配置递归生成字符串

```typescript
class LSystemGenerator {
  private config: LSystemConfig;

  constructor(config: LSystemConfig) {
    this.config = config;
  }

  generate(): string {
    let current = this.config.axiom;

    for (let i = 0; i < this.config.iterations; i++) {
      current = this.rewrite(current);
    }

    return current;
  }

  private rewrite(input: string): string {
    let output = '';
    for (const char of input) {
      if (this.config.rules[char]) {
        if (this.config.isStochastic) {
          output += this.applyStochasticRule(char);
        } else {
          output += this.config.rules[char];
        }
      } else {
        output += char;
      }
    }
    return output;
  }

  estimateLength(): number {
    const expansionFactor = this.calculateExpansionFactor();
    return Math.floor(this.config.axiom.length * Math.pow(expansionFactor, this.config.iterations));
  }

  private calculateExpansionFactor(): number {
    let total = 0;
    for (const char of this.config.axiom) {
      total += this.config.rules[char]?.length ?? 1;
    }
    return total / this.config.axiom.length || 1;
  }

  private applyStochasticRule(symbol: string): string {
    const rule = this.config.stochasticRules?.find(r => r.symbol === symbol);
    if (!rule) return symbol;

    const rand = Math.random();
    let cumulative = 0;
    for (const replacement of rule.replacements) {
      cumulative += replacement.probability;
      if (rand <= cumulative) {
        return replacement.result;
      }
    }
    return rule.replacements[rule.replacements.length - 1].result;
  }
}
```

### 5.2 Turtle2D（2D海龟解释器）

职责：将字符串转换为2D绘制命令序列

```typescript
class TurtleInterpreter2D {
  private angleUnit: number;
  private stepLength: number;

  constructor(angleDeg: number, stepLength: number) {
    this.angleUnit = angleDeg * Math.PI / 180;
    this.stepLength = stepLength;
  }

  interpret(lString: string): DrawCommand2D[] {
    const commands: DrawCommand2D[] = [];
    const stack: TurtleState2D[] = [];

    let state: TurtleState2D = {
      x: 0,
      y: 0,
      angle: 0
    };

    for (const char of lString) {
      switch (char) {
        case 'F': {
          const newX = state.x + this.stepLength * Math.cos(state.angle);
          const newY = state.y + this.stepLength * Math.sin(state.angle);
          commands.push({
            type: 'line',
            from: { x: state.x, y: state.y },
            to: { x: newX, y: newY }
          });
          state.x = newX;
          state.y = newY;
          break;
        }
        case 'f': {
          state.x += this.stepLength * Math.cos(state.angle);
          state.y += this.stepLength * Math.sin(state.angle);
          break;
        }
        case '+':
          state.angle += this.angleUnit;
          break;
        case '-':
          state.angle -= this.angleUnit;
          break;
        case '[':
          stack.push({ ...state });
          commands.push({ type: 'push' });
          break;
        case ']':
          if (stack.length > 0) {
            state = stack.pop()!;
          }
          commands.push({ type: 'pop' });
          break;
      }
    }

    return commands;
  }

  getBounds(commands: DrawCommand2D[]): BoundingBox2D {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const cmd of commands) {
      if (cmd.type === 'line' && cmd.from && cmd.to) {
        minX = Math.min(minX, cmd.from.x, cmd.to.x);
        maxX = Math.max(maxX, cmd.from.x, cmd.to.x);
        minY = Math.min(minY, cmd.from.y, cmd.to.y);
        maxY = Math.max(maxY, cmd.from.y, cmd.to.y);
      }
    }

    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
  }
}
```

### 5.3 Turtle3D（3D海龟解释器）

职责：将字符串转换为3D绘制命令序列，使用方向向量表示朝向

```typescript
import * as THREE from 'three';

class TurtleInterpreter3D {
  private angles: { yaw: number; pitch: number; roll: number };
  private stepLength: number;

  constructor(angles: { yaw: number; pitch: number; roll: number }, stepLength: number) {
    this.angles = {
      yaw: angles.yaw * Math.PI / 180,
      pitch: angles.pitch * Math.PI / 180,
      roll: angles.roll * Math.PI / 180,
    };
    this.stepLength = stepLength;
  }

  interpret(lString: string): DrawCommand3D[] {
    const commands: DrawCommand3D[] = [];
    const stack: TurtleState3D[] = [];

    let turtle: TurtleState3D = {
      position: new THREE.Vector3(0, 0, 0),
      heading: new THREE.Vector3(1, 0, 0),
      up: new THREE.Vector3(0, 1, 0),
      left: new THREE.Vector3(0, 0, 1),
    };

    for (const char of lString) {
      switch (char) {
        case 'F': {
          const newPos = turtle.position.clone().add(
            turtle.heading.clone().multiplyScalar(this.stepLength)
          );
          commands.push({
            type: 'line',
            from: turtle.position.clone(),
            to: newPos.clone()
          });
          turtle.position = newPos;
          break;
        }
        case '+':
          this.rotateAround(turtle, turtle.up, this.angles.yaw);
          break;
        case '-':
          this.rotateAround(turtle, turtle.up, -this.angles.yaw);
          break;
        case '&':
          this.rotateAround(turtle, turtle.left, this.angles.pitch);
          break;
        case '^':
          this.rotateAround(turtle, turtle.left, -this.angles.pitch);
          break;
        case '/':
          this.rotateAround(turtle, turtle.heading, this.angles.roll);
          break;
        case '\\':
          this.rotateAround(turtle, turtle.heading, -this.angles.roll);
          break;
        case '[':
          stack.push(this.deepCopy(turtle));
          commands.push({ type: 'push' });
          break;
        case ']':
          if (stack.length > 0) {
            turtle = stack.pop()!;
          }
          commands.push({ type: 'pop' });
          break;
      }
    }

    return commands;
  }

  private rotateAround(turtle: TurtleState3D, axis: THREE.Vector3, angle: number): void {
    const matrix = new THREE.Matrix4().makeRotationAxis(axis.normalize(), angle);
    turtle.heading.applyMatrix4(matrix).normalize();
    turtle.up.applyMatrix4(matrix).normalize();
    turtle.left.applyMatrix4(matrix).normalize();
  }

  private deepCopy(t: TurtleState3D): TurtleState3D {
    return {
      position: t.position.clone(),
      heading: t.heading.clone(),
      up: t.up.clone(),
      left: t.left.clone(),
    };
  }
}
```

### 5.4 Renderer2D（Canvas 2D渲染器）

```typescript
class Renderer2D {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cameraTransform: Transform2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.cameraTransform = { offsetX: 0, offsetY: 0, scale: 1 };
  }

  render(commands: DrawCommand2D[], options: RenderOptions2D): void {
    const { width, height } = this.canvas;
    const bounds = new TurtleInterpreter2D(0, 0).getBounds(commands);

    this.ctx.fillStyle = options.backgroundColor || '#1a1a2e';
    this.ctx.fillRect(0, 0, width, height);

    this.autoFit(bounds, width, height);

    this.ctx.strokeStyle = options.lineColor || '#00ff88';
    this.ctx.lineWidth = options.lineWidth || 1;
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    for (const cmd of commands) {
      if (cmd.type === 'line' && cmd.from && cmd.to) {
        const from = this.transform(cmd.from);
        const to = this.transform(cmd.to);
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
      }
    }
    this.ctx.stroke();
  }

  private transform(point: { x: number; y: number }): { x: number; y: number } {
    return {
      x: point.x * this.cameraTransform.scale + this.cameraTransform.offsetX,
      y: -point.y * this.cameraTransform.scale + this.cameraTransform.offsetY,
    };
  }

  private autoFit(bounds: BoundingBox2D, canvasWidth: number, canvasHeight: number): void {
    const padding = 40;
    const scaleX = (canvasWidth - padding * 2) / bounds.width;
    const scaleY = (canvasHeight - padding * 2) / bounds.height;
    this.cameraTransform.scale = Math.min(scaleX, scaleY, 50);

    this.cameraTransform.offsetX =
      canvasWidth / 2 - (bounds.minX + bounds.width / 2) * this.cameraTransform.scale;
    this.cameraTransform.offsetY =
      canvasHeight / 2 + (bounds.minY + bounds.height / 2) * this.cameraTransform.scale;
  }

  exportToPNG(): string {
    return this.canvas.toDataURL('image/png');
  }

  exportToSVG(commands: DrawCommand2D[], options: RenderOptions2D): string {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${this.getViewBox(commands)}">`;
    svg += `<style>line{stroke:${options.lineColor || '#00ff88'};stroke-width:${options.lineWidth || 1}}</style>`;
    for (const cmd of commands) {
      if (cmd.type === 'line' && cmd.from && cmd.to) {
        svg += `<line x1="${cmd.from.x}" y1="${cmd.from.y}" x2="${cmd.to.x}" y2="${cmd.to.y}"/>`;
      }
    }
    svg += '</svg>';
    return svg;
  }
}
```

### 5.5 Renderer3D（Three.js 3D渲染器）

```typescript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class Renderer3D {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private linesGroup: THREE.Group;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);

    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(5, 5, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.linesGroup = new THREE.Group();
    this.scene.add(this.linesGroup);

    this.addLights();
  }

  render(commands: DrawCommand3D[], options: RenderOptions3D): void {
    this.clearLines();

    const points: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];
    const color = new THREE.Color(options.lineColor || '#00ff88');

    for (const cmd of commands) {
      if (cmd.type === 'line' && cmd.from && cmd.to) {
        points.push(cmd.from, cmd.to);
        colors.push(color, color);
      }
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(
      colors.flatMap(c => [c.r, c.g, c.b]), 3
    ));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: options.lineWidth || 1,
    });

    const lineSegments = new THREE.LineSegments(geometry, material);
    this.linesGroup.add(lineSegments);

    this.autoCenterAndZoom();
    this.animate();
  }

  private addLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    this.scene.add(directionalLight);
  }

  private autoCenterAndZoom(): void {
    const box = new THREE.Box3().setFromObject(this.linesGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    this.linesGroup.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    const distance = (maxDim / 2) / Math.tan(fov / 2) * 2;

    this.camera.position.set(distance, distance, distance);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  private animate(): void {
    const loop = () => {
      requestAnimationFrame(loop);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  clearLines(): void {
    while (this.linesGroup.children.length > 0) {
      const child = this.linesGroup.children[0];
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
        child.geometry.dispose();
        (child as THREE.Material).dispose();
      }
      this.linesGroup.remove(child);
    }
  }

  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  exportToPNG(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  dispose(): void {
    this.clearLines();
    this.controls.dispose();
    this.renderer.dispose();
  }
}
```

---

## 6. UI组件布局设计

### 6.1 主界面布局

```
┌──────────────────────────────────────────────────────────────────┐
│  Toolbar: [2D/3D切换] [导出] [重置] [预设选择] [主题]    [设置⚙️] │
├──────────────┬───────────────────────────────────────────────────┤
│              │                                                   │
│  Editor      │              Canvas Area                          │
│  Panel       │          (2D / 3D Viewport)                       │
│  ┌────────┐  │                                                    │
│  │Axiom:  │  │     ┌──────────────────────────┐                  │
│  │F++F++F │  │     │                          │                  │
│  ├────────┤  │     │    L-System Visualization │                  │
│  │Rules:  │  │     │                          │                  │
│  │F→...   │  │     │                          │                  │
│  ├────────┤  │     │                          │                  │
│  │Angle:  │  │     │                          │                  │
│  │60°     │  │     └──────────────────────────┘                  │
│  ├────────┤  │                                                    │
│  │Iter:   │  │  Status: 字符串长度: 12,480 | 渲染耗时: 23ms      │
│  │[====4=]│  │                                                    │
│  └────────┘  │                                                    │
├──────────────┴───────────────────────────────────────────────────┤
│  Control Panel: [步长] [线宽] [颜色] [背景色] [动画] [性能监控]   │
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 关键UI组件说明

#### EditorPanel（编辑面板）
- **Monaco Editor**: 支持语法高亮的L系统表达式编辑
- **实时验证**: 检测语法错误和循环引用
- **自动补全**: 常用符号和预设模板补全

#### ControlPanel（控制面板）
- **滑块控件**: 步长、角度、迭代次数等数值参数
- **颜色选择器**: 线条颜色、背景色
- **复选框**: 动画模式、显示坐标轴、网格等

#### PresetSelector（预设选择器）
- **分类标签页**: 经典分形 / 植物 / 3D结构 / 自定义
- **卡片式展示**: 缩略图 + 名称 + 描述
- **一键加载**: 点击即应用配置

---

## 7. 性能优化策略

### 7.1 字符串生成优化

| 问题 | 解决方案 |
|------|---------|
| 字符串爆炸 O(k^n) | 设置最大字符串长度上限（如500万字符） |
| 同步阻塞UI | 使用 Web Worker 进行后台生成 |
| 内存占用大 | 使用流式处理，边生成边解析 |

### 7.2 渲染优化

| 场景 | 优化手段 |
|------|---------|
| 大量线段 | 使用 `BufferGeometry` 合并绘制 |
| 3D复杂场景 | LOD（细节层次），远距离降低迭代次数 |
| 实时预览 | Debounce 输入，300ms延迟后重新渲染 |
| GPU加速 | 使用 InstancedRendering 处理重复分支 |

### 7.3 Web Worker架构

```
Main Thread                    Worker Thread
┌──────────────┐              ┌──────────────┐
│  UI React    │──config────▶│  Generator   │
│              │◀──string────│  .generate() │
│  Renderer    │──string────▶│  Interpreter │
│  .render()   │              │  .interpret()│
│              │◀──commands──│              │
└──────────────┘              └──────────────┘
```

---

## 8. 扩展功能规划

### Phase 1（MVP）
- [x] 基础L系统配置与生成
- [x] 2D Canvas渲染
- [x] 3D Three.js渲染
- [x] 预置经典示例（5+）
- [x] PNG/SVG导出

### Phase 2（增强）
- [ ] 参数化L系统支持
- [ ] 随机L系统支持
- [ ] 动画模式（逐步生长过程）
- [ ] WebGL着色器特效（发光线条）
- [ ] 多种配色方案

### Phase 3（高级）
- [ ] 上下文相关L系统
- [ ] 体积渲染（树干/叶片模型）
- [ ] GLTF/GLB 3D导出
- [ ] 分享链接（URL编码配置）
- [ ] 社区预设库

---

## 9. 依赖清单

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "zustand": "^4.4.0",
    "@monaco-editor/react": "^4.6.0",
    "antd": "^5.12.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/three": "^0.160.0"
  }
}
```

---

## 10. 开发路线图建议

```
Week 1: 项目初始化 + 核心引擎（Generator + Turtle2D/3D）
Week 2: 2D渲染器完成 + 基础UI框架
Week 3: 3D渲染器完成 + 视图切换
Week 4: 预置示例库 + 导出功能 + 打磨UI
```
