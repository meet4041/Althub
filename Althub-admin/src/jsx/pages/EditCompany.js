import React, { useState, useEffect, Fragment } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import { ALTHUB_API_URL } from './baseURL';
import axios from 'axios';
import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';

const EditCompany = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);
    const [data, setData] = useState({
        id:"",
        name: "",
        image:"",
        email: "",
        phone:"",
        website:"",
        address:""
    });
    const location = useLocation();
    const state = location.state.data;
    console.log("data", state);
    const getuserData = () => {
       
            setData({
                id:state.id,
                name: state.name,
                image:state.image,
                email: state.email,
                phone:state.phone,
                website:state.website,
                address:state.address
            })  
    }
    useEffect(() => {
        var element = document.getElementById("page-container");
        element.classList.add("show");
        getuserData();
    }, []);

    const handleReset=()=>{
        setData({
            id:"",
            name: "",
            image:"",
            email: "",
            phone:"",
            website:"",
            address:""
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
                url: `${ALTHUB_API_URL}api/companyUpdate`,
                data: {
                    id: data.id,
                    name: data.name,
                    address:data.address,
                    image:data.image,
                    email: data.email,
                    phone:data.phone,
                    website:data.website
                },
            }).then((response) => {
                handleReset();
                setDisable(false);
                toast.success("Company Updated");
                setTimeout(() => {
                    navigate('/company');
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
            errors["name_err"] = "Please Enter Company Name";
        }
        if (!input["address"]) {
            isValid = false;
            errors["address_err"] = "Please Enter Company Address";
        }
        if (!input["email"]) {
            isValid = false;
            errors["email_err"] = "Please Enter Company Email";
        }
        if (!input["website"]) {
            isValid = false;
            errors["website_err"] = "Please Enter Company Website";
        }
        if (!input["phone"]) {
            isValid = false;
            errors["phone_err"] = "Please Enter Company Contact";
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
                        <li className="breadcrumb-item"><Link to="/company">Companies</Link></li>
                        <li className="breadcrumb-item active">Edit Company</li>
                    </ol>
                    <h1 className="page-header">Edit Company  </h1>
                    <div className="row">
                        <div className="col-xl-6 ui-sortable">
                            <div className="panel panel-inverse" data-sortable-id="form-stuff-10">
                                <div className="panel-heading ui-sortable-handle">
                                    <h4 className="panel-title">Edit Company</h4>
                                    <Link to="/company" className="btn btn-sm btn-default pull-right">Back</Link>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => submitHandler(e)} >
                                        <fieldset>
                                        <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputName"> Name:</label>
                                                    <input type="text" className="form-control" id="exampleInputName" placeholder="Enter Company Name" name="name" value={data.name} onChange={handleChange} />
                                                    <div className="text-danger">{errors.name_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="Companyaddress"> Address:</label>
                                                    <input type='text' className="form-control" id="Companyaddress" placeholder="Enter Company Address" name="address" value={data.address} onChange={handleChange}  />
                                                    <div className="text-danger">{errors.address_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputWebsite"> Website URL </label>
                                                    <input type='text' className="form-control" id="exampleInputWebsite" placeholder="Enter Company Website" name="website" value={data.website} onChange={handleChange} />
                                                    <div className="text-danger">{errors.website_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputEmail"> Email </label>
                                                    <input type='text' className="form-control" id="exampleInputEmail" placeholder="Enter Company Email" name="email" value={data.email} onChange={handleChange}   />
                                                    <div className="text-danger">{errors.email_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputContact">Company Contact </label>
                                                    <input type='number' className="form-control" id="exampleInputContact" placeholder="Enter Company Contact" name="phone" value={data.phone} onChange={handleChange}  />
                                                    <div className="text-danger">{errors.phone_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleprofile">Profile Pic:</label><br/>
                                                    <img src={`${ALTHUB_API_URL}${data.image}`}alt={data.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}/><br/><br/>
                                                    <input type="file" className="form-control" id="exampleprofile" placeholder="Enter Profile pic" name="Profilepic" onChange={handleChange}  src={data.image}  />
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

export default EditCompany;