import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Users from './pages/Users';
import AddUser from './pages/AddUser';
import Institutes from './pages/Institute';
import Feedback from './pages/FeedBack';
import EditInstitute from './pages/EditInstitute';
import Company from './pages/Company';
import AddCompany from './pages/AddCompany';
import EditCompany from './pages/EditCompany';
// import EditUser from './pages/EditUser';
// import AddInstitute from './pages/AddInstitute';


const Markup = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/users' element={<Users />} />
            <Route path='/add-user' element={<AddUser />} />
            <Route path='/add-company' element={<AddCompany/>}/>
            <Route path='/institute' element={<Institutes/>}/>
            <Route path='/feedback' element={<Feedback/>}/>
            <Route path='/company' element={<Company/>}/>
            <Route path='/edit-institute' element={<EditInstitute/>}/>
            <Route path='/edit-company' element={<EditCompany/>}/>
            {/* <Route path='/edit-user' element={<EditUser />} /> */}
            {/* <Route path='/add-Institute' element={<AddInstitute/>}/> */}
        </Routes>
    )
}

export default Markup