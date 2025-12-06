import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Login from './components/home/Login';
import Register from './components/home/Register';
import ForgotPassword from './components/home/ForgotPassword';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
}

export default App;
