import React from 'react';
import { Source } from './ChatPage';
import './SourcesPanel.css';

interface SourcesPanelProps {
  sources: Source[];
  isOpen: boolean;
  onToggle: () => void;
}

const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, isOpen, onToggle }) => {
  return (
    <div className="sources-panel">
      <button className="sources-toggle" onClick={onToggle}>
        <span>{isOpen ? '▼' : '▶'}</span>
        <span>Sources ({sources.length})</span>
      </button>
      <div className={`sources-content ${isOpen ? 'open' : ''}`}>
        {sources.map((source, index) => (
          <div key={index} className="source-item">
            <div className="source-text">{source.text}</div>
            {source.metadata && (
              <div className="source-metadata">
                {source.metadata.crop && (
                  <span className="source-tag">Crop: {source.metadata.crop}</span>
                )}
                {source.metadata.topic && (
                  <span className="source-tag">Topic: {source.metadata.topic}</span>
                )}
                {source.metadata.source && (
                  <span className="source-tag">Source: {source.metadata.source}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourcesPanel;

