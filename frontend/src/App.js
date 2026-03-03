import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Login from './components/home/Login';
import Register from './components/home/Register';
import ForgotPassword from './components/home/ForgotPassword';
import ResetPassword from './components/home/ResetPassword';
import TermsOfService from './components/home/TermsOfService';
import PrivacyPolicy from './components/home/PrivacyPolicy';
import Help from './components/home/Help';
import CompanyRegister from './components/home/CompanyRegister';
import MaintenancePage from './components/home/MaintenancePage';


import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/pages/Dashboard';
import Companies from './components/admin/pages/Companies';
import Users from './components/admin/pages/Users';
import Support from './components/admin/pages/Support';
import Logs from './components/admin/pages/Logs';
import Settings from './components/admin/pages/Settings';
import Reports from './components/admin/pages/Reports';
import JobDescriptions from './components/admin/pages/JobDescriptions';
import AdminProfile from './components/admin/pages/AdminProfile';
import Documentation from './components/admin/pages/Documentation';
import JobCategories from './components/admin/pages/JobCategories';
import Skills from './components/admin/pages/Skills';
// import ComingSoon from './components/admin/pages/ComingSoon';


import UserLayout from './components/user/UserLayout';
import UserDashboard from './components/user/pages/UserDashboard';
import UserProfile from './components/user/pages/UserProfile';
import MyApplications from './components/user/pages/MyApplications';
import InterviewCenter from './components/user/pages/InterviewCenter';
import PracticeInterview from './components/user/pages/PracticeInterviewPage';
import ResultsFeedback from './components/user/pages/ResultsFeedback';
import SkillDevelopment from './components/user/pages/SkillDevelopment';
import Notifications from './components/user/pages/Notifications';
import HelpSupport from './components/user/pages/HelpSupport';
import UserSettings from './components/user/pages/Settings';
import JobOpportunities from './components/user/pages/JobOpportunities';
import SpeechTest from './components/SpeechTest';
import NativeSpeechTest from './components/NativeSpeechTest';

import CompanyLayout from './components/company/CompanyLayout';
import CompanyDashboard from './components/company/pages/Dashboard';
import CompanyProfile from './components/company/pages/CompanyProfile';


import CompanyIntegrity from './components/company/pages/Integrity';
import CompanySupport from './components/company/pages/Support';
import CompanySettings from './components/company/pages/Settings';
import CompanyReports from './components/company/pages/Reports';
import CompanyJobDescriptions from './components/company/pages/JobDescriptions';
import CompanyInterviewMonitoring from './components/company/pages/InterviewMonitoring';

import CompanyDocumentation from './components/company/pages/Documentation';
// import CompanyComingSoon from './components/company/pages/ComingSoon';
import ProtectedRoute from './components/common/ProtectedRoute';
import MaintenanceGuard from './components/common/MaintenanceGuard';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Unrestricted Routes that bypass maintenance mode explicitly in logic or handle it themselves */}
        <Route path="/login" element={<Login />} />
        <Route path="/maintenance" element={<MaintenancePage />} />

        {/* Admin Routes (Explicitly bypassed in MaintenanceGuard logic based on URL or role) */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="companies" element={<Companies />} />
            <Route path="users" element={<Users />} />
            <Route path="jobs" element={<JobDescriptions />} />
            <Route path="job-categories" element={<JobCategories />} />
            <Route path="skills" element={<Skills />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="logs" element={<Logs />} />
            <Route path="support" element={<Support />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="documentation" element={<Documentation />} />
          </Route>
        </Route>

        {/* Global Maintenance Wrapper for all other routes */}
        <Route element={<MaintenanceGuard />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/help" element={<Help />} />
          <Route path="/company/register" element={<CompanyRegister />} />
          <Route path="/speech-test" element={<SpeechTest />} />
          <Route path="/native-speech-test" element={<NativeSpeechTest />} />

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['candidate', 'user']} />}>
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="jobs" element={<JobOpportunities />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="interview/:interviewId" element={<InterviewCenter />} />
              <Route path="practice" element={<PracticeInterview />} />
              <Route path="results" element={<ResultsFeedback />} />
              <Route path="skills" element={<SkillDevelopment />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="help" element={<HelpSupport />} />
              <Route path="settings" element={<UserSettings />} />
            </Route>
          </Route>

          {/* Company Routes */}
          <Route element={<ProtectedRoute allowedRoles={['company']} />}>
            <Route path="/company" element={<CompanyLayout />}>
              <Route index element={<CompanyDashboard />} />
              <Route path="dashboard" element={<CompanyDashboard />} />
              <Route path="profile" element={<CompanyProfile />} />
              <Route path="jobs" element={<CompanyJobDescriptions />} />

              <Route path="interviews" element={<CompanyInterviewMonitoring />} />
              <Route path="integrity" element={<CompanyIntegrity />} />
              <Route path="reports" element={<CompanyReports />} />
              <Route path="support" element={<CompanySupport />} />
              <Route path="documentation" element={<CompanyDocumentation />} />
              <Route path="settings" element={<CompanySettings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
