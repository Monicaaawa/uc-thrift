import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navigation/Navbar';
import Searchbar from './components/navigation/Searchbar';
import ProfilePage from './pages/profile'; // Import the ProfilePage component

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Searchbar />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
