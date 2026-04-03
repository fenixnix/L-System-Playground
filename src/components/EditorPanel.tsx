import React, { useState, useEffect } from 'react';
import { LSystemConfig } from '../types/lsystem';

interface EditorPanelProps {
  config: LSystemConfig;
  onConfigChange: (config: LSystemConfig) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ config, onConfigChange }) => {
  const [localConfig, setLocalConfig] = useState<LSystemConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = (field: keyof LSystemConfig, value: any) => {
    const newConfig = { ...localConfig, [field]: value };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleRuleChange = (symbol: string, value: string) => {
    const newRules = { ...localConfig.rules, [symbol]: value };
    handleChange('rules', newRules);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>L-System Editor</h3>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Axiom</label>
        <input
          type="text"
          value={localConfig.axiom}
          onChange={(e) => handleChange('axiom', e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Rules</label>
        {Object.entries(localConfig.rules).map(([symbol, replacement]) => (
          <div key={symbol} style={styles.ruleRow}>
            <input
              type="text"
              value={symbol}
              onChange={(e) => {
                const newSymbol = e.target.value;
                const newRules = { ...localConfig.rules };
                delete newRules[symbol];
                newRules[newSymbol] = replacement;
                handleChange('rules', newRules);
              }}
              style={{
                ...styles.ruleInput,
                ...styles.ruleSymbol
              }}
            />
            <span style={styles.ruleArrow}>→</span>
            <input
              type="text"
              value={replacement}
              onChange={(e) => handleRuleChange(symbol, e.target.value)}
              style={{
                ...styles.ruleInput,
                ...styles.ruleReplacement
              }}
            />
          </div>
        ))}
        <button
          onClick={() => handleChange('rules', { ...localConfig.rules, 'F': 'F' })}
          style={styles.addButton}
        >
          + Add Rule
        </button>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Iterations</label>
        <input
          type="range"
          min="1"
          max="8"
          value={localConfig.iterations}
          onChange={(e) => handleChange('iterations', parseInt(e.target.value))}
          style={styles.slider}
        />
        <span style={styles.sliderValue}>{localConfig.iterations}</span>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Angle (degrees)</label>
        <input
          type="number"
          value={localConfig.angle2D}
          onChange={(e) => handleChange('angle2D', parseInt(e.target.value) || 0)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Step Length</label>
        <input
          type="number"
          value={localConfig.stepLength}
          onChange={(e) => handleChange('stepLength', parseFloat(e.target.value) || 0)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Line Color</label>
        <input
          type="color"
          value={localConfig.lineColor || '#00ff88'}
          onChange={(e) => handleChange('lineColor', e.target.value)}
          style={styles.colorInput}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Background Color</label>
        <input
          type="color"
          value={localConfig.backgroundColor || '#1a1a2e'}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
          style={styles.colorInput}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '15px',
    backgroundColor: '#16213e',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  title: {
    color: '#e0e0e0',
    marginBottom: '20px',
    fontSize: '18px',
  },
  formGroup: {
    marginBottom: '10px',
  },
  label: {
    display: 'block',
    color: '#b0b0b0',
    marginBottom: '5px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#0f3460',
    border: '1px solid #1a1a2e',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  },
  slider: {
    width: '100%',
    margin: '10px 0',
  },
  sliderValue: {
    color: '#e0e0e0',
    fontSize: '14px',
    display: 'block',
    textAlign: 'center' as const,
  },
  ruleRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    width: '100%',
  },
  ruleInput: {
    padding: '6px',
    backgroundColor: '#0f3460',
    border: '1px solid #1a1a2e',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  },
  ruleSymbol: {
    width: '40px',
    marginRight: '8px',
  },
  ruleArrow: {
    color: '#e0e0e0',
    margin: '0 8px',
    fontSize: '12px',
  },
  ruleReplacement: {
    flex: 1,
    minWidth: '0',
  },
  addButton: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#0f3460',
    border: '1px solid #1a1a2e',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '5px',
    boxSizing: 'border-box' as const,
  },
  colorInput: {
    width: '100%',
    height: '40px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    boxSizing: 'border-box' as const,
  },
};
