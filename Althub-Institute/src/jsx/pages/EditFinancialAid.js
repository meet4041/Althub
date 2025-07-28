import React, { useState, useEffect, Fragment } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import { ALTHUB_API_URL } from './baseURL';
import axios from 'axios';

import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';

const EditFinancialAid = () => {
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);
    const [data, setData] = useState({
        id: "",
        claimed: ""
    });
    const location = useLocation();
    const state = location.state.data;

    const getAidData = () => {
        setData({
            id: state._id,
            claimed: state.claimed,
        })
    }
    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");
        getAidData();
    }, []);

    const handleReset = () => {
        setData({
            claimed: "",
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
                url: `${ALTHUB_API_URL}/api/editFinancialAid`,
                data: {
                    _id: data.id,
                    claimed: data.claimed,
                },
            }).then((response) => {
                console.log(response.data.data);
                handleReset();
                setDisable(false);
                toast.success("Claimed Amount Updated");
                setTimeout(() => {
                    navigate('/financial-aid');
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

        if (!input["claimed"]) {
            isValid = false;
            errors["claimed_err"] = "Please Enter claimed Amount";
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
                        <li className="breadcrumb-item"><Link to="/financial-Aid">Financial-Aid</Link></li>
                        <li className="breadcrumb-item active">Edit Financial-Aid</li>
                    </ol>
                    <h1 className="page-header">Edit Financial-Aid </h1>

                    <div className="row">
                        <div className="col-xl-6 ui-sortable">
                            <div className="panel panel-inverse" data-sortable-id="form-stuff-10">
                                <div className="panel-heading ui-sortable-handle">
                                    <h4 className="panel-title">Edit Course</h4>
                                    <Link to="/financial-aid" className="btn btn-sm btn-default pull-right">Back</Link>
                                </div>


                                <div className="panel-body">
                                    <form onSubmit={(e) => submitHandler(e)} >
                                        <fieldset>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputName">Claimed Amount : </label>
                                                    <input type="text" className="form-control" id="exampleInputName" placeholder="Enter Course Name" name="claimed" onChange={handleChange} value={data.claimed} />
                                                    <div className="text-danger">{errors.claimed_err}</div>
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

export default EditFinancialAid;
