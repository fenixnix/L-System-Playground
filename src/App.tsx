import { useState, useEffect, useRef } from 'react';
import { EditorPanel } from './components/EditorPanel';
import { CanvasView } from './components/CanvasView';
import { ControlPanel } from './components/ControlPanel';
import { PresetSelector } from './components/PresetSelector';
import { LSystemConfig, DrawCommand2D, DrawCommand3D } from './types/lsystem';
import { LSystemGenerator } from './core/Generator';
import { TurtleInterpreter2D } from './core/Turtle2D';
import { TurtleInterpreter3D } from './core/Turtle3D';
import { classic2DPresets } from './presets/classic2d';

function App() {
  // 状态管理
  const [config, setConfig] = useState<LSystemConfig>(classic2DPresets[0]);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [isGenerating, setIsGenerating] = useState(false);
  const [stringLength, setStringLength] = useState(0);
  const [renderTime, setRenderTime] = useState(0);
  const [commands2D, setCommands2D] = useState<DrawCommand2D[]>([]);
  const [commands3D, setCommands3D] = useState<DrawCommand3D[]>([]);
  
  // 渲染器引用
  const renderer2DRef = useRef<any>(null);
  const renderer3DRef = useRef<any>(null);

  // 生成 L 系统
  useEffect(() => {
    const generateLSystem = async () => {
      setIsGenerating(true);
      
      try {
        const startTime = performance.now();
        
        // 生成字符串
        const generator = new LSystemGenerator(config);
        const lString = generator.generate();
        setStringLength(lString.length);

        // 2D 解释
        const turtle2D = new TurtleInterpreter2D(config.angle2D, config.stepLength);
        const commands2D = turtle2D.interpret(lString);
        setCommands2D(commands2D);

        // 3D 解释
        const turtle3D = new TurtleInterpreter3D(
          {
            yaw: config.angleYaw || config.angle2D,
            pitch: config.anglePitch || config.angle2D,
            roll: config.angleRoll || config.angle2D
          },
          config.stepLength
        );
        const commands3D = turtle3D.interpret(lString);
        setCommands3D(commands3D);

        const endTime = performance.now();
        setRenderTime(endTime - startTime);
      } catch (error) {
        console.error('Error generating L-system:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    generateLSystem();
  }, [config]);

  // 处理配置变化
  const handleConfigChange = (newConfig: LSystemConfig) => {
    setConfig(newConfig);
  };

  // 处理预置选择
  const handlePresetSelect = (preset: LSystemConfig) => {
    setConfig(preset);
  };

  // 导出 PNG
  const handleExportPNG = () => {
    if (viewMode === '2d' && renderer2DRef.current) {
      const dataUrl = renderer2DRef.current.exportToPNG();
      downloadFile(dataUrl, 'l-system-2d.png');
    } else if (viewMode === '3d' && renderer3DRef.current) {
      const dataUrl = renderer3DRef.current.exportToPNG();
      downloadFile(dataUrl, 'l-system-3d.png');
    }
  };

  // 导出 SVG
  const handleExportSVG = () => {
    if (viewMode === '2d' && renderer2DRef.current) {
      const svg = renderer2DRef.current.exportToSVG(commands2D, config);
      downloadFile('data:image/svg+xml;utf8,' + encodeURIComponent(svg), 'l-system-2d.svg');
    }
  };

  // 下载文件
  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>L-System Playground</h1>
          <p style={styles.subtitle}>Interactive Lindenmayer System Visualizer</p>
        </div>
        <div style={styles.headerRight}>
          <ControlPanel 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onExportPNG={handleExportPNG}
            onExportSVG={handleExportSVG}
            isGenerating={isGenerating}
            stringLength={stringLength}
            renderTime={renderTime}
          />
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.leftPanel}>
          <EditorPanel 
            config={config} 
            onConfigChange={handleConfigChange} 
          />
        </div>

        <div style={styles.centerPanel}>
          <CanvasView 
            commands2D={commands2D}
            commands3D={commands3D}
            viewMode={viewMode}
            renderOptions={{
              lineColor: config.lineColor,
              lineWidth: config.lineWidth,
              backgroundColor: config.backgroundColor
            }}
          />
        </div>

        <div style={styles.rightPanel}>
          <PresetSelector onPresetSelect={handlePresetSelect} />
        </div>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>L-System Playground © 2026</p>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#e0e0e0',
  },
  header: {
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    borderBottom: '1px solid #16213e',
  },
  headerLeft: {
    textAlign: 'left' as const,
  },
  headerRight: {
    flex: 1,
    maxWidth: '800px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700' as const,
    marginBottom: '2px',
    background: 'linear-gradient(45deg, #00ff88, #4ecdc4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '12px',
    color: '#b0b0b0',
    marginBottom: '0',
  },
  main: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    minHeight: 'calc(100vh - 300px)',
  },
  leftPanel: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    overflow: 'hidden' as const,
  },
  centerPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  rightPanel: {
    width: '280px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    overflow: 'hidden' as const,
  },
  footer: {
    padding: '20px',
    textAlign: 'center' as const,
    borderTop: '1px solid #16213e',
  },
  footerText: {
    color: '#b0b0b0',
    fontSize: '14px',
  },
};

export default App;