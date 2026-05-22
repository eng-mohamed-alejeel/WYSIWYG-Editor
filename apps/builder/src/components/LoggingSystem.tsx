import React, { useState, useEffect } from 'react';
import { Button } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Panel } from '@wysiwyg/ui';
import { Tabs, TabItem } from '@wysiwyg/ui';
import { Select } from '@wysiwyg/ui';
import { Input } from '@wysiwyg/ui';
import { EmptyState } from '@wysiwyg/ui';
import { Badge } from '@wysiwyg/ui';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: string;
  message: string;
  details?: any;
  userId?: string;
  sessionId?: string;
}

interface LoggingSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoggingSystem: React.FC<LoggingSystemProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  const fetchLogs = async () => {
    // Simulate fetching logs
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        level: 'info',
        category: 'component',
        message: 'Component added successfully',
        details: { componentId: 'comp_123', type: 'button' }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        level: 'warning',
        category: 'validation',
        message: 'Missing alt text on image',
        details: { componentId: 'comp_456' }
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        level: 'error',
        category: 'export',
        message: 'Export failed: Invalid component structure',
        details: { error: 'Invalid structure', componentId: 'comp_789' }
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        level: 'debug',
        category: 'performance',
        message: 'Render time: 150ms',
        details: { componentId: 'comp_123', renderTime: 150 }
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        level: 'info',
        category: 'user',
        message: 'User action: selected component',
        details: { componentId: 'comp_123', userId: 'user_1' }
      }
    ];

    setLogs(mockLogs);
  };

  const handleExportLogs = () => {
    const logData = JSON.stringify(logs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const filteredLogs = logs.filter(log => {
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (log.details && JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesCategory && matchesSearch;
  });

  const logsTab: TabItem = {
    id: 'logs',
    label: 'Logs',
    content: (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<Icon name="search" size="small" />}
            className="flex-1"
          />
          <Select
            value={selectedLevel}
            onChange={setSelectedLevel}
            options={[
              { value: 'all', label: 'All Levels' },
              { value: 'info', label: 'Info' },
              { value: 'warning', label: 'Warning' },
              { value: 'error', label: 'Error' },
              { value: 'debug', label: 'Debug' }
            ]}
            className="w-32"
          />
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'component', label: 'Component' },
              { value: 'validation', label: 'Validation' },
              { value: 'export', label: 'Export' },
              { value: 'performance', label: 'Performance' },
              { value: 'user', label: 'User' }
            ]}
            className="w-32"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            onClick={handleExportLogs}
          >
            <Icon name="download" size="small" />
            Export
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={handleClearLogs}
          >
            <Icon name="delete" size="small" />
            Clear
          </Button>
        </div>

        {filteredLogs.length === 0 ? (
          <EmptyState
            icon="file-text"
            title="No logs found"
            description="Try adjusting your filters or search query"
          />
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLogs.map(log => (
              <div
                key={log.id}
                className={`p-3 border rounded-lg ${
                  log.level === 'error' ? 'border-red-300 bg-red-50' :
                  log.level === 'warning' ? 'border-yellow-300 bg-yellow-50' :
                  log.level === 'debug' ? 'border-gray-300 bg-gray-50' :
                  'border-blue-300 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          log.level === 'error' ? 'danger' :
                          log.level === 'warning' ? 'warning' :
                          log.level === 'debug' ? 'secondary' :
                          'default'
                        }
                        size="sm"
                      >
                        {log.level}
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        {log.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {log.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                    {log.details && (
                      <details className="mt-2">
                        <summary className="text-sm text-gray-600 cursor-pointer">
                          Details
                        </summary>
                        <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  };

  const settingsTab: TabItem = {
    id: 'settings',
    label: 'Settings',
    content: (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Log Level</h3>
          <Select
            value="all"
            onChange={() => {}}
            options={[
              { value: 'all', label: 'All Levels' },
              { value: 'info', label: 'Info and above' },
              { value: 'warning', label: 'Warning and above' },
              { value: 'error', label: 'Error only' }
            ]}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Log Retention</h3>
          <Select
            value="7d"
            onChange={() => {}}
            options={[
              { value: '1d', label: '1 day' },
              { value: '7d', label: '7 days' },
              { value: '30d', label: '30 days' },
              { value: '90d', label: '90 days' }
            ]}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Categories to Log</h3>
          <div className="space-y-2">
            {['component', 'validation', 'export', 'performance', 'user'].map(category => (
              <label key={category} className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Export Format</h3>
          <Select
            value="json"
            onChange={() => {}}
            options={[
              { value: 'json', label: 'JSON' },
              { value: 'csv', label: 'CSV' },
              { value: 'txt', label: 'Text' }
            ]}
            className="w-full"
          />
        </div>
      </div>
    )
  };

  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="medium"
      title="Logs"
      className="h-full"
    >
      <Tabs
        items={[logsTab, settingsTab]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="flex-1"
      />
    </Panel>
  );
};

export default LoggingSystem;
