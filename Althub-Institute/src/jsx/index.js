import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Users from './pages/Users';
import AddUser from './pages/AddUser';
import Courses from './pages/Courses';
import AddCourse from './pages/AddCourse';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import Posts from './pages/Posts';
import AddPost from './pages/AddPost';
import EditCourse from './pages/EditCourse';
import EditEvent from './pages/EditEvent';
import Register from './pages/Register';
import NewPassword from './pages/NewPassword';
import FinancialPole from './pages/FinancialPole';
import AddFinancialHelp from './pages/AddFinancialHelp';
import EditFinancialAid from './pages/EditFinancialAid';


const Markup = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/new-password' element={<NewPassword />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/users' element={<Users />} />
            <Route path='/add-user' element={<AddUser />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/add-course' element={<AddCourse />} />
            <Route path='/edit-course' element={<EditCourse />} />
            <Route path='/events' element={<Events />} />
            <Route path='/add-event' element={<AddEvent />} />
            <Route path='/edit-event' element={<EditEvent />} />
            <Route path='/posts' element={<Posts />} />
            <Route path='/add-post' element={<AddPost />} />
            <Route path='/financial-aid' element={<FinancialPole />} />
            <Route path='/add-financial-aid' element={<AddFinancialHelp />} />
            <Route path='/edit-financial-aid' element={<EditFinancialAid />} />
        </Routes>
    )
}

export default Markup