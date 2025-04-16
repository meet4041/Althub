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
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("");
  const myid = localStorage.getItem("AlmaPlus_Id");
  const getUser = () => {
    if (userId !== "") {
      axios({
        method: "get",
        url: `${WEB_URL}/api/searchUserById/${userId}`,
      })
        .then((Response) => {
          setUser(Response.data.data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    setUserId(userid.members.find((m) => m !== myid));
    getUser();
  }, [userid,getUser,myid]);

  

  return (
    <>
      <div
        className="chat-user"
        onClick={() => {
          setCurrentId(userid._id);
          setName(user.fname + " " + user.lname);
          setProfilepic(user.profilepic);
          setReceiverId(user._id);
        }}
      >
        <img src={`${WEB_URL}${user.profilepic}`} alt="" />
        <span className="chat-user-name">
          {user.fname} {user.lname}
        </span>
      </div>
    </>
  );
}

export default ChatUser;
