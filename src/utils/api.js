const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    const htmlSnippet = await response.text();
    console.error(`API Error: Expected JSON but got HTML for ${url} (Status ${response.status})`);
    console.error(`HTML Snippet: ${htmlSnippet.substring(0, 200)}...`);
    throw new Error(`Server returned HTML instead of JSON for ${endpoint} (${response.status}). Check console for details.`);
  }

  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error(`Failed to parse JSON for ${endpoint}:`, text.substring(0, 100));
      throw new Error(`Invalid JSON response from server for ${endpoint}`);
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `API error ${response.status}: ${endpoint}`);
  }
  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Auth
  login: (email, password) => request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (userData) => request('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  sendOtp: (email) => request('/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  verifyOtp: (email, otp) => request('/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  }),
  forgotPassword: (email) => request('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  resetPassword: (email, password) => request('/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  changePassword: (data) => request('/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Student Progress
  getProgress: (userId) => request(`/progress/${userId}`),
  saveProgress: (progressData) => request('/progress/save', {
    method: 'POST',
    body: JSON.stringify(progressData),
  }),
  saveStudyTime: (userId, minutes) => request('/study/save', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, minutes }),
  }),

  // Courses
  getSubjects: (grade) => request(`/courses/subjects/${grade}`),
  getChapters: (subjectId) => request(`/courses/chapters/${subjectId}`),
  getQuiz: (chapterId) => request(`/courses/quizzes/${chapterId}`),
  getChallenge: (grade) => request(`/courses/challenges/${grade}`),

  // Social & UI
  getLeaderboard: (grade) => request(`/leaderboard/${grade}`),
  getAnnouncements: (grade, userId, role) => {
    const params = new URLSearchParams({ user_id: userId, role });
    return request(`/announcements/${grade}?${params.toString()}`);
  },
  
  // AI
  askChatbot: (question) => request('/chatbot/ask', {
    method: 'POST',
    body: JSON.stringify({ question }),
  }),

  // Teacher Endpoints
  getTeacherStudents: (grade) => request(`/students/${grade}`),
  submitAttendance: (data) => request('/attendance', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getAttendanceByDate: (grade, date) => request(`/attendance/${grade}/${date}`),
  getAttendanceHistory: (grade) => request(`/attendance/history/${grade}`),
  createAssignment: (data) => request('/assignments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getTeacherAssignments: (grade) => request(`/assignments/${grade}`),
  getStudentReport: (userId) => request(`/progress/${userId}`),

  // Admin Endpoints
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: () => request('/admin/users'),
  approveUser: (userId) => request(`/admin/approve-user/${userId}`, {
    method: 'POST',
  }),
  getAdminAnalytics: () => request('/admin/analytics/detailed'),
  getAdminUserDetail: (userId) => request(`/admin/users/${userId}`),
  getAdminNotifications: () => request('/admin/notifications'),
  deleteUser: (userId) => request(`/admin/users/${userId}`, {
    method: 'DELETE',
  }),
  createAnnouncement: (data) => request('/announcements', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  createChapter: (data) => request('/courses/chapters', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  createQuiz: (data) => request('/courses/quizzes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Grade Analytics (Teacher)
  getGradeAnalytics: (grade) => request(`/analytics/grade/${grade}`),

  // Admin Create User
  adminCreateUser: (data) => request('/admin/create-user', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Speech Training
  saveSpeechProgress: (data) => request('/speech/save', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getSpeechStats: (userId) => request(`/speech/stats/${userId}`),
};
