import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminLogin from './components/AdminLogin';
import DeptRepLogin from './components/DeptRepLogin';
import StudentLogin from './components/StudentLogin';
import RepDashboard from './components/RepDashboard';
import AdminManageStudents from './components/AdminManageStudents';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import AdminPostAnnouncement from './components/AdminPostAnnouncement';
import ViewAnnouncements from './components/ViewAnnouncements';
import AdminAddScoreboard from './components/AdminAddScoreboard'
import ScoreboardPage from './components/ScoreboardPage';
import DepartmentRankings from './components/DepartmentRankings';
import AddEvent from './components/AddEvent';
import ManageRepresentatives from './components/ManageRepresentatives';
import AdminViewFeedback from './components/AdminViewFeedback';
import DeptRepManageStudents from './components/DeptRepManageStudents';
import StudentEnrollment from './components/StudentEnrollment';
import EnrollmentRequestsPage from './components/EnrollmentRequestsPage';
import EventRegistrationForm from './components/EventRegistrationForm';

const App = () => {
  return (
    <Router  future={{ v7_relativeSplatPath: true, v7_startTransition: true }} >
      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-student" element={<AdminManageStudents />} />
        <Route path="/admin/add-announcement" element={<AdminPostAnnouncement />} />
        <Route path="/admin/view-announcements" element={<ViewAnnouncements />} />
        <Route path="/admin/add-scoreboard" element={<AdminAddScoreboard />} />
        <Route path="/admin/view-scoreboard" element={<ScoreboardPage />} />
        <Route path="/admin/view-department-rankings" element={<DepartmentRankings />} />
        <Route path="/admin/add-event" element={<AddEvent />} />
        <Route path="/admin/manage-representatives" element={<ManageRepresentatives />} />
        <Route path="/admin/feedback" element={<AdminViewFeedback />} />

        <Route path="/deptrep/login" element={<DeptRepLogin />} />
        <Route path="/deptrep/dashboard" element={<RepDashboard />} />
        <Route path="/deptrep/manage-student" element={< DeptRepManageStudents/>} />
        <Route path="/deptrep/register-events" element={< EventRegistrationForm />} />



        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/enroll" element={<StudentEnrollment />} />
        <Route path="/student/view-enrollments" element={<EnrollmentRequestsPage />} />

      </Routes>
    </Router>
  );
};

export default App;
