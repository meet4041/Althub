import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom'
import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';
import { ALTHUB_API_URL } from './baseURL';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';

const Posts = () => {
    const institute_Id = localStorage.getItem("AlmaPlus_institute_Id");
    const [posts, setPosts] = useState([]);
    const [displayPosts, setDisplayPosts] = useState([]);
    const rows = [10, 20, 30];
    const [postsPerPage, setPostsPerPage] = useState(rows[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");
        getPostsData();
    }, []);

    const getPostsData = () => {

        axios({
            method: "get",
            url: `${ALTHUB_API_URL}/api/getPostById/${institute_Id}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then((response) => {
            console.log(response.data.data);
            setPosts(response.data.data);
        });
    };

    useEffect(() => {
        setDisplayPosts(posts);
    }, [posts]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPost = displayPosts.slice(indexOfFirstPost, indexOfLastPost);
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(displayPosts.length / setPostsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (num) => {
        setCurrentPage(num);
    }

    const handleSearch = (e) => {
        if (e.target.value) {
            let search = e.target.value;
            setDisplayPosts(posts.filter(
                (elem) =>
                    elem.description.toLowerCase().includes(search.toLowerCase())
            ));
        } else {
            setDisplayPosts(posts)
        }
    }

    const handleApply = () => {
        if (from && to) {
            setCurrentPage(1);
        }
    }

    const handleReset = () => {
        setCurrentPage(1);
        setFrom('');
        setTo('');
    }

    const [deleteId, setDeleteId] = useState('');
    const [alert, setAlert] = useState(false);
    const [alert2, setAlert2] = useState(false);

    const handleDeletePost = (id) => {
        setDeleteId(id);
        setAlert(true);
    }

    const DeletePost = () => {
        axios({
            method: "delete",
            url: `${ALTHUB_API_URL}/api/deletePost/${deleteId}`,
        }).then((response) => {
            if (response.data.success === true) {
                getPostsData();
                setDeleteId('');
                setAlert(false);
                setAlert2(true);
            }
        })
    }

    const formatDate = (timestamp) => {
        const messageTime = new Date(timestamp);
        const now = new Date();
        const timeDiff = Math.abs(now - messageTime);
        const minutesDiff = Math.floor(timeDiff / 60000);
        if (minutesDiff < 1) {
            return "Just now";
        } else if (minutesDiff < 60) {
            return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"} ago`;
        } else if (messageTime.toDateString() === now.toDateString()) {
            const options = { hour: "numeric", minute: "numeric" };
            return `Today at ${messageTime.toLocaleTimeString("en-US", options)}`;
        } else {
            const options = {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            };
            return messageTime.toLocaleString("en-US", options);
        }
    };

    return (
        <Fragment>
            <Loader />
            <div id="page-container" className="fade page-sidebar-fixed page-header-fixed">
                <Menu />
                <div id="content" className="content">
                    <ol className="breadcrumb float-xl-right">
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Posts</li>
                    </ol>

                    <h1 className="page-header">Posts
                        <Link to="/add-post" className="btn btn-success mx-3" ><i className="fa fa-plus"></i></Link>
                    </h1>

                    <div className="card">
                        <div className="card-body">
                            <div class="form-outline mb-4">
                                <input type="search" class="form-control" id="datatable-search-input" placeholder='Search post' onChange={handleSearch} />
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="table-responsive">
                                        <table id="product-listing" className="table">
                                            <thead>
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Photos</th>
                                                    <th>Description</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentPost.length > 0 ? currentPost.map((elem, index) =>
                                                    <tr key={index}>
                                                        <td align='left'>{index + 1}</td>
                                                        <td>{elem.photos === '' || elem.photos === undefined || elem.photos.length <= 0 ? <img src='assets/img/Events-amico.png' style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}></img> : <img src={`${ALTHUB_API_URL}${elem.photos[0]}`} alt='user-img' style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }} />}</td>
                                                        <td>{elem.description}</td>
                                                        <td>{formatDate(elem.date)}</td>
                                                        <td><i className='fa fa-trash' style={{ color: "red", cursor: "pointer" }} onClick={() => { handleDeletePost(elem._id) }}></i></td>
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
                                            <label htmlFor='selection' style={{ marginBottom: '0' }}>Users Per Page :</label>
                                            <select className='selection' style={{ outline: '0', borderWidth: '0 0 1px', borderColor: 'black', marginLeft: '10px' }} onChange={(e) => setPostsPerPage(e.target.value)}>
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
                    onConfirm={DeletePost}
                    onCancel={() => { setAlert(false); setDeleteId(''); }}
                >
                    You will not be able to recover this user!
                </SweetAlert> : ''
                }
                {alert2 === true ? <SweetAlert
                    success
                    title="User Deleted Successfully!"
                    onConfirm={() => { setAlert2(false); getPostsData(); }}
                />
                    : ''}
                <Footer />
            </div>
        </Fragment>
    )
}

export default Posts