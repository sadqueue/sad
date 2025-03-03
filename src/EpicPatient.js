import React, { useState } from "react";
import axios from "axios";

const EpicPatient = () => {
  const [patient, setPatient] = useState(null);
  const [patientId, setPatientId] = useState(""); // Patient ID input

  const fetchPatientData = async () => {
    const EPIC_BASE_URL = "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4";
    const ACCESS_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1cm46b2lkOjEuMi44NDAuMTE0MzUwLjEuMTMuMC4xLjcuMy42ODg4ODQuMTAwIiwiY2xpZW50X2lkIjoiZDlmMDdiZTYtMjhjZC00NjlhLWIyYzEtYzY1OTVjYzgxOTAxIiwiZXBpYy5lY2kiOiJ1cm46ZXBpYzpPcGVuLkVwaWMtY3VycmVudCIsImVwaWMubWV0YWRhdGEiOiJYM1JWUmdtaWU3WDlPZTRSTS1FY3R2R2swdUlDcEwzTk1MMkhITHdmNVZ6bHJxZHpyVXBKTXRUekZvODE2c1gyS2NQemhtbkdwUXdhQlZYdGZfcjJsNERwNzdMbVhXWmRtU29seXYzQjhBdzZNbF9TVGFWS1JSTVZSWW80YzdfRiIsImVwaWMudG9rZW50eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwODkxODU2LCJpYXQiOjE3NDA4ODgyNTYsImlzcyI6InVybjpvaWQ6MS4yLjg0MC4xMTQzNTAuMS4xMy4wLjEuNy4zLjY4ODg4NC4xMDAiLCJqdGkiOiJhMzgxMzU4YS1kYmUzLTQxNTYtOTgzOS1jZTM1MWQ1MjY5Y2IiLCJuYmYiOjE3NDA4ODgyNTYsInN1YiI6ImV2TnAtS2hZd09PcUFabjFwWjJlbnVBMyJ9.f-A894uLx7RQkADPM2JiSqg3Ob08TrRKzq5USznhhYf6LZQNjf_F2ZQ98dyur03AXjrBM3HvVyZIzOZk7HN2bJV-GRpLNbc6-TS450s3lCm669a-3gAag9nHPPV6jjrzhhtntW_oRlgR7Ov3BoGGhNeUZUn93mVNnTQ3LAbY2rrqMZSdOSBsddxv3PcfgDYNkD1i68xSpkvuh8Ryiw1Z0u5wp-SkmqJtMa4TsqRnmlARtwmWWH-Ob-k12BsGSxCqJgkwfA8RAq8Tp3QLfgOyfe13q_m89SMWZ34kOPdqORCET7p3gPHXueVXixjnvjcghsuwkOmmzxWBWbQzITlO2Q"; // Replace with your actual token

    try {
      const response = await axios.get(`${EPIC_BASE_URL}/Patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          Accept: "application/fhir+json",
        },
      });

      setPatient(response.data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Epic FHIR Patient Data</h2>
      <input
        type="text"
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={fetchPatientData} style={{ padding: "5px 10px" }}>
        Fetch Patient
      </button>

      {patient && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
          <h3>Patient Info</h3>
          <p><strong>Name:</strong> {patient.name?.[0]?.text || "N/A"}</p>
          <p><strong>Gender:</strong> {patient.gender || "N/A"}</p>
          <p><strong>Birth Date:</strong> {patient.birthDate || "N/A"}</p>
        </div>
      )}
    </div>
  );
};

export default EpicPatient;
