import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Auth Components
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Student Module Components
import DashboardPage from './pages/student/DashboardPage';

import SubjectsPage from './pages/student/SubjectsPage';
import ChaptersPage from './pages/student/ChaptersPage';
import LessonPage from './pages/student/LessonPage';
import QuizPage from './pages/student/QuizPage';
import PostQuizPage from './pages/student/PostQuizPage';

import LeaderboardPage from './pages/student/LeaderboardPage';
import RewardsPage from './pages/student/RewardsPage';
import ReportsPage from './pages/student/ReportsPage';
import NotificationsPage from './pages/student/NotificationsPage';

// Remaining Components (to be implemented)
import ProfilePage from './pages/student/ProfilePage';
import ChatbotPage from './pages/student/ChatbotPage';
import DailyChallengePage from './pages/student/DailyChallengePage';

// Teacher Module Components
import TeacherLayout from './components/teacher/TeacherLayout';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import TeacherContent from './pages/teacher/TeacherContent';

// Admin Module Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';


import StudentLayout from './components/student/StudentLayout';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Student Protected Routes */}
      <Route element={
        <ProtectedRoute allowedRole="student">
          <StudentLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/subjects/:subjectId/chapters" element={<ChaptersPage />} />
        <Route path="/chapters/:chapterId/lesson" element={<LessonPage />} />
        <Route path="/chapters/:chapterId/quiz" element={<QuizPage />} />
        <Route path="/quiz/results" element={<PostQuizPage />} />
        <Route path="/challenge" element={<DailyChallengePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Route>

      {/* Teacher Protected Routes */}
      <Route element={
        <ProtectedRoute allowedRole={['teacher', 'faculty']}>
          <TeacherLayout />
        </ProtectedRoute>
      }>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/students" element={<TeacherStudents />} />
        <Route path="/teacher/attendance" element={<TeacherAttendance />} />
        <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        <Route path="/teacher/content" element={<TeacherContent />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
