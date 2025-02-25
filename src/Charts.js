import { useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { testArr5pm, testArr7pm } from "./data/data";

// For a real implementation, these arrays would be imported
// I'm using empty placeholders since your actual data is defined elsewhere
// const testArr5pm = [];
// const testArr7pm = [];
const arr = testArr5pm.concat(testArr7pm);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const ROLES = ['S1', 'S2', 'S3', 'S4', 'N5'];

export default function AnalysisPage() {
  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'role',
    direction: 'ascending'
  });

  // Filter options
  const [timeOfDay, setTimeOfDay] = useState('all'); // all, 5pm, 7pm
  const [dateRange, setDateRange] = useState('all'); // all, lastMonth, lastWeek

  // Define cost constants
  const hourlyRate = {
    S1: 50, // Staff role 1 cost per hour
    S2: 50, // Staff role 2 cost per hour
    S3: 50, // Staff role 3 cost per hour
    S4: 50, // Staff role 4 cost per hour
    N5: 85, // N5 role cost per hour (assuming higher cost)
  };

  // Process data for analysis
  const processedData = useMemo(() => {
    // Filter data based on selected filters
    let dataToProcess = arr;
    if (timeOfDay === '5pm') {
      dataToProcess = testArr5pm;
    } else if (timeOfDay === '7pm') {
      dataToProcess = testArr7pm;
    }

    // Process date range filtering if needed
    if (dateRange !== 'all') {
      // Implementation of date filtering would go here
    }

    // Stats by role
    const roleStats = {
      S1: { admissionsTotal: 0, admissionsCount: 0, timeTotal: 0, timeCount: 0 },
      S2: { admissionsTotal: 0, admissionsCount: 0, timeTotal: 0, timeCount: 0 },
      S3: { admissionsTotal: 0, admissionsCount: 0, timeTotal: 0, timeCount: 0 },
      S4: { admissionsTotal: 0, admissionsCount: 0, timeTotal: 0, timeCount: 0 },
      N5: { admissionsTotal: 0, admissionsCount: 0, timeTotal: 0, timeCount: 0 }
    };

    // Daily trends data
    const trendsData = {};

    // Process each entry
    dataToProcess.forEach(([entry, date]) => {
      const [times, counts] = entry.split(";").slice(0, 2);
      const timeArray = times.split(",");
      const countArray = counts.split(",").map(Number);

      // Extract date for trends
      const simpleDate = date.split(" ")[0]; // Remove any time component
      if (!trendsData[simpleDate]) {
        trendsData[simpleDate] = { date: simpleDate, S1: 0, S2: 0, S3: 0, S4: 0, N5: 0, total: 0 };
      }

      // Process S1, S2, S3, S4 data
      for (let i = 0; i < 4; i++) {
        const role = `S${i + 1}`;
        const time = timeArray[i];
        const admissions = countArray[i];

        // Convert time to minutes for averaging
        const [hours, minutes] = time.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;

        roleStats[role].admissionsTotal += admissions;
        roleStats[role].admissionsCount++;
        roleStats[role].timeTotal += timeInMinutes;
        roleStats[role].timeCount++;

        // Add to trends data
        trendsData[simpleDate][role] += admissions;
        trendsData[simpleDate].total += admissions;
      }

      // For N5, we need to extract from the algorithm order (assuming it's there)
      // For simplicity, I'm just going to estimate based on the data structure you have
      if (timeArray.length > 4) {
        const n5Time = timeArray[4];
        const n5Admissions = countArray[4] || 0;

        const [hours, minutes] = n5Time.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;

        roleStats.N5.admissionsTotal += n5Admissions;
        roleStats.N5.admissionsCount++;
        roleStats.N5.timeTotal += timeInMinutes;
        roleStats.N5.timeCount++;

        trendsData[simpleDate].N5 += n5Admissions;
        trendsData[simpleDate].total += n5Admissions;
      }
    });

    // Calculate averages and format for display
    const roleData = Object.entries(roleStats).map(([role, stats]) => {
      const avgAdmissions = stats.admissionsTotal / (stats.admissionsCount || 1);
      const avgTimeMinutes = stats.timeTotal / (stats.timeCount || 1);
      const hours = Math.floor(avgTimeMinutes / 60);
      const minutes = Math.round(avgTimeMinutes % 60);
      const avgTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      // Calculate cost metrics
      const avgCostPerAdmission = hourlyRate[role] / avgAdmissions;
      const totalCost = (stats.admissionsTotal * hourlyRate[role]) / avgAdmissions;

      return {
        role,
        avgAdmissions: avgAdmissions.toFixed(2),
        avgTime,
        totalAdmissions: stats.admissionsTotal,
        avgCostPerAdmission: avgCostPerAdmission.toFixed(2),
        totalCost: totalCost.toFixed(2),
        efficiency: (avgAdmissions / hourlyRate[role] * 100).toFixed(2) // higher is better
      };
    });

    // Convert trends data to array for charts
    const trendsArray = Object.values(trendsData).sort((a, b) => new Date(a.date) - new Date(b.date));

    return { roleData, trendsArray };
  }, [arr, timeOfDay, dateRange]);

  // Sorting function
  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
  };

  // Apply sorting to data
  const sortedData = [...processedData.roleData].sort((a, b) => {
    if (sortConfig.key === 'role') {
      return sortConfig.direction === 'ascending'
        ? a.role.localeCompare(b.role)
        : b.role.localeCompare(a.role);
    } else {
      const aValue = parseFloat(a[sortConfig.key]);
      const bValue = parseFloat(b[sortConfig.key]);
      return sortConfig.direction === 'ascending'
        ? aValue - bValue
        : bValue - aValue;
    }
  });

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  // Calculate summary statistics
  const totalAdmissions = sortedData.reduce((sum, item) => sum + parseFloat(item.totalAdmissions), 0);
  const totalCost = sortedData.reduce((sum, item) => sum + parseFloat(item.totalCost), 0);
  const avgCostPerAdmission = totalCost / totalAdmissions;

  // Prepare data for the pie chart
  const costDistributionData = sortedData.map(item => ({
    name: item.role,
    value: parseFloat(item.totalCost)
  }));

  return (
    <div>
      <div className="header">
        <h1 className="title">S.A.D.Q.</h1>
        <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
      </div>
      <div className="containerconfig">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">S.A.D.Q.</h1>
          <h2 className="text-xl text-gray-600">Standardized Admissions Distribution Queue</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time of Day</label>
            <select
              className="border rounded-md px-3 py-2 bg-white"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
            >
              <option value="all">All Times</option>
              <option value="5pm">5PM Shift</option>
              <option value="7pm">7PM Shift</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              className="border rounded-md px-3 py-2 bg-white"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="lastMonth">Last Month</option>
              <option value="lastWeek">Last Week</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-md shadow">
            <h3 className="text-lg font-semibold text-blue-800">Total Admissions</h3>
            <p className="text-2xl font-bold">{totalAdmissions}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-md shadow">
            <h3 className="text-lg font-semibold text-green-800">Total Cost</h3>
            <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-md shadow">
            <h3 className="text-lg font-semibold text-purple-800">Avg Cost Per Admission</h3>
            <p className="text-2xl font-bold">${avgCostPerAdmission.toFixed(2)}</p>
          </div>
        </div>

        {/* Role Metrics Table */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Role Performance Metrics</h3>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => sortData('role')}
                  >
                    Role{getSortIndicator('role')}
                  </th>
                  <th
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => sortData('avgAdmissions')}
                  >
                    Avg Admissions{getSortIndicator('avgAdmissions')}
                  </th>
                  <th
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => sortData('avgTime')}
                  >
                    Avg Time{getSortIndicator('avgTime')}
                  </th>
                  <th
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => sortData('totalAdmissions')}
                  >
                    Total Admissions{getSortIndicator('totalAdmissions')}
                  </th>
                  <th
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => sortData('avgCostPerAdmission')}
                  >
                    Cost/Admission{getSortIndicator('avgCostPerAdmission')}
                  </th>
                  <th
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => sortData('totalCost')}
                  >
                    Total Cost{getSortIndicator('totalCost')}
                  </th>
                  <th
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200"
                    onClick={() => sortData('efficiency')}
                  >
                    Efficiency{getSortIndicator('efficiency')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 font-medium">{item.role}</td>
                    <td className="px-4 py-2 text-right">{item.avgAdmissions}</td>
                    <td className="px-4 py-2 text-right">{item.avgTime}</td>
                    <td className="px-4 py-2 text-right">{item.totalAdmissions}</td>
                    <td className="px-4 py-2 text-right">${item.avgCostPerAdmission}</td>
                    <td className="px-4 py-2 text-right">${item.totalCost}</td>
                    <td className="px-4 py-2 text-right">{item.efficiency}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Admissions by Role Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Average Admissions by Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={sortedData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip formatter={(value) => [value, "Avg Admissions"]} />
                <Bar dataKey="avgAdmissions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Distribution Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Cost Distribution by Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Cost"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Efficiency Comparison */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Efficiency Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={sortedData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Efficiency"]} />
                <Bar dataKey="efficiency" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Trends Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Daily Admissions Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={processedData.trendsArray.slice(-14)} // Last 14 days
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total" strokeWidth={2} />
                {ROLES.map((role, index) => (
                  <Line
                    key={role}
                    type="monotone"
                    dataKey={role}
                    stroke={COLORS[index % COLORS.length]}
                    name={role}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Analysis Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Cost Optimization Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 p-4 rounded-md shadow">
              <h4 className="font-medium text-amber-800 mb-2">Most Cost-Effective Role</h4>
              <p className="text-lg font-bold">
                {sortedData.sort((a, b) => parseFloat(a.avgCostPerAdmission) - parseFloat(b.avgCostPerAdmission))[0]?.role || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                Lowest cost per admission at ${sortedData.sort((a, b) => parseFloat(a.avgCostPerAdmission) - parseFloat(b.avgCostPerAdmission))[0]?.avgCostPerAdmission || 'N/A'}
              </p>
            </div>

            <div className="bg-cyan-50 p-4 rounded-md shadow">
              <h4 className="font-medium text-cyan-800 mb-2">Highest Efficiency Role</h4>
              <p className="text-lg font-bold">
                {sortedData.sort((a, b) => parseFloat(b.efficiency) - parseFloat(a.efficiency))[0]?.role || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                Highest admissions per dollar at {sortedData.sort((a, b) => parseFloat(b.efficiency) - parseFloat(a.efficiency))[0]?.efficiency || 'N/A'}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}