import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AnalyticsPage from "./AnalyticsPage";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sad" element={<HomePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;