import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';
import axios from 'axios';
import { ALTHUB_API_URL } from './baseURL';

function Dashboard() {        
    useEffect(() => {
        var element = document.getElementById("page-container");
        element.classList.add("show");
        getTotalUser();
        getTotalInstitutes();
        getTotalFeedback();
        getTotalCompany();
    }, []);

    const [users, setUsers] = useState(0);
    const [institutes, setInstitutes] = useState(0);
    const [feedback, setFeedback] = useState(0);
    const [company, setCompany] = useState(0);

    const getTotalUser = () => {
        axios({
            method: "get",
            url: `${ALTHUB_API_URL}/api/getUsers`,
        }).then((response) => {
            if (response.data.success === true) {
                setUsers(response.data.data.length);
            }
        });
    };

    const getTotalInstitutes = () => {
        axios({
            method: "get",
            url: `${ALTHUB_API_URL}/api/getInstitutes`,
        }).then((response) => {
            if (response.data.success === true) {
                setInstitutes(response.data.data.length);
            }
        });
    };

    const getTotalFeedback = () => {
        axios({
            method: "get",
            url: `${ALTHUB_API_URL}/api/getFeedback`,
        }).then((response) => {
            if (response.data.success === true) {
                setFeedback(response.data.data.length);
            }
        });
    };
    const getTotalCompany = () => {
        axios({
            method: "get",
            url: `${ALTHUB_API_URL}/api/getCompanies`,
        }).then((response) => {
            if (response.data.success === true) {
                setCompany(response.data.data.length);
            }
        });
    };

    return (
        <>
            <div id="page-container" className="fade page-sidebar-fixed page-header-fixed">
                <Menu />
                <div id="content" className="content">
                    <ol className="breadcrumb float-xl-right">
                        <li className="breadcrumb-item"><a>Home</a></li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                    <h1 className="page-header">Dashboard </h1>
                    <div className="row">
                        <div className="col-xl-3 col-md-6">
                        <div className="widget widget-stats " style={{background:'#17A2B8'}}>
                                <div className="stats-icon"><i className="fa fa-users"></i></div>
                                <div className="stats-info">
                                    <h4>Total Users</h4>
                                    <p>{users}</p>
                                </div>
                                <div className="stats-link">
                                    <Link to="/users">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                        <div className="widget widget-stats bg-pink" >
                                <div className="stats-icon"><i className="fa fa-university"></i></div>
                                <div className="stats-info">
                                    <h4>Total Institutes</h4>
                                    <p>{institutes}</p>
                                </div>
                                <div className="stats-link">
                                    <Link to="/Institute">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                        <div className="widget widget-stats" style={{background:'#17A2B8'}} >
                                <div className="stats-icon"><i class="fa fa-building"></i></div>
                                <div className="stats-info">
                                    <h4>Total Company</h4>
                                    <p>{company}</p>
                                </div>
                                <div className="stats-link">
                                    <Link to="/company">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                        <div className="widget widget-stats bg-pink" >
                                <div className="stats-icon"><i className="fa fa-comments"></i></div>
                                <div className="stats-info">
                                    <h4>Total Feedback</h4>
                                    <p>{feedback}</p>
                                </div>
                                <div className="stats-link">
                                    <Link to="/Feedback">View Detail <i className="fa fa-arrow-alt-circle-right"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Dashboard