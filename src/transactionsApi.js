import {
  ref,
  push,
  get,
  remove,
  query,
  orderByKey,
  limitToLast,
  orderByChild,
  set,
  getDatabase,
  update
} from "firebase/database";
import { ENV_POINT_TO } from "./constants";
import database from "./firebaseConfig";
// import { getDatabase, ref, remove } from "firebase/database";

// Fetch all config values from Firebase
export const fetchConfigValues = async () => {
  const db = getDatabase();
  const configRef = ref(db, "config");

  try {
    const snapshot = await get(configRef);
    if (snapshot.exists()) {
      console.log("Config data fetched:", snapshot.val()); // Debug log
      return snapshot.val();
    } else {
      console.warn("No configuration found in Firebase.");
      return {};
    }
  } catch (error) {
    console.error("Error fetching config from Firebase:", error);
    return {};
  }
};

// Update a single config value in Firebase
export const updateConfigValue = async (key, value) => {
  const db = getDatabase();
  const configRef = ref(db, `config/${key}`);

  try {
    await set(configRef, value);
    console.log(`${key} updated successfully.`);
  } catch (error) {
    console.error(`Error updating ${key}:`, error);
  }
};

// Initialize default values if config is empty
export const initializeConfigValues = async () => {
  const db = getDatabase();
  const configRef = ref(db, "config");

  try {
    const snapshot = await get(configRef);
    if (!snapshot.exists()) {
      const defaultConfig = {
        ALR_5PM: 0.6,
        CLR_5PM: 0.4,
        ALR_7PM: 0.7,
        CLR_7PM: 0.3,
        P95_7PM: 180,
        P95_5PM: 180,
        CONSTANT_COMPOSITE_5PM_N5: 0.49,
        CONSTANT_COMPOSITE_7PM_N1: 0.49,
        CONSTANT_COMPOSITE_7PM_N2: 0.59,
        CONSTANT_COMPOSITE_7PM_N3: 0.69,
        CONSTANT_COMPOSITE_7PM_N4: 0.79
      };
      await set(configRef, defaultConfig);
      console.log("Initialized default config values.");
    }
  } catch (error) {
    console.error("Error initializing config:", error);
  }
};

export const getFirebaseRef = (startTime, manuallySetEnv = "") => {
  let transactionsRef = "";

  if (manuallySetEnv == "prod" || ENV_POINT_TO =="prod"){
    transactionsRef = ref(database, `transactions_${startTime}`);
  } else {
    if (ENV_POINT_TO == "prod") {
      transactionsRef = ref(database, `transactions_${startTime}`);
    } else if (window.location.hostname === 'localhost') {
      transactionsRef = ref(database, `transactions_local_${startTime}`);
    } else {
      transactionsRef = ref(database, `transactions_${startTime}`);
    }
  }
  
  return transactionsRef
}
export const getLast10Transactions = async (admissionsObj) => {
  const transactionsRef = getFirebaseRef(admissionsObj.startTime);
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
export const addTransaction = async (admissionsObj, order, copyBox) => {
  const transactionsRef = getFirebaseRef(admissionsObj.startTime);

  try {
    const getUserDeviceDetails = () => {
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      };
    };

    const timestamp = new Date();
    const month = timestamp.getMonth() + 1; // Months are zero-based
    const day = timestamp.getDate();
    const year = timestamp.getFullYear();
    let hours = timestamp.getHours();
    const minutes = String(timestamp.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

    const localDateTime = `${month}/${day}/${year} ${hours}:${minutes}${ampm}`;

    const newTransaction = {
      timestamp: timestamp,
      localDateTime: localDateTime,
      userDeviceDetails: getUserDeviceDetails(),
      admissionsObj,
      order: order ? order : "",
      deleted: false
      // copyBox: copyBox ? copyBox : ""
    };

    // Push the new transaction to the database
    const newRef = await push(transactionsRef, newTransaction);
    return { success: true, key: newRef.key }; // Return the unique key
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { success: false, error };
  }
};

export const getLast50Transactions = async (admissionsObj) => {
  const transactionsRef = getFirebaseRef(admissionsObj.startTime, "prod");
  const transactionsQuery = query(transactionsRef, orderByKey(), limitToLast(100));

  try {
    const snapshot = await get(transactionsQuery);
    if (snapshot.exists()) {
      const data = snapshot.val();

      return Object.entries(data)
        .map(([key, value]) => ({
          id: key,
          timestamp: value.localDateTime || "N/A",
          orderOfAdmissions: value.order?.split(">") || [],
          shifts: value.admissionsObj?.allAdmissionsDataShifts?.shifts || [],
          deleted: value.deleted || false,
        }))
        .filter(transaction => !transaction.deleted); // Properly filter deleted transactions
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getAllTransactions = async (startTime) => {
  // Reference to the "5PM" table in Firebase
  const transactionsRef = getFirebaseRef(startTime);
  const transactionsQuery = query(transactionsRef, orderByKey());

  try {
    const snapshot = await get(transactionsQuery);
    if (snapshot.exists()) {
      const data = snapshot.val();

      return Object.entries(data)
        .map(([key, value]) => ({
          id: key,
          timestamp: value.localDateTime || "N/A",
          orderOfAdmissions: value.order?.split(">") || [],
          shifts: value.admissionsObj?.allAdmissionsDataShifts?.shifts || [],
        }))
        .filter(transaction => !transaction.deleted); // Filter out deleted transactions
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const deleteAllTransactions = async (startTime) => {
  const transactionsRef = getFirebaseRef(startTime);
  try {
    await remove(transactionsRef);
    console.log("All transactions deleted successfully!");
  } catch (error) {
    console.error("Error deleting all transactions:", error);
  }
};

export const deleteTransaction = async (startTime, transactionId) => {
  try {
    let transactionRef = "";

    if (ENV_POINT_TO == "prod") {
      transactionRef = ref(database, `transactions_${startTime}/${transactionId}`);
    } else if (window.location.hostname === 'localhost') {
      transactionRef = ref(database, `transactions_local_${startTime}/${transactionId}`);
    } else {
      transactionRef = ref(database, `transactions_${startTime}/${transactionId}`);
    }

    await update(transactionRef, { deleted: true });
    console.log(`Transaction ${transactionId} marked as deleted.`);
  } catch (error) {
    console.error(`Error deleting transaction ${transactionId}:`, error);
  }
};

export const hardDeleteTransaction = async (startTime, transactionId) => {
  try {
    let transactionRef = "";

    if (ENV_POINT_TO == "prod") {
      transactionRef = ref(database, `transactions_${startTime}/${transactionId}`);
    } else if (window.location.hostname === "localhost") {
      transactionRef = ref(database, `transactions_local_${startTime}/${transactionId}`);
    } else {
      transactionRef = ref(database, `transactions_${startTime}/${transactionId}`);
    }

    await remove(transactionRef); // Completely removes the transaction from the database
    console.log(`Transaction ${transactionId} has been permanently deleted.`);
  } catch (error) {
    console.error(`Error deleting transaction ${transactionId}:`, error);
  }
};

export const getMostRecentTransaction = async (startTime) => {
  try {
    const transactionsRef = getFirebaseRef(startTime);
    const recentQuery = query(transactionsRef, orderByChild("timestamp"), limitToLast(1));


    const snapshot = await get(recentQuery);


    if (snapshot && snapshot.exists()) {
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

export const updateTransaction = async (startTime, transactionId, updatedTransaction) => {
  try {
    let transactionRef = "";

    if (ENV_POINT_TO == "prod") {
      transactionRef = ref(database, `transactions_${startTime}/${transactionId}`);
    } else if (window.location.hostname === 'localhost') {
      transactionRef = ref(database, `transactions_local_${startTime}/${transactionId}`);
    } else {
      transactionRef = ref(database, `transactions_${startTime}/${transactionId}`);
    }

    // Remove any properties we don't want to update in Firebase
    const { deleted, ...dataToUpdate } = updatedTransaction;

    await update(transactionRef, dataToUpdate);
    console.log(`Transaction ${transactionId} updated successfully.`);
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating transaction ${transactionId}:`, error);
    throw error; // Rethrow so the UI can handle it
  }
};