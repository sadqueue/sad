import React, { useState, useEffect } from "react";
import { db, collection, addDoc, getDocs, query, orderBy } from "./config/firebaseConfigMore";
import "./SearchData.css"; // Import the CSS file

const AssessmentsPage = () => {
  const [formData, setFormData] = useState({ patientName: "", assessment: "", plan: "" });
  const [assessments, setAssessments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAssessments();
  }, []);

  // Fetch assessments from Firebase
  const fetchAssessments = async () => {
    const q = query(collection(db, "assessments"), orderBy("timestamp", "desc"));
    // const querySnapshot = await getDocs(q);
    // setAssessments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit data to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.assessment || !formData.plan) return;

    await addDoc(collection(db, "assessments"), {
      ...formData,
      timestamp: new Date()
    });

    setFormData({ patientName: "", assessment: "", plan: "" });
    fetchAssessments(); // Refresh table
  };

  // AI-Powered Search (basic implementation)
  const filteredAssessments = assessments.filter(({ patientName, assessment, plan }) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      patientName.toLowerCase().includes(lowerQuery) ||
      assessment.toLowerCase().includes(lowerQuery) ||
      plan.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <div className="container">
      <h3>Doctor's Assessments & Plans</h3>

      {/* Input Form */}
      <form className="searchdataform" onSubmit={handleSubmit}>
        <textarea className="searchdatainput" name="assessment" placeholder="Assessment" value={formData.assessment} onChange={handleChange} required />
        <textarea className="searchdatainput"  name="plan" placeholder="Plan" value={formData.plan} onChange={handleChange} required />
        <button className="searchdatabutton" type="submit">Add Note</button>
      </form>

      {/* Search Bar */}
      <input type="text" className="search-bar" placeholder="Search assessments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      {/* Data Table */}
      <table className="searchdatatable">
        <thead>
          <tr>
            <th className="searchdatata">Assessment</th>
            <th className="searchdatata">Plan</th>
            <th className="searchdatata">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssessments.map(({ id, patientName, assessment, plan, timestamp }) => (
            <tr key={id}>
              <td className="searchdatata">{assessment}</td>
              <td className="searchdatata">{plan}</td>
              <td className="searchdatata">{new Date(timestamp.seconds * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssessmentsPage;
