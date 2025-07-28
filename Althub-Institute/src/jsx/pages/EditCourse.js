import React, { useState, useEffect, Fragment } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import { ALTHUB_API_URL } from './baseURL';
import axios from 'axios';
import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';

const EditCourse = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);
    const [data, setData] = useState({
        id: "",
        name: "",
        stream: "",
        duration: ""
    });
    const location = useLocation();
    const state = location.state.data;
    console.log("data:", state);

    const getcourseData = () => {
        setData({
            id: state._id,
            name: state.name,
            stream: state.stream,
            duration: state.duration
        })
    }
    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';

        var element = document.getElementById("page-container");
        element.classList.add("show");

        getcourseData();
    }, []);

    const handleReset = () => {
        setData({
            name: "",
            stream: "",
            duration: ""
        });
    }
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (validate()) {
            setDisable(true);
            axios({
                method: "post",
                url: `${ALTHUB_API_URL}/api/editCourse`,
                data: {
                    id: data.id,
                    name: data.name,
                    stream: data.stream,
                    duration: data.duration
                },
            }).then((response) => {
                handleReset();
                setDisable(false);
                toast.success("Course Updated");
                setTimeout(() => {
                    navigate('/courses');
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

        if (!input["name"]) {
            isValid = false;
            errors["name_err"] = "Please Enter Course Name";
        }
        if (!input["stream"]) {
            isValid = false;
            errors["stream_err"] = "Please Enter course stream";
        }
        if (!input["duration"]) {
            isValid = false;
            errors["duration_err"] = "Please Enter course Duration";
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
                        <li className="breadcrumb-item"><Link to="/courses">Courses</Link></li>
                        <li className="breadcrumb-item active">Edit Course</li>
                    </ol>
                    <h1 className="page-header">Edit Course  </h1>

                    <div className="row">
                        <div className="col-xl-6 ui-sortable">
                            <div className="panel panel-inverse" data-sortable-id="form-stuff-10">
                                <div className="panel-heading ui-sortable-handle">
                                    <h4 className="panel-title">Edit Course</h4>
                                    <Link to="/courses" className="btn btn-sm btn-default pull-right">Back</Link>
                                </div>


                                <div className="panel-body">
                                    <form onSubmit={(e) => submitHandler(e)} >
                                        <fieldset>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputName">Course Name:</label>
                                                    <input type="text" className="form-control" id="exampleInputName" placeholder="Enter Course Name" name="name" onChange={handleChange} value={data.name} />
                                                    <div className="text-danger">{errors.name_err}</div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputstream">Stream:</label>
                                                    <input className="form-control" id="exampleInputstream" placeholder="Enter Course Stream" name="stream" onChange={handleChange} value={data.stream} />
                                                    <div className="text-danger">{errors.stream_err}</div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputduration">Duration:</label>
                                                    <input type='number' className="form-control" id="exampleInputduration" placeholder="Enter Course Duration" name="duration" onChange={handleChange} value={data.duration} />
                                                    <div className="text-danger">{errors.duration_err}</div>
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-sm btn-success m-r-5" disabled={disable} >{disable ? 'Processing...' : 'Update'}</button>
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

export default EditCourse;