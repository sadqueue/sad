import { 
    ref,
    push,
    get,
    remove,
    query,
    orderByKey,
    limitToLast, 
    orderByChild
 } from "firebase/database";
import database from "./firebaseConfig";

export const getLast10Transactions = async () => {
    const transactionsRef = ref(database, "transactions");
    const transactionsQuery = query(transactionsRef, orderByKey(), limitToLast(10));
  
    try {
      const snapshot = await get(transactionsQuery);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  };

// Function to add a new transaction
export const addTransaction = async (admissionsObj) => {
  
  try {
    
    const transactionsRef = ref(database, "transactions");

    const getUserDeviceDetails = () => {
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      };
    };

    const newTransaction = {
      timestamp: Date.now(),
      userDeviceDetails: getUserDeviceDetails(),
      admissionsObj
    };

    // Push the new transaction to the database
    const newRef = await push(transactionsRef, newTransaction);
    return { success: true, key: newRef.key }; // Return the unique key
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { success: false, error };
  }  
};

export const getTransaction = async (role, admissions) => {
    const transactionsRef = ref(database, "transactions");
    
      get(transactionsRef).then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Key:", snapshot.key); // The key of the current node
          console.log("Value:", snapshot.val()); // The value of the current node
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
  };

export const deleteAllTransactions = async (role, admissions) => {
    const transactionsRef = ref(database, "transactions");
    try {
        await remove(transactionsRef);
        console.log("All transactions deleted successfully!");
      } catch (error) {
        console.error("Error deleting all transactions:", error);
      }
  };
  
  export const getMostRecentTransaction = async () => {
    try {
      const transactionsRef = ref(database, "transactions");
      const recentQuery = query(transactionsRef, orderByChild("timestamp"), limitToLast(1));
  
      const snapshot = await get(recentQuery);
  
      if (snapshot.exists()) {
        const data = snapshot.val();
        const [key, value] = Object.entries(data)[0];
        return { success: true, transaction: { id: key, ...value } };
      } else {
        return { success: false, message: "No transactions found." };
      }
    } catch (error) {
      console.error("Error fetching the most recent transaction:", error);
      return { success: false, error };
    }
  };