import React from 'react';
import { Icon } from '@wysiwyg/ui';

export const ActivityTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Recent Activity</h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <Icon name="edit" size="small" className="mt-0.5" />
          <div>
            <p>
              <strong>John Doe</strong> updated the hero section
            </p>
            <p className="text-gray-600">2 minutes ago</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Icon name="comment" size="small" className="mt-0.5" />
          <div>
            <p>
              <strong>Jane Smith</strong> added a comment
            </p>
            <p className="text-gray-600">5 minutes ago</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Icon name="user-plus" size="small" className="mt-0.5" />
          <div>
            <p>
              <strong>Jane Smith</strong> joined the project
            </p>
            <p className="text-gray-600">10 minutes ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};
