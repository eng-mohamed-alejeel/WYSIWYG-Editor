import React from 'react';
import { Button, Loading, Badge } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { EmptyState } from '@wysiwyg/ui';
import { ValidationIssue } from './types';

interface IssuesTabProps {
  issues: ValidationIssue[];
  isScanning: boolean;
  onFixIssue: (issueId: string) => void;
  onFixAll: () => void;
  onRescan: () => void;
}

export const IssuesTab: React.FC<IssuesTabProps> = ({
  issues,
  isScanning,
  onFixIssue,
  onFixAll,
  onRescan,
}) => (
  <div className="space-y-4">
    {isScanning ? (
      <div className="flex items-center justify-center py-8">
        <Loading size="medium" />
        <span className="ml-2">Scanning components...</span>
      </div>
    ) : issues.length === 0 ? (
      <EmptyState
        icon="check-circle"
        title="No issues found"
        description="Your project looks great!"
      />
    ) : (
      <>
        <div className="flex gap-2 mb-4">
          <Button
            variant="primary"
            size="small"
            onClick={onFixAll}
            disabled={!issues.some((i) => i.fix)}
          >
            <Icon name="check" size="small" />
            Fix All
          </Button>
          <Button variant="ghost" size="small" onClick={onRescan}>
            <Icon name="refresh" size="small" />
            Rescan
          </Button>
        </div>
        <div className="space-y-2">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className={`p-3 border rounded-lg ${
                issue.type === 'error'
                  ? 'border-red-300 bg-red-50'
                  : issue.type === 'warning'
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-blue-300 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <Icon
                    name={
                      issue.type === 'error'
                        ? 'alert-circle'
                        : issue.type === 'warning'
                          ? 'alert-triangle'
                          : 'info'
                    }
                    size="small"
                    className={`mt-0.5 ${issue.type === 'error' ? 'text-red-600' : issue.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'}`}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{issue.message}</p>
                    {issue.suggestion && (
                      <p className="text-sm text-gray-600 mt-1">{issue.suggestion}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={issue.type === 'error' ? 'danger' : 'secondary'} size="sm">
                        {issue.componentType}
                      </Badge>
                      <span className="text-xs text-gray-500">ID: {issue.componentId}</span>
                    </div>
                  </div>
                </div>
                {issue.fix && (
                  <Button variant="ghost" size="small" onClick={() => onFixIssue(issue.id)}>
                    <Icon name="check" size="small" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);
