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
import Triage from "./Triage";
import EpicPatient from "./EpicPatient";
import ALRCompositeCalculator from "./Calculator";
import ReportEntry from "./ReportEntryPage";
import Contact from "./Contact";
import SearchData from "./SearchData";
import GroupMorningEntry from "./GroupMorningEntry";
import AdmissionTracker from "./AdmissionTracker";
import About from "./About";


function App() {
  return (
    <Router basename="/">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sad" element={<HomePage />} />
        <Route path="/statistics" element={<AnalyticsPage />} />
        <Route path="/beta" element={<HomePageBeta />} />
        <Route path="/sad_v1.0" element={<HomePage_backup />} />
        <Route path="/login" element={<ConfigPage />} />
        <Route path="/cypress" element={<CypressPage />} />
        <Route path="/data" element={<Charts/>} />
        <Route path="/triage" element={<Triage/>} />
        <Route path="/epic" element={<EpicPatient/>} />
        <Route path="/calculator" element={<ALRCompositeCalculator/>} />
        <Route path="/reportentry" element={<ReportEntry/>} />
        <Route path="/searchdata" element={<SearchData/>} />
        <Route path="/GroupMorningEntry" element={<GroupMorningEntry/>} />
        <Route path="/AdmissionTracker" element={<AdmissionTracker/>} />
        <Route path="/Contact" element={<Contact/>} />
        <Route path="/About" element={<About/>} />

      </Routes>
    </Router>
  );
}

export default App;
