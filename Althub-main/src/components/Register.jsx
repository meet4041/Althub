import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { WEB_URL } from "../baseURL";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

export default function Register() {
  const [universityShow, setUniversityShow] = useState(false);
  const [university, setUniversity] = useState([]);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const nav = useNavigate();
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
    { value: "Gujarati", label: "Gujarati" }
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
    { value: "Customer Relationship Management", label: "Customer Relationship Management" },
  ];

  const colorStyle = {
    control: (styles) => ({
      ...styles,
      padding: "5px",
      border: "1px solid #ACB4BA",
      borderRadius: "16px",
      outline: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      fontSize: '14px'
    }),
  };

  const handleSelect1 = (e) => {
    setLanguages(e);
  };

  const handleSelect2 = (e) => {
    setSkills(e);
  };

  const [user, setUser] = useState({
    fname: "",
    lname: "",
    gender: "",
    country: "",
    dob: "",
    city: "",
    state: "",
    profilepic: "",
    phone: "",
    email: "",
    password: "",
    cpassword: "",
    github: "",
    linkedin: "",
    portfolioweb: "",
    role: "",
    institute: "",
  });

  const increaseStep = () => {
    setStep(step + 1);
  };
  const decraseStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let input = user;

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
    if (!input["dob"]) {
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
    if (!input["country"]) {
      isValid = false;
      errors["country_err"] = "Please Enter country";
    }
    // if (!input["institute"]) {
    //   isValid = false;
    //   errors["institute_err"] = "Please Choose Institute";
    // }
    if (!input["email"]) {
      isValid = false;
      errors["email_err"] = "Please Enter Email";
    }
    if (!input["password"]) {
      isValid = false;
      errors["password_err"] = "Please Enter Password";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      var lang = languages.map((elem) => elem.value);
      var skill = skills.map((elem) => elem.value);

      var body = {
        fname: user.fname,
        lname: user.lname,
        gender: user.gender,
        dob: user.dob,
        city: user.city,
        state: user.state,
        nation: user.country,
        profilepic: user.profilepic,
        phone: user.phone,
        email: user.email,
        password: user.password,
        languages: JSON.stringify(lang),
        github: user.github,
        linkedin: user.linkedin,
        portfolioweb: user.portfolioweb,
        skills: JSON.stringify(skill),
        institute: user.institute,
        role: user.role,
      };

      const myurl = `${WEB_URL}/api/register`;
      axios.post(myurl, body)
        .then((res) => {
          toast.success("Register Successful");
          nav("/login");
        })
        .catch((err) => {
          toast.error(err.response.data.msg);
        });
    } else {
      toast.error("Some Fields Missing!!");
    }
  };

  const handleImgChange = (e) => {
    var body = new FormData();
    body.append("profilepic", e.target.files[0]);
    axios({
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      url: `${WEB_URL}/api/uploadUserImage`,
      data: body,
    })
      .then((response) => {
        console.log(response.data.data.url);
        setUser({ ...user, profilepic: response.data.data.url });
      })
      .catch((error) => { });
  };

  const getUniversity = () => {
    axios({
      method: "get",
      url: `${WEB_URL}/api/getInstitutes`,
    }).then((response) => {
      setUniversity(response.data.data);
    });
  };

  useEffect(() => {
    getUniversity();
  }, []);

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
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                nav("/login");
              }}
            >
              Login
            </a>
          </div>
          <img src="./images/Usability testing-bro.png" alt="" />
        </div>
        <div className="right-container">
          <form id="msform">
            <ul id="progressbar">
              <li
                className={step >= 1 ? "active" : ""}
                onClick={() => {
                  setStep(1);
                }}
              >
                Personal Details
              </li>
              <li
                className={step >= 2 ? "active" : ""}
                onClick={() => {
                  setStep(2);
                }}
              >
                Social Profiles
              </li>
              <li
                className={step >= 3 ? "active" : ""}
                onClick={() => {
                  setStep(3);
                }}
              >
                Additional Details
              </li>
              <li
                className={step >= 4 ? "active" : ""}
                onClick={() => {
                  setStep(4);
                }}
              >
                Upload Profile
              </li>
              <li
                className={step >= 5 ? "active" : ""}
                onClick={() => {
                  setStep(5);
                }}
              >
                Account Setup
              </li>
            </ul>

            {step === 1 ? (
              <fieldset>
                <h2 className="fs-title">Personal Details</h2>
                <h3 className="fs-subtitle">
                  Tell us something more about you
                </h3>
                <input
                  type="text"
                  name="fname"
                  placeholder="First Name"
                  value={user.fname}
                  onChange={handleChange}
                />
                <div className="text-danger">{errors.fname_err}</div>
                <input
                  type="text"
                  name="lname"
                  placeholder="Last Name"
                  value={user.lname}
                  onChange={handleChange}
                />
                <div className="text-danger">{errors.lname_err}</div>
                <div className="datefield"><span>Date of Birth</span>
                  <input
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    value={user.dob}
                    onChange={handleChange}
                  /></div>
                <div className="text-danger">{errors.dob_err}</div>
                <div className="gender">
                  <div>Gender</div>
                  <div>

                    <input
                      type="radio"
                      name="gender"
                      onChange={(e) => {
                        setUser({ ...user, gender: e.target.value });
                      }}
                      value="Male"
                      checked={user.gender === "Male" ? true : false}
                    />
                    <span>Male</span>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      onChange={(e) => {
                        setUser({ ...user, gender: e.target.value });
                      }}
                      value="Female"
                      checked={user.gender === "Female" ? true : false}
                    />
                    <span>Female</span>
                  </div>
                </div>
                <div className="text-danger">{errors.gender_err}</div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={user.phone}
                  onChange={handleChange}
                />
                <div className="text-danger">{errors.phone_err}</div>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={handleChange}
                />
                <div className="text-danger">{errors.email_err}</div>
                <input
                  type="button"
                  name="next"
                  className="next action-button"
                  value="Next"
                  onClick={increaseStep}
                />
              </fieldset>
            ) : (
              ""
            )}
            {step === 2 ? (
              <fieldset>
                <h2 className="fs-title">Social Profiles</h2>
                <h3 className="fs-subtitle">
                  Your presence on the social network
                </h3>
                <input
                  type="text"
                  name="github"
                  placeholder="Github"
                  value={user.github}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="linkedin"
                  placeholder="LinkedIn"
                  value={user.linkedin}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="portfolioweb"
                  placeholder="Portfolio Web"
                  value={user.portfolioweb}
                  onChange={handleChange}
                />
                <input
                  type="button"
                  name="previous"
                  className="previous action-button-previous"
                  value="Previous"
                  onClick={decraseStep}
                />
                <input
                  type="button"
                  name="next"
                  className="next action-button"
                  value="Next"
                  onClick={increaseStep}
                />
              </fieldset>
            ) : (
              ""
            )}
            {step === 3 ? (
              <fieldset>
                <h2 className="fs-title">Additional Info</h2>
                <h3 className="fs-subtitle">
                  Tell us something more about you
                </h3>
                <div
                  class="prise_main_drop"
                  onClick={() => setUniversityShow(!universityShow)}
                >
                  <span class="prise-data">{user.institute ? user.institute : "Select Institute"}</span>
                  <span class="prise_down_icon">
                    <i class="fa-solid fa-angle-down"></i>
                  </span>
                  {university.length > 0 ? (
                    <ul
                      class={
                        universityShow === true
                          ? "prise-list-merge opened"
                          : "prise-list-merge"
                      }
                    >
                      {university.map((elem) => (
                        <li
                          class={
                            user.institute === elem.name
                              ? "prise_list selected"
                              : "prise_list"
                          }
                          onClick={() => {
                            setUser({ ...user, institute: elem.name });
                          }}
                        >
                          {elem.image !== "" ? (
                            <img
                              src={`${WEB_URL}${elem.image}`}
                              className="option-img"
                              alt=""
                            />
                          ) : (
                            ""
                          )}
                          <span>{elem.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="text-danger">{errors.institute_err}</div>
                <Select
                  options={option1}
                  isMulti
                  onChange={handleSelect1}
                  placeholder="Select Language"
                  value={languages}
                  styles={colorStyle}
                ></Select>
                <div className="text-danger" style={{ margin: "10px" }}>{errors.languages_err}</div>
                <Select
                  options={option2}
                  isMulti
                  onChange={handleSelect2}
                  placeholder="Select Skills"
                  value={skills}
                  styles={colorStyle}
                ></Select>
                <div className="text-danger" style={{ margin: "10px" }}>{errors.skills_err}</div>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={user.country}
                  onChange={handleChange}
                />
                <div className="text-danger">{errors.country_err}</div>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={user.state}
                  onChange={handleChange}
                />
                <div className="text-danger">{errors.state_err}</div>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={user.city}
                  onChange={handleChange}
                />
                <div className="text-danger">{errors.city_err}</div>
                <input
                  type="button"
                  name="previous"
                  className="previous action-button-previous"
                  value="Previous"
                  onClick={decraseStep}
                />
                <input
                  type="button"
                  name="next"
                  className="next action-button"
                  value="Next"
                  onClick={increaseStep}
                />
              </fieldset>
            ) : (
              ""
            )}
            {step === 4 ? (
              <fieldset>
                <h2 className="fs-title">Upload Profile</h2>
                <h3 className="fs-subtitle">Take your photo in a Well-lit place</h3>
                <div className="profile-uload">
                  {user.profilepic ? (
                    <img
                      src={`${WEB_URL}${user.profilepic}`}
                      alt=""
                      className="img-fluid"
                      style={{
                        objectFit: "cover",
                        width: "200px",
                        height: "200px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                        backgroundColor: "#F3F3F3",
                      }}
                    ></div>
                  )}
                  <div className="information-profile-upload">
                    <label>
                      {" "}
                      <input type="file" onChange={handleImgChange} name="profilepic" placeholder="Select your profile picture" />{" "}
                      <img
                        src=" images/Icon_Camera.png"
                        alt=""
                        className="img-fluid"
                      />
                    </label>
                  </div>
                </div>
                <div className="text-danger">{errors.profilepic_err}</div>
                <input
                  type="button"
                  name="previous"
                  className="previous action-button-previous"
                  value="Previous"
                  onClick={decraseStep}
                />
                <input
                  type="button"
                  name="next"
                  className="next action-button"
                  value="Next"
                  onClick={increaseStep}
                />
              </fieldset>
            ) : (
              ""
            )}
            {step === 5 ? (
              <fieldset>
                <h2 className="fs-title">Create your account</h2>
                <h3 className="fs-subtitle">Fill in your credentials</h3>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={handleChange}
                />
                <div className="text-danger">{errors.password_err}</div>
                <input
                  type="password"
                  name="cpassword"
                  placeholder="Confirm Password"
                  value={user.cpassword}
                  onChange={handleChange}
                />
                <div className="text-danger">{errors.cpassword_err}</div>
                <input
                  type="button"
                  name="previous"
                  className="previous action-button-previous"
                  value="Previous"
                  onClick={decraseStep}
                />
                <input
                  type="button"
                  name="submit"
                  className="submit action-button"
                  value="Submit"
                  onClick={handleSubmit}
                />
              </fieldset>
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </>
  );
}