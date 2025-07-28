import React, { useEffect, useState } from "react";
import { WEB_URL } from "../baseURL";
import axios from "axios";

function ChatUser({
  userid,
  setCurrentId,
  setName,
  setProfilepic,
  setReceiverId,
}) {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("");
  const myid = localStorage.getItem("Althub_Id");

  useEffect(() => {
    if (userid?.members && myid) {
      const otherUserId = userid.members.find((m) => m !== myid);
      setUserId(otherUserId);
    }
  }, [userid, myid]);

  useEffect(() => {
    if (userId !== "") {
      axios
        .get(`${WEB_URL}/api/searchUserById/${userId}`)
        .then((response) => {
          setUser(response.data.data[0]);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [userId]);

  if (!user) {
    return null;
  }

  return (
    <div
      className="chat-user"
      onClick={() => {
        setCurrentId(userid._id);
        setName(`${user.fname} ${user.lname}`);
        setProfilepic(user.profilepic);
        setReceiverId(user._id);
      }}
    >
      <img
        src={`${WEB_URL}${user.profilepic || "/default-profile.png"}`}
        alt="Profile"
      />
      <span className="chat-user-name">
        {user.fname} {user.lname}
      </span>
    </div>
  );
}

export default ChatUser;