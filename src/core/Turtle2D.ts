import { DrawCommand2D, TurtleState2D, BoundingBox2D } from '../types/lsystem';

export class TurtleInterpreter2D {
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

    return { 
      minX: minX === Infinity ? 0 : minX,
      maxX: maxX === -Infinity ? 0 : maxX,
      minY: minY === Infinity ? 0 : minY,
      maxY: maxY === -Infinity ? 0 : maxY,
      width: (maxX === -Infinity ? 0 : maxX) - (minX === Infinity ? 0 : minX),
      height: (maxY === -Infinity ? 0 : maxY) - (minY === Infinity ? 0 : minY)
    };
  }
}