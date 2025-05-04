import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ALTHUB_API_URL } from './baseURL';

const Register = () => {
    const [errors, setErrors] = useState({});
    const nav = useNavigate();
    const [user, setUser] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        image: "",
        website: "",
        password: "",
        cpassword: ""
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let input = user;

        let errors = {};
        let isValid = true;

        if (!input["name"]) {
            isValid = false;
            errors["name_err"] = "Please Enter Name";
        }
        if (!input["address"]) {
            isValid = false;
            errors["address_err"] = "Please Enter Address";
        }
        if (!input["phone"]) {
            isValid = false;
            errors["phone_err"] = "Please Enter Phone Number";
        }
        if (!input["email"]) {
            isValid = false;
            errors["email_err"] = "Please Enter Email";
        }
        if (!input["password"]) {
            isValid = false;
            errors["password_err"] = "Please Enter Password";
        }
        if (!input["website"]) {
            isValid = false;
            errors["website_err"] = "Please Enter Website";
        }
        if (input["password"].length < 8) {
            isValid = false;
            errors["password_err"] = "Password must be at least 8 characters long";
        }
        if (input["cpassword"] !== input["password"]) {
            isValid = false;
            errors["cpassword_err"] = "Password not match";
        }
        setErrors(errors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validate()) {
            var body = {
                name: user.name,
                address: user.address,
                image: user.image,
                phone: user.phone,
                email: user.email,
                password: user.password,
                website: user.website,
            };
            const myurl = `${ALTHUB_API_URL}/api/registerInstitute`;
            axios({
                method: "post",
                url: myurl,
                data: body,
            })
                .then((res) => {
                    toast.success("Register Successful");
                    setTimeout(() => {
                        nav("/login");
                    }, 1000)
                })
                .catch((err) => {
                    toast.error(err.response.data.msg);
                });
        }
        else {
            toast.error("Some Fields Missing!!")
        }
    };

    const handleImgChange = (e) => {
        var body = new FormData();
        body.append("image", e.target.files[0]);
        axios({
            method: "post",
            headers: { "Content-Type": "multipart/form-data" },
            url: `${ALTHUB_API_URL}/api/uploadInstituteImage`,
            data: body,
        })
            .then((response) => {
                console.log(response.data.data.url);
                setUser({ ...user, image: response.data.data.url });
            })
            .catch((error) => { });
    };

    return (
        <>
            <div className="form-fields-container">
                <div className="left-container">
                    <div className="left-container-content">
                        <h2>Already a member ?</h2>
                        <p>
                            To keep track on your dashboard please login with your personal
                            info
                        </p>
                        <a onClick={() => {
                            nav("/login");
                        }}>
                            Login
                        </a>
                    </div>
                    <img src="/img/Usability testing-bro.png" alt="" />
                </div>
                <div className="right-container">
                    <form id="msform">
                        <fieldset>
                            <h2 class="fs-title">Institute Details</h2>
                            <h3 class="fs-subtitle">Tell us something more about your Institute</h3>

                            <input type="text" name="name" placeholder=" Name" value={user.name} onChange={handleChange} />
                            <div className="text-danger">{errors.name_err}</div>

                            <input type="text" name="address" placeholder="Address" value={user.address} onChange={handleChange} />
                            <div className="text-danger">{errors.address_err}</div>

                            <input type="text" name="phone" placeholder="Contact Number" value={user.phone} onChange={handleChange} />
                            <div className="text-danger">{errors.phone_err}</div>

                            <input type="text" name="email" placeholder="Email" value={user.email} onChange={handleChange} />
                            <div className="text-danger">{errors.email_err}</div>

                            <input type="file" name="image" placeholder="Select your profile picture" onChange={handleImgChange} />
                            {user.image ? (
                                <div>
                                    <img
                                        src={`${ALTHUB_API_URL}${user.image}`}
                                        alt=""
                                        height={150}
                                        width={150}
                                        style={{ objectFit: "cover", borderRadius: "50%" }}
                                    />
                                </div>
                            ) : (
                                ""
                            )}

                            <input type="text" name="website" placeholder="Website URL" value={user.website} onChange={handleChange} />
                            <div className="text-danger">{errors.website_err}</div>

                            <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} />
                            <div className="text-danger">{errors.password_err}</div>

                            <input type="password" name="cpassword" placeholder="Confirm Password" value={user.cpassword} onChange={handleChange} />
                            <div className="text-danger">{errors.cpassword_err}</div>

                            <input type="button" name="Submit" class="next action-button" value="SUBMIT" onClick={handleSubmit} />
                        </fieldset>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register