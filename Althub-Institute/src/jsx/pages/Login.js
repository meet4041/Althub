import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { ALTHUB_API_URL } from './baseURL';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });
    const [check, setCheck] = useState(false);
    const [errors, setErrors] = useState({});
    const [err] = useState('');
    const [disable, setDisable] = useState(false);

    const InputEvent = (e) => {
        const newLoginInfo = { ...loginInfo };
        newLoginInfo[e.target.name] = e.target.value;
        setLoginInfo(newLoginInfo);
    }

    const handleRememberMe = (e) => {
        if (e.target.checked) {
            setCheck(true)
        } else {
            setCheck(false)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (validate()) {
            setDisable(true);
            var bodyFormData = new URLSearchParams();
            bodyFormData.append('email', loginInfo.email);
            bodyFormData.append('password', loginInfo.password);
            const myurl = `${ALTHUB_API_URL}/api/instituteLogin`;
            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success('Login Successfully')
                    localStorage.setItem('AlmaPlus_institute_Id', response.data.data._id);
                    localStorage.setItem('AlmaPlus_institute_Name', response.data.data.name);
                    if (check === true) {
                        localStorage.setItem('AlmaPlus_admin_Remember_Me', 'Enabled')
                    } else {
                        localStorage.setItem('AlmaPlus_admin_Remember_Me', 'Disabled')
                    }
                    setDisable(false);
                    navigate('/dashboard');
                } else {
                    setDisable(false);
                    toast.error('Incorrect Credentials')
                }
            }).catch((error) => {
                console.log("Errors", error);
                setDisable(false);
            })
        }
    }

    const validate = () => {
        let input = loginInfo;
        let errors = {};
        let isValid = true;
        if (!input["email"]) {
            isValid = false;
            errors["email_err"] = "Please Enter Email";
        }
        if (!input["password"]) {
            isValid = false;
            errors["password_err"] = "Please Enter Password";
        }
        setErrors(errors);
        return isValid;
    }

    useEffect(() => {
        if (localStorage.getItem("AlmaPlus_institute_Id") !== null) {
            navigate('/dashboard');
        }
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");
        if (localStorage.getItem('AlmaPlus_Admin_Remember_Me') === 'Enabled') {
            setCheck(true);
            setLoginInfo({
                email: localStorage.getItem('AlmaPlus_Admin_Email'),
                password: localStorage.getItem('AlmaPlus_Admin_Password')
            })
        }
    }, [navigate]);

    return (
        <Fragment>
            <ToastContainer />
            <div id="page-loader" className="fade show">
                <span className="spinner"></span>
            </div>
            <div className="login-cover">
                <div className="login-cover-image" style={{ backgroundImage: "url(assets/img/login-bg/login-bg-11.jpg)" }} data-id="login-cover-image"></div>
                <div className="login-cover-bg"></div>
            </div>
            <div id="page-container" className="fade">
                <div className="login login-v2" data-pageload-addclassname="animated fadeIn">
                    <div className="login-header">
                        <div className="brand">
                            <img src='Logo1.jpeg' style={{ width: '150px', height: '70px', borderRadius: "8px" }} alt="logo" />
                            <b>Institute</b> 
                            <small>Login for Althub Institute panel</small>
                        </div>
                        <div className="icon">
                            <i className="fa fa-lock"></i>
                        </div>
                    </div>
                    <div className="login-content">
                        <form onSubmit={(e) => submitHandler(e)} >
                            <div className="form-group m-b-20">
                                <input type="text" className="form-control form-control-lg" placeholder="Email Address" name="email" onChange={InputEvent} value={loginInfo.email} />
                                <div className="text-danger">{errors.email_err}</div>
                            </div>
                            <div className="form-group m-b-20">
                                <input type="password" className="form-control form-control-lg my-3" placeholder="Password" name="password" onChange={InputEvent} value={loginInfo.password} />
                                <a onClick={() => navigate('/forgot-password')} style={{ color: "white", marginLeft: "243px", textDecoration: "underline" }}>Forgot Password</a>
                                <div className="text-danger">{errors.password_err}</div>
                                <div className='text-danger'>{err}</div>
                            </div>
                            <div className="form-group m-b-20">
                                <input type='checkbox' checked={check} value={check} onChange={handleRememberMe} /> Remember Me
                            </div>
                            <div className="login-buttons">
                                <button type="submit" className="btn btn-success btn-block btn-lg" disabled={disable}>{disable ? 'Processing...' : 'Sign In'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Login