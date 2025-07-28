import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { WEB_URL } from "../baseURL";
import { toast } from "react-toastify";

export default function Home({ socket }) {
  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const nav = useNavigate();
  const [user, setUser] = useState({});
  const [post, setPost] = useState([]);
  const [description, setDescription] = useState("");
  const [events, setEvents] = useState([]);
  const [aids, setAids] = useState([]);
  const [fileList, setFileList] = useState(null);
  const files = fileList ? [...fileList] : [];
  const userid = localStorage.getItem("Althub_Id");

  const getUser = useCallback(() => {
    axios({
      method: "get",
      url: `${WEB_URL}/api/searchUserById/${userid}`,
    })
      .then((Response) => {
        setUser(Response.data.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userid]);

  useEffect(() => {
    getUser();
    getPost();
    getEvents();
    getAids();
  }, [getUser]);

  const uploadImg = () => {
    document.getElementById("myFileInput").click();
  };

  const imgChange = (e) => {
    setFileList(e.target.files);
  };

  const getAids = () => {
    axios({
      url: `${WEB_URL}/api/getFinancialAid`,
      method: "get",
    })
      .then((Response) => {
        setAids(Response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getPost = () => {
    axios({
      method: "get",
      url: `${WEB_URL}/api/getPost`,
    })
      .then((Response) => {
        setPost(Response.data.data.reverse());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addPost = () => {
    var body = new FormData();
    body.append("userid", localStorage.getItem("Althub_Id"));
    body.append("description", description);
    body.append("date", new Date());
    files.forEach((file, i) => {
      body.append(`photos`, file, file.name);
    });
    body.append("fname", user.fname);
    body.append("lname", user.lname);
    body.append("profilepic", user.profilepic);
    axios({
      url: `${WEB_URL}/api/addPost`,
      method: "post",
      headers: {
        "Content-type": "multipart/form-data",
      },
      data: body,
    })
      .then((Response) => {
        toast.success("Post Uploaded!!");
        setFileList(null);
        setDescription("");
        getPost();
      })
      .catch((error) => {
        toast.error("Something went wrong!!");
      });
  };

  const getEvents = () => {
    axios({
      method: "get",
      url: `${WEB_URL}/api/getEvents`,
    })
      .then((Response) => {
        setEvents(Response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Logout = () => {
    localStorage.clear();
    nav("/");
  };

  const handleLike = async (elem) => {
    if (userid !== elem.userid) {
      socket.emit("sendNotification", {
        receiverid: elem.userid,
        title: "New Like",
        msg: `${user.name} Liked Your Post`,
      });
    }
    await axios({
      method: "put",
      url: `${WEB_URL}/api/like/${elem._id}`,
      data: {
        userId: userid,
      },
    })
      .then((response) => {
        handleNotification(elem, response.data.msg);
        getPost();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNotification = (elem, msg) => {
    if (userid !== elem.userid) {
      axios({
        url: `${WEB_URL}/api/addNotification`,
        method: "post",
        data: {
          userid: elem.userid,
          msg: `${user.fname} ${user.lname} ${msg} your Post`,
          image: user.profilepic,
          title: "New Like",
          date: new Date(),
        },
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const formatPostTime = (timestamp) => {
    const messageTime = new Date(timestamp);
    const now = new Date();
    const timeDiff = Math.abs(now - messageTime);
    const minutesDiff = Math.floor(timeDiff / 60000);
    if (minutesDiff < 1) {
      return "Just now";
    } else if (minutesDiff < 60) {
      return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"} ago`;
    } else if (messageTime.toDateString() === now.toDateString()) {
      const options = { hour: "numeric", minute: "numeric" };
      return `Today at ${messageTime.toLocaleTimeString("en-US", options)}`;
    } else {
      const options = {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return messageTime.toLocaleString("en-US", options);
    }
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Kolkata",
    };

    const formattedTime = date.toLocaleTimeString("en-US", options);
    return formattedTime.replace(/(\+|-)\d+:\d+/, "");
  };

  const calWidth = (aid, claimed) => {
    const ans = Number(claimed) / Number(aid) * 100;
    if (ans > 100) {
      return "100%";
    } else {
      return `${ans.toFixed(2)}%`;
    }
  }

  return (
    <>
      <div className="home-container">
        <div className="profile-card-main">
          <div className="profile-card">
            <div className="profile-card-imgbox">
              {user.profilepic ? (
                <img
                  src={`${WEB_URL}${user.profilepic}`}
                  alt=""
                  className="profile-card-img"
                />
              ) : (
                <img
                  alt=""
                  src="images/profile1.png"
                  className="profile-card-img"
                ></img>
              )}
            </div>

            <div className="profile-card-info">
              <span className="profile-card-name">
                {user.fname} {user.lname}
              </span>
            </div>
            <div
              className="profile-card-button"
              onClick={() => {
                nav("/view-profile");
                window.scrollTo(0, 0);
              }}
            >
              <button>View Profile</button>
            </div>
          </div>

          <div className="menu-container">
            <div
              className="menu"
              onClick={() => {
                nav("/events");
              }}
            >
              <i className="fa-solid fa-calendar"></i>Events
            </div>
            <div
              className="menu"
              onClick={() => {
                nav("/help-students");
              }}
            >
              <i class="fa-solid fa-handshake-angle"></i>Help Students
            </div>
            <div
              className="menu"
              onClick={() => {
                nav("/feedback");
              }}
            >
              <i className="fa-solid fa-star"></i>FeedBack & Rating
            </div>
            <hr className="hr-line" />
            <div className="menu" onClick={Logout}>
              <i className="fa-solid fa-right-from-bracket"></i>Logout
            </div>
          </div>
        </div>

        <div className="home-post-main">
          <div className="new-post-box">
            {user.profilepic ? (
              <img src={`${WEB_URL}${user.profilepic}`} alt="" />
            ) : (
              <img src="images/profile1.png" alt=""></img>
            )}
            <div className="new-post-content">
              <div className="new-post-text">
                <input
                  type="text"
                  placeholder="Write Here"
                  name="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
                <input
                  type="file"
                  onChange={imgChange}
                  id="myFileInput"
                  hidden
                  multiple={true}
                />
                <i className="fa-regular fa-image" onClick={uploadImg}></i>
              </div>
              {files.length > 0 ? (
                <div className="selected-img">
                  {files.map((elem) => (
                    <div>
                      <img src={window.URL.createObjectURL(elem)} alt="" />
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>
            <button type="submit" className="new-post-btn" onClick={addPost}>
              Post
            </button>
          </div>

          <div className="post-box">
            {post.length > 0 ? (
              <>
                {post.map((elem) => (
                  <div className="post">
                    <div className="post-header">
                      <div className="post-profile">
                        <div
                          onClick={() => {
                            elem.userid === userid
                              ? nav("/view-profile")
                              : nav("/view-search-profile", {
                                state: { id: elem.userid },
                              });
                          }}
                        >
                          <img
                            src={
                              elem.profilepic === "" ||
                                user.profilepic === "undefined" ||
                                user.profilepic === null
                                ? "images/profile1.png"
                                : `${WEB_URL}${elem.profilepic}`
                            }
                            alt=""
                            className="post-profile-img"
                          />
                        </div>
                        <div className="post-info">
                          <span className="post-name">
                            {elem.fname} {elem.lname}
                          </span>
                          <span className="post-description">
                            {formatPostTime(elem.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="post-message">{elem.description}</div>
                    {elem.photos.length > 0 ? (
                      <div className="post-images">
                        <Slider {...settings}>
                          {elem.photos.map((el) => (
                            <img
                              src={`${WEB_URL}${el}`}
                              alt=""
                              className="post-image"
                              onDoubleClick={() => {
                                handleLike(elem._id);
                              }}
                            />
                          ))}
                        </Slider>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="likebar">
                      <i
                        className={`${elem.likes.includes(userid.toString())
                          ? "fa-solid fa-heart"
                          : "fa-regular fa-heart"
                          }`}
                        style={{
                          color: `${elem.likes.includes(userid.toString())
                            ? "#FF0000"
                            : "#000000"
                            }`,
                        }}
                        onClick={() => {
                          handleLike(elem);
                        }}
                      ></i>
                      <span>{elem.likes.length}</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="home-right-main">
          <div className="event-box">
            <span>Events</span>
            <div className="upcoming-events">
              {events.map((elem) => (
                <div className="upcoming-event">
                  <div className="event-img">
                    {elem.photos.length > 0 ? (
                      <img
                        src={`${WEB_URL}${elem.photos[0]}`}
                        alt=""
                        className="post-image"
                      />
                    ) : (
                      <img src="images/event1.png" className="post-image" alt=""></img>
                    )}
                  </div>
                  <div className="event-info">
                    <div className="event-name">{elem.title}</div>
                    <div className="event-date">
                      <i className="fa-solid fa-calendar-days"></i>
                      {formatDate(elem.date)}
                    </div>
                    <div className="event-time">
                      <i className="fa-regular fa-clock"></i>
                      {formatTime(elem.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {aids.length > 0 ?
            <div className="aid-box">
              <h2>Aid Progress Bars</h2>
              {aids.map((elem) =>
                <div className="aid">
                  {elem.image !== "" ?
                    <img
                      src={`${WEB_URL}${elem.image}`}
                      alt={elem.name ? `${elem.name} Profile Picture` : "User Profile Picture"}
                    />
                    :
                    <img
                      src="images/profile1.png"
                      alt="Default Profile"
                    />
                  }
                  <div className="aid-info">
                    <div className="aid-info-div">
                      <div className="name">{elem.name && elem.name}</div>
                      <div>{calWidth(elem.aid, elem.claimed)}</div>
                    </div>
                    <div className="progress-bar">
                      <div className="fill-progress-bar" style={{ width: calWidth(elem.aid, elem.claimed) }}></div>
                    </div>
                    <div className="amount">
                      <span>₹0</span>
                      <span>₹{elem.aid}</span>
                    </div>
                  </div>
                </div>
              )}
            </div> : null
          }
        </div>
      </div>
    </>
  );
}