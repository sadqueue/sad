import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import HomePageBeta from "./HomePageBeta";
import AnalyticsPage from "./AnalyticsPage";
import Navbar from "./NavBar";
// import AboutPage from "./AboutPage"; // Create an AboutPage component

function App() {
  return (
    <Router basename="/">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sad" element={<HomePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/beta" element={<HomePageBeta />} />
      </Routes>
    </Router>
  );
}

export default App;
