import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios';
import { ALTHUB_API_URL } from '../pages/baseURL';

function Menu() {
   const navigate = useNavigate();

   if (localStorage.getItem("AlmaPlus_institute_Id") == null) {
      toast.error("Please login first...!");
      navigate(`/`);
   }

   const Logout = () => {
      localStorage.removeItem('AlmaPlus_institute_Id');
      navigate(`/`);
   }

   var dashboardClass = window.location.pathname.match(/^\/dashboard/) ? "active" : "";
   var usersClass = window.location.pathname.match(/^\/users/) ? "active" : "";
   var coursesClass = window.location.pathname.match(/^\/courses/) ? "active" : "";
   var eventsClass = window.location.pathname.match(/^\/events/) ? "active" : "";
   var postsClass = window.location.pathname.match(/^\/posts/) ? "active" : "";
   var aidClass = window.location.pathname.match(/^\/financial-aid/) ? "active" : "";

   const institute_Id = localStorage.getItem("AlmaPlus_institute_Id");
   const [profileInfo, setProfileInfo] = useState({
      name: '',
      image: ''
   });

   const getData = () => {
      const myurl = `${ALTHUB_API_URL}/api/getInstituteById/${institute_Id}`;
      axios({
         method: "get",
         url: myurl,
      }).then((response) => {
         if (response.data.success === true) {
            setProfileInfo({
               name: response.data.data.name,
               image: response.data.data.image
            })
         }
      });
   };
   useEffect(() => getData(), [])

   return (
      <>
         <div id="header" className="header navbar-default">
            <div className="navbar-header">
               <Link to="/dashboard" className="navbar-brand">
                  <img src='Logo1.jpeg' style={{ marginRight: '5px' , width:"1000px"}} alt="logo" />
                  <b>Institute</b></Link>
            </div>
            <ul className="navbar-nav navbar-right">
               <li className="dropdown navbar-user">
                  <a className="dropdown-toggle" data-toggle="dropdown">
                     <img src={`${ALTHUB_API_URL}${profileInfo.image}`} alt="" />
                     <span className="d-none d-md-inline">{profileInfo.name}</span> <b className="caret"></b>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                     <Link to="/profile" className="dropdown-item">Edit Profile</Link>
                     <a onClick={Logout} className="dropdown-item">Log Out</a>
                  </div>
               </li>
            </ul>
         </div>
         <div id="sidebar" className="sidebar">
            <div data-scrollbar="true" data-height="100%">
               <ul className="nav">
                  <li className={dashboardClass}>
                     <Link to="/dashboard" >
                        <i className="fa fa-th-large"></i>
                        <span>Dashboard</span>
                     </Link>
                  </li>
                  <li className={usersClass}>
                     <Link to="/users" >
                        <i class="fa fa-users"></i>
                        <span>Users</span>
                     </Link>
                  </li>
                  <li className={coursesClass}>
                     <Link to="/courses" >
                        <i class="fa fa-graduation-cap"></i>
                        <span>Courses</span>
                     </Link>
                  </li>
                  <li className={eventsClass}>
                     <Link to="/events" >
                        <i class="fa fa-calendar"></i>
                        <span>Events</span>
                     </Link>
                  </li>
                  <li className={postsClass}>
                     <Link to="/posts" >
                        <i class="fa fa-address-card"></i>
                        <span>Post</span>
                     </Link>
                  </li>
                  <li className={aidClass}>
                     <Link to="/financial-aid" >
                        <i class="fa-solid fa-sack-dollar"></i>
                        <span>Financial Aid</span>
                     </Link>
                  </li>
               </ul>
            </div>
         </div>
         <div className="sidebar-bg"></div>
      </>
   )
}

export default Menu