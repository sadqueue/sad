import React, { useState } from "react";

const ReportEntry = () => {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [admissions, setAdmissions] = useState({});
    const roles = ["Role 1", "Role 2", "Role 3", "Role 4"]; // Replace with actual roles

    const handleAdmissionChange = (role, value) => {
        setAdmissions(prev => ({
            ...prev,
            [role]: value
        }));
    };

    const addIndividualEntry = (role) => {
        console.log(`Adding entry for ${role}: ${admissions[role] || 0} admits on ${date}`);
    };

    const addGroupEntry = () => {
        console.log("Adding group entry:", admissions, "on", date);
    };

    return (
        <div className="report-entry-container">
            <h2>Report Entry</h2>
            <label>Date: </label>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Number of Admissions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map(role => (
                        <tr key={role}>
                            <td>{role}</td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    value={admissions[role] || ""}
                                    onChange={(e) => handleAdmissionChange(role, e.target.value)}
                                />
                            </td>
                            <td>
                                <button onClick={() => addIndividualEntry(role)}>Add</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={addGroupEntry}>Add Group Entry</button>
        </div>
    );
};

export default ReportEntry;
