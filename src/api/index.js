import api from './client';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  changePassword: (data) => api.put('/users/me/password', data),
};

export const complaintApi = {
  create: (formData) => {
    // If formData is FormData instance, send multipart
    if (formData instanceof FormData) {
      return api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/complaints', formData);
  },
  getMyComplaints: () => api.get('/complaints/my'),
  getById: (id) => api.get(`/complaints/${id}`),
  trackByNumber: (complaintNumber) => api.get(`/complaints/track/${complaintNumber}`),
  reopen: (id, data) => api.post(`/complaints/${id}/reopen`, data),
  submitFeedback: (id, data) => api.post(`/complaints/${id}/feedback`, data),
};

export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getComplaints: (params) => api.get('/admin/complaints', { params }),
  getComplaintById: (id) => api.get(`/admin/complaints/${id}`),
  updateStatus: (id, data, isMultipart = false) => {
    if (isMultipart) {
      return api.put(`/admin/complaints/${id}/status`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/admin/complaints/${id}/status`, data);
  },
  assignComplaint: (id, data) => api.put(`/admin/complaints/${id}/assign`, data),
  updatePriority: (id, data) => api.put(`/admin/complaints/${id}/priority`, data),
  addRemark: (id, data) => api.post(`/admin/complaints/${id}/remarks`, data),
  getReports: () => api.get('/admin/reports'),
  exportCsv: () => api.get('/admin/reports/export-csv', { responseType: 'blob' }),
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  getFeedback: () => api.get('/admin/feedback'),
};

export const publicApi = {
  getCategories: () => api.get('/categories'),
  getDepartments: () => api.get('/departments'),
};
