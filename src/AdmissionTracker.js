import React, { useState } from "react";
import { getConfigNavbar } from "./helper";

const mockUsers = [
  { name: "Dr. Lee", count: 2 },
  { name: "Dr. Smith", count: 3 },
  { name: "Dr. Patel", count: 1 },
  { name: "Dr. Gomez", count: 4 },
];

export default function AdmissionTracker() {
  const [admissions, setAdmissions] = useState(mockUsers);
  const [newEntry, setNewEntry] = useState({ name: "", count: 0 });

  const handleSubmit = () => {
    setAdmissions((prev) => {
      const exists = prev.find((p) => p.name === newEntry.name);
      if (exists) {
        return prev.map((p) =>
          p.name === newEntry.name ? { ...p, count: p.count + parseInt(newEntry.count) } : p
        );
      } else {
        return [...prev, { ...newEntry, count: parseInt(newEntry.count) }];
      }
    });
    setNewEntry({ name: "", count: 0 });
  };

  return (
    <div className="containerconfig">
      {/* Admission Entry Section */}
      {getConfigNavbar()}
      <div className="border p-4 rounded-lg shadow">
        <h3>Real-Time Admission Tracker</h3>
        <div className="flex gap-4 mt-2">
          <input
            className="border p-2 rounded w-1/3"
            placeholder="Your Name"
            value={newEntry.name}
            onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
          />
          <input
            className="border p-2 rounded w-1/3"
            type="number"
            placeholder="# of Admissions"
            value={newEntry.count}
            onChange={(e) => setNewEntry({ ...newEntry, count: e.target.value })}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Live Admission Counts */}
      <div className="border p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Live Admission Counts</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Hospitalist</th>
              <th className="border p-2">Admissions</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((doc, index) => (
              <tr key={index}>
                <td className="border p-2">{doc.name}</td>
                <td className="border p-2 text-center">{doc.count}</td>
                <td className="border p-2 text-center">
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      doc.count > 3 ? "bg-red-500 text-white" : "bg-green-500 text-white"
                    }`}
                  >
                    {doc.count > 3 ? "Heavy" : "Balanced"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
