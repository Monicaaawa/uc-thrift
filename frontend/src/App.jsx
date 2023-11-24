import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import ProfilePage from './pages/profile';
import Register from './pages/signup';
import Login from './pages/signin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;



