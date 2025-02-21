// module.exports = (on, config) => {
//     on("task", {
//         saveTestResult(testResult) {
//             const { getDatabase, ref, set } = require("firebase/database");
//             const { initializeApp } = require("firebase/app");
//             const firebaseConfig = require("../../src/firebaseConfig");

//             const app = initializeApp(firebaseConfig);
//             const db = getDatabase(app);

//             // Push the result to Firebase under the 'cypressResults' node
//             const resultRef = ref(db, "cypressResults/" + testResult.title.replace(/\s+/g, "_"));
//             return set(resultRef, testResult).then(() => {
//                 return null; // Return null when done saving
//             });
//         }
//     });
// };