import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  return isLoggedIn && userRole === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;
