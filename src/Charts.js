import React, { useEffect, useState } from "react";
import { getDatabase, ref, query, orderByKey, limitToLast, get } from "firebase/database";
import { getFirebaseRef, getLast50Transactions } from "./transactionsApi";



const QueueHistoryTable = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const admissionsObj = { startTime: "17:00" }; // Adjust as needed
        const data = await getLast50Transactions(admissionsObj);
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Queue Generation History</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Role</th>
            <th>Admissions</th>
            <th>ALR</th>
            <th>CLR</th>
            <th>Composite Score</th>
            <th>Order of Admissions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            transaction.shifts.map((shift, index) => (
              <tr key={`${transaction.id}-${index}`}>
                <td>{index == 0 ? transaction.timestamp : ""}</td>
                <td>{shift.name}</td>
                <td>{shift.numberOfAdmissions || "N/A"}</td>
                <td>{shift.alr}</td>
                <td>{shift.clr}</td>
                <td>{shift.composite}</td>
                <td>{index == 0 ? transaction.orderOfAdmissions.join(", ") : ""}</td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueueHistoryTable;
