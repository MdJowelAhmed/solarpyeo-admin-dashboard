import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Table, Select, Button, DatePicker } from "antd";
import "antd/dist/reset.css";
import { Filter } from "../../components/common/Svg"; // Import the relevant SVGs

const { Option } = Select;
const { RangePicker } = DatePicker;

const components = {
  header: {
    row: (props) => (
      <tr
        {...props}
        style={{
          backgroundColor: "#f0f5f9",
          height: "50px",
          color: "secondary",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
    cell: (props) => (
      <th
        {...props}
        style={{
          color: "secondary",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
  },
};

// Sample data
const data = [
  {
    date: "Jan 2025",
    category: "Employee",
    region: "USA",
    revenue: 100,
    users: 65,
    submission: 32,
  },
  {
    date: "Feb 2025",
    category: "Employee",
    region: "USA",
    revenue: 75,
    users: 60,
    submission: 27,
  },
  {
    date: "Mar 2025",
    category: "Employee",
    region: "USA",
    revenue: 50,
    users: 62,
    submission: 22,
  },
  {
    date: "Apr 2025",
    category: "Employee",
    region: "UK",
    revenue: 69,
    users: 54,
    submission: 29,
  },
  {
    date: "May 2025",
    category: "Employee",
    region: "UK",
    revenue: 47,
    users: 59,
    submission: 24,
  },
  {
    date: "Jun 2025",
    category: "Employee",
    region: "UK",
    revenue: 60,
    users: 68,
    submission: 37,
  },
  {
    date: "Jul 2025",
    category: "Employee",
    region: "USA",
    revenue: 88,
    users: 57,
    submission: 45,
  },
  {
    date: "Aug 2025",
    category: "Employee",
    region: "USA",
    revenue: 88,
    users: 57,
    submission: 45,
  },
  {
    date: "Sep 2025",
    category: "Customer",
    region: "UK",
    revenue: 38,
    users: 57,
    submission: 100,
  },
  {
    date: "Oct 2025",
    category: "Customer",
    region: "UK",
    revenue: 88,
    users: 57,
    submission: 45,
  },
  {
    date: "Nov 2025",
    category: "Customer",
    region: "USA",
    revenue: 88,
    users: 57,
    submission: 45,
  },
  {
    date: "Dec 2025",
    category: "Customer",
    region: "USA",
    revenue: 88,
    users: 57,
    submission: 45,
  },
  {
    date: "Jan 2026",
    category: "Partner",
    region: "Canada",
    revenue: 95,
    users: 72,
    submission: 38,
  },
  {
    date: "Feb 2026",
    category: "Partner",
    region: "Canada",
    revenue: 82,
    users: 68,
    submission: 41,
  },
  {
    date: "Mar 2026",
    category: "Vendor",
    region: "Australia",
    revenue: 76,
    users: 63,
    submission: 35,
  },
];

// Dropdown options
const monthYearOptions = [...new Set(data.map((d) => d.date))];
const categoryOptions = [
  "All Categories",
  ...new Set(data.map((d) => d.category)),
];
const regionOptions = ["All Regions", ...new Set(data.map((d) => d.region))];
const metricOptions = ["revenue", "users", "submission"];

const maxValues = {
  revenue: Math.max(...data.map((d) => d.revenue)),
  users: Math.max(...data.map((d) => d.users)),
  submission: Math.max(...data.map((d) => d.submission)),
};

// Custom 3D Bar with watermark
const Custom3DBarWithWatermark = ({
  x,
  y,
  width,
  height,
  fill,
  dataKey,
  payload,
}) => {
  const depth = 10;
  const maxValue = maxValues[dataKey];
  const scale = maxValue / payload[dataKey];
  const watermarkHeight = height * scale;
  const watermarkY = y - (watermarkHeight - height);

  return (
    <g>
      <g opacity={0.1}>
        <rect
          x={x}
          y={watermarkY}
          width={width}
          height={watermarkHeight}
          fill={fill}
        />
        <polygon
          points={`${x},${watermarkY} ${x + depth},${watermarkY - depth} ${
            x + width + depth
          },${watermarkY - depth} ${x + width},${watermarkY}`}
          fill={fill}
        />
        <polygon
          points={`${x + width},${watermarkY} ${x + width + depth},${
            watermarkY - depth
          } ${x + width + depth},${watermarkY + watermarkHeight} ${x + width},${
            watermarkY + watermarkHeight
          }`}
          fill={fill}
        />
      </g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        opacity={0.4}
      />
      <polygon
        points={`${x},${y} ${x + depth},${y - depth} ${x + width + depth},${
          y - depth
        } ${x + width},${y}`}
        fill={fill}
        opacity={0.6}
      />
      <polygon
        points={`${x + width},${y} ${x + width + depth},${y - depth} ${
          x + width + depth
        },${y + height} ${x + width},${y + height}`}
        fill={fill}
        opacity={0.7}
      />
    </g>
  );
};

export default function MonthlyStatsChart() {
  const [selectedMonthYear, setSelectedMonthYear] = useState("All Months");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [chartType, setChartType] = useState("Bar");
  const [dateRange, setDateRange] = useState(null);

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Region', 'Revenue', 'Users', 'Submission'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        [row.date, row.category, row.region, row.revenue, row.users, row.submission].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      // Category filter
      const categoryMatch = selectedCategory === "All Categories" || d.category === selectedCategory;
      
      // Region filter
      const regionMatch = selectedRegion === "All Regions" || d.region === selectedRegion;
      
      // Month/Year filter
      const monthYearMatch = selectedMonthYear === "All Months" || d.date === selectedMonthYear;
      
      // Date range filter
      let dateRangeMatch = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const itemDate = dayjs(d.date, "MMM YYYY");
        const startDate = dayjs(dateRange[0]);
        const endDate = dayjs(dateRange[1]);
        dateRangeMatch = itemDate.isBetween(startDate, endDate, 'month', '[]');
      }
      
      return categoryMatch && regionMatch && monthYearMatch && dateRangeMatch;
    });
  }, [selectedCategory, selectedRegion, selectedMonthYear, dateRange]);

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    // { title: "Category", dataIndex: "category", key: "category" },
    // { title: "Region", dataIndex: "region", key: "region" },
    { title: "Revenue", dataIndex: "revenue", key: "revenue" },
    { title: "Users", dataIndex: "users", key: "users" },
    { title: "Submission", dataIndex: "submission", key: "submission" },
  ];

  return (
    <div className="w-full p-4 max-w-full overflow-hidden">
      {/* Dropdowns */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <RangePicker
          className="min-w-[200px] sm:w-[250px]"
          placeholder={['Start Date', 'End Date']}
          onChange={setDateRange}
          format="MMM YYYY"
        />

        <Select
          value={selectedMonthYear}
          className="min-w-[120px] sm:w-[150px]"
          onChange={setSelectedMonthYear}
        >
          <Option value="All Months">All Months</Option>
          {monthYearOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedCategory}
          className="min-w-[120px] sm:w-[150px]"
          onChange={setSelectedCategory}
        >
          {categoryOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedRegion}
          className="min-w-[120px] sm:w-[150px]"
          onChange={setSelectedRegion}
        >
          {regionOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedMetric}
          className="min-w-[120px] sm:w-[150px]"
          onChange={setSelectedMetric}
        >
          <Option value="all">All Metrics</Option>
          {metricOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        <Select
          value={chartType}
          className="min-w-[120px] sm:w-[150px]"
          onChange={setChartType}
        >
          <Option value="Bar">Bar Chart</Option>
          <Option value="Line">Line Chart</Option>
          <Option value="Area">Area Chart</Option>
        </Select>

        {/* <Button className="bg-primary text-white" onClick={exportToCSV}>Export Report</Button> */}
      </div>

      {/* Chart */}
      <div className="p-4 rounded-lg border w-full mt-10 overflow-x-auto" style={{ height: 400 }}>
        <ResponsiveContainer>
          {chartType === "Bar" ? (
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="20%"
              barGap={13}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(selectedMetric === "all" || selectedMetric === "revenue") && (
                <Bar
                  dataKey="revenue"
                  fill="#7086FD"
                  shape={(props) => (
                    <Custom3DBarWithWatermark {...props} dataKey="revenue" />
                  )}
                />
              )}
              {(selectedMetric === "all" || selectedMetric === "users") && (
                <Bar
                  dataKey="users"
                  fill="#6FD195"
                  shape={(props) => (
                    <Custom3DBarWithWatermark {...props} dataKey="users" />
                  )}
                />
              )}
              {(selectedMetric === "all" || selectedMetric === "submission") && (
                <Bar
                  dataKey="submission"
                  fill="#FFAE4C"
                  shape={(props) => (
                    <Custom3DBarWithWatermark {...props} dataKey="submission" />
                  )}
                />
              )}
            </BarChart>
          ) : chartType === "Line" ? (
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(selectedMetric === "all" || selectedMetric === "revenue") && (
                <Line type="monotone" dataKey="revenue" stroke="#7086FD" />
              )}
              {(selectedMetric === "all" || selectedMetric === "users") && (
                <Line type="monotone" dataKey="users" stroke="#6FD195" />
              )}
              {(selectedMetric === "all" || selectedMetric === "submission") && (
                <Line type="monotone" dataKey="submission" stroke="#FFAE4C" />
              )}
            </LineChart>
          ) : (
            <AreaChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(selectedMetric === "all" || selectedMetric === "revenue") && (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7086FD"
                  fill="#7086FD"
                />
              )}
              {(selectedMetric === "all" || selectedMetric === "users") && (
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#6FD195"
                  fill="#6FD195"
                />
              )}
              {(selectedMetric === "all" || selectedMetric === "submission") && (
                <Area
                  type="monotone"
                  dataKey="submission"
                  stroke="#FFAE4C"
                  fill="#FFAE4C"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Ant Design Table */}
      <div className="mt-12">
        <h1 className="text-lg sm:text-xl lg:text-[22px] font-bold mb-4">Data Table</h1>
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <Table
            bordered={false}
            size="small"
            rowClassName="custom-row"
            components={components}
            className="custom-table min-w-full"
            scroll={{ x: 'max-content' }}
            columns={columns.filter(
              (col) =>
                col.dataIndex === "date" ||
                col.dataIndex === "category" ||
                col.dataIndex === "region" ||
                selectedMetric === "all" ||
                col.dataIndex === selectedMetric
            )}
            dataSource={filteredData.map((row, index) => ({
              ...row,
              key: index,
            }))}
            pagination={{ 
              pageSize: 6,
              showSizeChanger: false,
              showQuickJumper: false,
              responsive: true
            }}
          />
        </div>
      </div>
    </div>
  );
}
