import React from 'react';
import { Card, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Dot } from 'recharts';

const { Title } = Typography;

// Sample data matching your chart
const revenueData = [
  { month: 'Jan', revenue: 120000, label: 'Jan' },
  { month: 'Feb', revenue: 160000, label: 'Feb' },
  { month: 'Mar', revenue: 170000, label: 'Mar' },
  { month: 'Apr', revenue: 160000, label: 'Apr' },
  { month: 'May', revenue: 200000, label: 'May' },
  { month: 'Jun', revenue: 387530, label: 'Jun', isHighlight: true, value: '$387,530.00' },
  { month: 'Jul', revenue: 300000, label: 'Jul' },
  { month: 'Aug', revenue: 200000, label: 'Aug' },
  { month: 'Sep', revenue: 180000, label: 'Sep' },
  { month: 'Oct', revenue: 192670, label: 'Oct', isHighlight: true, value: '$192,670.00' },
  { month: 'Nov', revenue: 230000, label: 'Nov' },
  { month: 'Dec', revenue: 240000, label: 'Dec' },
];

// Custom dot component for highlighted points
const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (payload.isHighlight) {
    return (
      <g>
        <Dot 
          cx={cx} 
          cy={cy} 
          r={6} 
          fill="#ff4d4f" 
          stroke="#fff" 
          strokeWidth={2}
        />
        <foreignObject x={cx - 40} y={cy - 35} width={80} height={25}>
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded text-center font-medium">
            {payload.value}
          </div>
        </foreignObject>
      </g>
    );
  }
  return null;
};

// Format Y-axis labels
const formatYAxisLabel = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(0)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value}`;
};

const RevenueLineChart = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div 
        className="shadow-lg border border-gray-200 rounded-lg"
        bodyStyle={{ padding: '16px' }}
      >
        <div className="p-6">
          <Title level={4} className="text-gray-800 font-semibold mb-0">
            Total Revenue
          </Title>
        </div>
        
        <div className="h-60 w-full ">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid 
                strokeDasharray="none" 
                stroke="#e5e7eb" 
                vertical={true}
                horizontal={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={formatYAxisLabel}
                domain={[0, 'dataMax + 50000']}
                tickCount={6}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1f2937"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, stroke: '#1f2937', strokeWidth: 2, fill: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="transparent"
                dot={<CustomDot />}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend for highlighted points */}
        {/* <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3  rounded-full"></div>
            <span>Peak Revenue Points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-gray-800 rounded"></div>
            <span>Monthly Revenue Trend</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default RevenueLineChart;