import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { ALTHUB_API_URL } from './baseURL';
import axios from 'axios';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const [err, setErr] = useState('');
    const [disable, setDisable] = useState(false);

    const InputEvent = (e) => {
        setEmail(e.target.value);
    }

    const validate = () => {
        let isValid = true;
        if (!email) {
            isValid = false;
            setErr("Please Enter Email");
        } else {
            setErr("");
        }
        return isValid;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (validate()) {
            setDisable(true);
            const myurl = `${ALTHUB_API_URL}/api/instituteForgetPassword`;
            axios({
                method: "post",
                url: myurl,
                data: {
                    email: email
                },
            }).then((response) => {
                if (response.data.success === true) {
                    setDisable(false);
                    toast.success(response.data.msg);
                    setTimeout(() => {
                        navigate('/');
                    }, [2000])
                }
            }).catch((error) => {
                console.log("Errors", error);
                setDisable(false);
                toast.error(error.response.data.message);
            })
        }
    }

    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");
    }, []);

    return (
        <>
            <ToastContainer />
            <div id="page-loader" className="fade show">
                <span className="spinner"></span>
            </div>

            <div className="login-cover">
                <div className="login-cover-image" style={{ backgroundImage: "url(assets/img/login-bg/login-bg-17.jpg)" }} data-id="login-cover-image"></div>
                <div className="login-cover-bg"></div>
            </div>

            <div id="page-container" className="fade">
                <div className="login login-v2" data-pageload-addclassName="animated fadeIn">
                    <div className="login-header">
                        <div className="brand">
                            <span className="logo"></span> <b>Althub Institues</b>
                            <small>Forgot Password for Plus One admin panel</small>
                        </div>
                        <div className="icon">
                            <i className="fa fa-lock"></i>
                        </div>
                    </div>

                    <div className="login-content">
                        <form onSubmit={(e) => submitHandler(e)} >
                            <div className="form-group m-b-20">
                                <input type="text" className="form-control form-control-lg" placeholder="Email Address" name="email" onChange={InputEvent} value={email} />
                                <div className="text-danger">{err}</div>
                            </div>
                            <div className="login-buttons">
                                <button type="button" onClick={submitHandler} class="btn btn-success btn-block btn-lg" disabled={disable}>{disable ? 'Processing...' : 'Reset Password'}</button>
                            </div>
                            <p style={{ marginLeft: "130px", paddingTop: "10px" }}>Known with Credentials then , <Link to='/' style={{ textDecoration: "underline" }}><b>Login</b></Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword