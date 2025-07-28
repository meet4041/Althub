import React, { useEffect, useState } from "react";
import axios from "axios";
import { WEB_URL } from "../baseURL";
import { useNavigate } from "react-router-dom";
import FilterModal from "./FilterModal";

export default function SearchProfile() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState([]);
  const nav = useNavigate();
  const [modal, setModal] = useState(false);
  const closeModal = () => setModal(false);
  const [add, setAdd] = useState("");
  const [skill, setSkill] = useState("");
  const userID = localStorage.getItem("Althub_Id");

  useEffect(() => {
    axios({
      url: `${WEB_URL}/api/searchUser`,
      method: "post",
      data: {
        search: name,
      },
    })
      .then((Response) => {
        setUsers(Response.data.data);
        setShowUsers(Response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [name]);

  const handleFilter = () => {
    closeModal();
    setShowUsers(users.filter((elem) => {
      const cityMatch = elem.city && elem.city.toLowerCase().includes(add.toLowerCase())
      const skillreg = new RegExp(skill, "i");
      const skillsMatch = elem.skills && skillreg.test(elem.skills);
      return cityMatch && skillsMatch;
    }));
  };

  return (
    <>
      <div class="body1">
        <div className="search-hearder">
          <div class="search-box">
            <i
              class="fa-sharp fa-solid fa-magnifying-glass"
              style={{ color: "#787878" }}
            ></i>
            <input
              type="text"
              placeholder="search"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <i class="fa-solid fa-filter" onClick={() => setModal(true)}></i>
            {add || skill ? <i
              class="fa-solid fa-circle"
              style={{
                color: "#ff0000",
                fontSize: "6px",
                position: "absolute",
                marginLeft: "2px",
              }}
            ></i> : null}
          </div>
        </div>
        {showUsers && showUsers.length > 0 ? (
          <div class="card-wrapper">
            {showUsers.map((elem) => (
              <div class="card">
                <div class="image-content">
                  <span class="overlay"></span>
                  <div class="card-image">
                    {elem.profilepic !== "" ? (
                      <img
                        src={`${WEB_URL}${elem.profilepic}`}
                        alt="amir-esrafili"
                        class="card-img"
                      />
                    ) : (
                      <img src="images/profile1.png" class="card-img" alt="#"></img>
                    )}
                  </div>
                </div>
                <div class="card-content">
                  <h2 class="name">
                    {elem.fname} {elem.lname}
                  </h2>
                  <p>
                    {elem.city && elem.city} {elem.state && elem.state}{" "}
                    {elem.nation ? `, ${elem.nation} ` : null}
                  </p>
                  <div class="nav">
                    <ul>
                      <li>
                        <a href="#">
                          <i
                            class="fa-brands fa-whatsapp"
                            style={{ color: "#7e7f81" }}
                          ></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i
                            class="fa-brands fa-linkedin-in"
                            style={{ color: "#7e7f81" }}
                          ></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i
                            class="fa-brands fa-github"
                            style={{ color: "#7e7f81" }}
                          ></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i
                            class="fa-brands fa-google"
                            style={{ color: "#7e7f81" }}
                          ></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <button
                    class="btn-more"
                    onClick={() => {
                      elem._id === userID ? nav("/view-profile") : nav("/view-search-profile", { state: { id: elem._id } })
                    }
                    }
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="no-search">
              <img src="images/search-bro.png" className="no-search-img" />
              <span>"Connecting You with the Right People"</span>
            </div>
          </>
        )}
      </div>
      {modal && (
        <FilterModal
          closeModal={closeModal}
          add={add}
          setAdd={setAdd}
          skill={skill}
          setSkill={setSkill}
          handleFilter={handleFilter}
        />
      )}
    </>
  );
}