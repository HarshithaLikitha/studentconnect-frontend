import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (userId) => api.get(`/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  getUserCommunities: (userId) => api.get(`/users/${userId}/communities`),
  getUserProjects: (userId) => api.get(`/users/${userId}/projects`),
  getUserEvents: (userId) => api.get(`/users/${userId}/events`),
};

// Communities API
export const communitiesAPI = {
  getCommunities: (params) => api.get('/communities', { params }),
  getCommunity: (communityId) => api.get(`/communities/${communityId}`),
  createCommunity: (communityData) => api.post('/communities', communityData),
  updateCommunity: (communityId, communityData) => api.put(`/communities/${communityId}`, communityData),
  deleteCommunity: (communityId) => api.delete(`/communities/${communityId}`),
  joinCommunity: (communityId) => api.post(`/communities/${communityId}/join`),
  leaveCommunity: (communityId) => api.post(`/communities/${communityId}/leave`),
  getCommunityMembers: (communityId) => api.get(`/communities/${communityId}/members`),
};

// Projects API
export const projectsAPI = {
  getProjects: (params) => api.get('/projects', { params }),
  getProject: (projectId) => api.get(`/projects/${projectId}`),
  createProject: (projectData) => api.post('/projects', projectData),
  updateProject: (projectId, projectData) => api.put(`/projects/${projectId}`, projectData),
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),
  joinProject: (projectId) => api.post(`/projects/${projectId}/join`),
  leaveProject: (projectId) => api.post(`/projects/${projectId}/leave`),
  getProjectMembers: (projectId) => api.get(`/projects/${projectId}/members`),
};

// Posts API
export const postsAPI = {
  getPosts: (params) => api.get('/posts', { params }),
  getPost: (postId) => api.get(`/posts/${postId}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (postId, postData) => api.put(`/posts/${postId}`, postData),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  getPostComments: (postId) => api.get(`/posts/${postId}/comments`),
  createComment: (postId, commentData) => api.post(`/posts/${postId}/comments`, commentData),
  updateComment: (commentId, commentData) => api.put(`/posts/comments/${commentId}`, commentData),
  deleteComment: (commentId) => api.delete(`/posts/comments/${commentId}`),
};

// Events API
export const eventsAPI = {
  getEvents: (params) => api.get('/events', { params }),
  getEvent: (eventId) => api.get(`/events/${eventId}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (eventId, eventData) => api.put(`/events/${eventId}`, eventData),
  deleteEvent: (eventId) => api.delete(`/events/${eventId}`),
  registerForEvent: (eventId) => api.post(`/events/${eventId}/register`),
  unregisterFromEvent: (eventId) => api.post(`/events/${eventId}/unregister`),
  getEventAttendees: (eventId) => api.get(`/events/${eventId}/attendees`),
};

// Tutorials API
export const tutorialsAPI = {
  getTutorials: (params) => api.get('/tutorials', { params }),
  getTutorial: (tutorialId) => api.get(`/tutorials/${tutorialId}`),
  createTutorial: (tutorialData) => api.post('/tutorials', tutorialData),
  updateTutorial: (tutorialId, tutorialData) => api.put(`/tutorials/${tutorialId}`, tutorialData),
  deleteTutorial: (tutorialId) => api.delete(`/tutorials/${tutorialId}`),
  getTutorialCategories: () => api.get('/tutorials/categories'),
  searchTutorials: (params) => api.get('/tutorials/search', { params }),
};

// Messages API
export const messagesAPI = {
  getMessages: (params) => api.get('/messages', { params }),
  getMessage: (messageId) => api.get(`/messages/${messageId}`),
  sendMessage: (messageData) => api.post('/messages', messageData),
  markMessageRead: (messageId) => api.post(`/messages/${messageId}/read`),
  getConversations: () => api.get('/messages/conversations'),
  getUnreadCount: () => api.get('/messages/unread-count'),
};

export default api;

