import { LSystemConfig } from '../types/lsystem';

export const classic3DPresets: LSystemConfig[] = [
  {
    name: '3D Hilbert Curve',
    description: '3D希尔伯特曲线',
    axiom: 'A',
    rules: {
      'A': 'B-F+CFC+F-D&F^D-F+&&CFC+F+B>>',
      'B': 'A>F<CFC<F-D^F^D-F->^^CFC<F+A',
      'C': 'B>F+CFC<F-D&FD-F-^^CFC<F+B>>',
      'D': 'B>F+CFC<F-D^F^D-F->^^CFC<F+A'
    },
    iterations: 3,
    angle2D: 90,
    angleYaw: 90,
    anglePitch: 90,
    angleRoll: 90,
    stepLength: 1,
    lineColor: '#00ff88',
    backgroundColor: '#1a1a2e'
  },
  {
    name: '3D Fractal Tree',
    description: '3D分形树',
    axiom: 'F',
    rules: {
      'F': 'F[&F]F[/F]F[^F]F'
    },
    iterations: 4,
    angle2D: 20,
    angleYaw: 20,
    anglePitch: 20,
    angleRoll: 20,
    stepLength: 1,
    lineColor: '#88d8b0',
    backgroundColor: '#1a1a2e'
  },
  {
    name: '3D Sierpinski Gasket',
    description: '3D谢尔宾斯基垫片',
    axiom: 'F-F-F-F',
    rules: {
      'F': 'F-F+F+FF-F-F+F'
    },
    iterations: 3,
    angle2D: 90,
    angleYaw: 90,
    anglePitch: 90,
    angleRoll: 90,
    stepLength: 2,
    lineColor: '#ff6b6b',
    backgroundColor: '#1a1a2e'
  }
];