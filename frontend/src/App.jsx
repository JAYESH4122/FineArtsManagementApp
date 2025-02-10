import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
import EventRegistrationForm from './components/EventRegistrationForm';
import ViewRegistrations from './components/ViewRegistrations';
import StudentComplaintPage from './components/StudentComplaintPage';
import DeptRepComplaintPage from './components/DeptRepComplaintPage';
import FeedbackForm from './components/FeedbackForm';
import StudentProfile from './components/StudentProfile';
import EventsList from './components/EventsList';
import AdminMarkAttendance from './components/AdminMarkAttendance';
import RegistrationClosed from './components/Registration Closed';

const App = () => {
  return (
    <Router  future={{ v7_relativeSplatPath: true, v7_startTransition: true }} >
      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-announcement" element={<AdminPostAnnouncement />} />
        <Route path="/admin/view-announcements" element={<ViewAnnouncements />} />
        <Route path="/admin/add-scoreboard" element={<AdminAddScoreboard />} />
        <Route path="/admin/view-scoreboard" element={<ScoreboardPage />} />
        <Route path="/admin/view-departmentwise-rankings" element={<DepartmentRankings />} />
        <Route path="/admin/add-event" element={<AddEvent />} />
        <Route path="/admin/view-registrations" element={<ViewRegistrations />} />
        <Route path="/admin/manage-representatives" element={<ManageRepresentatives />} />
        <Route path="/admin/manage-student" element={<AdminManageStudents />} />
        <Route path="/admin/feedback" element={<AdminViewFeedback />} />
        <Route path="/admin/mark-atendence" element={<AdminMarkAttendance />} />

        <Route path="/deptrep/login" element={<DeptRepLogin />} />
        <Route path="/deptrep/view-dashboard" element={<RepDashboard />} />
        <Route path="/deptrep/manage-student" element={< DeptRepManageStudents/>} />
        <Route path="/deptrep/register-events" element={< EventRegistrationForm />} />
        <Route path="/deptrep/view-departmentwise-rankings" element={<DepartmentRankings />} />
        <Route path="/deptrep/view-registrations" element={<ViewRegistrations />} />
        <Route path="/deptrep/view-announcements" element={<ViewAnnouncements />} />
        <Route path="/deptrep/view-scoreboard" element={<ScoreboardPage />} />
        <Route path="/deptrep/reply-complaints" element={<DeptRepComplaintPage />} />


        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/view-dashboard" element={<StudentDashboard />} />
        <Route path="/student/view-registrations" element={<ViewRegistrations />} />
        <Route path="/student/view-announcements" element={<ViewAnnouncements />} />
        <Route path="/student/view-scoreboard" element={<ScoreboardPage />} />
        <Route path="/student/view-departmentwise-rankings" element={<DepartmentRankings />} />
        <Route path="/student/closed" element={<RegistrationClosed />} />
        <Route path="/student/view-complaints" element={<StudentComplaintPage />} />
        <Route path="/student/manage-profile" element={<StudentProfile />} />
        <Route path="/student/view-feedback" element={<FeedbackForm />} />
        <Route path="/student/event-list" element={<EventsList />} />
        

      </Routes>
    </Router>
  );
};

export default App;
