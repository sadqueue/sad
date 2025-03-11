import React, { useState } from "react";
import { getConfigNavbar } from "./helper";

const initialGroup = [
  { name: "Dr. Lee", count: 0, verified: false },
  { name: "Dr. Smith", count: 0, verified: false },
  { name: "Dr. Patel", count: 0, verified: false },
];

export default function GroupMorningEntry() {
  const [group, setGroup] = useState(initialGroup);

  const handleInputChange = (index, value) => {
    const updated = [...group];
    updated[index].count = parseInt(value) || 0;
    updated[index].verified = true;
    setGroup(updated);
  };

  const handleSubmitAll = () => {
    console.log("Submitted entries:", group);
    // Save to backend logic here
  };

  return (
    <div>
    <div className="containerconfig">
      {getConfigNavbar()}
      
      <h3>Morning Admissions Entry</h3>
      <p style={{ color: "#666", fontSize: "14px" }}>
        Enter the number of admissions for each provider during the previous night shift.
        This entry will be visible to the group and used to fairly assign morning rounding load.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Hospitalist</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Admissions</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {group.map((doc, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>{doc.name}</td>
              <td style={{ padding: "8px" }}>
                <input
                  type="number"
                  value={doc.count}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  style={{ width: "50px", padding: "5px" }}
                />
              </td>
              <td style={{ padding: "8px", color: doc.verified ? "green" : "gray" }}>
                {doc.verified ? "Verified" : "Pending"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSubmitAll}
        style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}
      >
        Submit All Entries
      </button>
    </div>
    </div>
  );
}
