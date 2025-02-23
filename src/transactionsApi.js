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
import database from "./firebaseConfig";

export const runCypressTests = async () => {
  try {
      const response = await fetch("http://localhost:3001/run-cypress", {
          method: "POST",
      });
      const result = await response.json();
      return result;
  } catch (error) {
      console.error("Error running Cypress tests:", error);
      return { success: false, error: error.message };
  }
};

export const saveLog = async (message) => {
  // const database = getDatabase(db);
  const logsRef = ref(database, "logs"); // Save logs under "logs" node

  try {
      await push(logsRef, {
          message: message,
          timestamp: new Date().toISOString(),
      });
      console.log("Log saved successfully");
  } catch (error) {
      console.error("Error saving log:", error);
  }
};

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

export const getFirebaseRef = (startTime) => {
  let transactionsRef = "";

  if (window.location.href.includes("/beta")){
    transactionsRef = ref(database, `transactions_beta_${startTime}`);
  } else if (window.location.hostname === 'localhost') {
    transactionsRef = ref(database, `transactions_local_${startTime}`);
  } else {
    transactionsRef = ref(database, `transactions_${startTime}`);
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

export const getMostRecentShiftByStartTime = (data) => {
  const shifts = data.shifts;
  const targetStartTime = data.startTime;

  // Filter the shifts with the specific startTime
  const filteredShifts = shifts.filter(shift => shift.startTime === targetStartTime);

  // Sort the filtered shifts by `timestamp` in descending order
  const sortedShifts = filteredShifts.sort((a, b) => {
    // Ensure empty timestamps are treated as less recent
    const timestampA = a.timestamp ? new Date(`1970-01-01T${a.timestamp}`) : new Date(0);
    const timestampB = b.timestamp ? new Date(`1970-01-01T${b.timestamp}`) : new Date(0);
    return timestampB - timestampA;
  });

  // Return the most recent shift (first in the sorted list) or null if none
  return sortedShifts.length > 0 ? sortedShifts[0] : null;
}


export const deleteAllTransactions = async (startTime) => {
  const transactionsRef = getFirebaseRef(startTime);
  try {
    await remove(transactionsRef);
    console.log("All transactions deleted successfully!");
  } catch (error) {
    console.error("Error deleting all transactions:", error);
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