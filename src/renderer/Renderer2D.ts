import { DrawCommand2D, RenderOptions2D, BoundingBox2D } from '../types/lsystem';
import { TurtleInterpreter2D } from '../core/Turtle2D';

export class Renderer2D {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cameraTransform: { offsetX: number; offsetY: number; scale: number };
  private isDragging: boolean = false;
  private lastMousePos: { x: number; y: number } = { x: 0, y: 0 };
  private commands: DrawCommand2D[] = [];
  private options: RenderOptions2D | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.cameraTransform = { offsetX: 0, offsetY: 0, scale: 1 };
    this.canvas.style.cursor = 'grab';
    this.setupEventListeners();
  }

  render(commands: DrawCommand2D[], options: RenderOptions2D): void {
    this.commands = commands;
    this.options = options;
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
    const scaleX = (canvasWidth - padding * 2) / (bounds.width || 1);
    const scaleY = (canvasHeight - padding * 2) / (bounds.height || 1);
    this.cameraTransform.scale = Math.min(scaleX, scaleY, 50);

    this.cameraTransform.offsetX =
      canvasWidth / 2 - (bounds.minX + bounds.width / 2) * this.cameraTransform.scale;
    this.cameraTransform.offsetY =
      canvasHeight / 2 + (bounds.minY + bounds.height / 2) * this.cameraTransform.scale;
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
  }

  private handleMouseDown(e: MouseEvent): void {
    this.isDragging = true;
    this.lastMousePos = { x: e.clientX, y: e.clientY };
    this.canvas.style.cursor = 'grabbing';
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.lastMousePos.x;
    const deltaY = e.clientY - this.lastMousePos.y;

    this.cameraTransform.offsetX += deltaX;
    this.cameraTransform.offsetY += deltaY;

    this.lastMousePos = { x: e.clientX, y: e.clientY };
    this.redraw();
  }

  private handleMouseUp(): void {
    this.isDragging = false;
    this.canvas.style.cursor = 'grab';
  }

  private handleWheel(e: WheelEvent): void {
    e.preventDefault();
    
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(100, this.cameraTransform.scale * scaleFactor));
    
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleRatio = newScale / this.cameraTransform.scale;
    
    this.cameraTransform.offsetX = mouseX - (mouseX - this.cameraTransform.offsetX) * scaleRatio;
    this.cameraTransform.offsetY = mouseY - (mouseY - this.cameraTransform.offsetY) * scaleRatio;
    this.cameraTransform.scale = newScale;

    this.redraw();
  }

  private redraw(): void {
    if (!this.options) return;
    
    const { width, height } = this.canvas;
    
    this.ctx.fillStyle = this.options.backgroundColor || '#1a1a2e';
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.strokeStyle = this.options.lineColor || '#00ff88';
    this.ctx.lineWidth = this.options.lineWidth || 1;
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    for (const cmd of this.commands) {
      if (cmd.type === 'line' && cmd.from && cmd.to) {
        const from = this.transform(cmd.from);
        const to = this.transform(cmd.to);
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
      }
    }
    this.ctx.stroke();
  }

  exportToPNG(): string {
    return this.canvas.toDataURL('image/png');
  }

  exportToSVG(commands: DrawCommand2D[], options: RenderOptions2D): string {
    const bounds = new TurtleInterpreter2D(0, 0).getBounds(commands);
    const viewBox = `${bounds.minX - 10} ${-bounds.maxY - 10} ${bounds.width + 20} ${bounds.height + 20}`;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">`;
    svg += `<style>line{stroke:${options.lineColor || '#00ff88'};stroke-width:${options.lineWidth || 1};stroke-linecap:round}</style>`;
    
    for (const cmd of commands) {
      if (cmd.type === 'line' && cmd.from && cmd.to) {
        svg += `<line x1="${cmd.from.x}" y1="${-cmd.from.y}" x2="${cmd.to.x}" y2="${-cmd.to.y}"/>`;
      }
    }
    svg += '</svg>';
    return svg;
  }

  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    if (this.commands.length > 0 && this.options) {
      this.redraw();
    }
  }

  resetCamera(): void {
    this.cameraTransform = { offsetX: 0, offsetY: 0, scale: 1 };
    if (this.commands.length > 0 && this.options) {
      const { width, height } = this.canvas;
      const bounds = new TurtleInterpreter2D(0, 0).getBounds(this.commands);
      this.autoFit(bounds, width, height);
      this.redraw();
    }
  }
}