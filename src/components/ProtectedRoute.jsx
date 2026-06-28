import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // 1. Browser ki pocket (localStorage) se token nikalte hain
    const token = localStorage.getItem('token');

    // 2. Agar token nahi mila, toh user ko chalte bano bolo (Redirect to login)
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 3. Agar token hai, toh jo bhi page (component) manga hai use khol do
    return children;
};

export default ProtectedRoute;