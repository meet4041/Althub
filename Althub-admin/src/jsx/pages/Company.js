import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom'
import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';
import { ALTHUB_API_URL } from './baseURL';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';

const Company = () => {
    const [companies, setCompanies] = useState([]);
    const [displaycompanies, setDisplayCompanies] = useState([]);
    const rows = [10, 20, 30];
    const [companiesPerPage, setCompaniesPerPage] = useState(rows[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");
        getCompaniesData();
    }, []);

    const getCompaniesData = () => {
        axios({
            method: "get",
            url: `${ALTHUB_API_URL}/api/getCompanies`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then((response) => {
            console.log(response.data.data);
            setCompanies(response.data.data);
        });
    };
    useEffect(() => {
        setDisplayCompanies(companies);
    }, [companies]);

    const indexOfLastcompany = currentPage * companiesPerPage;
    const indexOfFirstcompany = indexOfLastcompany - companiesPerPage;
    const currentcompanies = displaycompanies.slice(indexOfFirstcompany, indexOfLastcompany);
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(displaycompanies.length / companiesPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (num) => {
        setCurrentPage(num);
    }

    const handleSearch = (e) => {
        if (e.target.value) {
            let search = e.target.value;
            setDisplayCompanies(companies.filter(
                (elem) =>
                    elem.email.toLowerCase().includes(search.toLowerCase()) ||
                    elem.name.toLowerCase().includes(search.toLowerCase())
            ));
        } else {
            setDisplayCompanies(companies)
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
    const handleDeletecompany = (id) => {
        setDeleteId(id);
        setAlert(true);
    }

    const DeleteCompany = () => {
        axios({
            method: "delete",
            url: `${ALTHUB_API_URL}/api/deletecompany/${deleteId}`,
        }).then((response) => {
            if (response.data.success === true) {
                getCompaniesData();
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
                        <li className="breadcrumb-item active">Companies</li>
                    </ol>

                    <h1 className="page-header">Companies
                        <Link to="/add-company" className="btn btn-success mx-3" ><i className="fa fa-plus"></i></Link>
                    </h1>

                    <div className="card">
                        <div className="card-body">
                            <div class="form-outline mb-4">
                                <input type="search" class="form-control" id="datatable-search-input" placeholder='Search company' onChange={handleSearch} />
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="table-responsive">
                                        <table id="product-listing" className="table">
                                            <thead>
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Company</th>
                                                    <th>Address</th>
                                                    <th>Image</th>
                                                    <th>Email</th>
                                                    <th>Phone Number</th>
                                                    <th>Website</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentcompanies.length > 0 ? currentcompanies.map((elem, index) =>
                                                    <tr key={index}>
                                                        <td align='left'>{index + 1}</td>
                                                        <td>{elem.name}</td>
                                                        <td>{elem.address}</td>
                                                        <td>{elem.image === '' || elem.image === undefined ? <img src='assets/img/login-bg/profile1.png' alt='' style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}></img> : <img src={`${ALTHUB_API_URL}${elem.image}`} alt='company-img' style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }} />}</td>
                                                        <td>{elem.email}</td>
                                                        <td>{elem.phone ? elem.phone : ''}</td>
                                                        <td>{elem.website}</td>
                                                        <td>
                                                        <i className='fa fa-trash' style={{ color: "red", cursor: "pointer", marginLeft: "5px" }} onClick={() => { handleDeletecompany(elem._id) }}></i></td>
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
                                            <label htmlFor='selection' style={{ marginBottom: '0' }}>companies Per Page :</label>
                                            <select className='selection' style={{ outline: '0', borderWidth: '0 0 1px', borderColor: 'black', marginLeft: '10px' }} onChange={(e) => setCompaniesPerPage(e.target.value)}>
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
                    onConfirm={DeleteCompany}
                    onCancel={() => { setAlert(false); setDeleteId(''); }}
                >
                    You will not be able to recover this company!
                </SweetAlert> : ''
                }
                {alert2 === true ? <SweetAlert
                    success
                    title="Company Deleted Successfully!"
                    onConfirm={() => { setAlert2(false); getCompaniesData(); }}
                />
                    : ''}
                <Footer />
            </div>
        </Fragment>
    )
}

export default Company
