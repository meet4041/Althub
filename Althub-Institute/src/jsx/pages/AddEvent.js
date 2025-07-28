import React, { useState, useEffect, Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import { ALTHUB_API_URL } from './baseURL';
import axios from 'axios';
import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';

const AddEvent = () => {
    const institute_Id = localStorage.getItem("AlmaPlus_institute_Id");
    const navigate = useNavigate();
    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");

    }, []);
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);
    const [data, setData] = useState({
        title: "",
        description: "",
        date: "",
        venue: "",
    });

    const [fileList, setFileList] = useState(null);
    const files = fileList ? [...fileList] : [];

    const imgChange = (e) => {
        setFileList(e.target.files);
    }

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        setData({
            title: "",
            description: "",
            date: "",
            venue: "",
        });
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (validate()) {
            setDisable(true)
            const body = new FormData();
            body.append("organizerid", institute_Id)
            body.append("title", data.title);
            body.append("description", data.description);
            body.append("date", data.date);
            body.append("venue", data.venue);
            files.forEach((file, i) => {
                body.append(`photos`, file, file.name);
            });
            axios({
                method: "post",
                url: `${ALTHUB_API_URL}/api/addEvent`,
                data: body,
                headers: {
                    "content-type": "multipart/form-data"
                },
            }).then((response) => {
                handleReset();
                setDisable(false);
                toast.success("Event Added");
                setTimeout(() => {
                    navigate('/events');
                }, 1500);
            }).catch((error) => {
                console.log(error);
                setDisable(false);
            });
        }
    };

    const validate = () => {
        let input = data;
        let errors = {};
        let isValid = true;

        if (!input["title"]) {
            isValid = false;
            errors["name_err"] = "Please Enter Title";
        }
        if (!input["description"]) {
            isValid = false;
            errors["description_err"] = "Please Enter Event Description";
        }
        if (!input["date"]) {
            isValid = false;
            errors["date_err"] = "Please Enter Date";
        }
        if (!input["venue"]) {
            isValid = false;
            errors["venue_err"] = "Please Enter Venue";
        }
        setErrors(errors);
        return isValid;
    }

    return (
        <Fragment>
            <ToastContainer />
            <Loader />
            <div id="page-container" className="fade page-sidebar-fixed page-header-fixed">
                <Menu />
                <div id="content" className="content">
                    <ol className="breadcrumb float-xl-right">
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to="/events">Events</Link></li>
                        <li className="breadcrumb-item active">Add Event</li>
                    </ol>
                    <h1 className="page-header">Add Event  </h1>

                    <div className="row">
                        <div className="col-xl-6 ui-sortable">
                            <div className="panel panel-inverse" data-sortable-id="form-stuff-10">
                                <div className="panel-heading ui-sortable-handle">
                                    <h4 className="panel-title">Add Event</h4>
                                    <Link to="/events" className="btn btn-sm btn-default pull-right">Back</Link>
                                </div>

                                <div className="panel-body">
                                    <form onSubmit={submitHandler}>
                                        <fieldset>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputName">Title:</label>
                                                    <input type="text" className="form-control" id="exampleInputName" placeholder="Enter Event Title" name="title" value={data.title} onChange={handleChange} />
                                                    <div className="text-danger">{errors.name_err}</div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputdesc">Description:</label>
                                                    <input className="form-control" id="exampleInputdesc" placeholder="Enter Event Description" name="description" value={data.description} onChange={handleChange} />
                                                    <div className="text-danger">{errors.description_err}</div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputdate">Date:</label>
                                                    <input type='datetime-local' className="form-control" id="exampleInputdate" placeholder="Enter Event Date" name="date" value={data.date} onChange={handleChange} />
                                                    <div className="text-danger">{errors.date_err}</div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputvenue">Venue:</label>
                                                    <input className="form-control" id="exampleInputvenue" placeholder="Enter Event venue" name="venue" value={data.venue} onChange={handleChange} />
                                                    <div className="text-danger">{errors.venue_err}</div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputfile">Upload Photos:</label>
                                                    <input type='file' multiple="true" className="form-control" id="exampleInputfile" placeholder="Upload Event Photos" name="photos" value={data.photos} onChange={imgChange} />
                                                    {files.length > 0 ?
                                                        <div className="selected-img row mt-2">
                                                            {files.map((elem) =>
                                                                <div className='col col-2 ml-2'>
                                                                    <img src={window.URL.createObjectURL(elem)} alt="" height={100} width={100} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        : ""}
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-sm btn-success m-r-5" >{disable ? 'Processing...' : 'Submit'}</button>
                                            <button type="reset" className="btn btn-sm btn-default" onClick={handleReset}>Reset</button>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </Fragment>
    )
}

export default AddEvent;