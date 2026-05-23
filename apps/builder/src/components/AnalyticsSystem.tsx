import React, { useState, useEffect } from 'react';
import { Button } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Panel } from '@wysiwyg/ui';
import { Tabs, TabItem } from '@wysiwyg/ui';
import { Select } from '@wysiwyg/ui';
import { EmptyState } from '@wysiwyg/ui';
import { Loading } from '@wysiwyg/ui';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: PageData[];
  trafficSources: TrafficSource[];
  deviceBreakdown: DeviceData[];
  conversionRate: number;
}

interface PageData {
  path: string;
  views: number;
  avgTime: number;
  bounceRate: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

interface DeviceData {
  device: string;
  visitors: number;
  percentage: number;
}

interface AnalyticsSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsSystem: React.FC<AnalyticsSystemProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAnalyticsData();
    }
  }, [isOpen, timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockData: AnalyticsData = {
      pageViews: Math.floor(Math.random() * 10000) + 5000,
      uniqueVisitors: Math.floor(Math.random() * 5000) + 2000,
      bounceRate: Math.random() * 50 + 20,
      avgSessionDuration: Math.random() * 300 + 60,
      topPages: [
        {
          path: '/',
          views: Math.floor(Math.random() * 2000) + 1000,
          avgTime: Math.random() * 120 + 30,
          bounceRate: Math.random() * 30 + 20,
        },
        {
          path: '/about',
          views: Math.floor(Math.random() * 1000) + 500,
          avgTime: Math.random() * 90 + 20,
          bounceRate: Math.random() * 40 + 25,
        },
        {
          path: '/contact',
          views: Math.floor(Math.random() * 500) + 200,
          avgTime: Math.random() * 60 + 15,
          bounceRate: Math.random() * 50 + 30,
        },
      ],
      trafficSources: [
        {
          source: 'Organic',
          visitors: Math.floor(Math.random() * 2000) + 1000,
          percentage: Math.random() * 40 + 30,
        },
        {
          source: 'Direct',
          visitors: Math.floor(Math.random() * 1000) + 500,
          percentage: Math.random() * 30 + 20,
        },
        {
          source: 'Referral',
          visitors: Math.floor(Math.random() * 500) + 200,
          percentage: Math.random() * 20 + 10,
        },
        {
          source: 'Social',
          visitors: Math.floor(Math.random() * 300) + 100,
          percentage: Math.random() * 10 + 5,
        },
      ],
      deviceBreakdown: [
        {
          device: 'Desktop',
          visitors: Math.floor(Math.random() * 3000) + 1500,
          percentage: Math.random() * 50 + 40,
        },
        {
          device: 'Mobile',
          visitors: Math.floor(Math.random() * 2000) + 1000,
          percentage: Math.random() * 40 + 30,
        },
        {
          device: 'Tablet',
          visitors: Math.floor(Math.random() * 500) + 200,
          percentage: Math.random() * 15 + 5,
        },
      ],
      conversionRate: Math.random() * 5 + 1,
    };

    setAnalyticsData(mockData);
    setIsLoading(false);
  };

  const overviewTab: TabItem = {
    id: 'overview',
    label: 'Overview',
    content: (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Select
            value={timeRange}
            onChange={setTimeRange}
            options={[
              { value: '24h', label: 'Last 24 hours' },
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
            ]}
            className="w-40"
          />
          <Button variant="ghost" size="small" onClick={fetchAnalyticsData}>
            <Icon name="refresh" size="small" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loading size="medium" />
            <span className="ml-2">Loading analytics...</span>
          </div>
        ) : analyticsData ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Page Views</span>
                  <Icon name="eye" size="small" />
                </div>
                <div className="text-2xl font-bold">{analyticsData.pageViews.toLocaleString()}</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Unique Visitors</span>
                  <Icon name="users" size="small" />
                </div>
                <div className="text-2xl font-bold">
                  {analyticsData.uniqueVisitors.toLocaleString()}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                  <Icon name="trending-down" size="small" />
                </div>
                <div className="text-2xl font-bold">{analyticsData.bounceRate.toFixed(1)}%</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Avg. Session</span>
                  <Icon name="clock" size="small" />
                </div>
                <div className="text-2xl font-bold">
                  {Math.floor(analyticsData.avgSessionDuration / 60)}:
                  {(analyticsData.avgSessionDuration % 60).toFixed(0).padStart(2, '0')}
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <Icon name="trending-up" size="small" />
              </div>
              <div className="text-2xl font-bold">{analyticsData.conversionRate.toFixed(2)}%</div>
            </div>
          </>
        ) : (
          <EmptyState
            icon="chart"
            title="No analytics data available"
            description="Start tracking your project to see analytics"
          />
        )}
      </div>
    ),
  };

  const pagesTab: TabItem = {
    id: 'pages',
    label: 'Pages',
    content: (
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loading size="medium" />
          </div>
        ) : analyticsData ? (
          <div className="space-y-2">
            <h3 className="font-semibold">Top Pages</h3>
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{page.path}</div>
                    <div className="text-sm text-gray-600">
                      Avg. Time: {Math.floor(page.avgTime / 60)}:
                      {(page.avgTime % 60).toFixed(0).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{page.views.toLocaleString()} views</div>
                    <div className="text-sm text-gray-600">
                      {page.bounceRate.toFixed(1)}% bounce
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="file" title="No page data available" />
        )}
      </div>
    ),
  };

  const trafficTab: TabItem = {
    id: 'traffic',
    label: 'Traffic',
    content: (
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loading size="medium" />
          </div>
        ) : analyticsData ? (
          <>
            <h3 className="font-semibold">Traffic Sources</h3>
            <div className="space-y-2">
              {analyticsData.trafficSources.map((source, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{source.source}</span>
                    <div className="text-right">
                      <div className="font-medium">{source.visitors.toLocaleString()} visitors</div>
                      <div className="text-sm text-gray-600">{source.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-semibold mt-6">Device Breakdown</h3>
            <div className="space-y-2">
              {analyticsData.deviceBreakdown.map((device, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{device.device}</span>
                    <div className="text-right">
                      <div className="font-medium">{device.visitors.toLocaleString()} visitors</div>
                      <div className="text-sm text-gray-600">{device.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState icon="globe" title="No traffic data available" />
        )}
      </div>
    ),
  };

  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="medium"
      title="Analytics"
      className="h-full"
    >
      <Tabs
        items={[overviewTab, pagesTab, trafficTab]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="flex-1"
      />
    </Panel>
  );
};

export default AnalyticsSystem;
