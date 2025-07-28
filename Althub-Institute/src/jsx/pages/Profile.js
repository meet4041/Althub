import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { ALTHUB_API_URL } from './baseURL';
import Loader from '../layout/Loader';
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';

const Profile = () => {
    const institute_Id = localStorage.getItem("AlmaPlus_institute_Id");
    const [changepass, setChangePass] = useState({
        oldpassword: '',
        newpassword: '',
        confirmpassword: ''
    });
    const [profileInfo, setProfileInfo] = useState({
        name: '',
        email: '',
        phone: '',
        image: ''
    });
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);
    const [disable2, setDisable2] = useState(false);

    const getData = () => {
        const myurl = `${ALTHUB_API_URL}/api/getInstituteById/${institute_Id}`;
        axios({
            method: "get",
            url: myurl,
        }).then((response) => {
            if (response.data.success === true) {
                setProfileInfo({
                    name: response.data.data.name,
                    email: response.data.data.email,
                    phone: response.data.data.phone,
                    image: response.data.data.image
                })
            }
        });
    };

    useEffect(() => getData(), [])

    const handleImg = (e) => {
        var body = new FormData();
        body.append('image', e.target.files[0]);
        axios({
            method: "post",
            url: `${ALTHUB_API_URL}/api/uploadInstituteImage`,
            data: body,
            headers: { 'Content-Type': "multipart/form-data" },
        }).then((response) => {
            if (response.data.success === true) {
                setProfileInfo({
                    ...profileInfo,
                    image: response.data.data.url
                })
            }
        });
    };

    const handleProfileReset = () => {
        getData();
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (validate()) {
            setDisable(true);
            axios({
                method: "post",
                url: `${ALTHUB_API_URL}/api/instituteUpdate`,
                data: {
                    id: institute_Id,
                    name: profileInfo.name,
                    phone: profileInfo.phone,
                    email: profileInfo.email,
                    image: profileInfo.image
                },
            }).then((response) => {
                console.log(response);
                if (response.data.success === true) {
                    toast.success('Profile Updated Successfully')
                    window.location.reload();
                    setDisable(false);
                    setErrors({});
                } else {
                    setDisable(false);
                    toast.error('Something went wrong')
                }
            }).catch((error) => {
                console.log("Errors", error);
                setDisable(false);
            })
        }
    }
    const handlePassReset = () => {
        setChangePass({
            old_password: '',
            new_password: '',
            confirm_password: ''
        })
    }
    const getPassData = () => {
        setChangePass({
            institute_id: localStorage.getItem("Althub_institute_Id")
        })
    }
    useEffect(() => getPassData(), [])

    const handleChange = (e) => {
        setChangePass({ ...changepass, [e.target.name]: e.target.value });
    }

    const submitHandlerTwo = (e) => {
        e.preventDefault();
        if (validateTwo()) {
            setDisable2(true);
            const myurl = `${ALTHUB_API_URL}/api/instituteUpdatePassword`;
            axios({
                method: "post",
                url: myurl,
                data:
                {
                    institute_id: changepass.institute_id,
                    oldpassword: changepass.oldpassword,
                    newpassword: changepass.newpassword
                },
            }).then((response) => {
                console.log(response);
                if (response.data.success === true) {
                    toast.success('Password Updated Successfully')
                    setDisable2(false);
                    setChangePass({
                        oldpassword: '',
                        newpassword: '',
                        confirmpassword: ''
                    });
                    setErrors({});
                } else {
                    setDisable2(false);
                    toast.error('Something went wrong')
                    setErrors({ ...errors, confirmpassword: response.data.message })
                }
            }).catch((error) => {
                console.log("Errors", error);
                setDisable2(false);
            })
        }
    }

    const validate = () => {
        let input = profileInfo;
        let errors = {};
        let isValid = true;
        if (!input["name"]) {
            isValid = false;
            errors["name_err"] = "Please Enter Name";
        }
        if (!input["email"]) {
            isValid = false;
            errors["email_err"] = "Please Enter Email";
        }
        setErrors(errors);
        return isValid;
    };

    const validateTwo = () => {
        let input = changepass;
        let errors = {};
        let isValid = true;
        if (!input["oldpassword"]) {
            isValid = false;
            errors["oldpassword_err"] = "Please Enter Old Password";
        }
        if (!input["newpassword"]) {
            isValid = false;
            errors["newpassword_err"] = "Please Enter New Password";
        }
        if (!input["confirmpassword"]) {
            isValid = false;
            errors["confirmpassword_err"] = "Please Enter Confirm Password";
        }
        if (input["newpassword"] !== input["confirmpassword"]) {
            isValid = false;
            errors["confirmpassword_err"] = "Password Doesn't Match";
        }
        if (input["newpassword"] === input["oldpassword"]) {
            isValid = false;
            errors["newpassword_err"] = "New Password should be different from old one";
        }
        setErrors(errors);
        return isValid;
    };

    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");
    }, []);

    return (
        <>
            <ToastContainer />
            <Loader />
            <div id="page-container" className="fade page-sidebar-fixed page-header-fixed">
                <Menu />
                <div id="content" className="content">
                    <ol className="breadcrumb float-xl-right">
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Profile</li>
                    </ol>
                    <h1 className="page-header">Profile</h1>
                    <div className="row">
                        <div className="col-xl-6 ui-sortable">
                            <div className="panel panel-inverse" data-sortable-id="form-stuff-10">
                                <div className="panel-heading ui-sortable-handle">
                                    <h4 className="panel-title">Profile setting</h4>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => submitHandler(e)} >
                                        <fieldset>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label for="exampleInputName">Name:</label>
                                                    <input type="text" className="form-control" id="exampleInputName" placeholder="Enter name here.." name="name" value={profileInfo.name} onChange={(e) => setProfileInfo({ ...profileInfo, name: e.target.value })} />
                                                    <div className="text-danger">{errors.name_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label for="exampleInputName">Email:</label>
                                                    <input type="text" className="form-control" id="exampleInputEmail" placeholder="Enter name here.." name="name" value={profileInfo.email} onChange={(e) => setProfileInfo({ ...profileInfo, email: e.target.value })} />
                                                    <div className="text-danger">{errors.email_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label for="exampleInputImage">Image:</label>
                                                    <br />
                                                    <input type="file" className="form-control" id="exampleInputImage" onChange={handleImg} />
                                                    {profileInfo.image !== '' ?
                                                        <img src={`${ALTHUB_API_URL}${profileInfo.image}`} className="form-img__img-preview" style={{ width: "84px", height: "84px" }} alt='profile_img' />
                                                        : ''
                                                    }
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-sm btn-success m-r-5" disabled={disable}>{disable ? 'Processing...' : 'Submit'}</button>
                                            <button type="reset" className="btn btn-sm btn-default" onClick={handleProfileReset}>Reset</button>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 ui-sortable">
                            <div className="panel panel-inverse" data-sortable-id="form-stuff-10">
                                <div className="panel-heading ui-sortable-handle">
                                    <h4 className="panel-title">Change Password</h4>
                                </div>
                                <div className="panel-body">
                                    <form onSubmit={(e) => submitHandlerTwo(e)} >
                                        <fieldset>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label for="exampleInputOldPass">Old Password:</label>
                                                    <input type="password" className="form-control" id="exampleInputOldPass" placeholder="Enter old password here.." name="oldpassword" onChange={handleChange} value={changepass.oldpassword} />
                                                    <div className="text-danger">{errors.oldpassword_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label for="exampleInputNewPass">New Password:</label>
                                                    <input type="password" className="form-control" id="exampleInputNewPass" placeholder="Enter new password here.." name="newpassword" onChange={handleChange} value={changepass.newpassword} />
                                                    <div className="text-danger">{errors.newpassword_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label for="exampleInputConfirmPass">Confirm Password:</label>
                                                    <input type="password" className="form-control" id="exampleInputConfirmPass" placeholder="Enter confirm password here.." name="confirmpassword" onChange={handleChange} value={changepass.confirmpassword} />
                                                    <div className="text-danger">{errors.confirmpassword_err}</div>
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-sm btn-success m-r-5" disabled={disable2}>{disable2 ? 'Processing...' : 'Submit'}</button>
                                            <button type="reset" className="btn btn-sm btn-default" onClick={handlePassReset}>Reset</button>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Profile