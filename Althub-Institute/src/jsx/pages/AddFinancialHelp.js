import React, { useState, useEffect, Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import { ALTHUB_API_URL } from './baseURL';
import axios from 'axios';
import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';

const AddFinancialHelp = () => {
    const navigate = useNavigate();
    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");
    }, []);

    const institute_Id = localStorage.getItem("AlmaPlus_institute_Id");
    const institute_Name = localStorage.getItem("AlmaPlus_institute_Name");
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);

    const [data, setData] = useState({
        name: "",
        aid: "",
        claimed: "",
        description: "",
        image: "",
        dueDate: ""
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        setData({
            name: "",
            aid: "",
            claimed: "",
            description: "",
            image: "",
            dueDate: ""
        });
    }

    const handleImgChange = (e) => {
        var body = new FormData();
        body.append("profilepic", e.target.files[0]);
        axios({
            method: "post",
            headers: { "Content-Type": "multipart/form-data" },
            url: `${ALTHUB_API_URL}/api/uploadUserImage`,
            data: body,
        }).then((response) => {
            console.log(response.data.data.url);
            setData({ ...data, image: response.data.data.url });
        }).catch((error) => { });
    };

    const submitHandler = (e) => {
        if (validate()) {
            setDisable(true)
            axios({
                method: "post",
                url: `${ALTHUB_API_URL}/api/addFinancialAid`,
                data: {
                    institutename: institute_Name,
                    name: data.name,
                    aid: data.aid,
                    claimed: data.claimed,
                    description: data.description,
                    image: data.image,
                    dueDate: data.dueDate
                },
            }).then((response) => {
                handleReset();
                setDisable(false);
                toast.success("Financial aid added");
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

        if (!input["name"]) {
            isValid = false;
            errors["name_err"] = "Please Enter Course Name";
        }
        if (!input["aid"]) {
            isValid = false;
            errors["aid_err"] = "Please Enter Aid Ammount";
        }
        if (!input["claimed"]) {
            isValid = false;
            errors["claimed_err"] = "Please Enter Claimed Amount";
        }
        if (!input["description"]) {
            isValid = false;
            errors["description_err"] = "Please Enter description";
        }
        if (!input["dueDate"]) {
            isValid = false;
            errors["dueDate_err"] = "Please Enter Due Date";
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
                        <li className="breadcrumb-item"><Link to="/financialAid">Financial-Aid</Link></li>
                        <li className="breadcrumb-item active">Add Financial-Aid</li>
                    </ol>
                    <h1 className="page-header">Add Financial-Aid</h1>

                    <div className="row">
                        <div className="col-xl-6 ui-sortable">
                            <div className="panel panel-inverse" data-sortable-id="form-stuff-10">
                                <div className="panel-heading ui-sortable-handle">
                                    <h4 className="panel-title">Add Financial-Aid</h4>
                                    <Link to="/financialAid" className="btn btn-sm btn-default pull-right">Back</Link>
                                </div>

                                <div className="panel-body">
                                    <form>
                                        <fieldset>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputName">Student Name:</label>
                                                    <input type="text" className="form-control" id="exampleInputName" placeholder="Enter Student Name" name="name" value={data.name} onChange={handleChange} />
                                                    <div className="text-danger">{errors.name_err}</div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="courseStream">Aid Amount</label>
                                                    <input type='number' className="form-control" id="courseStream" placeholder="Enter Aid Amount" name="aid" value={data.aid} onChange={handleChange} />
                                                    <div className="text-danger">{errors.aid_err}</div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputAddress">Claimed Amount</label>
                                                    <input type='number' className="form-control" id="exampleInputNumber" placeholder="Enter Claimed Amount" name="claimed" value={data.claimed} onChange={handleChange} />
                                                    <div className="text-danger">{errors.claimed_err}</div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputAddress">Description</label>
                                                    <input className="form-control" id="exampleInputNumber" placeholder="Enter Description" name="description" value={data.description} onChange={handleChange} />
                                                    <div className="text-danger">{errors.description_err}</div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputAddress">Due Date :</label>
                                                    <input type="Date" className="form-control" id="exampleInputNumber" placeholder="Enter Due Date" name="dueDate" value={data.dueDate} onChange={handleChange} />
                                                    <div className="text-danger">{errors.dueDate_err}</div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputName">Student Image:</label>
                                                    <input type="file" className='form-control' name="image" placeholder="Select image" onChange={handleImgChange} />
                                                    {data.image ? (
                                                        <div>
                                                            <img
                                                                src={`${ALTHUB_API_URL}${data.image}`}
                                                                alt=""
                                                                height={150}
                                                                width={150}
                                                                style={{ objectFit: "cover" }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>

                                            <button type="button" className="btn btn-sm btn-success m-r-5" onClick={submitHandler}>{disable ? 'Processing...' : 'Submit'}</button>
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

export default AddFinancialHelp;