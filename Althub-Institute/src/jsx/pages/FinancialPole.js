import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';
import { ALTHUB_API_URL } from './baseURL';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';

const FinancialPole = () => {
    const institute_Name = localStorage.getItem("AlmaPlus_institute_Name");
    let navigate = useNavigate();
    const [data, setData] = useState([]);
    const [displayCourses, setDisplayCourses] = useState([]);
    const rows = [10, 20, 30];
    const [coursesPerPage, setCoursesPerPage] = useState(rows[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");
        getAidData();

    }, []);

    const getAidData = () => {
        axios({
            method: "get",
            url: `${ALTHUB_API_URL}/api/getFinancialAidByInstitute/${institute_Name}`,
        }).then((response) => {
            setData(response.data.data);

        });
    };

    useEffect(() => {
        setDisplayCourses(data);
    }, [data]);

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = displayCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(displayCourses.length / coursesPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (num) => {
        setCurrentPage(num);
    }

    const handleSearch = (e) => {
        if (e.target.value) {
            let search = e.target.value;
            setDisplayCourses(data.filter(
                (elem) =>
                    elem.name.toLowerCase().includes(search.toLowerCase()) ||
                    elem.aid.toLowerCase().includes(search.toLowerCase())
            ));
        } else {
            setDisplayCourses(data)
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

    const handleDeleteAid = (id) => {
        setDeleteId(id);
        setAlert(true);
    }

    const DeleteAid = () => {
        axios({
            method: "delete",
            url: `${ALTHUB_API_URL}/api/deleteFinancialAid/${deleteId}`,
        }).then((response) => {
            if (response.data.success === true) {
                getAidData();
                setDeleteId('');
                setAlert(false);
                setAlert2(true);
            }
        })
    }

    return (
        <Fragment>
            <Loader />
            <div id="page-container" className="fade page-sidebar-fixed page-header-fixed">
                <Menu />
                <div id="content" className="content">
                    <ol className="breadcrumb float-xl-right">
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Financial-Aid</li>
                    </ol>

                    <h1 className="page-header">Financial-Aid
                        <Link to="/add-financial-aid" className="btn btn-success mx-3" ><i className="fa fa-plus"></i></Link>
                    </h1>

                    <div className="card">
                        <div className="card-body">
                            <div class="form-outline mb-4">
                                <input type="search" class="form-control" id="datatable-search-input" placeholder='Search Course' onChange={handleSearch} />
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="table-responsive">
                                        <table id="product-listing" className="table">
                                            <thead>
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Student Name</th>
                                                    <th>image</th>
                                                    <th>Aid</th>
                                                    <th>Claimed</th>
                                                    <th>Due Date</th>
                                                    <th>Description</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentCourses.length > 0 ? currentCourses.map((elem, index) =>
                                                    <tr key={index}>
                                                        <td align='left'>{index + 1}</td>
                                                        <td>{elem.name}</td>
                                                        <td>{elem.image === '' || elem.image === undefined ? <img src='assets/img/profile1.png' style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}></img> : <img src={`${ALTHUB_API_URL}${elem.image}`} alt='user-img' style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }} />}</td>
                                                        <td>{elem.aid}</td>
                                                        <td>{elem.claimed}</td>
                                                        <td>{elem.dueDate.split('T')[0]}</td>
                                                        <td>{elem.description}</td>
                                                        <td><i className='fa fa-edit' style={{ color: "green", cursor: "pointer" }} onClick={() => { navigate('/edit-financial-aid', { state: { data: elem } }) }}></i><i className='fa fa-trash' style={{ color: "red", cursor: "pointer", marginLeft: "5px" }} onClick={() => { handleDeleteAid(elem._id) }}></i></td>
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
                                            <select className='selection' style={{ outline: '0', borderWidth: '0 0 1px', borderColor: 'black', marginLeft: '10px' }} onChange={(e) => setCoursesPerPage(e.target.value)}>
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
                    onConfirm={DeleteAid}
                    onCancel={() => { setAlert(false); setDeleteId(''); }}
                >
                    You will not be able to recover this user!
                </SweetAlert> : ''
                }
                {alert2 === true ? <SweetAlert
                    success
                    title="User Deleted Successfully!"
                    onConfirm={() => { setAlert2(false); getAidData(); }}
                />
                    : ''}
                <Footer />
            </div>
        </Fragment>
    )
}

export default FinancialPole