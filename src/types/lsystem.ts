// L 系统配置接口
export interface LSystemConfig {
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

// 随机规则接口
export interface StochasticRule {
  symbol: string;
  replacements: {
    result: string;
    probability: number;            // 0-1, 总和应为1
  }[];
}

// 2D绘制命令
export interface DrawCommand2D {
  type: 'move' | 'line' | 'push' | 'pop';
  from?: { x: number; y: number };
  to?: { x: number; y: number };
}

// 3D绘制命令
export interface DrawCommand3D {
  type: 'move' | 'line' | 'push' | 'pop';
  from?: { x: number; y: number; z: number };
  to?: { x: number; y: number; z: number };
}

// 2D海龟状态
export interface TurtleState2D {
  x: number;
  y: number;
  angle: number;
}

// 3D海龟状态
export interface TurtleState3D {
  position: { x: number; y: number; z: number };
  heading: { x: number; y: number; z: number };    // 前方向量
  up: { x: number; y: number; z: number };         // 上方向量
  left: { x: number; y: number; z: number };       // 左方向量
}

// 2D边界框
export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
}

// 2D渲染选项
export interface RenderOptions2D {
  lineColor?: string;
  lineWidth?: number;
  backgroundColor?: string;
}

// 3D渲染选项
export interface RenderOptions3D {
  lineColor?: string;
  lineWidth?: number;
  backgroundColor?: string;
}