import { DrawCommand3D, TurtleState3D } from '../types/lsystem';

export class TurtleInterpreter3D {
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
      position: { x: 0, y: 0, z: 0 },
      heading: { x: 1, y: 0, z: 0 },
      up: { x: 0, y: 1, z: 0 },
      left: { x: 0, y: 0, z: 1 },
    };

    for (const char of lString) {
      switch (char) {
        case 'F': {
          const newPos = {
            x: turtle.position.x + turtle.heading.x * this.stepLength,
            y: turtle.position.y + turtle.heading.y * this.stepLength,
            z: turtle.position.z + turtle.heading.z * this.stepLength
          };
          commands.push({
            type: 'line',
            from: { ...turtle.position },
            to: newPos
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

  private rotateAround(turtle: TurtleState3D, axis: { x: number; y: number; z: number }, angle: number): void {
    // 简单的向量旋转实现
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    
    // 归一化轴向量
    const len = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
    const ux = axis.x / len;
    const uy = axis.y / len;
    const uz = axis.z / len;

    // 旋转矩阵
    const rotationMatrix = [
      [cosA + ux * ux * (1 - cosA), ux * uy * (1 - cosA) - uz * sinA, ux * uz * (1 - cosA) + uy * sinA],
      [uy * ux * (1 - cosA) + uz * sinA, cosA + uy * uy * (1 - cosA), uy * uz * (1 - cosA) - ux * sinA],
      [uz * ux * (1 - cosA) - uy * sinA, uz * uy * (1 - cosA) + ux * sinA, cosA + uz * uz * (1 - cosA)]
    ];

    // 应用旋转到方向向量
    turtle.heading = this.applyRotation(turtle.heading, rotationMatrix);
    turtle.up = this.applyRotation(turtle.up, rotationMatrix);
    turtle.left = this.applyRotation(turtle.left, rotationMatrix);
  }

  private applyRotation(v: { x: number; y: number; z: number }, matrix: number[][]): { x: number; y: number; z: number } {
    return {
      x: v.x * matrix[0][0] + v.y * matrix[0][1] + v.z * matrix[0][2],
      y: v.x * matrix[1][0] + v.y * matrix[1][1] + v.z * matrix[1][2],
      z: v.x * matrix[2][0] + v.y * matrix[2][1] + v.z * matrix[2][2]
    };
  }

  private deepCopy(t: TurtleState3D): TurtleState3D {
    return {
      position: { ...t.position },
      heading: { ...t.heading },
      up: { ...t.up },
      left: { ...t.left },
    };
  }
}