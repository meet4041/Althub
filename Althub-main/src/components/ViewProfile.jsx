import React, { useEffect, useState } from "react";
import axios from "axios";
import { WEB_URL } from "../baseURL";
import { toast } from "react-toastify";
import EditProfileModal from "./EditProfileModal";
import EditExperienceModal from "./EditExperienceModal";
import EditEducationModal from "./EditEducationModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { useNavigate } from "react-router-dom";
import FollowerModal from "./FollowerModal";

export default function ViewProfile() {
  const nav = useNavigate();
  const [user, setUser] = useState({});
  const [language, setLanguage] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [contactInfo, setContactInfo] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [showModal5, setShowModal5] = useState(false);
  const [experience, setExperience] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const closeModal1 = () => setShowModal1(false);
  const closeModal2 = () => setShowModal2(false);
  const closeModal3 = () => setShowModal3(false);
  const closeModal4 = () => setShowModal4(false);
  const closeModal5 = () => setShowModal5(false);
  const [modal, setModal] = useState("");
  const [editmenu, setEditMenu] = useState(false);
  const userID = localStorage.getItem("Althub_Id");

  const getUser = () => {
    axios({
      method: "get",
      url: `${WEB_URL}/api/searchUserById/${userID}`,
    })
      .then((Response) => {
        Response.data.data[0].languages &&
          setLanguage(JSON.parse(Response.data.data[0].languages));
        setUser(Response.data.data[0]);
        Response.data.data[0].skills &&
          setSkills(JSON.parse(Response.data.data[0].skills));
      })
      .catch((error) => {
        toast.error("Something Went Wrong");
      });
  };

  const getEducation = () => {
    axios({
      method: "post",
      url: `${WEB_URL}/api/getEducation`,
      data: {
        userid: userID,
      },
    })
      .then((Response) => {
        setEducation(Response.data.data);
      })
      .catch((Error) => {
        console.log(Error);
      });
  };

  const getExperience = () => {
    axios({
      method: "post",
      url: `${WEB_URL}/api/getExperience`,
      data: {
        userid: userID,
      },
    })
      .then((Response) => {
        setExperience(Response.data.data);
      })
      .catch((Error) => {
        console.log(Error);
      });
  };

  const getNewUsers = () => {
    axios({
      url: `${WEB_URL}/api/getTopUsers`,
      method: "post",
      data: {
        institute: user.institute,
      },
    }).then((Response) => {
      console.log(Response.data.data.filter((elem) => elem._id !== user._id));
      setTopUsers(Response.data.data.filter((elem) => elem._id !== user._id));
    });
  };

  const formatDate = (date) => {
    if (date === "" || date == null) {
      return "Present";
    }
    var year = date.split("-")[0];
    var month = date.split("-")[1];
    switch (month) {
      case "01":
        return `January ${year}`;
      case "02":
        return `February ${year}`;
      case "03":
        return `March ${year}`;
      case "04":
        return `April ${year}`;
      case "05":
        return `May ${year}`;
      case "06":
        return `June ${year}`;
      case "07":
        return `July ${year}`;
      case "08":
        return `August ${year}`;
      case "09":
        return `September ${year}`;
      case "10":
        return `October ${year}`;
      case "11":
        return `November ${year}`;
      case "12":
        return `December ${year}`;
      default:
        return "ok";
    }
  };

  useEffect(() => {
    getUser();
    getEducation();
    getExperience();
  }, []);

  useEffect(() => {
    getNewUsers();
  }, [user, getUser, getNewUsers]);

  return (
    <>
      <div className="container">
        <div className="profile-main">
          <div className="profile-container">
            <div className="profile-cover"></div>
            <div className="profile-container-inner1">
              <div>
                {user.profilepic !== "" ? (
                  <img
                    src={`${WEB_URL}${user.profilepic}`}
                    alt=""
                    className="profile-pic"
                  />
                ) : (
                  <img src="images/profile1.png" className="profile-pic" alt="#" />
                )}
                <h1>
                  {user.fname} {user.lname}
                </h1>
                <p>{user.institute && user.institute}</p>
                <p>
                  {user.city && user.city} {user.state && user.state}{" "}
                  {user.nation ? `, ${user.nation} ` : null}
                  <a
                    onClick={() => {
                      setContactInfo(!contactInfo);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Contact info
                  </a>
                </p>
                <div
                  className="contactInfo"
                  style={{ display: `${contactInfo ? "block" : "none"}` }}
                >
                  {user.github ? (
                    <div>
                      <a
                        href={user.github.startsWith('http') ? user.github : `https://github.com/${user.github}`}
                        className="fa-brands fa-github"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginRight: '8px' }}
                      >
                      </a>
                      {user.github}
                    </div>
                  ) : null}
                  {user.linkedin ? (
                    <div>
                      <a
                        href={user.linkedin.startsWith('http') ? user.linkedin : `https://www.linkedin.com/in/${user.linkedin}`}
                        className="fa-brands fa-linkedin-in"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginRight: '8px' }}
                      >
                      </a>
                      {user.linkedin}
                    </div>
                  ) : null}
                  {user.portfolioweb ? (
                    <div>
                      <a
                        href={user.portfolioweb.startsWith('http') ? user.portfolioweb : `http://${user.portfolioweb}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fa-regular fa-id-card"
                        style={{ marginRight: '5px' }}
                      >
                      </a>
                      {user.portfolioweb}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="edit-icon">
                <i
                  class="fa-solid fa-pencil"
                  onClick={() => setShowModal1(true)}
                ></i>
                <div class="dropdown" style={{ marginLeft: "6px" }}>
                  <i
                    class="fa-solid fa-ellipsis-vertical dropbtn"
                    onClick={() => {
                      setEditMenu(!editmenu);
                    }}
                    style={{ padding: "0 10px", cursor: "pointer" }}
                  ></i>
                  <div
                    class="dropdown-content"
                    style={{ display: `${editmenu ? "block" : "none"}` }}
                  >
                    <b onClick={() => setEditMenu(!editmenu)}>Add Details</b>
                    <hr />
                    <a
                      onClick={() => {
                        setShowModal1(true);
                        setEditMenu(!editmenu);
                      }}
                    >
                      Profile
                    </a>
                    <a
                      onClick={() => {
                        setShowModal5(true);
                        setEditMenu(!editmenu);
                      }}
                    >
                      Connections
                    </a>
                    <a
                      onClick={() => {
                        setModal("Add");
                        setShowModal3(true);
                        setEditMenu(!editmenu);
                      }}
                    >
                      Education
                    </a>
                    <a
                      onClick={() => {
                        setModal("Add");
                        setShowModal2(true);
                        setEditMenu(!editmenu);
                      }}
                    >
                      Experience
                    </a>
                    <a
                      onClick={() => {
                        setShowModal4(true);
                        setEditMenu(!editmenu);
                      }}
                    >
                      Change Password
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {user.about !== "" ? (
            <div className="profile-description">
              <h2>About</h2>
              <p>{user.about}</p>
            </div>
          ) : null}

          {experience.length > 0 ? (
            <div className="profile-description">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2>Experience</h2>
                <div className="edit-icon">
                  <i
                    class="fa-solid fa-plus"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      setModal("Add");
                      setShowModal2(true);
                    }}
                  ></i>
                  <i
                    class="fa-solid fa-pencil"
                    onClick={() => {
                      setModal("Edit");
                      setShowModal2(true);
                    }}
                  ></i>
                </div>
              </div>
              {experience.map((elem) => (
                <div className="profile-desc-row">
                  <img src={`${WEB_URL}${elem.companylogo}`} alt="" />
                  <div>
                    <h3>{elem.position}</h3>
                    <b>{elem.companyname} &middot; Full-time</b>
                    <b>
                      {formatDate(elem.joindate)} - {formatDate(elem.enddate)}
                    </b>
                    {elem.description !== "" ? (
                      <p>
                        <strong>Description :</strong> {elem.description}
                      </p>
                    ) : (
                      ""
                    )}
                    <hr />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {education.length > 0 ? (
            <div className="profile-description">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2>Education</h2>
                <div className="edit-icon">
                  <i
                    class="fa-solid fa-plus"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      setModal("Add");
                      setShowModal3(true);
                    }}
                  ></i>
                  <i
                    class="fa-solid fa-pencil"
                    onClick={() => {
                      setModal("Edit");
                      setShowModal3(true);
                    }}
                  ></i>
                </div>
              </div>
              {education.map((elem) => (
                <div className="profile-desc-row">
                  <img src={`${WEB_URL}${elem.collagelogo}`} alt="" />
                  <div>
                    <h3>{elem.institutename}</h3>
                    <b>{elem.course}</b>
                    <b>
                      {elem.joindate.split("-")[0]} -{" "}
                      {elem.enddate.split("-")[0]}
                    </b>
                    <hr />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {skills.length > 0 ? (
            <div className="profile-description">
              <h3>Skills</h3>
              {skills.map((elem) => (
                <a className="skills-btn">{elem}</a>
              ))}
            </div>
          ) : null}

          {language.length > 0 ? (
            <div className="profile-description">
              <h3>Language</h3>
              {language.map((elem) => (
                <a className="language-btn">{elem}</a>
              ))}
            </div>
          ) : null}
        </div>
        <div className="profile-sidebar">
          {topUsers.length > 0 ? (
            <div className="sidebar-people">
              <h3>People you may know</h3>
              {topUsers.map((elem) => (
                <>
                  <div className="sidebar-people-row">
                    <img src={`${WEB_URL}${elem.profilepic}`} alt="" />
                    <div>
                      <h2>
                        {elem.fname} {elem.lname}
                      </h2>
                      <p>
                        {elem.city} {elem.state}, {elem.nation}{" "}
                      </p>
                      <a
                        onClick={() =>
                          nav("/view-search-profile", {
                            state: { id: elem._id },
                          })
                        }
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                  <hr />
                </>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {showModal1 && (
        <EditProfileModal
          closeModal={closeModal1}
          user={user}
          getUser={getUser}
        />
      )}
      {showModal2 && (
        <EditExperienceModal
          closeModal={closeModal2}
          experience={experience}
          getExperience={getExperience}
          modal={modal}
        />
      )}
      {showModal3 && (
        <EditEducationModal
          closeModal={closeModal3}
          education={education}
          getEducation={getEducation}
          modal={modal}
        />
      )}
      {showModal4 && <ChangePasswordModal closeModal={closeModal4} />}
      {showModal5 && <FollowerModal closeModal={closeModal5} user={user} getUser={getUser} />}
    </>
  );
}