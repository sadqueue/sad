import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage'; // Your main page
import VisualizationPage from './VisualizationPage'; // The new page

function App() {
  return (
    <Router>
      <nav>
        <ul>
          {/* <li><Link to="/">Home</Link></li>
          <li><Link to="/visualization">Visualization</Link></li> */}
        </ul>
      </nav>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sad" element={<HomePage />} />
        <Route path="/visualization" element={<VisualizationPage />} />
      </Routes>
    </Router>
  );
}

export default App;