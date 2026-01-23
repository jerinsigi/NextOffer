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
import JobCategories from './components/admin/pages/JobCategories';
import Skills from './components/admin/pages/Skills';
// import ComingSoon from './components/admin/pages/ComingSoon';


import UserLayout from './components/user/UserLayout';
import UserDashboard from './components/user/pages/UserDashboard';
import UserProfile from './components/user/pages/UserProfile';
import MyApplications from './components/user/pages/MyApplications';
import InterviewCenter from './components/user/pages/InterviewCenter';
import PracticeInterview from './components/user/pages/PracticeInterview';
import ResultsFeedback from './components/user/pages/ResultsFeedback';
import SkillDevelopment from './components/user/pages/SkillDevelopment';
import Notifications from './components/user/pages/Notifications';
import HelpSupport from './components/user/pages/HelpSupport';
import UserSettings from './components/user/pages/Settings';
import JobOpportunities from './components/user/pages/JobOpportunities';

import CompanyLayout from './components/company/CompanyLayout';
import CompanyDashboard from './components/company/pages/Dashboard';
import CompanyProfile from './components/company/pages/CompanyProfile';

import CompanyUsers from './components/company/pages/Users';
import CompanyIntegrity from './components/company/pages/Integrity';
import CompanySupport from './components/company/pages/Support';
import CompanyLogs from './components/company/pages/Logs';
import CompanySettings from './components/company/pages/Settings';
import CompanyReports from './components/company/pages/Reports';
import CompanyJobDescriptions from './components/company/pages/JobDescriptions';
import CompanyInterviewMonitoring from './components/company/pages/InterviewMonitoring';

import CompanyDocumentation from './components/company/pages/Documentation';
// import CompanyComingSoon from './components/company/pages/ComingSoon';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<Help />} />
        <Route path="/company/register" element={<CompanyRegister />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="users" element={<Users />} />
          <Route path="jobs" element={<JobDescriptions />} />
          <Route path="job-categories" element={<JobCategories />} />
          <Route path="skills" element={<Skills />} />
          <Route path="interviews" element={<InterviewMonitoring />} />
          <Route path="integrity" element={<Integrity />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logs" element={<Logs />} />
          <Route path="support" element={<Support />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="documentation" element={<Documentation />} />
        </Route>

        {/* User Routes */}
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

        {/* Company Routes */}
        <Route path="/company" element={<CompanyLayout />}>
          <Route index element={<CompanyDashboard />} />
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="profile" element={<CompanyProfile />} />
          <Route path="jobs" element={<CompanyJobDescriptions />} />

          <Route path="interviews" element={<CompanyInterviewMonitoring />} />
          <Route path="integrity" element={<CompanyIntegrity />} />
          <Route path="reports" element={<CompanyReports />} />
          <Route path="logs" element={<CompanyLogs />} />
          <Route path="support" element={<CompanySupport />} />
          <Route path="documentation" element={<CompanyDocumentation />} />
          <Route path="settings" element={<CompanySettings />} />

          <Route path="users" element={<CompanyUsers />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;
