import axios from "axios";
import React, { useEffect, useState } from "react";
import { WEB_URL } from "../baseURL";
import { toast } from "react-toastify";
import Select from "react-select";

const EditProfileModal = ({ closeModal, user, getUser }) => {
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({});
  const [dob, setDob] = useState("");
  const [languages, setLanguages] = useState([]);
  const [skills, setSkills] = useState([]);

  const option1 = [
    { value: "Bahana Indonesia", label: "Bahana Indonesia" },
    { value: "Bengali", label: "Bengali" },
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Dansk", label: "Dansk" },
    { value: "Deutsch", label: "Deutsch" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "Italian", label: "Italian" },
    { value: "Gujarati", label: "Gujarati" },
  ];

  const option2 = [
    { value: "Management", label: "Management" },
    { value: "Communication", label: "Communication" },
    { value: "Customer Service", label: "Customer Service" },
    { value: "Leadership", label: "Leadership" },
    { value: "Sales", label: "Sales" },
    { value: "Project Management", label: "Project Management" },
    { value: "Research", label: "Research" },
    { value: "Analytical Skills", label: "Analytical Skills" },
    { value: "Marketing", label: "Marketing" },
    { value: "Teamwork", label: "Teamwork" },
    { value: "Software Development", label: "Software Development" },
    { value: "SQL", label: "SQL" },
    { value: "Finance", label: "Finance" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Cloud Computing", label: "Cloud Computing" },
    { value: "Operations", label: "Operations" },
    {
      value: "Customer Relationship Management",
      label: "Customer Relationship Management",
    },
  ];

  const colorStyle = {
    control: (styles) => ({
      ...styles,
      padding: "5px",
      border: "1px solid #ACB4BA",
      borderRadius: "16px",
      outline: "none",
      cursor: "pointer",
      textAlign: "left",
      fontSize: "14px",
    }),
  };

  const handleSelect1 = (e) => {
    setLanguages(e);
  };

  const handleSelect2 = (e) => {
    setSkills(e);
  };

  useEffect(() => {
    setUserData(user);
    let arr = [];
    user.languages && JSON.parse(user.languages).forEach((elem) => {
      arr.push({ value: elem, label: elem });
    })
    setLanguages(arr);
    arr = [];
    user.skills && JSON.parse(user.skills).forEach((elem) => {
      arr.push({ value: elem, label: elem });
    })
    setSkills(arr);
    setDob(user.dob && user.dob.split("T")[0]);
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, [user]);

  const validate = () => {
    let input = userData;

    let errors = {};
    let isValid = true;

    if (!input["fname"]) {
      isValid = false;
      errors["fname_err"] = "Please Enter First Name";
    }
    if (!input["lname"]) {
      isValid = false;
      errors["lname_err"] = "Please Enter Last Name";
    }
    if (!input["gender"]) {
      isValid = false;
      errors["gender_err"] = "Please Choose Gender";
    }
    if (!dob) {
      isValid = false;
      errors["dob_err"] = "Please Choose Date of Birth";
    }
    if (!input["city"]) {
      isValid = false;
      errors["city_err"] = "Please Enter City";
    }
    if (!input["state"]) {
      isValid = false;
      errors["state_err"] = "Please Enter State";
    }
    if (!input["phone"]) {
      isValid = false;
      errors["phone_err"] = "Please Enter Phone Number";
    }
    if (!input["nation"]) {
      isValid = false;
      errors["country_err"] = "Please Enter country";
    }
    if (!input["email"]) {
      isValid = false;
      errors["email_err"] = "Please Enter Email";
    }
    setErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    console.log(userData);
    if (validate()) {
      var lang = languages.map((elem) => {
        return elem.value;
      });
      var skill = skills.map((elem) => {
        return elem.value;
      });
      axios({
        url: `${WEB_URL}/api/userProfileEdit`,
        method: "post",
        data: {
          id: userData._id,
          fname: userData.fname,
          lname: userData.lname,
          gender: userData.gender,
          dob: dob,
          city: userData.city,
          state: userData.state,
          nation: userData.nation,
          phone: userData.phone,
          email: userData.email,
          github: userData.github,
          linkedin: userData.linkedin,
          portfolioweb: userData.portfolioweb,
          about: userData.about,
          languages: JSON.stringify(lang),
          skills: JSON.stringify(skill),
        },
      })
        .then((response) => {
          toast.success("Profile Updated!!");
          getUser();
          closeModal();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleCancel = () => {
    setUserData(user);
    closeModal();
  };

  return (
    <>
      <div className="modal-wrapper" onClick={closeModal}></div>
      <div className="modal-container">
        <div className="edit-profile-header" onClick={closeModal}>
          <h2>Edit Profile</h2>
          <i class="fa-solid fa-xmark close-modal"></i>
        </div>
        <div className="edit-profile-details">
          <span>First Name</span>
          <input
            type="text"
            name="fname"
            placeholder="First Name"
            value={userData.fname && userData.fname}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.fname_err}</div>
          <span>Last Name</span>
          <input
            type="text"
            name="lname"
            placeholder="Last Name"
            value={userData.lname && userData.lname}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.lname_err}</div>
          <span>Date of Birth</span>
          <div className="datefield">
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
              }}
            />
          </div>
          <div className="text-danger">{errors.dob_err}</div>
          <div className="gender">
            <div>Gender</div>
            <div>
              <input
                type="radio"
                name="gender"
                onChange={(e) => {
                  setUserData({ ...userData, gender: e.target.value });
                }}
                value="Male"
                checked={userData.gender === "Male" ? true : false}
              />
              <span>Male</span>
            </div>
            <div>
              <input
                type="radio"
                name="gender"
                onChange={(e) => {
                  setUserData({ ...userData, gender: e.target.value });
                }}
                value="Female"
                checked={userData.gender === "Female" ? true : false}
              />
              <span>Female</span>
            </div>
          </div>
          <div className="text-danger">{errors.gender_err}</div>
          <span>Phone</span>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={userData.phone}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.phone_err}</div>
          <span>Email</span>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.email_err}</div>
          <span>Github</span>
          <input
            type="text"
            name="github"
            placeholder="Github"
            value={userData.github}
            onChange={handleChange}
          />
          <span>LinkedIn</span>
          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn"
            value={userData.linkedin}
            onChange={handleChange}
          />
          <span>Portfolio</span>
          <input
            type="text"
            name="portfolioweb"
            placeholder="Portfolio Web"
            value={userData.portfolioweb}
            onChange={handleChange}
          />
          <span>Languages</span>
          <Select
            options={option1}
            isMulti
            onChange={handleSelect1}
            placeholder="Select Language"
            value={languages}
            styles={colorStyle}
            className="select"
          ></Select>
          <span>Skills</span>
          <Select
            options={option2}
            isMulti
            onChange={handleSelect2}
            placeholder="Select Skills"
            value={skills}
            styles={colorStyle}
            className="select"
          ></Select>
          <span>Nation</span>
          <input
            type="text"
            name="nation"
            placeholder="Nation"
            value={userData.nation}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.country_err}</div>
          <span>State</span>
          <input
            type="text"
            name="state"
            placeholder="State"
            value={userData.state}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.state_err}</div>
          <span>City</span>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={userData.city}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.city_err}</div>
          <span>About</span>
          <input
            type="text"
            name="about"
            placeholder="About"
            value={userData.about}
            onChange={handleChange}
          />


          <div className="buttons">
            <input
              type="button"
              value="Cancel"
              className="action-button-cancel"
              onClick={handleCancel}
            />
            <input
              type="button"
              value="Update"
              className="action-button-confirm"
              onClick={handleUpdate}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;