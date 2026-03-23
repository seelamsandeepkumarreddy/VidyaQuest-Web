const SESSION_KEY = 'vq_user_session';

export const sessionManager = {
  setUser: (userData) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
  },

  getUser: () => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  getUserId: () => {
    const user = sessionManager.getUser();
    return user ? user.id : null;
  },

  getFullName: () => {
    const user = sessionManager.getUser();
    return user ? (user.fullName || user.full_name || 'Administrator') : 'Guest';
  },

  getRole: () => {
    const user = sessionManager.getUser();
    return user ? user.role : null;
  },

  getGrade: () => {
    const user = sessionManager.getUser();
    return user ? user.grade : '8';
  },

  getSchoolName: () => {
    const user = sessionManager.getUser();
    return user ? user.schoolName || user.school_name : '';
  },

  getEmail: () => {
    const user = sessionManager.getUser();
    return user ? user.email : '';
  },

  getSubjectExpertise: () => {
    const user = sessionManager.getUser();
    return user ? user.subject_expertise || '' : '';
  },

  getExperience: () => {
    const user = sessionManager.getUser();
    return user ? user.experience || '' : '';
  },

  getMustChangePassword: () => {
    const user = sessionManager.getUser();
    return user ? (user.must_change_password === true || user.must_change_password === 'yes') : false;
  },

  isLoggedIn: () => {
    return !!localStorage.getItem(SESSION_KEY);
  },

  setSubject: (subject) => {
    localStorage.setItem('vq_current_subject', subject);
  },

  getSubject: () => {
    return localStorage.getItem('vq_current_subject');
  },

  setChapterName: (name) => {
    localStorage.setItem('vq_current_chapter', name);
  },

  getChapterName: () => {
    return localStorage.getItem('vq_current_chapter');
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '/login';
  },

  // Local XP and Streak Logic (Mirroring Android SessionManager.kt)
  
  getTodayKey: () => {
    const today = new Date().toISOString().split('T')[0];
    return `daily_xp_${today}`;
  },

  addDailyXp: (xp) => {
    const key = sessionManager.getTodayKey();
    const currentXp = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (currentXp + xp).toString());
  },

  getXpForDate: (dateOffset) => {
    const d = new Date();
    d.setDate(d.getDate() - dateOffset);
    const dateKey = d.toISOString().split('T')[0];
    return parseInt(localStorage.getItem(`daily_xp_${dateKey}`) || '0');
  },

  getStreakCount: () => {
    let count = 0;
    let offset = 0;

    // If no XP today, check if last active was yesterday
    if (sessionManager.getXpForDate(0) === 0) {
      if (sessionManager.getXpForDate(1) === 0) {
        return 0;
      }
      offset = 1;
    }

    // Count backwards
    while (sessionManager.getXpForDate(offset) > 0) {
      count++;
      offset++;
      if (count > 365) break; // Sanity check
    }

    return count;
  }
};
