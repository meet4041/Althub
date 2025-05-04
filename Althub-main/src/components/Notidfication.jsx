import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WEB_URL } from "../baseURL";

export default function Notidfication() {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState({});
  const nav = useNavigate();
  const userid = localStorage.getItem("Althub_Id");

  const getUser = () => {
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
  };
  const getNotifications = () => {
    axios({
      url: `${WEB_URL}/api/getnotifications`,
      method: "post",
      data: {
        userid: userid,
      },
    })
      .then((Response) => {
        console.log(Response);
        setNotifications(Response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatTime = (timestamp) => {
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

  const Logout = () => {
    localStorage.clear();
    nav("/");
  };

  useEffect(() => {
    getUser();
    getNotifications();
  }, []);

  return (
    <>
      <div class="home-container">
        <div className="profile-card-main">
          <div className="profile-card">
            <div className="profile-card-imgbox">
              {user.profilepic !== "" ? (
                <img
                  src={`${WEB_URL}${user.profilepic}`}
                  alt=""
                  className="profile-card-img"
                />
              ) : (
                <img
                  src="images/profile1.png"
                  className="profile-card-img"
                  alt="#"
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

        <div class="notification-main">
          {notifications.length > 0 ? (
            <div class="notification-box">
              {notifications.map((elem) => (
                <div class="notification">
                  <div class="notifiction-img">
                    <img src={`${WEB_URL}${elem.image}`} alt="" />
                  </div>
                  <div class="notification-info">
                    <div class="notification-name">
                      {elem.title}
                    </div>
                    <div class="notification-desc">
                      {elem.msg}
                    </div>
                    <div className="notification-time">
                      {formatTime(elem.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}