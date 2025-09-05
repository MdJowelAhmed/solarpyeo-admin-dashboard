import React, { useState, useMemo } from "react";
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
import { Table, Select, Button } from "antd";
import "antd/dist/reset.css";
import { Filter } from "../../components/common/Svg"; // Import the relevant SVGs

const { Option } = Select;

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
    // region: "USA",
    revenue: 100,
    users: 65,
    profit: 32,
  },
  {
    date: "Feb 2025",
    category: "Employee",
    // region: "USA",
    revenue: 75,
    users: 60,
    profit: 27,
  },
  {
    date: "Mar 2025",
    category: "Employee",
    // region: "USA",
    revenue: 50,
    users: 62,
    profit: 22,
  },
  {
    date: "Apr 2025",
    category: "Employee",
    // region: "UK",
    revenue: 69,
    users: 54,
    profit: 29,
  },
  {
    date: "May 2025",
    category: "Employee",
    // region: "UK",
    revenue: 47,
    users: 59,
    profit: 24,
  },
  {
    date: "Jun 2025",
    category: "Employee",
    // region: "UK",
    revenue: 60,
    users: 68,
    profit: 37,
  },
  {
    date: "Jul 2025",
    category: "Employee",
    // region: "USA",
    revenue: 88,
    users: 57,
    profit: 45,
  },
  {
    date: "Aug 2025",
    category: "Employee",
    // region: "USA",
    revenue: 88,
    users: 57,
    profit: 45,
  },
  {
    date: "Sep 2025",
    category: "Customer",
    // region: "UK",
    revenue: 38,
    users: 57,
    profit: 100,
  },
  {
    date: "Oct 2025",
    category: "Customer",
    // region: "UK",
    revenue: 88,
    users: 57,
    profit: 45,
  },
  {
    date: "Nov 2025",
    category: "Customer",
    // region: "USA",
    revenue: 88,
    users: 57,
    profit: 45,
  },
  {
    date: "Dec 2025",
    category: "Customer",
    // region: "USA",
    revenue: 88,
    users: 57,
    profit: 45,
  },
];

// Dropdown options
const monthYearOptions = [...new Set(data.map((d) => d.date))];
const categoryOptions = [
  "All Categories",
  ...new Set(data.map((d) => d.category)),
];
// const regionOptions = ["All Regions", ...new Set(data.map((d) => d.region))];
const metricOptions = ["revenue", "users", "profit"];

const maxValues = {
  revenue: Math.max(...data.map((d) => d.revenue)),
  users: Math.max(...data.map((d) => d.users)),
  profit: Math.max(...data.map((d) => d.profit)),
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

  const filteredData = useMemo(() => {
    return data.filter(
      (d) =>
        (selectedCategory === "All Categories" ||
          d.category === selectedCategory) &&
        // (selectedRegion === "All Regions" || d.region === selectedRegion) &&
        (selectedMonthYear === "All Months" || d.date === selectedMonthYear)
    );
  }, [selectedCategory, selectedRegion, selectedMonthYear]);

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Revenue", dataIndex: "revenue", key: "revenue" },
    { title: "Users", dataIndex: "users", key: "users" },
    { title: "Submission", dataIndex: "profit", key: "profit" },
  ];

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      {/* Dropdowns */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Select
          value={selectedMonthYear}
          style={{ width: 150 }}
          onChange={setSelectedMonthYear}
        >
          <Option value="All Months">All Months</Option>
          {monthYearOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        {/* <Select
          value={selectedCategory}
          style={{ width: 150 }}
          onChange={setSelectedCategory}
        >
          {categoryOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select> */}



        <Select
          value={selectedMetric}
          style={{ width: 150 }}
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
          style={{ width: 150 }}
          onChange={setChartType}
        >
          <Option value="Bar">Bar Chart</Option>
          <Option value="Line">Line Chart</Option>
          <Option value="Area">Area Chart</Option>
        </Select>

        <Button className="bg-primary text-white">Export Report</Button>
      </div>

      {/* Chart */}
      <div
        className="p-4 rounded-lg border"
        style={{ width: "100%", height: 400, marginTop: "40px" }}
      >
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
              {(selectedMetric === "all" || selectedMetric === "profit") && (
                <Bar
                  dataKey="profit"
                  fill="#FFAE4C"
                  shape={(props) => (
                    <Custom3DBarWithWatermark {...props} dataKey="profit" />
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
              {(selectedMetric === "all" || selectedMetric === "profit") && (
                <Line type="monotone" dataKey="profit" stroke="#FFAE4C" />
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
              {(selectedMetric === "all" || selectedMetric === "profit") && (
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#FFAE4C"
                  fill="#FFAE4C"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Ant Design Table */}
      <div style={{ marginTop: "50px" }}>
        <h1 className="text-[22px] font-bold mb-2">Data Table</h1>
        <Table
          bordered={false}
          size="small"
          rowClassName="custom-row"
          components={components}
          className="custom-table"
          columns={columns.filter(
            (col) =>
              selectedMetric === "all" || col.dataIndex === selectedMetric
          )}
          dataSource={filteredData.map((row, index) => ({
            ...row,
            key: index,
          }))}
          pagination={{ pageSize: 6 }}
        />
      </div>
    </div>
  );
}
