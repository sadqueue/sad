// import { useEffect, useState } from "react";
// import { fetchConfigValues, saveConfigValues } from "./transactionsApi";

// const ConfigPage = () => {
//   const [composite5PM, setComposite5PM] = useState({});
//   const [composite7PM, setComposite7PM] = useState({});

//   useEffect(() => {
//     const loadConfig = async () => {
//       const config = await fetchConfigValues();
//       if (config) {
//         setComposite5PM(config.composite5PM || {});
//         setComposite7PM(config.composite7PM || {});
//       }
//     };
//     loadConfig();
//   }, []);

//   const handleSave = async () => {
//     await saveConfigValues(composite5PM, composite7PM);
//     alert("Config saved!");
//   };

//   return (
//     <div>
//       <h1>Config Settings</h1>
//       <pre>{JSON.stringify(composite5PM, null, 2)}</pre>
//       <pre>{JSON.stringify(composite7PM, null, 2)}</pre>
//       <button onClick={handleSave}>Save Config</button>
//     </div>
//   );
// };

// export default ConfigPage;
