import axios from 'axios';
import React, { useState } from 'react'
import { WEB_URL } from '../baseURL';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
  const [email,setEmail]=useState("");
  const nav=useNavigate();
  const handleForgotPassword = ()=>{
    if(email!==""){
      axios({
        url:`${WEB_URL}/api/userForgetPassword`,
        data:{
          email:email,
        },
        method:'post',
      }).then((response)=>{
        console.log(response);
        toast.success(response.data.msg);
        setEmail("");
          nav('/login');
      }).catch((error)=>{
        console.log(error);
      })
    }
  }
  return (
    <>
      <div class="forgot">
        <div class="forgot-left">
                <img src="images/Forgot password-amico.svg" alt="Sorry"/>
        </div>
        <div class="forgot-right">
            <h1>Forgot Your Password ?</h1><br/>
            <h4>Please Enter your email address below</h4><br/>
            <div class="user-email">
            <i class="fa-solid fa-envelope"></i>
            <input type="text" placeholder="EMAIL ADDRESS" id="email-input" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
            </div>
            <br/>
            <button id="btn-reset-password" onClick={handleForgotPassword}>RESET PASSWORD</button>
        </div>
    </div>
    </>
  )
}

export default ForgetPassword