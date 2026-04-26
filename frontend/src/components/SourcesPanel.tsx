import React from 'react';
import { Source } from './ChatPage.types';
import { ScrollArea } from './ui/scroll-area';
import { Tag } from 'lucide-react';
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
      <ScrollArea className={`sources-content ${isOpen ? 'open' : ''}`}>
        {sources.map((source, index) => (
          <div key={index} className="source-item">
            <div className="source-text">{source.text}</div>
            {source.metadata && (
              <div className="source-metadata">
                {source.metadata.crop && (
                  <span className="source-tag">
                    <Tag size={12} className="inline mr-1" />
                    Crop: {source.metadata.crop}
                  </span>
                )}
                {source.metadata.topic && (
                  <span className="source-tag">
                    <Tag size={12} className="inline mr-1" />
                    Topic: {source.metadata.topic}
                  </span>
                )}
                {source.metadata.source && (
                  <span className="source-tag">
                    <Tag size={12} className="inline mr-1" />
                    Source: {source.metadata.source}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default SourcesPanel;

