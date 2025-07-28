import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { WEB_URL } from "../baseURL";
import { useEffect } from "react";

export default function Login() {
  const nav = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let input = user;
    let isValid = true;

    if (!input["email"]) {
      isValid = false;
      toast.error("Please Enter Email");
    }
    if (!input["password"]) {
      isValid = false;
      toast.error("Please Enter Password");
    }
    return isValid;
  };

  const handleLogin = () => {
    if (validate()) {
      axios({
        method: "post",
        data: {
          email: user.email,
          password: user.password,
        },
        url: `${WEB_URL}/api/userLogin`
      }).then((response) => {
        toast.success("Login Successfull");
        localStorage.setItem("Althub_Id", response.data.data._id);
        setTimeout(() => {
          nav("/home");
        })
      }).catch((err) => {
        toast.error("Invalid Creadentials");
      })
    }
  };

  useEffect(() => {
    if (localStorage.getItem("Althub_Id") !== null) {
      nav('/home');
    }
  })

  return (
    <>
      <div className="wrap1">
        <div className="login-img-box">
          <img src="images/register-animate.svg" alt="" />
        </div>
        <div className="main-box">
          <div className="main">
            <div className="login-logo">
              <img src="images/Logo1.jpeg" alt="" />
            </div>
            <div className="title">Login</div>
            <div className="input-box ">
              <input
                type="text"
                placeholder="Enter Your Email"
                value={user.email}
                onChange={handleChange}
                name="email"
              />
              <div className="underline"></div>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Enter Your Password"
                value={user.password}
                onChange={handleChange}
                name="password"
              />
              <div className="underline"></div>
            </div>
            <div className="input-box button">
              <input
                type="submit"
                name=""
                value="Continue"
                onClick={handleLogin}
              />
            </div>
            <div
              className="option"
              onClick={() => {
                nav("/forget-password");
              }}
            >
              <span>Forget Password ?</span>
            </div>
            <div
              className="new-account"
              onClick={() => {
                nav("/register");
              }}
            >
              Don't have an Account?
              <span>Sign Up</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}