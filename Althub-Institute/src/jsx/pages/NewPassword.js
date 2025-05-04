import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ALTHUB_API_URL } from "./baseURL";
import axios from "axios";

function NewPassword() {
    const queryParameters = new URLSearchParams(window.location.search)
    const token = queryParameters.get("token")
    const navigate = useNavigate();
    const [changepass, setChangePass] = useState({
        password: "",
        confirm_password: "",
    });

    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);

    const validate = () => {
        let input = changepass;
        let errors = {};
        let isValid = true;
        if (!input["password"]) {
            isValid = false;
            errors["new_password_err"] = "Please Enter New Password";
        }
        if (!input["confirm_password"]) {
            isValid = false;
            errors["confirm_password_err"] = "Please Enter Confirm Password";
        }
        if (input["password"] !== input["confirm_password"]) {
            isValid = false;
            errors["confirm_password_err"] = "Password Doesn't Match";
        }
        setErrors(errors);
        return isValid;
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (validate()) {
            setDisable(true);
            const myurl = `${ALTHUB_API_URL}/api/instituteResetPassword?token=${token}`;
            axios({
                method: "post",
                url: myurl,
                data: {
                    password: changepass.password
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
                setDisable(false);
                toast.error(error.response.data.msg);
            })
        }
    };

    const handleChange = (e) => {
        const newPass = { ...changepass };
        newPass[e.target.name] = e.target.value;
        setChangePass(newPass);
    };

    useEffect(() => {
        document.getElementById("page-loader").style.display = "none";
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
                <div
                    className="login-cover-image"
                    style={{
                        backgroundImage: "url(assets/img/login-bg/login-bg-17.jpg)",
                    }}
                    data-id="login-cover-image"
                ></div>
                <div className="login-cover-bg"></div>
            </div>

            <div id="page-container" className="fade">
                <div className="login login-v2">
                    <div className="login-header">
                        <div className="brand">
                            <span className="logo"></span> <b>Plus One</b> Admin
                            <small>Forgot Password for Plus One admin panel</small>
                        </div>
                        <div className="icon">
                            <i className="fa fa-lock"></i>
                        </div>
                    </div>

                    <div className="login-content">
                        <form>
                            <fieldset>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label for="exampleInputNewPass">New Password:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="exampleInputNewPass"
                                            placeholder="Enter new password here.."
                                            name="password"
                                            onChange={handleChange}
                                            value={changepass.password}
                                        />
                                        <div className="text-danger">{errors.new_password_err}</div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <label for="exampleInputConfirmPass">
                                            Confirm Password:
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="exampleInputConfirmPass"
                                            placeholder="Enter confirm password here.."
                                            name="confirm_password"
                                            onChange={handleChange}
                                            value={changepass.confirm_password}
                                        />
                                        <div className="text-danger">
                                            {errors.confirm_password_err}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success btn-block btn-lg"
                                    disabled={disable}
                                    onClick={submitHandler}
                                >
                                    {disable ? "Processing..." : "Submit"}
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewPassword;