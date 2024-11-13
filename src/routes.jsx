import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/pages/Login/Login';
import Layout from './components/pages/Home/Home';
import Dashboard from './components/pages/Dashboard/Dashboard';
import Task from './components/pages/SubPages/Task/Task';
import Activity from './components/pages/Activity/Activity';
import Permission from './components/pages/SubPages/Permissions/Permission';
import TaskMaster from './components/pages/TaskMaster/TaskMaster';
import Department from "./components/pages/Department/Department"
import Document from "./components/pages/Document/Document"
import Users from "./components/pages/Users/Users"
const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/dashboard" element={<Layout />}>
                    <Route path="home" element={<Dashboard />} />
                    <Route path="task" element={<Task />} />
                    <Route path="permissions" element={<Permission />} />
                    <Route path="tasks" element={<TaskMaster />} />
                    <Route path="departments" element={<Department />} />
                    <Route path="activity" element={<Activity />} />
                    <Route path="document" element={<Document />} />
                    <Route path="users" element={<Users />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
