import { LSystemConfig } from '../types/lsystem';

export const classic2DPresets: LSystemConfig[] = [
  {
    name: 'Koch Curve',
    description: '经典的科赫曲线',
    axiom: 'F',
    rules: {
      'F': 'F+F--F+F'
    },
    iterations: 4,
    angle2D: 60,
    stepLength: 4,
    lineColor: '#00ff88',
    backgroundColor: '#1a1a2e'
  },
  {
    name: 'Sierpinski Triangle',
    description: '谢尔宾斯基三角形',
    axiom: 'A',
    rules: {
      'A': 'B-A-B',
      'B': 'A+B+A'
    },
    iterations: 6,
    angle2D: 60,
    stepLength: 5,
    lineColor: '#ff6b6b',
    backgroundColor: '#1a1a2e'
  },
  {
    name: 'Dragon Curve',
    description: '龙形曲线',
    axiom: 'FX',
    rules: {
      'X': 'X+YF+',
      'Y': '-FX-Y'
    },
    iterations: 11,
    angle2D: 90,
    stepLength: 3,
    lineColor: '#4ecdc4',
    backgroundColor: '#1a1a2e'
  },
  {
    name: 'Fractal Plant',
    description: '分形植物',
    axiom: 'X',
    rules: {
      'X': 'F+[[X]-X]-F[-FX]+X',
      'F': 'FF'
    },
    iterations: 5,
    angle2D: 25,
    stepLength: 3,
    lineColor: '#88d8b0',
    backgroundColor: '#1a1a2e'
  },
  {
    name: 'Hilbert Curve',
    description: '希尔伯特曲线',
    axiom: 'A',
    rules: {
      'A': '-BF+AFA+FB-',
      'B': '+AF-BFB-FA+'
    },
    iterations: 5,
    angle2D: 90,
    stepLength: 3,
    lineColor: '#ffd93d',
    backgroundColor: '#1a1a2e'
  }
];
