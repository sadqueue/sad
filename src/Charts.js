import React, { useEffect, useState } from "react";
import { getLast50Transactions, deleteTransaction } from "./transactionsApi";
import { SHOW_ROWS_TABLE } from "./constants";
import moment from "moment";

const QueueHistoryTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState("17:00");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const admissionsObj = { startTime: selectedTime }; // Adjust as needed
        const data = await getLast50Transactions(admissionsObj);
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedTime]);

  const calculateAverages = (transactions, selectedTime) => {
    const roleData = {};
  
    transactions.forEach(transaction => {
      transaction.shifts
        .filter(shift => SHOW_ROWS_TABLE[selectedTime].includes(shift.name))
        .forEach(shift => {
          if (!roleData[shift.name]) {
            roleData[shift.name] = { totalALR: 0, totalCLR: 0, totalComposite: 0, count: 0 };
          }
          roleData[shift.name].totalALR += Number(shift.alr) || 0;
          roleData[shift.name].totalCLR += Number(shift.clr) || 0;
          roleData[shift.name].totalComposite += Number(shift.composite) || 0;
          roleData[shift.name].count += 1;
        });
    });
  
    // Compute averages
    const averages = Object.entries(roleData).map(([role, data]) => ({
      role,
      avgALR: (data.totalALR / data.count).toFixed(3),
      avgCLR: (data.totalCLR / data.count).toFixed(3),
      avgComposite: (data.totalComposite / data.count).toFixed(3),
    }));
  
    return averages;
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(selectedTime, transactionId);
        setTransactions(transactions.filter(transaction => transaction.id !== transactionId));
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  return (
    <div>
      {/* <div className="header">
        <h1 className="title">S.A.D.Q.</h1>
        <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
      </div> */}
      {loading ? <div className="loading">
        <div className="spinner">
          {/* Loading... */}
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
      </div> :
        <div className="containerconfig">
            <ul>
                <li>
                    <a href="/sad#/data">Data</a>
                </li>
                <li>
                    <a href="/sad#/statistics">Statistics</a>
                </li>
                <li>
                    <a href="/sad#/login">Settings</a>
                </li>
                <li>
                    <a href="/sad#/triage">Triage</a>
                </li>
                <li>
                    <a href="/sad#/login" onClick={()=>{
                        localStorage.removeItem("loggedin");
                    }}>Logout</a>
                </li>
            </ul>
          <select className={"timesdropdownwithoutsnapshot"} value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
            <option value="17:00">5PM</option>
            <option value="19:00">7PM</option>
          </select>
          <div>
      <h3>Averages</h3>
      {calculateAverages(transactions, selectedTime).map(({ role, avgALR, avgCLR, avgComposite }) => (
        <p key={role}>
          {role} ALR: {avgALR}, CLR: {avgCLR}, Composite Score: {avgComposite}
        </p>
      ))}
    </div>
    <h3>Last Generated Order of Admissions</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Actions</th>
                <th>Time Generated</th>
                <th>Role</th>
                <th>Timestamp</th>
                <th># of Admissions</th>
                <th>ALR</th>
                <th>CLR</th>
                <th>Composite Score</th>
                <th>Order of Admissions</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .slice() // Create a shallow copy to avoid mutating the original array
                .reverse() // Reverse the order to make the most recent first
                .map((transaction) => (
                  transaction.shifts
                    .filter(shift => SHOW_ROWS_TABLE[selectedTime].includes(shift.name))
                    .map((shift, index) => (
                      <tr key={`${transaction.id}-${index}`} style={index % 5 == 0 ? { background: "lightgray" } : {}}>
                        <td>
                          {index % 5 == 0 && <button onClick={() => handleDelete(transaction.id)}>X</button>}
                        </td>
                        <td>{index % 5 == 0 && transaction.timestamp}</td>
                        <td>{shift.name}</td>
                        <td>{shift.timestamp}</td>
                        <td>{shift.numberOfAdmissions}</td>
                        <td>{shift.alr}</td>
                        <td>{shift.clr}</td>
                        <td>{shift.composite}</td>
                        <td>{index % 5 == 0 && transaction.orderOfAdmissions.join(", ")}</td>

                      </tr>
                    ))
                ))}
            </tbody>
          </table>
        </div>}


    </div>
  );
};

export default QueueHistoryTable;
