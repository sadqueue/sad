import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { getConfigNavbar } from "./helper";
import { getAllTransactions } from "./transactionsApi";

export default function AnalysisPage() {
    const [data, setData] = useState([]);
    const [selectedTime, setSelectedTime] = useState("17:00"); // Default to 17:00

    useEffect(() => {
        fetchTransactions(selectedTime);
    }, [selectedTime]);

    const fetchTransactions = (time) => {
        getAllTransactions(time).then((res) => {
            console.log("Raw API Response:", res);
            if (Array.isArray(res) && res.length > 0) {
                const processed = processData(res);
                console.log("Processed Data:", processed);
                setData(processed);
            } else {
                console.warn("No transactions found or incorrect response format.");
                setData([]);
            }
        }).catch(error => console.error("Error fetching transactions:", error));
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let min = 0; min < 60; min += 15) {
                const start = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                const end = `${hour.toString().padStart(2, '0')}:${(min + 15).toString().padStart(2, '0')}`;
                slots.push(`${start}-${end}`);
            }
        }
        return slots;
    };

    const processData = (transactions) => {
        const dataMap = new Map();
        const timeSlots = generateTimeSlots();
        timeSlots.forEach(slot => dataMap.set(slot, 0));

        transactions.forEach(transaction => {
            if (!transaction.orderOfAdmissions || !Array.isArray(transaction.orderOfAdmissions)) {
                console.warn("Skipping transaction with missing orderOfAdmissions:", transaction);
                return;
            }

            transaction.shifts.forEach(admission => {
                if (!admission.timestamp) {
                    console.warn("Skipping admission with missing timestamp:", admission);
                    return;
                }

                console.log("Processing timestamp:", admission.timestamp);
                const [hour, minute] = admission.timestamp.split(":").map(Number);
                const slotIndex = Math.floor(minute / 15);
                const slotKey = `${hour.toString().padStart(2, '0')}:${(slotIndex * 15).toString().padStart(2, '0')}-${hour.toString().padStart(2, '0')}:${((slotIndex + 1) * 15).toString().padStart(2, '0')}`;

                if (dataMap.has(slotKey)) {
                    dataMap.set(slotKey, dataMap.get(slotKey) + 1);
                }
            });
        });

        return Array.from(dataMap.entries()).map(([time, admissions]) => ({
            time,
            admissions,
        }));
    };

    return (
        <div>
            <div className="containerconfig">
                {getConfigNavbar()}

                {/* Dropdown to select time */}
                <label htmlFor="timeSelect">Select Time: </label>
                <select
                    id="timeSelect"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                >
                    <option value="17:00">17:00</option>
                    <option value="19:00">19:00</option>
                </select>

                <h3>Average Admissions Per 15-Minute Interval</h3>
                {data.length > 0 ? (
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
                ) : (
                    <p>No data available for this time range.</p>
                )}

                <h3>Admissions Data Table</h3>
                {data.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th className="border border-gray-500 px-4 py-2">Time</th>
                                <th className="border border-gray-500 px-4 py-2">Admissions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-500 px-4 py-2">{row.time}</td>
                                    <td className="border border-gray-500 px-4 py-2">{row.admissions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data available.</p>
                )}
            </div>
        </div>
    );
}
