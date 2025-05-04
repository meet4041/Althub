import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';
import { ALTHUB_API_URL } from './baseURL';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';

const FeedBack = () => {
    let navigate = useNavigate();
    const [feedback, setFeedBack] = useState([]);
    const [displayFeedBack, setDisplayFeedBack] = useState([]);
    const rows = [10, 20, 30];
    const [feedbackPerPage, setFeedBackPerPage] = useState(rows[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");
        getFeedBackData();
    }, []);

    const getFeedBackData = () => {

        axios({
            method: "get",
            url: `${ALTHUB_API_URL}/api/getFeedback`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then((response) => {
            console.log(response.data.data);
            setFeedBack(response.data.data);

        });
    };
    useEffect(() => {
        setDisplayFeedBack(feedback);
    }, [feedback]);

    const indexOfLastUser = currentPage * feedbackPerPage;
    const indexOfFirstUser = indexOfLastUser - feedbackPerPage;
    const currentFeedBack = displayFeedBack.slice(indexOfFirstUser, indexOfLastUser);
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(displayFeedBack.length / feedbackPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (num) => {
        setCurrentPage(num);
    }

    const handleSearch = (e) => {
        if (e.target.value) {
            let search = e.target.value;
            setDisplayFeedBack(feedback.filter(
                (elem) =>
                    elem.message &&  elem.message.toLowerCase().includes(search.toLowerCase())
            ));
        } else {
            setDisplayFeedBack(feedback)
        }
    }

    const handleApply = () => {
        if (from && to) {
            setCurrentPage(1);
        }
    }
    const [deleteId, setDeleteId] = useState('');
    const [alert, setAlert] = useState(false);
    const [alert2, setAlert2] = useState(false);
    const handleDeleteUser = (id) => {
        setDeleteId(id);
        setAlert(true);
    }

    const DeleteUser = () => {
        axios({
            method: "delete",
            url: `${ALTHUB_API_URL}/api/deleteFeedback/${deleteId}`,
        }).then((response) => {
            if (response.data.success === true) {
                getFeedBackData();
                setDeleteId('');
                setAlert(false);
                setAlert2(true);
            }
        })
    }
    const handleReset = () => {
        setCurrentPage(1);
        setFrom('');
        setTo('');
    }

    return (
        <Fragment>
            <Loader />
            <div id="page-container" className="fade page-sidebar-fixed page-header-fixed">
                <Menu />
                <div id="content" className="content">
                    <ol className="breadcrumb float-xl-right">
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">FeedBack</li>
                    </ol>
                    <h1 className="page-header">FeedBack</h1>
                    <div className="card">
                        <div className="card-body">
                            <div class="form-outline mb-4">
                                <input type="search" class="form-control" id="datatable-search-input" placeholder='Search User' onChange={handleSearch} />
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="table-responsive">
                                        <table id="product-listing" className="table">
                                            <thead>
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Message</th>
                                                    <th>Rate</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentFeedBack.length > 0 ? currentFeedBack.map((elem, index) =>
                                                    <tr key={index}>
                                                        <td align='left'>{index + 1}</td>
                                                        <td>{elem.message}</td>
                                                        <td>{elem.rate}</td>
                                                       
                                                        <td><i className='fa fa-trash' style={{ color: "red", cursor: "pointer", marginLeft: "5px" }} onClick={() => { handleDeleteUser(elem._id) }}></i></td>
                                                    </tr>
                                                ) : <tr><td >No Record Found..</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="gt-pagination" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <ul class="pagination">
                                            {pageNumbers.map((number) =>
                                                <li class={currentPage === number ? "page-item active" : "page-item"} aria-current="page">
                                                    <span class="page-link" onClick={() => paginate(number)}>{number}</span>
                                                </li>
                                            )}
                                        </ul>
                                        <div className='filter-pages' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <label htmlFor='selection' style={{ marginBottom: '0' }}>FeedBack Per Page :</label>
                                            <select className='selection' style={{ outline: '0', borderWidth: '0 0 1px', borderColor: 'black', marginLeft: '10px' }} onChange={(e) => setFeedBackPerPage(e.target.value)}>
                                                {rows.map(value =>
                                                    <option value={value}>{value}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {alert === true ? <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="Yes, delete it!"
                    confirmBtnBsStyle="danger"
                    title="Are you sure?"
                    onConfirm={DeleteUser}
                    onCancel={() => { setAlert(false); setDeleteId(''); }}
                >
                    You will not be able to recover this feedback!
                </SweetAlert> : ''
                }
                {alert2 === true ? <SweetAlert
                    success
                    title="User Deleted Successfully!"
                    onConfirm={() => { setAlert2(false); getFeedBackData(); }}
                />
                    : ''}
                <Footer />
            </div>
        </Fragment>
    )
}

export default FeedBack
