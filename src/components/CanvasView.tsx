import React, { useEffect, useRef, useState } from 'react';
import { DrawCommand2D, DrawCommand3D, RenderOptions2D, RenderOptions3D } from '../types/lsystem';
import { Renderer2D } from '../renderer/Renderer2D';
import { Renderer3D } from '../renderer/Renderer3D';

interface CanvasViewProps {
  commands2D: DrawCommand2D[];
  commands3D: DrawCommand3D[];
  viewMode: '2d' | '3d';
  renderOptions: RenderOptions2D & RenderOptions3D;
}

export const CanvasView: React.FC<CanvasViewProps> = ({ 
  commands2D, 
  commands3D, 
  viewMode, 
  renderOptions 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderer2DRef = useRef<Renderer2D | null>(null);
  const renderer3DRef = useRef<Renderer3D | null>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      const width = containerRef.current!.clientWidth;
      const height = containerRef.current!.clientHeight;
      setSize({ width, height });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (viewMode === '2d' && canvasRef.current) {
      if (!renderer2DRef.current) {
        renderer2DRef.current = new Renderer2D(canvasRef.current);
      } else {
        renderer2DRef.current.resetCamera();
      }
      renderer2DRef.current.resize(size.width, size.height);
      renderer2DRef.current.render(commands2D, renderOptions);
    }
  }, [commands2D, viewMode, size, renderOptions]);

  useEffect(() => {
    if (viewMode === '3d' && containerRef.current) {
      if (!renderer3DRef.current) {
        renderer3DRef.current = new Renderer3D(containerRef.current);
      } else {
        renderer3DRef.current.resetCamera();
      }
      renderer3DRef.current.resize(size.width, size.height);
      renderer3DRef.current.render(commands3D, renderOptions);
    }
  }, [commands3D, viewMode, size, renderOptions]);

  return (
    <div 
      ref={containerRef} 
      style={{
        flex: 1,
        position: 'relative',
        minHeight: '600px',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: renderOptions.backgroundColor || '#1a1a2e',
      }}
    >
      {viewMode === '2d' && (
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </div>
  );
};