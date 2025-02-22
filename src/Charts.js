import React, { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { testArr7pm, testArr5pm } from "./data/data"; // Import both datasets


const parseData = (data) => {
  let roleStats = {
    S1: { totalTime: 0, totalAdmissions: 0, count: 0 },
    S2: { totalTime: 0, totalAdmissions: 0, count: 0 },
    S3: { totalTime: 0, totalAdmissions: 0, count: 0 },
    S4: { totalTime: 0, totalAdmissions: 0, count: 0 },
    N5: { totalTime: 0, totalAdmissions: 0, count: 0 },
  };

  let chartData = [];

  data.forEach(([info, date]) => {
    const [timestamps, admissions, order] = info.split(";");
    const timeArr = timestamps.split(",");
    const admissionsArr = admissions.split(",").map(Number);
    const orderArr = ["S1","S2","S3","S4"]

    orderArr.forEach((role, index) => {
      let timeParts = timeArr[index].split(":").map(Number);
      let totalMinutes = timeParts[0] * 60 + timeParts[1];

      roleStats[role].totalTime += totalMinutes;
      roleStats[role].totalAdmissions += admissionsArr[index];
      roleStats[role].count++;
    });

    chartData.push({
      date,
      S1: admissionsArr[0],
      S2: admissionsArr[1],
      S3: admissionsArr[2],
      S4: admissionsArr[3],
    //   N5: admissionsArr[4] || 0, // Handle missing N5 in some cases
    });
  });

  let avgStats = Object.keys(roleStats).map((role) => ({
    role,
    avgTime: roleStats[role].count ? (roleStats[role].totalTime / roleStats[role].count).toFixed(2) : 0,
    avgAdmissions: roleStats[role].count ? (roleStats[role].totalAdmissions / roleStats[role].count).toFixed(2) : 0,
  }));

  return { avgStats, chartData };
};

const AnalysisPage = () => {
  const [analysis, setAnalysis] = useState({ avgStats: [], chartData: [] });

  useEffect(() => {
    setAnalysis(parseData(testArr5pm));
  }, []);

  return (
    <div>
        <div className="header">
                <h1 className="title">S.A.D.Q.</h1>
                <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
            </div>
      <h3>Admissions Analysis</h3>

      {/* Table for Averages */}
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "center", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Role</th>
            <th>Avg. Admissions</th>
            <th>Avg. Timestamp (minutes)</th>
          </tr>
        </thead>
        <tbody>
          {analysis.avgStats.map(({ role, avgAdmissions, avgTime }) => (
            <tr key={role}>
              <td>{role}</td>
              <td>{avgAdmissions}</td>
              <td>{avgTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Line Chart: Admissions Trends */}
      <h3>Admissions Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={analysis.chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#eee" />
          <Line type="monotone" dataKey="S1" stroke="#8884d8" name="S1" />
          <Line type="monotone" dataKey="S2" stroke="#82ca9d" name="S2" />
          <Line type="monotone" dataKey="S3" stroke="#ff7300" name="S3" />
          <Line type="monotone" dataKey="S4" stroke="#ff0000" name="S4" />
          <Line type="monotone" dataKey="N5" stroke="#0000ff" name="N5" />
        </LineChart>
      </ResponsiveContainer>

      {/* Bar Chart: Average Timestamps */}
      <h3>Average Timestamp by Role</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={analysis.avgStats}>
          <XAxis dataKey="role" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#eee" />
          <Bar dataKey="avgTime" fill="#8884d8" name="Avg. Timestamp" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisPage;
