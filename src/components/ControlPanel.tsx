import React from 'react';

interface ControlPanelProps {
  viewMode: '2d' | '3d';
  onViewModeChange: (mode: '2d' | '3d') => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  isGenerating: boolean;
  stringLength: number;
  renderTime: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  viewMode, 
  onViewModeChange, 
  onExportPNG, 
  onExportSVG, 
  isGenerating, 
  stringLength, 
  renderTime 
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <div style={styles.viewModeSelector}>
          <button
            onClick={() => onViewModeChange('2d')}
            style={{
              ...styles.viewModeButton,
              ...(viewMode === '2d' && styles.viewModeButtonActive)
            }}
          >
            2D
          </button>
          <button
            onClick={() => onViewModeChange('3d')}
            style={{
              ...styles.viewModeButton,
              ...(viewMode === '3d' && styles.viewModeButtonActive)
            }}
          >
            3D
          </button>
        </div>

        <div style={styles.exportButtons}>
          <button 
            onClick={onExportPNG} 
            style={styles.exportButton}
            disabled={isGenerating}
          >
            Export PNG
          </button>
          <button 
            onClick={onExportSVG} 
            style={styles.exportButton}
            disabled={isGenerating}
          >
            Export SVG
          </button>
        </div>

        <div style={styles.status}>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Status:</span>
            <span style={styles.statusValue}>
              {isGenerating ? 'Generating...' : 'Ready'}
            </span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Length:</span>
            <span style={styles.statusValue}>{stringLength.toLocaleString()}</span>
          </div>
          <div style={styles.statusItem}>
            <span style={styles.statusLabel}>Time:</span>
            <span style={styles.statusValue}>{renderTime.toFixed(2)}ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '8px 12px',
    backgroundColor: '#16213e',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  viewModeSelector: {
    display: 'flex',
    gap: '10px',
  },
  viewModeButton: {
    padding: '6px 12px',
    backgroundColor: '#0f3460',
    border: '1px solid #1a1a2e',
    borderRadius: '4px',
    color: '#e0e0e0',
    cursor: 'pointer',
    fontSize: '12px',
  },
  viewModeButtonActive: {
    backgroundColor: '#16213e',
    borderColor: '#00ff88',
  },
  exportButtons: {
    display: 'flex',
    gap: '8px',
  },
  exportButton: {
    padding: '6px 12px',
    backgroundColor: '#0f3460',
    border: '1px solid #1a1a2e',
    borderRadius: '4px',
    color: '#e0e0e0',
    cursor: 'pointer',
    fontSize: '12px',
  },
  status: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap' as const,
  },
  statusItem: {
    display: 'flex',
    gap: '6px',
  },
  statusLabel: {
    color: '#b0b0b0',
    fontSize: '12px',
  },
  statusValue: {
    color: '#e0e0e0',
    fontSize: '12px',
    fontWeight: '500' as const,
  },
};
