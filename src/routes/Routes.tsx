import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../components/navigations/Navbar';
import Home from '../pages/home/Home';
import Login from '../components/registration/Login';

import AuthRoute from '../components/registration/AuthRoute';
import Register from '../components/registration/Register';
import Dashboard from '../components/dashboard/Admin';
import Upload from '../components/Upload';





const AppRoutes: React.FC = () => {
  return (
    <Router>
        <Navbar />
      <Routes>
        <Route path="/" element={<AuthRoute><Home/></AuthRoute>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/admin-profile" element={<Dashboard/>} />
        <Route path="/upload" element={<Upload/>} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;