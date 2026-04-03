import React from 'react';
import { LSystemConfig } from '../types/lsystem';
import { classic2DPresets } from '../presets/classic2d';
import { classic3DPresets } from '../presets/classic3d';

interface PresetSelectorProps {
  onPresetSelect: (preset: LSystemConfig) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onPresetSelect }) => {
  const presets = [...classic2DPresets, ...classic3DPresets];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Presets</h3>
      <div style={styles.presetGrid}>
        {presets.map((preset, index) => (
          <div
            key={index}
            style={styles.presetCard}
            onClick={() => onPresetSelect(preset)}
          >
            <div style={styles.presetName}>{preset.name}</div>
            <div style={styles.presetDesc}>{preset.description}</div>
          </div>
        ))}
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
    marginBottom: '15px',
    fontSize: '16px',
  },
  presetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '10px',
  },
  presetCard: {
    padding: '12px',
    backgroundColor: '#0f3460',
    border: '1px solid #1a1a2e',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  presetName: {
    color: '#e0e0e0',
    fontSize: '14px',
    fontWeight: '500' as const,
    marginBottom: '4px',
  },
  presetDesc: {
    color: '#b0b0b0',
    fontSize: '12px',
    lineHeight: '1.3',
  },
};
