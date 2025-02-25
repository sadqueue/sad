import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { testArr5pm, testArr7pm } from "./data/data";
const arr = testArr5pm.concat(testArr7pm);

// Process data for chart
const processData = () => {
    const dataMap = new Map();

    arr.forEach(([entry]) => {
        const [times, counts] = entry.split(";").slice(0, 2);
        const timeArray = times.split(",");
        const countArray = counts.split(",").map(Number);

        timeArray.forEach((time, index) => {
            if (!dataMap.has(time)) {
                dataMap.set(time, []);
            }
            dataMap.get(time).push(countArray[index]);
        });
    });

    return Array.from(dataMap.entries()).map(([time, counts]) => ({
        time,
        admissions: counts.reduce((a, b) => a + b, 0) / counts.length,
    })).sort((a, b) => a.time.localeCompare(b.time));
};

const data = processData();

export default function AnalysisPage() {
    return (
        <div className="p-4">
            <div className="header">
                <h1 className="title">S.A.D.Q.</h1>
                <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
            </div>
            <div className="containerconfig">
                <h3>Average Admissions Per 15-Minute Interval</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" angle={-45} textAnchor="end" interval={3} />
                        <YAxis domain={[0, 'dataMax']} label={{ value: "Admissions", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="admissions" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>

                <h3>Admissions Data Table</h3>
                <table>
                    <thead>
                        <tr>
                            <th className="border border-gray-500 px-4 py-2">Time</th>
                            <th className="border border-gray-500 px-4 py-2">Average Admissions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td className="border border-gray-500 px-4 py-2">{row.time}</td>
                                <td className="border border-gray-500 px-4 py-2">{row.admissions.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
