import axios from "axios";
import React, { useState } from "react";
import { WEB_URL } from "../baseURL";
import { toast } from "react-toastify";

const ChangePasswordModal = ({ closeModal }) => {
  const [errors, setErrors] = useState({});
  const handleCancel = () => {
    closeModal();
  };
  const [pass, setPass] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setPass({ ...pass, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let input = pass;

    let errors = {};
    let isValid = true;

    if (!input["old"]) {
      isValid = false;
      errors["old_err"] = "Please Enter Old Password";
    }

    if (input["new"].length < 8) {
      isValid = false;
      errors["new_err"] = "Password must be at least 8 characters long";
    }

    if (!input["new"]) {
      isValid = false;
      errors["new_err"] = "Please Enter New Password";
    }

    if (input["confirm"] !== input["new"]) {
      isValid = false;
      errors["confirm_err"] = "Password not match";
    }

    if (!input["confirm"]) {
      isValid = false;
      errors["confirm_err"] = "Please Enter Confirm Password";
    }

    setErrors(errors);
    return isValid;
  };

  const handleChangePassword = () => {
    const userID=localStorage.getItem("Althub_Id");
    if (validate()) {
        axios({
            url:`${WEB_URL}/api/userUpdatePassword`,
            method:"post",
            data:{
                user_id:userID,
                oldpassword:pass.old,
                newpassword:pass.new
            }
        }).then((Response)=>{
            toast.success("Password Updated!!");
            closeModal();
            setPass({
                old:"",
                new:"",
                confirm:""
            })
        }).catch((error)=>{
            toast.error(error.response.data.msg);
        })
    }
  };
  return (
    <>
      <div className="modal-wrapper" onClick={closeModal}></div>
      <div className="modal-container">
        <div className="edit-profile-header" onClick={closeModal}>
          <h2>Change Password</h2>
          <i class="fa-solid fa-xmark close-modal"></i>
        </div>
        <>
          <div className="addEdit-experience">
            <span>Old Password</span>
            <input
              type="text"
              name="old"
              placeholder="Old Password"
              onChange={handleChange}
            />
            <div className="text-danger">{errors.old_err}</div>
            <span>New Password</span>
            <input
              type="password"
              name="new"
              placeholder="New Password"
              onChange={handleChange}
            />
            <div className="text-danger">{errors.new_err}</div>
            <span>Confirm Password</span>
            <input
              type="text"
              name="confirm"
              placeholder="Confirm Password"
              onChange={handleChange}
            />
            <div className="text-danger">{errors.confirm_err}</div>
            <div className="text-danger">{}</div>
            <div className="buttons">
              <button
                type="button"
                className="action-button-cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="action-button-confirm"
                onClick={handleChangePassword}
              >
                Submit
              </button>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default ChangePasswordModal;
