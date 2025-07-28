import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';
import { ALTHUB_API_URL } from './baseURL';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';

const Events = () => {
    const institute_Id = localStorage.getItem("AlmaPlus_institute_Id");
    let navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [displayEvents, setDisplayEvents] = useState([]);
    const rows = [10, 20, 30];
    const [eventsPerPage, setEventsPerPage] = useState(rows[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");
        getEventsData();

    }, []);

    const getEventsData = () => {
        axios({
            method: "get",
            url: `${ALTHUB_API_URL}/api/getEventsByInstitute/${institute_Id}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then((response) => {
            console.log(response.data.data);
            setEvents(response.data.data);
        });
    };

    useEffect(() => {

        setDisplayEvents(events);
    }, [events]);

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = displayEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(displayEvents.length / eventsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (num) => {
        setCurrentPage(num);
    }

    const handleSearch = (e) => {
        if (e.target.value) {
            let search = e.target.value;
            setDisplayEvents(events.filter(
                (elem) =>
                    elem.title.toLowerCase().includes(search.toLowerCase()) ||
                    elem.venue.toLowerCase().includes(search.toLowerCase())
            ));
        } else {
            setDisplayEvents(events)
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

    const handleDeleteEvent = (id) => {
        setDeleteId(id);
        setAlert(true);
    }

    const DeleteEvent = () => {
        axios({
            method: "delete",
            url: `${ALTHUB_API_URL}/api/deleteEvent/${deleteId}`,
        }).then((response) => {
            if (response.data.success === true) {
                getEventsData();
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
                        <li className="breadcrumb-item active">Events</li>
                    </ol>

                    <h1 className="page-header">Events
                        <Link to="/add-event" className="btn btn-success mx-3" ><i className="fa fa-plus"></i></Link>
                    </h1>

                    <div className="card">
                        <div className="card-body">
                            <div class="form-outline mb-4">
                                <input type="search" class="form-control" id="datatable-search-input" placeholder='Search Event' onChange={handleSearch} />
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="table-responsive">
                                        <table id="product-listing" className="table">
                                            <thead>
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Title</th>
                                                    <th>photos</th>
                                                    <th>Description</th>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Venue</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentEvents.length > 0 ? currentEvents.map((elem, index) =>
                                                    <tr key={index}>
                                                        <td align='left'>{index + 1}</td>
                                                        <td>{elem.title}</td>
                                                        <td>{elem.photos === '' || elem.photos === undefined || elem.photos.length <= 0 ? <img src='assets/img/Events-amico.png' style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}></img> : <img src={`${ALTHUB_API_URL}${elem.photos[0]}`} alt='user-img' style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }} />}</td>
                                                        <td>{elem.description}</td>
                                                        <td>{elem.date.split('T')[0]}</td>
                                                        <td>{elem.date.split('T')[1]}</td>
                                                        <td>{elem.venue}</td>
                                                        <td><i className='fa fa-edit' style={{ color: "green", cursor: "pointer" }} onClick={() => { navigate('/edit-event', { state: { data: elem } }) }}></i><i className='fa fa-trash' style={{ color: "red", cursor: "pointer", marginLeft: "5px" }} onClick={() => { handleDeleteEvent(elem._id) }}></i></td>
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
                                            <select className='selection' style={{ outline: '0', borderWidth: '0 0 1px', borderColor: 'black', marginLeft: '10px' }} onChange={(e) => setEventsPerPage(e.target.value)}>
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
                    onConfirm={DeleteEvent}
                    onCancel={() => { setAlert(false); setDeleteId(''); }}
                >
                    You will not be able to recover this user!
                </SweetAlert> : ''
                }
                {alert2 === true ? <SweetAlert
                    success
                    title="User Deleted Successfully!"
                    onConfirm={() => { setAlert2(false); getEventsData(); }}
                />
                    : ''}
                <Footer />
            </div>
        </Fragment>
    )
}

export default Events
