import axios from 'axios';
import React, { useState } from 'react'
import { WEB_URL } from '../baseURL';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function NewPassword() {
  const queryParameters = new URLSearchParams(window.location.search)
  const token = queryParameters.get("token")
  const [password, setPassword] = useState({
    new: "",
    confirm: ""
  });
  const [errors, setErrors] = useState({});
  const nav = useNavigate();

  const validate = () => {
    let input = password;
    let errors = {};
    let isValid = true;
    if (!input["new"]) {
      isValid = false;
      errors["new_password_err"] = "Please Enter New Password";
    }
    if (!input["confirm"]) {
      isValid = false;
      errors["confirm_password_err"] = "Please Enter Confirm Password";
    }
    if (input["new"] !== input["confirm"]) {
      isValid = false;
      errors["confirm_password_err"] = "Password Doesn't Match";
    }
    setErrors(errors);
    return isValid;
  };

  const handleResetPassword = () => {
    if (validate()) {
      axios({
        url: `${WEB_URL}/api/userResetPassword?token=${token}`,
        data: {
          password: password.new
        },
        method: 'post',
      }).then((response) => {
        console.log(response);
        toast.success(response.data.msg);
        nav('/login');
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  const handleChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  }

  return (
    <>
      <div class="reset">
        <div class="reset-left">
          <img src="images/Forgot password-amico.svg" alt="forgot password" />
        </div>
        <div class="reset-right">
          <h1>Set New Password ?</h1>
          <h4>Please Enter New-Password</h4>
          <input type="password" placeholder="New Password" id="email-input" value={password.new} onChange={handleChange} name='new' />
          <div style={{ color: "red", fontSize: "12px" }}>{errors.new_password_err}</div>
          <input type="text" placeholder="Confirm Password" id="email-input" value={password.confirm} onChange={handleChange} name='confirm' />
          <div style={{ color: "red", fontSize: "12px" }}>{errors.confirm_password_err}</div>
          <button id="btn-reset-password" onClick={handleResetPassword}>Change Password</button>
        </div>
      </div>
    </>
  )
}

export default NewPassword
