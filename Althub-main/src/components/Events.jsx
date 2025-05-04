import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { WEB_URL } from "../baseURL";
import { toast } from "react-toastify";
import EventModal from "./EventModal";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const closeModal = () => setModal(false);
  const [event, setEvent] = useState({});
  const [showEvent, setShowEvent] = useState({});
  const [type, setType] = useState("All");

  const getEvents = () => {
    axios({
      method: "get",
      url: `${WEB_URL}/api/getEvents`,
    })
      .then((Response) => {
        setEvents(Response.data.data);
        setShowEvent(Response.data.data);
        setType("All");
      })
      .catch((error) => {
        toast.error("Something Went Wrong");
      });
  };

  useEffect(() => {
    getEvents();
  }, []);

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

  useEffect(() => {
    const currentDate = new Date();
    setShowEvent(events.filter(event => {
      const eventDate = new Date(event.date);
      if (type === "All") {
        return true;
      } else if (type === "Upcomming") {
        return eventDate > currentDate;
      } else {
        return eventDate < currentDate;
      }
    }));
  }, [type, events]);

  return (
    <>
      <div className="container-2">
        <div className="events-cover">
          <div className="content">
            <h1>Events</h1>
            <b>Find The Best Event</b>
          </div>
          <img src="/images/Events-amico.png" alt="" />
        </div>
        <div className="container">
          <div className="events-links">
            <ul>
              <li onClick={() => setType("All")}>
                <a className={type === "All" ? "active-link" : null}>All</a>
              </li>
              <li onClick={() => setType("Upcomming")}>
                <a className={type === "Upcomming" ? "active-link" : null}>
                  Upcomming
                </a>
              </li>
              <li onClick={() => setType("Past")}>
                <a className={type === "Past" ? "active-link" : null}>Past</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="container">
          {showEvent.length > 0 ? (
            <div className="events-list">
              {showEvent.map((elem) => (
                <div className="card">
                  {elem.photos.length > 0 ? (
                    <img src={`${WEB_URL}${elem.photos[0]}`} alt="" />
                  ) : (
                    <img src="images/event1.png" alt=""></img>
                  )}
                  <div className="intro">
                    <h2>{elem.title}</h2>
                    <ul>
                      <li>
                        <i
                          className="fa-regular fa-calendar-days"
                          style={{ color: "#919090" }}
                        ></i>
                        <span>{formatDate(elem.date)}</span>
                      </li>
                      <li>
                        <i
                          className="fa-regular fa-clock"
                          style={{ color: "#919090" }}
                        ></i>
                        <span>{formatTime(elem.date)}</span>
                      </li>
                      <li>
                        <i
                          className="fa-solid fa-location-dot"
                          style={{ color: "#919090" }}
                        ></i>
                        <span>{elem.venue}</span>
                      </li>
                    </ul>
                    <a
                      onClick={() => {
                        setModal(true);
                        setEvent(elem);
                      }}
                    >
                      View More
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {modal && <EventModal closeModal={closeModal} event={event} getEvents={getEvents} />}
    </>
  );
}