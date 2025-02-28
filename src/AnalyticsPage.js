import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { testArr5pm, testArr7pm } from "./data/data";
const arr = testArr5pm.concat(testArr7pm);

// Process data for chart
const processData = () => {
    const dataMap = new Map();
    const timeSlots = [
        "16:00-16:15", "16:15-16:30", "16:30-16:45", "16:45-17:00", 
        "17:00-17:15", "17:15-17:30", "17:30-17:45", "17:45-18:00",
        "18:00-18:15", "18:15-18:30", "18:30-18:45", "18:45-19:00",
        "19:00-19:15", "19:15-19:30", "19:30-19:45", "19:45-20:00"
    ];

    timeSlots.forEach(slot => dataMap.set(slot, []));

    arr.forEach(([entry]) => {
        const [times, counts] = entry.split(";").slice(0, 2);
        const timeArray = times.split(",");
        const countArray = counts.split(",").map(Number);

        timeArray.forEach((time, index) => {
            const [hour, minute] = time.split(":").map(Number);
            const slotIndex = Math.floor(minute / 15);
            const slotKey = `${hour.toString().padStart(2, '0')}:${(slotIndex * 15).toString().padStart(2, '0')}-${hour.toString().padStart(2, '0')}:${((slotIndex + 1) * 15).toString().padStart(2, '0')}`;
            
            if (dataMap.has(slotKey)) {
                dataMap.get(slotKey).push(countArray[index]);
            }
        });
    });

    return Array.from(dataMap.entries()).map(([time, counts]) => ({
        time,
        admissions: counts.length ? (counts.reduce((a, b) => a + b, 0) / counts.length) : 0,
    }));
};

const data = processData();

export default function AnalysisPage() {
    return (
        <div>
            {/* <div className="header">
                <h1 className="title">S.A.D.Q.</h1>
                <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
            </div> */}
            <div className="containerconfig">
            <ul>
                <li>
                    <a href="/sad#/login">Config</a>
                </li>
                <li>
                    <a href="/sad#/analytics">Analytics</a>
                </li>
                <li>
                    <a href="/sad#/charts">Charts</a>
                </li>
                <li>
                    <a href="/sad#/triage">Triage</a>
                </li>
            </ul>
                <h3>Average Admissions Per 15-Minute Interval</h3>
                <ResponsiveContainer height={400} width="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" angle={-30} textAnchor="end" />
                        <YAxis domain={[0, 'dataMax']} label={{ value: "Admissions", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="admissions" fill="#8884d8" />
                    </BarChart>
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
