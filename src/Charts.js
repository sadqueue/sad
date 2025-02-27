import React, { useEffect, useState } from "react";
import { getDatabase, ref, query, orderByKey, limitToLast, get } from "firebase/database";
import { getFirebaseRef, getLast50Transactions } from "./transactionsApi";
import { SHOW_ROWS_COPY, SHOW_ROWS_TABLE } from "./constants";
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
  return (
    <div>
      <div className="header">
        <h1 className="title">S.A.D.Q.</h1>
        <h2 className="subtitle">Standardized Admissions Distribution Queue</h2>
      </div>
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
                    .filter(() => {
                      const timestamp = moment(transaction.timestamp.split(" ")[1], "HH:mmA");
                      let start = "";
                      let end = "";

                      if (selectedTime == "17:00") {
                        start = moment("16:30", "HH:mm");
                        end = moment("17:30", "HH:mm");
                      } else if (selectedTime == "19:00") {
                        start = moment("18:30", "HH:mm");
                        end = moment("19:30", "HH:mm");
                      }
                      return timestamp.isBetween(start, end, null, "[]");
                    })
                    .map((shift, index) => (
                      <tr key={`${transaction.id}-${index}`} style={index % 5 == 0 ? { background: "lightgray" } : {}}>
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
