import React, { useEffect, useState } from "react";
import { getLast10Transactions } from "./transactionsApi";

const Last10Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getLast10Transactions();
      setTransactions(data);
    };

    fetchTransactions();
  }, []);
  
  return (
    <div>
      {/* <h2>Last 10 Transactions</h2> */}
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul>
          {transactions.map((transaction) => {
            console.log(transaction);
            return (<li key={transaction.id}>
            <strong> Time: </strong> {transaction.admissionsObj.startTime} | <strong>Order:</strong> {transaction.admissionsObj.admissionsOutput} | <strong>Timestamp:</strong> {new Date(transaction.timestamp).toLocaleString()}
            </li>);
})}
        </ul>
      )}
    </div>
  );
};

export default Last10Transactions;
