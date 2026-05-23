import React from 'react';
import { ValidationIssue } from './types';

interface SummaryTabProps {
  issues: ValidationIssue[];
  components: any[];
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ issues, components }) => {
  const errorCount = issues.filter((i) => i.type === 'error').length;
  const warningCount = issues.filter((i) => i.type === 'warning').length;
  const infoCount = issues.filter((i) => i.type === 'info').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg text-center">
          <div className="text-3xl font-bold text-red-600">{errorCount}</div>
          <div className="text-sm text-gray-600">Errors</div>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
          <div className="text-sm text-gray-600">Warnings</div>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600">{infoCount}</div>
          <div className="text-sm text-gray-600">Info</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Validation Categories</h3>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Accessibility</span>
            <span className="text-gray-600">
              {issues.filter((i) => i.message.includes('alt')).length} issues
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Performance</span>
            <span className="text-gray-600">
              {
                issues.filter(
                  (i) => i.message.includes('performance') || i.message.includes('large')
                ).length
              }{' '}
              issues
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>SEO</span>
            <span className="text-gray-600">
              {
                issues.filter((i) => i.message.includes('SEO') || i.message.includes('heading'))
                  .length
              }{' '}
              issues
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Responsive Design</span>
            <span className="text-gray-600">
              {
                issues.filter(
                  (i) => i.message.includes('responsive') || i.message.includes('width')
                ).length
              }{' '}
              issues
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Component Summary</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Total Components</span>
            <span className="text-gray-600">{components.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Components with Issues</span>
            <span className="text-gray-600">{new Set(issues.map((i) => i.componentId)).size}</span>
          </div>
          <div className="flex justify-between">
            <span>Components without Issues</span>
            <span className="text-gray-600">
              {components.length - new Set(issues.map((i) => i.componentId)).size}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
