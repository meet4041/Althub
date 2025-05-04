import axios from "axios";
import React, { useEffect, useState } from "react";
import { WEB_URL } from "../baseURL";
import { toast } from "react-toastify";

const EditEducationModal = ({ closeModal, education, getEducation, modal }) => {
  const [ex, setEx] = useState({
    _id: "",
    institutename: "",
    course: "",
    collagelogo: "",
  });
  const [joindate, setJoinDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});
  const [educations, setEducations] = useState([]);
  const [modalType, setModalType] = useState("");
  const [university, setUniversity] = useState([]);
  const [universityShow, setUniversityShow] = useState(false);

  useEffect(() => {
    console.log(education);
    setEducations(education);
    setModalType(modal);
    getUniversity();
  }, [education , modal]);

  const handleChange = (e) => {
    setEx({ ...ex, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setEx();
    closeModal();
  };

  const validate = () => {
    let input = ex;

    let errors = {};
    let isValid = true;

    if (!input["course"]) {
      isValid = false;
      errors["course_err"] = "Please Choose Course";
    }
    if (!joindate) {
      isValid = false;
      errors["joindate_err"] = "Please Choose Joining Date";
    }
    setErrors(errors);
    return isValid;
  };

  const handleUpdate = () => {
    if (validate()) {
      axios({
        method: "post",
        url: `${WEB_URL}/api/editEducation`,
        data: {
          id: ex._id,
          institutename: ex.institutename,
          course: ex.course,
          joindate: joindate,
          enddate: enddate,
          collagelogo: ex.collagelogo,
        },
      })
        .then((response) => {
          toast.success("Education Updated!!");
          closeModal();
          getEducation();
          setEx({});
          joindate("");
          enddate("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleInsert = () => {
    const userID = localStorage.getItem("Althub_Id");
    if (validate()) {
      axios({
        url: `${WEB_URL}/api/addEducation`,
        method: "post",
        data: {
          userid: userID,
          institutename: ex.institutename,
          course: ex.course,
          joindate: joindate,
          enddate: enddate,
          collagelogo: ex.collagelogo,
        },
      })
        .then((response) => {
          toast.success("Education Added!!");
          closeModal();
          getEducation();
          setEx({});
          joindate("");
          enddate("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getUniversity = () => {
    axios({
      method: "get",
      url: `${WEB_URL}/api/getInstitutes`,
    }).then((response) => {
      setUniversity(response.data.data);
      console.log(response);
    });
  };

  const formatDate = (date) => {
    if (date == null) {
      return "";
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
        return `Sorry`;
    }
  };

  const handleDelete = () => {
    if(window.confirm("Do You Really want to Delete?")===true){
      axios({
        method: "delete",
        url: `${WEB_URL}/api/deleteEducation/${ex._id}`,
      }).then((response) => {
        closeModal();
        toast.success("Education Deleted!!");
        getEducation();
      });
    }
  };
  return (
    <>
      <div className="modal-wrapper" onClick={closeModal}></div>
      <div className="modal-container">
        <div className="edit-profile-header" onClick={closeModal}>
          <h2>Edit Education</h2>
          <i class="fa-solid fa-xmark close-modal"></i>
        </div>
        {modalType === "Edit" ? (
          <>
            {educations &&
              educations.map((elem) => (
                <div className="edit-experience">
                  <div>
                    <div className="ex_logo">
                      <img
                        alt="Description"
                        src={`${WEB_URL}${elem.collagelogo}`}
                        height={70}
                        width={70}
                      />
                    </div>
                    <div className="ex_details">
                      <b>{elem.course}</b>
                      <p>{elem.institutename}</p>
                      <p>
                        {formatDate(elem.joindate)} - {formatDate(elem.enddate)}
                      </p>
                    </div>
                  </div>
                  <div className="ex-button">
                    <i
                      class="fa-solid fa-pencil"
                      onClick={() => {
                        setEx({
                          _id: elem._id,
                          institutename: elem.institutename,
                          collagelogo: elem.collagelogo,
                          course: elem.course,
                        });
                        setJoinDate(elem.joindate.split("T")[0]);
                        setEndDate(elem.enddate.split("T")[0]);
                        setModalType("AddEdit");
                      }}
                    ></i>
                  </div>
                </div>
              ))}
          </>
        ) : (
          <>
            <div className="addEdit-experience">
              <div
                class="prise_main_drop"
                onClick={() => setUniversityShow(!universityShow)}
              >
                <span class="prise-data">
                  {ex.institutename ? ex.institutename : "Select Institute"}
                </span>
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
                          ex.institute === elem.name
                            ? "prise_list selected"
                            : "prise_list"
                        }
                        onClick={() => {
                          setEx({
                            ...ex,
                            institutename: elem.name,
                            collagelogo: elem.image,
                          });
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
              <span>Course</span>
              <input
                type="text"
                name="course"
                placeholder="Course"
                value={ex.course}
                onChange={handleChange}
              />
              <div className="text-danger">{errors.course_err}</div>
              <span>Joining Date</span>
              <input
                type="date"
                name="joindate"
                value={joindate}
                onChange={(e) => {
                  setJoinDate(e.target.value);
                }}
              />
              <div className="text-danger">{errors.joindate_err}</div>
              <span>Ending Date</span>
              <input
                type="date"
                name="enddate"
                value={enddate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
              <div className="buttons">
                <button
                  type="button"
                  className="action-button-cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                {modalType === "AddEdit" ? (
                  <> <button
                  type="button"
                  className="action-button-delete"
                  onClick={handleDelete}
                >
                  Delete
                </button> <button
                    type="button"
                    className="action-button-confirm"
                    onClick={handleUpdate}
                  >
                    Update
                  </button></>
                
                ) : (
                  <button
                    type="button"
                    className="action-button-confirm"
                    onClick={handleInsert}
                  >
                    Insert
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EditEducationModal;
