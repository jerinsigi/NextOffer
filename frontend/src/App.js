import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Login from './components/home/Login';
import Register from './components/home/Register';
import ForgotPassword from './components/home/ForgotPassword';
import TermsOfService from './components/home/TermsOfService';
import PrivacyPolicy from './components/home/PrivacyPolicy';
import Help from './components/home/Help';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/pages/Dashboard';
import Companies from './components/admin/pages/Companies';
import Users from './components/admin/pages/Users';
import Integrity from './components/admin/pages/Integrity';
import Support from './components/admin/pages/Support';
import Logs from './components/admin/pages/Logs';
import Settings from './components/admin/pages/Settings';
import Reports from './components/admin/pages/Reports';
import JobDescriptions from './components/admin/pages/JobDescriptions';
import InterviewMonitoring from './components/admin/pages/InterviewMonitoring';
import AdminProfile from './components/admin/pages/AdminProfile';
import Documentation from './components/admin/pages/Documentation';
import ComingSoon from './components/admin/pages/ComingSoon';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<Help />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="users" element={<Users />} />
          <Route path="jobs" element={<JobDescriptions />} />
          <Route path="interviews" element={<InterviewMonitoring />} />
          <Route path="integrity" element={<Integrity />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logs" element={<Logs />} />
          <Route path="support" element={<Support />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="documentation" element={<Documentation />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
