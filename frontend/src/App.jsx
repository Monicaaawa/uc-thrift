import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import ProfilePage from './pages/profile';
import Register from './pages/signup';
import Login from './pages/signin';
import DetailsPage from './pages/details';
import PostPage from './pages/post';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/item/:itemId" element={<DetailsPage />} />
        <Route path="/post" element={<PostPage />} />
      </Routes>
    </Router>
  );
}

export default App;



