import React from "react";
import Slider from "react-slick";
import { WEB_URL } from "../baseURL";
import axios from "axios";
import { toast } from "react-toastify";

const EventModal = ({ closeModal, event, getEvents }) => {
  const userid = localStorage.getItem("Althub_Id");
  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
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

  const handleJoin = () => {
    axios({
      url: `${WEB_URL}/api/participateInEvent/${event._id}`,
      method: "put",
      data: {
        userId: userid,
      },
    }).then((Response) => {
      toast(Response.data);
      closeModal();
      getEvents();
    }).catch((error) => {
      toast(error.response.data);
      closeModal();
    })
  };

  return (
    <>
      <div className="modal-wrapper" onClick={closeModal}></div>
      <div className="event-modal-container">
        <div className="edit-profile-header" onClick={closeModal}>
          <h2>{event.title}</h2>
          <i class="fa-solid fa-xmark close-modal"></i>
        </div>
        <div className="event-modal">
          {event.photos.length > 0 ? (
            <div className="event-modal-images">
              <Slider {...settings}>
                {event.photos.map((el) => (
                  <img src={`${WEB_URL}${el}`} alt="" className="post-image" />
                ))}
              </Slider>
            </div>
          ) : (
            "No Images"
          )}
          <div className="event-modal-info">
            <div>
              <i
                className="fa-regular fa-calendar-days"
                style={{ color: "#919090" }}
              ></i>
              <span>{formatDate(event.date)}</span>
            </div>
            <div>
              <i
                className="fa-regular fa-clock"
                style={{ color: "#919090" }}
              ></i>
              <span>{formatTime(event.date)}</span>
            </div>
            <div>
              <i
                className="fa-solid fa-location-dot"
                style={{ color: "#919090" }}
              ></i>
              <span>{event.venue}</span>
            </div>
            <div>
              <i
                className="fa-solid fa-person"
                style={{ color: "#919090" }}
              ></i>
              <span>{event.participants.length} Participants</span>
            </div>
          </div>
          {new Date() < new Date(event.date) ? (
            <button className="action-button-confirm" onClick={handleJoin}>
              Join
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default EventModal;
