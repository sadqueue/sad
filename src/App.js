import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import HomePageBeta from "./HomePageBeta";
// import HomePageBeta2 from "./HomePageBeta2";
import AnalyticsPage from "./AnalyticsPage";
import Navbar from "./NavBar";
import ConfigPage from "./ConfigPage";
import CypressPage from "./CypressPage";
import HomePage_backup from "./HomePage_backup";
import Charts from "./Charts";
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
        <Route path="/sad_v1.0" element={<HomePage_backup />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="/cypress" element={<CypressPage />} />
        <Route path="/charts" element={<Charts/>} />
      </Routes>
    </Router>
  );
}

export default App;
