import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import HomePageBeta from "./HomePageBeta";
// import HomePageBeta2 from "./HomePageBeta2";
import AnalyticsPage from "./AnalyticsPage";
import Navbar from "./NavBar";
import ConfigPage from "./ConfigPage";
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
        {/* <Route path="/beta2" element={<HomePageBeta2 />} /> */}
        <Route path="/config" element={<ConfigPage />} />
      </Routes>
    </Router>
  );
}

export default App;
