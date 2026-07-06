import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) delete config.headers['Content-Type'];
  return config;
});

// Mock data
const mockUsers = [
  { _id: '1', name: 'Admin User', email: 'admin@gmail.com', password: 'admin123', role: 'admin', createdAt: new Date().toISOString() },
  { _id: '2', name: 'John Doe', email: 'john@gmail.com', password: 'john123', role: 'user', createdAt: new Date().toISOString() },
];

const mockReports = [
  { _id: '101', user_id: '2', waste_type: 'Plastic', description: 'Plastic waste near the park', location: 'Central Park, Chennai', latitude: 13.0827, longitude: 80.2707, status: 'Pending', user_name: 'John Doe', user_email: 'john@gmail.com', createdAt: new Date().toISOString() },
  { _id: '102', user_id: '2', waste_type: 'Organic', description: 'Organic waste dumped on roadside', location: 'Anna Nagar, Chennai', latitude: 13.0900, longitude: 80.2100, status: 'In Progress', user_name: 'John Doe', user_email: 'john@gmail.com', createdAt: new Date().toISOString() },
  { _id: '103', user_id: '2', waste_type: 'Metal', description: 'Old metal scraps near school', location: 'T Nagar, Chennai', latitude: 13.0418, longitude: 80.2341, status: 'Completed', user_name: 'John Doe', user_email: 'john@gmail.com', createdAt: new Date().toISOString() },
];

let users = [...mockUsers];
let reports = [...mockReports];

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

const isMockMode = () => false;

// Auth APIs
export const login = async (credentials) => {
  if (isMockMode()) {
    await delay();
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (!user) throw { response: { data: { message: 'Invalid email or password.' } } };
    const token = btoa(JSON.stringify({ id: user._id, role: user.role }));
    return { data: { message: 'Login successful!', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } };
  }
  return api.post('/auth/login', credentials);
};

export const register = async (userData) => {
  if (isMockMode()) {
    await delay();
    if (users.find(u => u.email === userData.email)) throw { response: { data: { message: 'Email already registered.' } } };
    const newUser = { _id: Date.now().toString(), ...userData, role: 'user', createdAt: new Date().toISOString() };
    users.push(newUser);
    return { data: { message: 'Registration successful! Please login.' } };
  }
  return api.post('/auth/register', userData);
};

export const getAllUsers = async () => {
  if (isMockMode()) {
    await delay();
    return { data: users.map(({ password, ...u }) => u) };
  }
  return api.get('/auth/users');
};

export const createAdmin = async (userData) => {
  if (isMockMode()) {
    await delay();
    if (users.find(u => u.email === userData.email)) throw { response: { data: { message: 'Email already registered.' } } };
    users.push({ _id: Date.now().toString(), ...userData, role: 'admin', createdAt: new Date().toISOString() });
    return { data: { message: 'Admin created successfully!' } };
  }
  return api.post('/auth/create-admin', userData);
};

export const deleteUser = async (id) => {
  if (isMockMode()) {
    await delay();
    users = users.filter(u => u._id !== id);
    return { data: { message: 'User deleted successfully.' } };
  }
  return api.delete(`/auth/users/${id}`);
};

// Report APIs
export const createReport = async (reportData) => {
  if (isMockMode()) {
    await delay();
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const newReport = {
      _id: Date.now().toString(),
      user_id: userId,
      waste_type: reportData.get ? reportData.get('waste_type') : reportData.waste_type,
      description: reportData.get ? reportData.get('description') : reportData.description,
      location: reportData.get ? reportData.get('location') : reportData.location,
      latitude: reportData.get ? parseFloat(reportData.get('latitude')) : reportData.latitude,
      longitude: reportData.get ? parseFloat(reportData.get('longitude')) : reportData.longitude,
      status: 'Pending',
      user_name: userName,
      createdAt: new Date().toISOString(),
    };
    reports.push(newReport);
    return { data: { message: 'Report submitted successfully!', reportId: newReport._id } };
  }
  return api.post('/reports', reportData);
};

export const getMyReports = async () => {
  if (isMockMode()) {
    await delay();
    const userId = localStorage.getItem('userId');
    return { data: reports.filter(r => r.user_id === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) };
  }
  return api.get('/reports/my');
};

export const getAllReports = async () => {
  if (isMockMode()) {
    await delay();
    return { data: [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) };
  }
  return api.get('/reports/all');
};

export const updateReportStatus = async (id, status) => {
  if (isMockMode()) {
    await delay();
    reports = reports.map(r => r._id === id ? { ...r, status } : r);
    return { data: { message: `Report status updated to ${status}.` } };
  }
  return api.put(`/reports/${id}/status`, { status });
};

export const deleteReport = async (id) => {
  if (isMockMode()) {
    await delay();
    reports = reports.filter(r => r._id !== id);
    return { data: { message: 'Report deleted successfully.' } };
  }
  return api.delete(`/reports/${id}`);
};

export default api;
