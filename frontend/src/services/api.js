import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email, password, role = 'user') => {
    const response = await api.post('/auth/register', { email, password, role });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  checkAdmin: async () => {
    const response = await api.get('/auth/check-admin');
    return response.data;
  },
  
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  }
};

// Portfolio API
export const portfolioAPI = {
  // Personal Info
  getPersonalInfo: async () => {
    const response = await api.get('/personal-info');
    return response.data;
  },
  
  updatePersonalInfo: async (data) => {
    const response = await api.put('/personal-info', data);
    return response.data;
  },
  
  // Skills
  getSkills: async (category = null) => {
    const params = category ? { category } : {};
    const response = await api.get('/skills', { params });
    return response.data;
  },
  
  createSkill: async (data) => {
    const response = await api.post('/skills', data);
    return response.data;
  },
  
  updateSkill: async (id, data) => {
    const response = await api.put(`/skills/${id}`, data);
    return response.data;
  },
  
  deleteSkill: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },
  
  // Projects
  getProjects: async (featured = null) => {
    const params = featured !== null ? { featured } : {};
    const response = await api.get('/projects', { params });
    return response.data;
  },
  
  createProject: async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  
  updateProject: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },
  
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
  
  // Experience
  getExperience: async () => {
    const response = await api.get('/experience');
    return response.data;
  },
  
  createExperience: async (data) => {
    const response = await api.post('/experience', data);
    return response.data;
  },
  
  updateExperience: async (id, data) => {
    const response = await api.put(`/experience/${id}`, data);
    return response.data;
  },
  
  deleteExperience: async (id) => {
    const response = await api.delete(`/experience/${id}`);
    return response.data;
  },
  
  // Contact
  submitContact: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },
  
  getContacts: async (page = 1, limit = 10, isRead = null) => {
    const params = { page, limit };
    if (isRead !== null) params.is_read = isRead;
    const response = await api.get('/contacts', { params });
    return response.data;
  },
  
  updateContact: async (id, data) => {
    const response = await api.put(`/contacts/${id}`, data);
    return response.data;
  },
  
  // Newsletter
  subscribeNewsletter: async (email, name = null) => {
    const response = await api.post('/newsletter/subscribe', { email, name });
    return response.data;
  },
  
  // Analytics
  trackVisit: async (visitorId, page, referrer = null, sessionId = null) => {
    const response = await api.post('/analytics/visit', {
      visitor_id: visitorId,
      page,
      referrer,
      session_id: sessionId
    });
    return response.data;
  },
  
  trackProjectView: async (projectId, visitorId, action) => {
    const response = await api.post('/analytics/project-view', {
      project_id: projectId,
      visitor_id: visitorId,
      action
    });
    return response.data;
  },
  
  getDashboardAnalytics: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },
  
  getContactAnalytics: async () => {
    const response = await api.get('/analytics/contacts');
    return response.data;
  },
  
  // Settings
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  
  updateSetting: async (key, value) => {
    const response = await api.put(`/settings/${key}`, null, {
      params: { value }
    });
    return response.data;
  }
};

// Analytics helper functions
export const analyticsHelper = {
  generateVisitorId: () => {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
  },
  
  generateSessionId: () => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  },
  
  trackPageVisit: async (page) => {
    try {
      const visitorId = analyticsHelper.generateVisitorId();
      const sessionId = analyticsHelper.generateSessionId();
      const referrer = document.referrer || null;
      
      await portfolioAPI.trackVisit(visitorId, page, referrer, sessionId);
    } catch (error) {
      console.error('Error tracking page visit:', error);
    }
  },
  
  trackProjectInteraction: async (projectId, action) => {
    try {
      const visitorId = analyticsHelper.generateVisitorId();
      await portfolioAPI.trackProjectView(projectId, visitorId, action);
    } catch (error) {
      console.error('Error tracking project interaction:', error);
    }
  }
};

// Export default api instance
export default api;