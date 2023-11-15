import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navigation/Navbar';
import Searchbar from './components/navigation/Searchbar';
import ProfilePage from './pages/profile'; // Import the ProfilePage component
import DetailsPage from './pages/details';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Searchbar />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/item-details/:itemId" element={<DetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
