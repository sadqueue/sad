import React, { useEffect, useState } from "react";
import { getLast50Transactions, deleteTransaction, updateTransaction, hardDeleteTransaction} from "./transactionsApi";
import { SHOW_ROWS_TABLE } from "./constants";
import moment from "moment";
import { getConfigNavbar } from "./helper";

const QueueHistoryTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState("17:00");
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const admissionsObj = { startTime: selectedTime };
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

  const handleHardDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await hardDeleteTransaction(selectedTime, transactionId);
        setTransactions(transactions.filter(transaction => transaction.id !== transactionId));
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleEditClick = (transactionId, shiftIndex, field, value) => {
    setEditingCell({ transactionId, shiftIndex, field });
    setEditValue(value);
  };

  const handleEditCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleEditSave = async () => {
    if (!editingCell) return;
    
    const { transactionId, shiftIndex, field } = editingCell;
    
    try {
      // Find transaction index
      const transactionIndex = transactions.findIndex(t => t.id === transactionId);
      if (transactionIndex === -1) return;
      
      // Create deep copies to avoid state mutation
      const updatedTransactions = [...transactions];
      const updatedTransaction = { ...updatedTransactions[transactionIndex] };
      
      // Handle transaction-level fields
      if (field === 'transactionTimestamp') {
        updatedTransaction.timestamp = editValue;
        updatedTransaction.localDateTime = editValue;
      } 
      // Handle transaction-level orderOfAdmissions field
      else if (field === 'orderOfAdmissions') {
        // Convert comma-separated string to array
        updatedTransaction.orderOfAdmissions = editValue.split(',').map(item => item.trim());
      }
      // Handle shift-level fields
      else {
        const updatedShifts = [...updatedTransaction.shifts];
        updatedShifts[shiftIndex] = {
          ...updatedShifts[shiftIndex],
          [field]: field === 'numberOfAdmissions' || field === 'alr' || field === 'clr' || field === 'composite' 
            ? Number(editValue) // Convert to number for numeric fields
            : editValue
        };
        updatedTransaction.shifts = updatedShifts;
      }
      
      updatedTransactions[transactionIndex] = updatedTransaction;
      
      // Call API to update the transaction
      await updateTransaction(selectedTime, transactionId, updatedTransaction);
      
      // Update local state
      setTransactions(updatedTransactions);
      setEditingCell(null);
      setEditValue("");
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update data. Please try again.");
    }
  };

  const isEditableField = (field) => {
    // Define which fields are editable
    return ['name', 'timestamp', 'numberOfAdmissions', 'alr', 'clr', 'composite', 
            'transactionTimestamp', 'orderOfAdmissions'].includes(field);
  };

  const renderEditableCell = (transaction, shiftIndex, field, value, isRowStart) => {
    // Special handling for transaction-level fields that only appear at the start of a group
    if ((field === 'transactionTimestamp' || field === 'orderOfAdmissions') && !isRowStart) {
      return null;
    }

    const isEditing = 
      editingCell && 
      editingCell.transactionId === transaction.id && 
      editingCell.shiftIndex === shiftIndex && 
      editingCell.field === field;
    
    if (isEditing) {
      return (
        <div className="editing-container">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
            className="edit-input"
          />
          <div className="edit-buttons">
            <button onClick={handleEditSave} className="save-btn">✓</button>
            <button onClick={handleEditCancel} className="cancel-btn">✗</button>
          </div>
        </div>
      );
    }
    
    if (isEditableField(field)) {
      return (
        <div 
          onClick={() => handleEditClick(transaction.id, shiftIndex, field, value)}
          className="editable-cell"
        >
          {value}
          <span className="edit-icon">✎</span>
        </div>
      );
    }
    
    return value;
  };

  return (
    <div>
      {loading ? (
        <div className="loading">
          <div className="spinner">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
          </div>
        </div>
      ) : (
        <div className="containerconfig">
          {getConfigNavbar()}
          
          <select 
            className="timesdropdownwithoutsnapshot" 
            value={selectedTime} 
            onChange={(e) => setSelectedTime(e.target.value)}
          >
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
                .slice()
                .reverse()
                .map((transaction) => (
                  transaction.shifts
                    .filter(shift => SHOW_ROWS_TABLE[selectedTime].includes(shift.name))
                    .map((shift, shiftIndex) => {
                      const isRowStart = shiftIndex % 5 === 0;
                      return (
                        <tr 
                          key={`${transaction.id}-${shiftIndex}`} 
                          style={isRowStart ? { background: "lightgray" } : {}}
                        >
                          <td>
                            {isRowStart && <button
                            className="deleterow"
                            onClick={() => handleDelete(transaction.id)}>X</button>}
                            {window.location.href.includes("localhost") && isRowStart && <button
                            style={{all: "unset"}}
                            className="deleterow"
                            onClick={() => handleHardDelete(transaction.id)}>Hard Delete</button>}
                          </td>
                          <td>
                            {isRowStart && renderEditableCell(
                              transaction, 
                              shiftIndex, 
                              'transactionTimestamp', 
                              transaction.timestamp, 
                              isRowStart
                            )}
                          </td>
                          <td>{renderEditableCell(transaction, shiftIndex, 'name', shift.name, isRowStart)}</td>
                          <td>{renderEditableCell(transaction, shiftIndex, 'timestamp', shift.timestamp, isRowStart)}</td>
                          <td>{renderEditableCell(transaction, shiftIndex, 'numberOfAdmissions', shift.numberOfAdmissions, isRowStart)}</td>
                          <td>{renderEditableCell(transaction, shiftIndex, 'alr', shift.alr, isRowStart)}</td>
                          <td>{renderEditableCell(transaction, shiftIndex, 'clr', shift.clr, isRowStart)}</td>
                          <td>{renderEditableCell(transaction, shiftIndex, 'composite', shift.composite, isRowStart)}</td>
                          <td>
                            {isRowStart && renderEditableCell(
                              transaction, 
                              shiftIndex, 
                              'orderOfAdmissions', 
                              transaction.orderOfAdmissions.join(", "), 
                              isRowStart
                            )}
                          </td>
                        </tr>
                      );
                    })
                ))}
            </tbody>
          </table>
          
          <style jsx>{`
            .editable-cell {
              cursor: pointer;
              position: relative;
              padding-right: 20px;
              min-height: 20px;
            }
            .edit-icon {
              position: absolute;
              right: 5px;
              top: 50%;
              transform: translateY(-50%);
              opacity: 0.3;
              font-size: 12px;
            }
            .editable-cell:hover {
              background-color: #f5f5f5;
            }
            .editable-cell:hover .edit-icon {
              opacity: 1;
            }
            .editing-container {
              position: relative;
              padding-top: 20px;
            }
       
            .edit-buttons {
              position: absolute;
              top: 0;
              right: 0;
              display: flex;
              z-index: 10;
            }
      
          `}</style>
        </div>
      )}
    </div>
  );
};

export default QueueHistoryTable;