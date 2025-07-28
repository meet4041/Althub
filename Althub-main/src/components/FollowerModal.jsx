import React, { useState } from "react";
import ConnectionUser from "./ConnectionUser";

const FollowerModal = ({ closeModal, user, getUser }) => {
    console.log(user);
  const [type, setType] = useState("Follower");
  return (
    <>
      <div className="modal-wrapper" onClick={closeModal}></div>
      <div className="modal-container">
        <div className="edit-profile-header" onClick={closeModal}>
          <h2>Follower & Following</h2>
          <i class="fa-solid fa-xmark close-modal"></i>
        </div>
        <div className="follow">
          <div
            className={type === "Follower" ? "active" : ""}
            onClick={() => setType("Follower")}
          >
            Follower
          </div>
          <div
            className={type === "Following" ? "active" : ""}
            onClick={() => setType("Following")}
          >
            Following
          </div>
        </div>
        {type === "Follower" && user.followers && user.followers.length > 0 ? (
          <div className="peopleList">
            {user.followers.map((elem) => (
              <ConnectionUser userid={elem} type={type} getUser={getUser}/>
            ))}
          </div>
        ) : null}
        {type === "Following" &&
        user.followings &&
        user.followings.length > 0 ? (
          <div className="peopleList">
            {user.followings.map((elem) => (
              <ConnectionUser userid={elem} type={type} getUser={getUser}/>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default FollowerModal;